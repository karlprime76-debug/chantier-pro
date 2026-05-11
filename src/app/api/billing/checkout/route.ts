import { NextResponse } from "next/server";
import { z } from "zod";

import { requireApiSession } from "@/lib/auth/api";
import { prisma } from "@/lib/db/prisma";
import { createPayDunyaInvoice, PayDunyaError } from "@/lib/billing/paydunya";
import { logError, logInfo } from "@/lib/observability/logger";
import { getRequestId, withRequestIdHeaders } from "@/lib/observability/requestId";

const CheckoutSchema = z.object({
  plan: z.enum(["PREMIUM", "ENTERPRISE"]),
});

const PLAN_PRICES_XOF: Record<"PREMIUM" | "ENTERPRISE", number> = {
  PREMIUM: 15000,
  ENTERPRISE: 25000,
};

function getAppUrl(req: Request) {
  const envUrl = process.env.APP_URL || process.env.NEXTAUTH_URL;
  if (envUrl) return envUrl.replace(/\/$/, "");
  const url = new URL(req.url);
  return `${url.protocol}//${url.host}`;
}

type PaymentDelegate = {
  create: (args: unknown) => Promise<{ id: string }>;
  update: (args: unknown) => Promise<unknown>;
};

function getPaymentDelegate() {
  return (prisma as unknown as { payment: PaymentDelegate }).payment;
}

export async function POST(req: Request) {
  const requestId = getRequestId(req);
  logInfo("billing.checkout.request_received", { requestId });

  let session;
  try {
    session = await requireApiSession();
  } catch (e) {
    if (e instanceof Response) return e;
    return withRequestIdHeaders(
      NextResponse.json({ ok: false, error: "unauthorized", requestId }, { status: 401 }),
      requestId,
    );
  }

  const json = await req.json().catch(() => null);
  const parsed = CheckoutSchema.safeParse(json);
  if (!parsed.success) {
    logInfo("billing.checkout.invalid_payload", { requestId });
    return withRequestIdHeaders(
      NextResponse.json(
        { ok: false, error: "invalid_payload", issues: parsed.error.issues, requestId },
        { status: 400 },
      ),
      requestId,
    );
  }

  const plan = parsed.data.plan;
  const amount = PLAN_PRICES_XOF[plan];

  const appUrl = getAppUrl(req);

  const paymentDelegate = getPaymentDelegate();
  if (!paymentDelegate || typeof paymentDelegate.create !== "function") {
    logError("billing.checkout.server_misconfigured", { requestId });
    return withRequestIdHeaders(
      NextResponse.json(
        {
          ok: false,
          error: "server_misconfigured",
          message:
            "Le modèle Payment n’est pas disponible côté serveur. Vérifie la génération Prisma (prisma generate) et le déploiement.",
          requestId,
        },
        { status: 500 },
      ),
      requestId,
    );
  }

  let payment: { id: string };
  try {
    payment = await paymentDelegate.create({
      data: {
        userId: session.id,
        provider: "paydunya",
        plan,
        amount,
        currency: "XOF",
        status: "created",
      },
      select: { id: true },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown";
    logError("billing.checkout.db_create_failed", { requestId, message });
    return withRequestIdHeaders(
      NextResponse.json(
        {
          ok: false,
          error: "db_error",
          message:
            "Erreur base de données lors de l’initialisation du paiement. Vérifie que la migration Payment/User.plan est appliquée sur la base (table Payment existante) puis réessaie.",
          details: message,
          requestId,
        },
        { status: 500 },
      ),
      requestId,
    );
  }

  logInfo("billing.checkout.payment_created", { requestId, paymentId: payment.id, plan, amount });

  try {
    const invoice = await createPayDunyaInvoice({
      amount,
      description: plan === "PREMIUM" ? "Abonnement Premium" : "Abonnement Entreprise",
      returnUrl: `${appUrl}/dashboard/settings?payment=success`,
      cancelUrl: `${appUrl}/pricing?payment=cancel`,
      callbackUrl: `${appUrl}/api/billing/webhook?paymentId=${encodeURIComponent(payment.id)}`,
      customData: {
        paymentId: payment.id,
        userId: session.id,
        plan,
      },
    });
    try {
      await paymentDelegate.update({
        where: { id: payment.id },
        data: {
          status: "pending",
          providerRef: invoice.token,
          raw: { invoiceUrl: invoice.invoiceUrl },
        },
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "unknown";
      logError("billing.checkout.db_update_failed", { requestId, paymentId: payment.id, message });
      return withRequestIdHeaders(
        NextResponse.json(
          {
            ok: false,
            error: "db_error",
            message:
              "Le paiement a été créé mais impossible de mettre à jour son statut. Vérifie la base de données puis réessaie.",
            details: message,
            requestId,
          },
          { status: 500 },
        ),
        requestId,
      );
    }

    logInfo("billing.checkout.invoice_created", { requestId, paymentId: payment.id });
    return withRequestIdHeaders(
      NextResponse.json({ ok: true, redirectUrl: invoice.invoiceUrl, requestId }),
      requestId,
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown";

    let details: string | undefined;
    let status: number | undefined;
    let responseCode: string | undefined;
    let responseText: string | undefined;
    let responseMessage: string | undefined;

    if (err instanceof PayDunyaError) {
      status = err.details.httpStatus;
      responseCode = err.details.responseCode;
      responseText = err.details.responseText;
      responseMessage = err.details.responseMessage;

      const parts: string[] = [];
      if (typeof status === "number") parts.push(`HTTP ${status}`);
      if (responseCode) parts.push(`response_code=${responseCode}`);
      if (responseText) parts.push(`response_text=${responseText}`);
      if (responseMessage) parts.push(`response_message=${responseMessage}`);
      if (err.details.errors) parts.push(`errors=${JSON.stringify(err.details.errors)}`);
      details = parts.join(" | ") || message;
    } else {
      const name = err instanceof Error ? err.name : "Error";
      const cause = err instanceof Error && "cause" in err ? (err as { cause?: unknown }).cause : undefined;
      const parts: string[] = [`${name}: ${message}`];
      if (cause) parts.push(`cause=${typeof cause === "string" ? cause : JSON.stringify(cause)}`);
      details = parts.join(" | ");
    }

    logError("billing.checkout.provider_failed", {
      requestId,
      paymentId: payment.id,
      status,
      responseText,
      responseCode,
      responseMessage,
    });
    try {
      await paymentDelegate.update({ where: { id: payment.id }, data: { status: "error" } });
    } catch (err) {
      const message = err instanceof Error ? err.message : "unknown";
      logError("billing.checkout.db_mark_error_failed", { requestId, paymentId: payment.id, message });
    }
    return withRequestIdHeaders(
      NextResponse.json(
        {
          ok: false,
          error: "provider_error",
          message:
            "Impossible de créer le paiement. Veuillez réessayer dans un instant.",
          details,
          requestId,
        },
        { status: 502 },
      ),
      requestId,
    );
  }
}

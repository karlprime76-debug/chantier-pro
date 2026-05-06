import { NextResponse } from "next/server";
import { z } from "zod";

import { requireApiSession } from "@/lib/auth/api";
import { prisma } from "@/lib/db/prisma";
import { createPayDunyaInvoice } from "@/lib/billing/paydunya";

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
  let session;
  try {
    session = await requireApiSession();
  } catch (e) {
    if (e instanceof Response) return e;
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const json = await req.json().catch(() => null);
  const parsed = CheckoutSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "invalid_payload", issues: parsed.error.issues }, { status: 400 });
  }

  const plan = parsed.data.plan;
  const amount = PLAN_PRICES_XOF[plan];

  const appUrl = getAppUrl(req);

  const paymentDelegate = getPaymentDelegate();
  if (!paymentDelegate || typeof paymentDelegate.create !== "function") {
    return NextResponse.json(
      {
        ok: false,
        error: "server_misconfigured",
        message:
          "Le modèle Payment n’est pas disponible côté serveur. Vérifie la génération Prisma (prisma generate) et le déploiement.",
      },
      { status: 500 },
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
    console.error("[billing/checkout] Payment create failed", { message });
    return NextResponse.json(
      {
        ok: false,
        error: "db_error",
        message:
          "Erreur base de données lors de l’initialisation du paiement. Vérifie que la migration Payment/User.plan est appliquée sur la base (table Payment existante) puis réessaie.",
        details: message,
      },
      { status: 500 },
    );
  }

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
      console.error("[billing/checkout] Payment update failed", { paymentId: payment.id, message });
      return NextResponse.json(
        {
          ok: false,
          error: "db_error",
          message:
            "Le paiement a été créé mais impossible de mettre à jour son statut. Vérifie la base de données puis réessaie.",
          details: message,
        },
        { status: 500 },
      );
    }

    return NextResponse.json({ ok: true, redirectUrl: invoice.invoiceUrl });
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown";
    console.error("[billing/checkout] PayDunya invoice create failed", {
      paymentId: payment.id,
      message,
    });
    try {
      await paymentDelegate.update({ where: { id: payment.id }, data: { status: "error" } });
    } catch (err) {
      const message = err instanceof Error ? err.message : "unknown";
      console.error("[billing/checkout] Payment update error status failed", {
        paymentId: payment.id,
        message,
      });
    }
    return NextResponse.json(
      {
        ok: false,
        error: "provider_error",
        message:
          "Impossible de créer le paiement PayDunya. Vérifie PAYDUNYA_* et APP_URL, puis réessaie.",
        details: message,
      },
      { status: 502 },
    );
  }
}

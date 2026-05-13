import { NextResponse } from "next/server";

import { prisma } from "@/lib/db/prisma";
import { confirmPayDunyaInvoice } from "@/lib/billing/paydunya";
import { logError, logInfo } from "@/lib/observability/logger";
import { getRequestId, withRequestIdHeaders } from "@/lib/observability/requestId";

type PaymentDelegate = {
  findUnique: (args: unknown) => Promise<{ id: string; userId: string; plan: string } | null>;
  update: (args: unknown) => Promise<unknown>;
};

function getPaymentDelegate() {
  return (prisma as unknown as { payment: PaymentDelegate }).payment;
}

export async function POST(req: Request) {
  const requestId = getRequestId(req);
  logInfo("billing.webhook.request_received", { requestId });

  const url = new URL(req.url);
  const token = url.searchParams.get("token");
  const paymentId = url.searchParams.get("paymentId");

  if (!token || !paymentId) {
    logInfo("billing.webhook.missing_params", { requestId });
    return withRequestIdHeaders(
      NextResponse.json({ ok: false, error: "missing_params", requestId }, { status: 400 }),
      requestId,
    );
  }

  logInfo("billing.webhook.params_received", { requestId, paymentId });

  const paymentDelegate = getPaymentDelegate();
  if (!paymentDelegate || typeof paymentDelegate.findUnique !== "function" || typeof paymentDelegate.update !== "function") {
    logError("billing.webhook.server_misconfigured", { requestId, paymentId });
    return withRequestIdHeaders(
      NextResponse.json(
        {
          ok: false,
          error: "server_misconfigured",
          message: "Le modèle Payment n’est pas disponible côté serveur.",
          requestId,
        },
        { status: 500 },
      ),
      requestId,
    );
  }

  const payment = await paymentDelegate.findUnique({
    where: { id: paymentId },
    select: { id: true, userId: true, plan: true },
  });
  if (!payment) {
    logInfo("billing.webhook.unknown_payment", { requestId, paymentId });
    return withRequestIdHeaders(
      NextResponse.json({ ok: false, error: "unknown_payment", requestId }, { status: 404 }),
      requestId,
    );
  }

  try {
    const confirmation = await confirmPayDunyaInvoice(token);
    const status = String(confirmation.status ?? "").toLowerCase();

    if (status === "completed" || status === "paid" || status === "successful" || status === "success") {
      await paymentDelegate.update({
        where: { id: payment.id },
        data: {
          status: "paid",
          providerRef: token,
          raw: confirmation as unknown as object,
        },
      });
      await prisma.user.update({
        where: { id: payment.userId },
        data: { plan: payment.plan } as never,
      });

      logInfo("billing.webhook.payment_marked_paid", { requestId, paymentId });
      return withRequestIdHeaders(NextResponse.json({ ok: true, requestId }), requestId);
    }

    await paymentDelegate.update({
      where: { id: payment.id },
      data: {
        status: status || "failed",
        providerRef: token,
        raw: confirmation as unknown as object,
      },
    });

    logInfo("billing.webhook.payment_marked_non_success", { requestId, paymentId, status: status || "failed" });
    return withRequestIdHeaders(NextResponse.json({ ok: true, requestId }), requestId);
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown";
    try {
      await paymentDelegate.update({ where: { id: payment.id }, data: { status: "error" } });
    } catch (updateErr) {
      const updateMessage = updateErr instanceof Error ? updateErr.message : "unknown";
      logError("billing.webhook.db_mark_error_failed", { requestId, paymentId, message: updateMessage });
    }
    logError("billing.webhook.provider_error", { requestId, paymentId, message });
    return withRequestIdHeaders(
      NextResponse.json({ ok: false, error: "provider_error", requestId }, { status: 502 }),
      requestId,
    );
  }
}

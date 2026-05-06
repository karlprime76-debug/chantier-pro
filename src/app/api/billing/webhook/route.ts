import { NextResponse } from "next/server";

import { prisma } from "@/lib/db/prisma";
import { confirmPayDunyaInvoice } from "@/lib/billing/paydunya";

type PaymentDelegate = {
  findUnique: (args: unknown) => Promise<{ id: string; userId: string; plan: string } | null>;
  update: (args: unknown) => Promise<unknown>;
};

function getPaymentDelegate() {
  return (prisma as unknown as { payment: PaymentDelegate }).payment;
}

export async function POST(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token");
  const paymentId = url.searchParams.get("paymentId");

  if (!token || !paymentId) {
    return NextResponse.json({ ok: false, error: "missing_params" }, { status: 400 });
  }

  const payment = await getPaymentDelegate().findUnique({
    where: { id: paymentId },
    select: { id: true, userId: true, plan: true },
  });
  if (!payment) {
    return NextResponse.json({ ok: false, error: "unknown_payment" }, { status: 404 });
  }

  try {
    const confirmation = await confirmPayDunyaInvoice(token);
    const status = String(confirmation.status ?? "").toLowerCase();

    if (status === "completed" || status === "paid" || status === "successful" || status === "success") {
      await getPaymentDelegate().update({
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

      return NextResponse.json({ ok: true });
    }

    await getPaymentDelegate().update({
      where: { id: payment.id },
      data: {
        status: status || "failed",
        providerRef: token,
        raw: confirmation as unknown as object,
      },
    });

    return NextResponse.json({ ok: true });
  } catch {
    await getPaymentDelegate().update({ where: { id: payment.id }, data: { status: "error" } });
    return NextResponse.json({ ok: false, error: "provider_error" }, { status: 502 });
  }
}

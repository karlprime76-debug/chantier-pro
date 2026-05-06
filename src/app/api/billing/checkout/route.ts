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
  const session = await requireApiSession();

  const json = await req.json().catch(() => null);
  const parsed = CheckoutSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "invalid_payload", issues: parsed.error.issues }, { status: 400 });
  }

  const plan = parsed.data.plan;
  const amount = PLAN_PRICES_XOF[plan];

  const appUrl = getAppUrl(req);

  const payment = await getPaymentDelegate().create({
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

    await getPaymentDelegate().update({
      where: { id: payment.id },
      data: {
        status: "pending",
        providerRef: invoice.token,
        raw: { invoiceUrl: invoice.invoiceUrl },
      },
    });

    return NextResponse.json({ ok: true, redirectUrl: invoice.invoiceUrl });
  } catch {
    await getPaymentDelegate().update({ where: { id: payment.id }, data: { status: "error" } });
    return NextResponse.json({ ok: false, error: "provider_error" }, { status: 502 });
  }
}

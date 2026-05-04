import { NextResponse } from "next/server";
import { z } from "zod";
import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/db/prisma";
import { requireApiSession } from "@/lib/auth/api";

const CreateQuoteSchema = z.object({
  projectId: z.string().min(1),
  title: z.string().min(2),
  clientName: z.string().optional(),
  itemLabel: z.string().min(2),
  quantity: z.string().min(1),
  unitPrice: z.string().min(1),
});

export async function GET() {
  const session = await requireApiSession();

  const user = await prisma.user.findUnique({
    where: { id: session.id },
    select: { companyId: true },
  });

  if (!user?.companyId) {
    return NextResponse.json({ ok: true, quotes: [] });
  }

  const quotes = await prisma.quote.findMany({
    where: { project: { companyId: user.companyId } },
    orderBy: { createdAt: "desc" },
    take: 30,
    select: {
      id: true,
      title: true,
      status: true,
      total: true,
      createdAt: true,
      project: { select: { id: true, name: true } },
    },
  });

  return NextResponse.json({ ok: true, quotes });
}

export async function POST(req: Request) {
  const session = await requireApiSession();

  const json = await req.json().catch(() => null);
  const parsed = CreateQuoteSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "invalid_payload", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const user = await prisma.user.findUnique({
    where: { id: session.id },
    select: { companyId: true },
  });

  if (!user?.companyId) {
    return NextResponse.json({ ok: false, error: "missing_company" }, { status: 400 });
  }

  const project = await prisma.project.findFirst({
    where: { id: parsed.data.projectId, companyId: user.companyId },
    select: { id: true },
  });

  if (!project) {
    return NextResponse.json({ ok: false, error: "invalid_project" }, { status: 400 });
  }

  const quantity = new Prisma.Decimal(parsed.data.quantity);
  const unitPrice = new Prisma.Decimal(parsed.data.unitPrice);
  const lineTotal = quantity.mul(unitPrice);

  const quote = await prisma.quote.create({
    data: {
      projectId: project.id,
      createdById: session.id,
      title: parsed.data.title.trim(),
      clientName: parsed.data.clientName?.trim() || null,
      status: "DRAFT",
      currency: "XOF",
      subtotal: lineTotal,
      taxTotal: new Prisma.Decimal("0"),
      total: lineTotal,
      items: {
        create: {
          label: parsed.data.itemLabel.trim(),
          quantity,
          unitPrice,
          total: lineTotal,
        },
      },
    },
    select: { id: true },
  });

  return NextResponse.json({ ok: true, quoteId: quote.id });
}

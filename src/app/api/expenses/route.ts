import { NextResponse } from "next/server";
import { z } from "zod";
import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/db/prisma";
import { requireApiSession } from "@/lib/auth/api";

const CreateExpenseSchema = z.object({
  projectId: z.string().min(1),
  category: z.string().min(2),
  label: z.string().min(2),
  amount: z.string().min(1),
  supplier: z.string().optional(),
  date: z.string().min(1),
  note: z.string().optional(),
  status: z.enum(["PENDING", "VALIDATED"]).optional(),
});

export async function GET() {
  const session = await requireApiSession();

  const user = await prisma.user.findUnique({
    where: { id: session.id },
    select: { companyId: true },
  });

  if (!user?.companyId) {
    return NextResponse.json({ ok: true, expenses: [] });
  }

  const expenses = await prisma.expense.findMany({
    where: { project: { companyId: user.companyId } },
    orderBy: { date: "desc" },
    take: 50,
    select: {
      id: true,
      category: true,
      label: true,
      amount: true,
      supplier: true,
      date: true,
      status: true,
      project: { select: { id: true, name: true } },
    },
  });

  return NextResponse.json({ ok: true, expenses });
}

export async function POST(req: Request) {
  const session = await requireApiSession();

  const json = await req.json().catch(() => null);
  const parsed = CreateExpenseSchema.safeParse(json);
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

  const expense = await prisma.expense.create({
    data: {
      projectId: project.id,
      createdById: session.id,
      category: parsed.data.category.trim(),
      label: parsed.data.label.trim(),
      amount: new Prisma.Decimal(parsed.data.amount),
      supplier: parsed.data.supplier?.trim() || null,
      date: new Date(parsed.data.date),
      note: parsed.data.note?.trim() || null,
      status: parsed.data.status ?? "PENDING",
    },
    select: { id: true },
  });

  return NextResponse.json({ ok: true, expenseId: expense.id });
}

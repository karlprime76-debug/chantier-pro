import { NextResponse } from "next/server";
import { z } from "zod";
import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/db/prisma";
import { requireApiSession } from "@/lib/auth/api";
import { FREE_LIMITS } from "@/lib/subscription/access";
import { getEffectiveUserPlan } from "@/lib/subscription/server";

const CreateProjectSchema = z.object({
  name: z.string().min(2),
  clientName: z.string().optional(),
  location: z.string().optional(),
  projectType: z.string().optional(),
  estimatedBudget: z.string().optional(),
  startDate: z.string().optional(),
  plannedEndDate: z.string().optional(),
  progress: z.string().optional(),
});

export async function GET() {
  const session = await requireApiSession();

  const user = await prisma.user.findUnique({
    where: { id: session.id },
    select: { companyId: true },
  });

  if (!user?.companyId) {
    return NextResponse.json({ ok: true, projects: [] });
  }

  const projects = await prisma.project.findMany({
    where: { companyId: user.companyId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      clientName: true,
      status: true,
      progress: true,
      location: true,
      createdAt: true,
    },
  });

  return NextResponse.json({ ok: true, projects });
}

export async function POST(req: Request) {
  const session = await requireApiSession();

  const json = await req.json().catch(() => null);
  const parsed = CreateProjectSchema.safeParse(json);
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

  const plan = await getEffectiveUserPlan(session);
  if (plan === "FREE") {
    const existingCount = await prisma.project.count({ where: { companyId: user.companyId } });
    if (existingCount >= FREE_LIMITS.maxProjects) {
      return NextResponse.json({ ok: false, error: "plan_limit" }, { status: 403 });
    }
  }

  const estimatedBudget = parsed.data.estimatedBudget?.trim();
  const progress = parsed.data.progress?.trim();

  const project = await prisma.project.create({
    data: {
      companyId: user.companyId,
      createdById: session.id,
      name: parsed.data.name.trim(),
      clientName: parsed.data.clientName?.trim() || null,
      location: parsed.data.location?.trim() || null,
      projectType: parsed.data.projectType?.trim() || null,
      estimatedBudget:
        estimatedBudget && estimatedBudget.length > 0
          ? new Prisma.Decimal(estimatedBudget)
          : null,
      startDate: parsed.data.startDate ? new Date(parsed.data.startDate) : null,
      plannedEndDate: parsed.data.plannedEndDate ? new Date(parsed.data.plannedEndDate) : null,
      progress: progress ? Math.max(0, Math.min(100, Number(progress))) : 0,
      status: "ACTIVE",
    },
    select: { id: true },
  });

  return NextResponse.json({ ok: true, projectId: project.id });
}

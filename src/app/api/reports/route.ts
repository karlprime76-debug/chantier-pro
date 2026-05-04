import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/db/prisma";
import { requireApiSession } from "@/lib/auth/api";
import { FREE_LIMITS, getUserPlanFromRole } from "@/lib/subscription/access";

const CreateReportSchema = z.object({
  projectId: z.string().min(1),
  date: z.string().min(1),
  weather: z.string().optional(),
  workersCount: z.string().optional(),
  workDone: z.string().min(2),
  materialsIn: z.string().optional(),
  incidents: z.string().optional(),
  observations: z.string().optional(),
  progressEst: z.string().optional(),
});

export async function GET() {
  const session = await requireApiSession();

  const user = await prisma.user.findUnique({
    where: { id: session.id },
    select: { companyId: true },
  });

  if (!user?.companyId) {
    return NextResponse.json({ ok: true, reports: [] });
  }

  const reports = await prisma.dailyReport.findMany({
    where: { project: { companyId: user.companyId } },
    orderBy: { date: "desc" },
    take: 30,
    select: {
      id: true,
      date: true,
      weather: true,
      workersCount: true,
      workDone: true,
      progressEst: true,
      project: { select: { id: true, name: true } },
    },
  });

  return NextResponse.json({ ok: true, reports });
}

export async function POST(req: Request) {
  const session = await requireApiSession();

  const json = await req.json().catch(() => null);
  const parsed = CreateReportSchema.safeParse(json);
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

  const plan = getUserPlanFromRole(session.role);
  if (plan === "FREE") {
    const existingCount = await prisma.dailyReport.count({ where: { project: { companyId: user.companyId } } });
    if (existingCount >= FREE_LIMITS.maxDailyReports) {
      return NextResponse.json({ ok: false, error: "plan_limit" }, { status: 403 });
    }
  }

  const project = await prisma.project.findFirst({
    where: { id: parsed.data.projectId, companyId: user.companyId },
    select: { id: true },
  });

  if (!project) {
    return NextResponse.json({ ok: false, error: "invalid_project" }, { status: 400 });
  }

  const report = await prisma.dailyReport.create({
    data: {
      projectId: project.id,
      createdById: session.id,
      date: new Date(parsed.data.date),
      weather: parsed.data.weather?.trim() || null,
      workersCount: parsed.data.workersCount ? Number(parsed.data.workersCount) : null,
      workDone: parsed.data.workDone.trim(),
      materialsIn: parsed.data.materialsIn?.trim() || null,
      incidents: parsed.data.incidents?.trim() || null,
      observations: parsed.data.observations?.trim() || null,
      progressEst: parsed.data.progressEst ? Number(parsed.data.progressEst) : null,
    },
    select: { id: true },
  });

  return NextResponse.json({ ok: true, reportId: report.id });
}

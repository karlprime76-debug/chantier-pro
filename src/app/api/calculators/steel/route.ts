import { NextResponse } from "next/server";
import { z } from "zod";
import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/db/prisma";
import { requireApiSession } from "@/lib/auth/api";
import { computeSteel, SteelInputSchema, SteelDiameterSchema } from "@/lib/calculators/steel";

const SaveSteelSchema = z.object({
  projectId: z.string().min(1),
  diameter: SteelDiameterSchema,
  unitLengthM: z.number().positive(),
  count: z.number().int().min(1),
  overlapM: z.number().min(0),
  lossPercent: z.number().min(0),
  pricePerKg: z.number().positive().optional(),
  pricePerBar: z.number().positive().optional(),
});

export async function GET(req: Request) {
  const session = await requireApiSession();

  const url = new URL(req.url);
  const projectId = url.searchParams.get("projectId") ?? "";
  if (!projectId) {
    return NextResponse.json({ ok: false, error: "missing_projectId" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { id: session.id }, select: { companyId: true } });
  if (!user?.companyId) {
    return NextResponse.json({ ok: false, error: "missing_company" }, { status: 400 });
  }

  const project = await prisma.project.findFirst({
    where: { id: projectId, companyId: user.companyId },
    select: { id: true },
  });

  if (!project) {
    return NextResponse.json({ ok: false, error: "invalid_project" }, { status: 400 });
  }

  const calculations = await prisma.steelCalculation.findMany({
    where: { projectId: project.id },
    orderBy: { createdAt: "desc" },
    take: 10,
    select: {
      id: true,
      createdAt: true,
      diameterMm: true,
      unitLengthM: true,
      count: true,
      overlapM: true,
      totalLengthM: true,
      totalWeightKg: true,
      bars12mCount: true,
      estimatedCost: true,
    },
  });

  return NextResponse.json({ ok: true, calculations });
}

export async function POST(req: Request) {
  const session = await requireApiSession();

  const json = await req.json().catch(() => null);
  const parsed = SaveSteelSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "invalid_payload", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const user = await prisma.user.findUnique({ where: { id: session.id }, select: { companyId: true } });
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

  const input = SteelInputSchema.parse({
    diameter: parsed.data.diameter,
    unitLengthM: parsed.data.unitLengthM,
    count: parsed.data.count,
    overlapM: parsed.data.overlapM,
    lossPercent: parsed.data.lossPercent,
    pricePerKg: parsed.data.pricePerKg,
    pricePerBar: parsed.data.pricePerBar,
  });

  const output = computeSteel(input);

  const saved = await prisma.steelCalculation.create({
    data: {
      projectId: project.id,
      createdById: session.id,
      diameterMm: output.diameterMm,
      unitLengthM: new Prisma.Decimal(input.unitLengthM),
      count: input.count,
      overlapM: new Prisma.Decimal(input.overlapM),
      totalLengthM: new Prisma.Decimal(output.totalLengthWithLossM),
      totalWeightKg: new Prisma.Decimal(output.totalWeightKg),
      bars12mCount: output.bars12mCount,
      estimatedCost: output.estimatedCost !== null ? new Prisma.Decimal(output.estimatedCost) : null,
    },
    select: { id: true, createdAt: true },
  });

  return NextResponse.json({ ok: true, calculationId: saved.id, createdAt: saved.createdAt });
}

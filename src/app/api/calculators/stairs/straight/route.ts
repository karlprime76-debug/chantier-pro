import { NextResponse } from "next/server";
import { z } from "zod";
import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/db/prisma";
import { requireApiSession } from "@/lib/auth/api";
import { computeStraightStair, StairStraightInputSchema } from "@/lib/calculators/stairStraight";

const SaveStraightStairSchema = z.object({
  projectId: z.string().min(1),
  totalHeightCm: z.number().positive(),
  availableLengthCm: z.number().positive(),
  stairWidthCm: z.number().positive(),
  slabThicknessCm: z.number().positive(),
  concreteDosageKgM3: z.number().positive(),
  wasteMarginPercent: z.number().min(0),
  stepsMode: z.enum(["auto", "manual"]),
  stepsCount: z.number().int().min(2).optional(),
  pricePerM3: z.number().positive().optional(),
});

export async function GET(req: Request) {
  const session = await requireApiSession();

  const url = new URL(req.url);
  const projectId = url.searchParams.get("projectId") ?? "";
  if (!projectId) {
    return NextResponse.json({ ok: false, error: "missing_projectId" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.id },
    select: { companyId: true },
  });

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

  const calculations = await prisma.straightStairCalculation.findMany({
    where: { projectId: project.id },
    orderBy: { createdAt: "desc" },
    take: 10,
    select: {
      id: true,
      createdAt: true,
      totalHeightCm: true,
      availableLengthCm: true,
      stairWidthCm: true,
      stepsCount: true,
      riserHeightCm: true,
      treadDepthCm: true,
      comfortFormulaValue: true,
      comfortStatus: true,
      concreteVolumeWithLossM3: true,
      estimatedCost: true,
    },
  });

  return NextResponse.json({ ok: true, calculations });
}

export async function POST(req: Request) {
  const session = await requireApiSession();

  const json = await req.json().catch(() => null);
  const parsed = SaveStraightStairSchema.safeParse(json);
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

  const input = StairStraightInputSchema.parse({
    totalHeightCm: parsed.data.totalHeightCm,
    availableLengthCm: parsed.data.availableLengthCm,
    stairWidthCm: parsed.data.stairWidthCm,
    slabThicknessCm: parsed.data.slabThicknessCm,
    concreteDosageKgM3: parsed.data.concreteDosageKgM3,
    wasteMarginPercent: parsed.data.wasteMarginPercent,
    stepsMode: parsed.data.stepsMode,
    stepsCount: parsed.data.stepsMode === "manual" ? parsed.data.stepsCount : undefined,
    pricePerM3: parsed.data.pricePerM3,
  });

  const output = computeStraightStair(input);

  const cementBags = Math.max(0, Math.ceil(output.cementEstimateKg / 50));

  const saved = await prisma.straightStairCalculation.create({
    data: {
      projectId: project.id,
      userId: session.id,

      totalHeightCm: new Prisma.Decimal(input.totalHeightCm),
      availableLengthCm: new Prisma.Decimal(input.availableLengthCm),
      stairWidthCm: new Prisma.Decimal(input.stairWidthCm),
      stepsCount: output.stepsCount,
      slabThicknessCm: new Prisma.Decimal(input.slabThicknessCm),

      concreteDosage: new Prisma.Decimal(input.concreteDosageKgM3),
      lossPercent: new Prisma.Decimal(input.wasteMarginPercent),
      concretePricePerM3: input.pricePerM3 ? new Prisma.Decimal(input.pricePerM3) : null,

      riserHeightCm: new Prisma.Decimal(output.riserHeightCm),
      treadDepthCm: new Prisma.Decimal(output.goingCm),
      comfortFormulaValue: new Prisma.Decimal(output.comfortValueCm),
      comfortStatus: output.comfortStatus,

      waistSlabLengthM: new Prisma.Decimal(output.slabLengthM),
      concreteVolumeM3: new Prisma.Decimal(output.concreteVolumeM3),
      concreteVolumeWithLossM3: new Prisma.Decimal(output.concreteVolumeWithWasteM3),
      formworkAreaM2: new Prisma.Decimal(output.formworkAreaM2),

      cementBags,
      sandVolumeM3: new Prisma.Decimal(output.sandEstimateM3),
      gravelVolumeM3: new Prisma.Decimal(output.gravelEstimateM3),
      estimatedCost: output.estimatedCost !== null ? new Prisma.Decimal(output.estimatedCost) : null,
    },
    select: { id: true, createdAt: true },
  });

  return NextResponse.json({ ok: true, calculationId: saved.id, createdAt: saved.createdAt });
}

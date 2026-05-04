import { NextResponse } from "next/server";
import { z } from "zod";
import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/db/prisma";
import { requireApiSession } from "@/lib/auth/api";
import { computeConcrete, ConcreteInputSchema, ConcreteElementTypeSchema } from "@/lib/calculators/concrete";

const SaveConcreteSchema = z.object({
  projectId: z.string().min(1),
  elementType: ConcreteElementTypeSchema,
  lengthM: z.number().positive(),
  widthM: z.number().positive(),
  heightM: z.number().positive(),
  quantity: z.number().int().min(1),
  concreteDosageKgM3: z.number().positive(),
  wasteMarginPercent: z.number().min(0),
  pricePerM3: z.number().positive().optional(),
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

  const calculations = await prisma.concreteCalculation.findMany({
    where: { projectId: project.id },
    orderBy: { createdAt: "desc" },
    take: 10,
    select: {
      id: true,
      createdAt: true,
      elementType: true,
      quantity: true,
      wasteMargin: true,
      volumeTotal: true,
      volumeWithWaste: true,
      cementEstimateKg: true,
      sandEstimateM3: true,
      gravelEstimateM3: true,
    },
  });

  return NextResponse.json({ ok: true, calculations });
}

export async function POST(req: Request) {
  const session = await requireApiSession();

  const json = await req.json().catch(() => null);
  const parsed = SaveConcreteSchema.safeParse(json);
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

  const input = ConcreteInputSchema.parse({
    elementType: parsed.data.elementType,
    lengthM: parsed.data.lengthM,
    widthM: parsed.data.widthM,
    heightM: parsed.data.heightM,
    quantity: parsed.data.quantity,
    concreteDosageKgM3: parsed.data.concreteDosageKgM3,
    wasteMarginPercent: parsed.data.wasteMarginPercent,
    pricePerM3: parsed.data.pricePerM3,
  });

  const output = computeConcrete(input);

  const saved = await prisma.concreteCalculation.create({
    data: {
      projectId: project.id,
      createdById: session.id,
      elementType: input.elementType,
      length: new Prisma.Decimal(input.lengthM),
      width: new Prisma.Decimal(input.widthM),
      height: new Prisma.Decimal(input.heightM),
      quantity: input.quantity,
      wasteMargin: new Prisma.Decimal(input.wasteMarginPercent),
      volumeTotal: new Prisma.Decimal(output.volumeTotalM3),
      volumeWithWaste: new Prisma.Decimal(output.volumeWithWasteM3),
      cementEstimateKg: new Prisma.Decimal(output.cementEstimateKg),
      sandEstimateM3: new Prisma.Decimal(output.sandEstimateM3),
      gravelEstimateM3: new Prisma.Decimal(output.gravelEstimateM3),
    },
    select: { id: true, createdAt: true },
  });

  return NextResponse.json({ ok: true, calculationId: saved.id, createdAt: saved.createdAt });
}

import { NextResponse } from "next/server";

import { prisma } from "@/lib/db/prisma";
import { requireApiSession } from "@/lib/auth/api";
import { assertApiFeatureAccess } from "@/lib/subscription/server";
import {
  mapConcreteToHistory,
  mapSteelToHistory,
  mapStraightStairToHistory,
  type CalculationHistoryItem,
} from "@/lib/calculations/history";

export async function GET() {
  const session = await requireApiSession();
  await assertApiFeatureAccess(session, "calc_history");

  const user = await prisma.user.findUnique({ where: { id: session.id }, select: { companyId: true } });
  if (!user?.companyId) {
    return NextResponse.json({ ok: true, items: [] as CalculationHistoryItem[] });
  }

  const projects = await prisma.project.findMany({
    where: { companyId: user.companyId },
    select: { id: true },
  });

  const projectIds = projects.map((p) => p.id);
  if (projectIds.length === 0) {
    return NextResponse.json({ ok: true, items: [] as CalculationHistoryItem[] });
  }

  const [concrete, steel, stairs] = await Promise.all([
    prisma.concreteCalculation.findMany({
      where: { projectId: { in: projectIds } },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
    prisma.steelCalculation.findMany({
      where: { projectId: { in: projectIds } },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
    prisma.straightStairCalculation.findMany({
      where: { projectId: { in: projectIds } },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
  ]);

  const items = (
    [] as CalculationHistoryItem[]
  )
    .concat(concrete.map(mapConcreteToHistory))
    .concat(steel.map(mapSteelToHistory))
    .concat(stairs.map(mapStraightStairToHistory))
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 60);

  return NextResponse.json({ ok: true, items });
}

export async function DELETE(req: Request) {
  const session = await requireApiSession();
  await assertApiFeatureAccess(session, "calc_history");

  const url = new URL(req.url);
  const kind = (url.searchParams.get("kind") ?? "").trim();
  const id = (url.searchParams.get("id") ?? "").trim();

  if (!kind || !id) {
    return NextResponse.json({ ok: false, error: "missing_kind_or_id" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { id: session.id }, select: { companyId: true } });
  if (!user?.companyId) {
    return NextResponse.json({ ok: false, error: "missing_company" }, { status: 400 });
  }

  if (kind === "concrete") {
    const found = await prisma.concreteCalculation.findUnique({ where: { id }, select: { project: { select: { companyId: true } } } });
    if (!found || found.project.companyId !== user.companyId) {
      return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });
    }
    await prisma.concreteCalculation.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  }

  if (kind === "steel") {
    const found = await prisma.steelCalculation.findUnique({ where: { id }, select: { project: { select: { companyId: true } } } });
    if (!found || found.project.companyId !== user.companyId) {
      return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });
    }
    await prisma.steelCalculation.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  }

  if (kind === "stair_straight") {
    const found = await prisma.straightStairCalculation.findUnique({ where: { id }, select: { project: { select: { companyId: true } } } });
    if (!found || found.project.companyId !== user.companyId) {
      return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });
    }
    await prisma.straightStairCalculation.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ ok: false, error: "invalid_kind" }, { status: 400 });
}

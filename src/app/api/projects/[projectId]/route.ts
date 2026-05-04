import { NextResponse } from "next/server";

import { prisma } from "@/lib/db/prisma";
import { requireApiSession } from "@/lib/auth/api";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ projectId: string }> },
) {
  const session = await requireApiSession();
  const { projectId } = await params;

  const user = await prisma.user.findUnique({
    where: { id: session.id },
    select: { companyId: true },
  });

  if (!user?.companyId) {
    return NextResponse.json({ ok: false, error: "missing_company" }, { status: 400 });
  }

  const project = await prisma.project.findFirst({
    where: { id: projectId, companyId: user.companyId },
    select: {
      id: true,
      name: true,
      clientName: true,
      location: true,
      projectType: true,
      estimatedBudget: true,
      startDate: true,
      plannedEndDate: true,
      status: true,
      progress: true,
      createdAt: true,
    },
  });

  if (!project) {
    return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true, project });
}

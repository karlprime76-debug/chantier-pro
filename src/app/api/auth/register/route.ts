import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/db/prisma";
import { hashPassword } from "@/lib/auth/password";

const RegisterSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  company: z.string().min(2),
  password: z.string().min(8),
});

export async function POST(req: Request) {
  try {
    const json = await req.json().catch(() => null);
    const parsed = RegisterSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "invalid_payload", issues: parsed.error.issues },
        { status: 400 },
      );
    }

    const email = parsed.data.email.trim().toLowerCase();

    const existing = await prisma.user.findUnique({ where: { email }, select: { id: true } });
    if (existing) {
      return NextResponse.json({ ok: false, error: "email_already_used" }, { status: 409 });
    }

    const passwordHash = await hashPassword(parsed.data.password);

    const companyName = parsed.data.company.trim();
    const userName = parsed.data.name.trim();

    const company = await prisma.company.upsert({
      where: { name: companyName },
      create: { name: companyName },
      update: {},
      select: { id: true },
    });

    const user = await prisma.user.create({
      data: {
        email,
        name: userName,
        passwordHash,
        role: "PROFESSIONAL",
        companyId: company.id,
      },
      select: { id: true },
    });

    return NextResponse.json({ ok: true, userId: user.id });
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown";
    return NextResponse.json(
      { ok: false, error: "server_error", message },
      { status: 500 },
    );
  }
}

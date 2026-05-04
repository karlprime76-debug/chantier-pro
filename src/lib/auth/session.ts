import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth/nextauth";

export type SessionUser = {
  id: string;
  name: string;
  role: "ADMIN" | "PROFESSIONAL" | "CLIENT";
};

export async function getSession(): Promise<SessionUser | null> {
  const session = await getServerSession(authOptions);
  const id = session?.user?.id;
  const name = session?.user?.name;
  const role = session?.user?.role;

  if (!id || !role) return null;

  if (role !== "ADMIN" && role !== "PROFESSIONAL" && role !== "CLIENT") return null;

  return { id, name: typeof name === "string" ? name : "", role };
}

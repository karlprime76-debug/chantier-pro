import { prisma } from "@/lib/db/prisma";
import { getSession } from "@/lib/auth/session";

export async function getCurrentUser() {
  const session = await getSession();
  if (!session) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.id },
    select: { id: true, name: true, email: true, role: true, companyId: true },
  });

  if (!user) return null;
  return user;
}

import { getSession } from "@/lib/auth/session";

export async function requireSession() {
  const session = await getSession();
  if (!session) return null;
  return session;
}

function isTruthyEnv(value: string | undefined) {
  const v = (value ?? "").trim().toLowerCase();
  return v === "1" || v === "true" || v === "yes" || v === "on";
}

function parseAllowedEmails(value: string | undefined) {
  return (value ?? "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

export async function requireAdmin() {
  const session = await requireSession();
  if (!session) return null;
  if (session.role !== "ADMIN") return null;

  const accessEnabled = process.env.ADMIN_ACCESS_ENABLED;
  if (accessEnabled !== undefined && !isTruthyEnv(accessEnabled)) {
    return null;
  }

  const allowedEmails = parseAllowedEmails(process.env.ADMIN_ALLOWED_EMAILS);
  if (allowedEmails.length) {
    const email = (session.email ?? "").trim().toLowerCase();
    if (!email || !allowedEmails.includes(email)) return null;
  }

  return session;
}

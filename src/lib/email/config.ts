export const SUPPORT_EMAIL = "contact@chantierpro.xyz";

const DEFAULT_FROM = "Chantier Pro <contact@chantierpro.xyz>";
const DEFAULT_REPLY_TO = SUPPORT_EMAIL;

function normalizeEmailHeader(value: string) {
  return value.trim();
}

export function getEmailFrom() {
  const fromEnv = (process.env.EMAIL_FROM ?? "").trim();
  return normalizeEmailHeader(fromEnv || DEFAULT_FROM);
}

export function getEmailReplyTo() {
  const replyToEnv = (process.env.EMAIL_REPLY_TO ?? "").trim();
  return normalizeEmailHeader(replyToEnv || DEFAULT_REPLY_TO);
}

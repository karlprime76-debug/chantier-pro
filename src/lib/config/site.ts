export const SITE_NAME = "Chantier Pro";
export const DEFAULT_SITE_URL = "https://chantierpro.xyz";

function normalizeBaseUrl(url: string) {
  return url.trim().replace(/\/+$/, "");
}

export function getSiteUrl() {
  const fromNextPublic = (process.env.NEXT_PUBLIC_APP_URL ?? "").trim();
  if (fromNextPublic) return normalizeBaseUrl(fromNextPublic);

  const fromAppUrl = (process.env.APP_URL ?? "").trim();
  if (fromAppUrl) return normalizeBaseUrl(fromAppUrl);

  const fromNextAuth = (process.env.NEXTAUTH_URL ?? "").trim();
  if (fromNextAuth) return normalizeBaseUrl(fromNextAuth);

  return normalizeBaseUrl(DEFAULT_SITE_URL);
}

export function absoluteUrl(path: string) {
  const base = getSiteUrl();
  const safePath = `/${String(path ?? "").trim().replace(/^\/+/, "")}`;
  return `${base}${safePath}`;
}

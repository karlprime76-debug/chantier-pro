export const SITE_NAME = "Chantier Pro";
export const DEFAULT_SITE_URL = "https://chantierpro.xyz";

function normalizeBaseUrl(url: string) {
  return url.trim().replace(/\/+$/, "");
}

function isVercelHost(url: string) {
  return /\.vercel\.app$/i.test(url.replace(/^https?:\/\//i, "").split("/")[0] ?? "");
}

export function getSiteUrl() {
  const fromNextPublic = (process.env.NEXT_PUBLIC_APP_URL ?? "").trim();
  if (fromNextPublic) {
    const normalized = normalizeBaseUrl(fromNextPublic);
    if (process.env.NODE_ENV === "production" && process.env.VERCEL_ENV !== "preview" && isVercelHost(normalized)) {
      return normalizeBaseUrl(DEFAULT_SITE_URL);
    }
    return normalized;
  }

  const fromAppUrl = (process.env.APP_URL ?? "").trim();
  if (fromAppUrl) {
    const normalized = normalizeBaseUrl(fromAppUrl);
    if (process.env.NODE_ENV === "production" && process.env.VERCEL_ENV !== "preview" && isVercelHost(normalized)) {
      return normalizeBaseUrl(DEFAULT_SITE_URL);
    }
    return normalized;
  }

  const fromNextAuth = (process.env.NEXTAUTH_URL ?? "").trim();
  if (fromNextAuth) {
    const normalized = normalizeBaseUrl(fromNextAuth);
    if (process.env.NODE_ENV === "production" && process.env.VERCEL_ENV !== "preview" && isVercelHost(normalized)) {
      return normalizeBaseUrl(DEFAULT_SITE_URL);
    }
    return normalized;
  }

  return normalizeBaseUrl(DEFAULT_SITE_URL);
}

export function absoluteUrl(path: string) {
  const base = getSiteUrl();
  const safePath = `/${String(path ?? "").trim().replace(/^\/+/, "")}`;
  return `${base}${safePath}`;
}

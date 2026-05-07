type RateLimitConfig = {
  limit: number;
  windowMs: number;
  keyPrefix: string;
};

type Bucket = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, Bucket>();

function nowMs() {
  return Date.now();
}

export function getClientIp(req: Request): string {
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) {
    const first = forwardedFor.split(",")[0]?.trim();
    if (first) return first;
  }

  const realIp = req.headers.get("x-real-ip")?.trim();
  if (realIp) return realIp;

  return "unknown";
}

export function checkRateLimit(req: Request, config: RateLimitConfig): {
  allowed: boolean;
  remaining: number;
  resetAt: number;
  key: string;
} {
  const ip = getClientIp(req);
  const key = `${config.keyPrefix}:${ip}`;

  const t = nowMs();
  const existing = buckets.get(key);

  if (!existing || existing.resetAt <= t) {
    const bucket: Bucket = { count: 1, resetAt: t + config.windowMs };
    buckets.set(key, bucket);
    return {
      allowed: true,
      remaining: Math.max(0, config.limit - bucket.count),
      resetAt: bucket.resetAt,
      key,
    };
  }

  existing.count += 1;
  buckets.set(key, existing);

  const allowed = existing.count <= config.limit;
  return {
    allowed,
    remaining: Math.max(0, config.limit - existing.count),
    resetAt: existing.resetAt,
    key,
  };
}

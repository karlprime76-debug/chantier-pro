import crypto from "crypto";

export function getRequestId(req: Request): string {
  const existing = (req.headers.get("x-request-id") ?? "").trim();
  if (existing) return existing;
  return crypto.randomUUID();
}

export function withRequestIdHeaders(res: Response, requestId: string): Response {
  res.headers.set("x-request-id", requestId);
  return res;
}

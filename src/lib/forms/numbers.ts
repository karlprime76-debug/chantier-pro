export function parseNumberFR(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) return null;

  const normalized = trimmed
    .replace(/\s+/g, "")
    .replace(/\u00A0/g, "")
    .replace(/,/g, ".");

  const n = Number(normalized);
  return Number.isFinite(n) ? n : null;
}

export function parseIntegerFR(value: string): number | null {
  const n = parseNumberFR(value);
  if (n === null) return null;
  return Number.isInteger(n) ? n : null;
}

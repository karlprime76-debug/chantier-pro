export type PrintPayload = {
  calculatorName: string;
  createdAt: string;
  warning: string;
  input: Record<string, unknown>;
  output: Record<string, unknown>;
};

const STORAGE_KEY = "cp:calc:print_payload:v1";

export function setPrintPayload(payload: PrintPayload) {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // ignore
  }
}

export function getPrintPayload(): PrintPayload | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const v = JSON.parse(raw) as unknown;
    if (!v || typeof v !== "object") return null;
    return v as PrintPayload;
  } catch {
    return null;
  }
}

export function clearPrintPayload() {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

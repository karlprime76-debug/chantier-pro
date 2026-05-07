type LogLevel = "info" | "warn" | "error";

type LogPayload = Record<string, unknown>;

type LogRecord = {
  level: LogLevel;
  event: string;
  requestId?: string;
} & LogPayload;

function safeJsonStringify(value: unknown): string {
  try {
    return JSON.stringify(value);
  } catch {
    return JSON.stringify({ error: "unstringifiable" });
  }
}

export function logInfo(event: string, payload?: LogPayload) {
  const record: LogRecord = { level: "info", event, ...(payload ?? {}) };
  console.info(safeJsonStringify(record));
}

export function logWarn(event: string, payload?: LogPayload) {
  const record: LogRecord = { level: "warn", event, ...(payload ?? {}) };
  console.warn(safeJsonStringify(record));
}

export function logError(event: string, payload?: LogPayload) {
  const record: LogRecord = { level: "error", event, ...(payload ?? {}) };
  console.error(safeJsonStringify(record));
}

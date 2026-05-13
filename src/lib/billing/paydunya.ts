import { logInfo } from "@/lib/observability/logger";

type PayDunyaInvoiceResponse = {
  response_code: string;
  response_text: string;
  token?: string;
  invoice_url?: string;
  response_message?: string;
  errors?: unknown;
};

type PayDunyaConfirmResponse = {
  response_code: string;
  response_text: string;
  status?: string;
  response_message?: string;
  errors?: unknown;
};

export type PayDunyaErrorDetails = {
  httpStatus?: number;
  contentType?: string;
  responseCode?: string;
  responseText?: string;
  responseMessage?: string;
  errors?: unknown;
};

export class PayDunyaError extends Error {
  public readonly details: PayDunyaErrorDetails;

  constructor(message: string, details: PayDunyaErrorDetails = {}) {
    super(message);
    this.name = "PayDunyaError";
    this.details = details;
  }
}

async function readPayDunyaJson(res: Response) {
  const contentType = res.headers.get("content-type") || "";
  const text = await res.text().catch(() => "");

  const trimmed = text.trim();
  const looksLikeJson =
    contentType.toLowerCase().includes("application/json") ||
    trimmed.startsWith("{") ||
    trimmed.startsWith("[");

  if (!looksLikeJson) {
    return { text, json: null as unknown, contentType };
  }

  const json = trimmed ? (JSON.parse(trimmed) as unknown) : null;
  return { text, json, contentType };
}

type PayDunyaRequestOptions = {
  masterKey: string;
  privateKey?: string;
  token?: string;
  apiKey?: string;
  apiSecret?: string;
};

function getPayDunyaConfig(): PayDunyaRequestOptions {
  const masterKey = process.env.PAYDUNYA_MASTER_KEY ?? "";
  const privateKey = process.env.PAYDUNYA_PRIVATE_KEY ?? "";
  const token = process.env.PAYDUNYA_TOKEN ?? "";

  const apiKey = process.env.PAYDUNYA_API_KEY ?? "";
  const apiSecret = process.env.PAYDUNYA_API_SECRET ?? "";

  if (!masterKey) {
    throw new Error("PAYDUNYA credentials are missing");
  }

  if (privateKey && token) {
    return { masterKey, privateKey, token };
  }

  if (apiKey && apiSecret) {
    return { masterKey, apiKey, apiSecret };
  }

  throw new Error("PAYDUNYA credentials are missing");
}

function getPayDunyaBaseUrl() {
  const override = process.env.PAYDUNYA_BASE_URL?.trim();
  if (override) return override;

  const env = (process.env.PAYDUNYA_ENV ?? "").trim().toLowerCase();
  if (env === "test" || env === "sandbox") {
    return "https://app.paydunya.com/sandbox-api/v1";
  }

  return "https://app.paydunya.com/api/v1";
}

export type CreateInvoiceInput = {
  amount: number;
  description: string;
  returnUrl: string;
  cancelUrl: string;
  callbackUrl: string;
  customerEmail?: string;
  customData?: Record<string, string>;
  storeWebsiteUrl?: string;
  storeLogoUrl?: string;
  storePhone?: string;
  itemKey?: string;
};

export async function createPayDunyaInvoice(input: CreateInvoiceInput) {
  const { apiKey, apiSecret, masterKey, privateKey, token } = getPayDunyaConfig();

  const url = `${getPayDunyaBaseUrl()}/checkout-invoice/create`;
  const itemKey = (input.itemKey || "premium").trim() || "premium";
  const storeWebsiteUrl = (input.storeWebsiteUrl || "").trim();
  const storeLogoUrl = (input.storeLogoUrl || "").trim();
  const storePhone = (input.storePhone || "").trim();
  const body = {
    invoice: {
      items: {
        [itemKey]: {
          name: input.description || "Abonnement Premium Chantier Pro",
          quantity: 1,
          unit_price: input.amount,
          total_price: input.amount,
          description: input.description,
        },
      },
      total_amount: input.amount,
      description: input.description,
      ...(input.customerEmail
        ? {
            customer: {
              email: input.customerEmail,
            },
          }
        : {}),
    },
    store: {
      name: "Chantier Pro",
      tagline: "L’application des pros du BTP",
      phone: storePhone,
      postal_address: "Bénin",
      website_url: storeWebsiteUrl,
      logo_url: storeLogoUrl,
    },
    actions: {
      cancel_url: input.cancelUrl,
      return_url: input.returnUrl,
      callback_url: input.callbackUrl,
    },
    custom_data: input.customData ?? {},
  };

  logInfo("billing.paydunya.create_invoice.request", {
    url,
    amount: input.amount,
    itemKey,
  });

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...(privateKey && token
        ? {
            "PAYDUNYA-MASTER-KEY": masterKey,
            "PAYDUNYA-PRIVATE-KEY": privateKey,
            "PAYDUNYA-TOKEN": token,
          }
        : {
            "PAYDUNYA-MASTER-KEY": masterKey,
            "PAYDUNYA-API-KEY": apiKey ?? "",
            "PAYDUNYA-API-SECRET": apiSecret ?? "",
          }),
    },
    body: JSON.stringify(body),
  });

  let parsed: { text: string; json: unknown; contentType: string };
  try {
    parsed = await readPayDunyaJson(res);
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown";
    throw new PayDunyaError("PayDunya response parse failed", {
      httpStatus: res.status,
      contentType: res.headers.get("content-type") || "",
      responseMessage: message,
    });
  }

  const data = parsed.json as PayDunyaInvoiceResponse | null;
  const trimmed = parsed.text.trim();

  if (!res.ok || !data) {
    if (trimmed.startsWith("<!DOCTYPE") || trimmed.startsWith("<html") || trimmed.startsWith("<")) {
      throw new PayDunyaError("PayDunya returned HTML instead of JSON", {
        httpStatus: res.status,
        contentType: parsed.contentType,
        responseMessage: trimmed.slice(0, 300),
      });
    }
    throw new PayDunyaError("PayDunya create invoice failed", {
      httpStatus: res.status,
      contentType: parsed.contentType,
      responseMessage: parsed.text?.slice(0, 500) || undefined,
    });
  }

  logInfo("billing.paydunya.create_invoice.response", {
    httpStatus: res.status,
    response_code: data.response_code,
    response_text: data.response_text,
  });

  const invoiceUrl = data.invoice_url || (data.response_text?.startsWith("http") ? data.response_text : "");

  if (data.response_code !== "00" || !data.token || !invoiceUrl) {
    throw new PayDunyaError(data.response_text || "PayDunya create invoice failed", {
      httpStatus: res.status,
      contentType: parsed.contentType,
      responseCode: data.response_code,
      responseText: data.response_text,
      responseMessage: data.response_message,
      errors: data.errors,
    });
  }

  return { token: data.token, invoiceUrl };
}

export async function confirmPayDunyaInvoice(token: string) {
  const { apiKey, apiSecret, masterKey, privateKey, token: paydunyaToken } = getPayDunyaConfig();

  const url = `${getPayDunyaBaseUrl()}/checkout-invoice/confirm/${encodeURIComponent(token)}`;
  const res = await fetch(url, {
    method: "GET",
    headers: {
      "content-type": "application/json",
      ...(privateKey && paydunyaToken
        ? {
            "PAYDUNYA-MASTER-KEY": masterKey,
            "PAYDUNYA-PRIVATE-KEY": privateKey,
            "PAYDUNYA-TOKEN": paydunyaToken,
          }
        : {
            "PAYDUNYA-MASTER-KEY": masterKey,
            "PAYDUNYA-API-KEY": apiKey ?? "",
            "PAYDUNYA-API-SECRET": apiSecret ?? "",
          }),
    },
  });

  let parsed: { text: string; json: unknown; contentType: string };
  try {
    parsed = await readPayDunyaJson(res);
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown";
    throw new PayDunyaError("PayDunya response parse failed", {
      httpStatus: res.status,
      contentType: res.headers.get("content-type") || "",
      responseMessage: message,
    });
  }

  const data = parsed.json as PayDunyaConfirmResponse | null;
  const trimmed = parsed.text.trim();
  if (!res.ok || !data) {
    if (trimmed.startsWith("<!DOCTYPE") || trimmed.startsWith("<html") || trimmed.startsWith("<")) {
      throw new PayDunyaError("PayDunya returned HTML instead of JSON", {
        httpStatus: res.status,
        contentType: parsed.contentType,
        responseMessage: trimmed.slice(0, 300),
      });
    }
    throw new PayDunyaError("PayDunya confirm invoice failed", {
      httpStatus: res.status,
      contentType: parsed.contentType,
      responseMessage: parsed.text?.slice(0, 500) || undefined,
    });
  }

  if (data.response_code !== "00") {
    throw new PayDunyaError(data.response_text || "PayDunya confirm invoice failed", {
      httpStatus: res.status,
      contentType: parsed.contentType,
      responseCode: data.response_code,
      responseText: data.response_text,
      responseMessage: data.response_message,
      errors: data.errors,
    });
  }

  return data;
}

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
  const text = await res.text().catch(() => "");
  const json = text ? (JSON.parse(text) as unknown) : null;
  return { text, json };
}

type PayDunyaRequestOptions = {
  apiKey: string;
  apiSecret: string;
  masterKey: string;
};

function getPayDunyaConfig(): PayDunyaRequestOptions {
  const apiKey = process.env.PAYDUNYA_API_KEY ?? "";
  const apiSecret = process.env.PAYDUNYA_API_SECRET ?? "";
  const masterKey = process.env.PAYDUNYA_MASTER_KEY ?? "";

  if (!apiKey || !apiSecret || !masterKey) {
    throw new Error("PAYDUNYA credentials are missing");
  }

  return { apiKey, apiSecret, masterKey };
}

function getPayDunyaBaseUrl() {
  return process.env.PAYDUNYA_BASE_URL ?? "https://app.paydunya.com/api/v1";
}

export type CreateInvoiceInput = {
  amount: number;
  description: string;
  returnUrl: string;
  cancelUrl: string;
  callbackUrl: string;
  customerEmail?: string;
  customData?: Record<string, string>;
};

export async function createPayDunyaInvoice(input: CreateInvoiceInput) {
  const { apiKey, apiSecret, masterKey } = getPayDunyaConfig();

  const url = `${getPayDunyaBaseUrl()}/checkout-invoice/create`;
  const body = {
    invoice: {
      total_amount: input.amount,
      description: input.description,
      items: [
        {
          name: input.description,
          quantity: 1,
          unit_price: input.amount,
          total_price: input.amount,
        },
      ],
    },
    store: {
      name: "Chantier Pro",
    },
    actions: {
      return_url: input.returnUrl,
      cancel_url: input.cancelUrl,
      callback_url: input.callbackUrl,
    },
    custom_data: input.customData ?? {},
    ...(input.customerEmail
      ? {
          customer: {
            email: input.customerEmail,
          },
        }
      : {}),
  };

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "PAYDUNYA-API-KEY": apiKey,
      "PAYDUNYA-API-SECRET": apiSecret,
      "PAYDUNYA-MASTER-KEY": masterKey,
    },
    body: JSON.stringify(body),
  });

  let parsed: { text: string; json: unknown };
  try {
    parsed = await readPayDunyaJson(res);
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown";
    throw new PayDunyaError("PayDunya response parse failed", {
      httpStatus: res.status,
      responseMessage: message,
    });
  }

  const data = parsed.json as PayDunyaInvoiceResponse | null;

  if (!res.ok || !data) {
    throw new PayDunyaError("PayDunya create invoice failed", {
      httpStatus: res.status,
      responseMessage: parsed.text?.slice(0, 500) || undefined,
    });
  }

  if (data.response_code !== "00" || !data.token || !data.invoice_url) {
    throw new PayDunyaError(data.response_text || "PayDunya create invoice failed", {
      httpStatus: res.status,
      responseCode: data.response_code,
      responseText: data.response_text,
      responseMessage: data.response_message,
      errors: data.errors,
    });
  }

  return { token: data.token, invoiceUrl: data.invoice_url };
}

export async function confirmPayDunyaInvoice(token: string) {
  const { apiKey, apiSecret, masterKey } = getPayDunyaConfig();

  const url = `${getPayDunyaBaseUrl()}/checkout-invoice/confirm/${encodeURIComponent(token)}`;
  const res = await fetch(url, {
    method: "GET",
    headers: {
      "content-type": "application/json",
      "PAYDUNYA-API-KEY": apiKey,
      "PAYDUNYA-API-SECRET": apiSecret,
      "PAYDUNYA-MASTER-KEY": masterKey,
    },
  });

  let parsed: { text: string; json: unknown };
  try {
    parsed = await readPayDunyaJson(res);
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown";
    throw new PayDunyaError("PayDunya response parse failed", {
      httpStatus: res.status,
      responseMessage: message,
    });
  }

  const data = parsed.json as PayDunyaConfirmResponse | null;
  if (!res.ok || !data) {
    throw new PayDunyaError("PayDunya confirm invoice failed", {
      httpStatus: res.status,
      responseMessage: parsed.text?.slice(0, 500) || undefined,
    });
  }

  if (data.response_code !== "00") {
    throw new PayDunyaError(data.response_text || "PayDunya confirm invoice failed", {
      httpStatus: res.status,
      responseCode: data.response_code,
      responseText: data.response_text,
      responseMessage: data.response_message,
      errors: data.errors,
    });
  }

  return data;
}

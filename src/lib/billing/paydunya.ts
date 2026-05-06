type PayDunyaInvoiceResponse = {
  response_code: string;
  response_text: string;
  token?: string;
  invoice_url?: string;
};

type PayDunyaConfirmResponse = {
  response_code: string;
  response_text: string;
  status?: string;
};

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

  const data = (await res.json().catch(() => null)) as PayDunyaInvoiceResponse | null;
  if (!res.ok || !data) {
    throw new Error("PayDunya create invoice failed");
  }

  if (data.response_code !== "00" || !data.token || !data.invoice_url) {
    throw new Error(data.response_text || "PayDunya create invoice failed");
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

  const data = (await res.json().catch(() => null)) as PayDunyaConfirmResponse | null;
  if (!res.ok || !data) {
    throw new Error("PayDunya confirm invoice failed");
  }

  if (data.response_code !== "00") {
    throw new Error(data.response_text || "PayDunya confirm invoice failed");
  }

  return data;
}

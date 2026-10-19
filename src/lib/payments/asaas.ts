import type { CheckoutRequest, CheckoutResponse, PaymentGateway } from "@/lib/payments/types";

export class AsaasGateway implements PaymentGateway {
  async createCheckout(input: CheckoutRequest): Promise<CheckoutResponse> {
    const apiKey = process.env.ASAAS_API_KEY;
    const base = process.env.ASAAS_BASE_URL;
    if (!apiKey || !base) throw new Error("Asaas não configurado: defina ASAAS_API_KEY e ASAAS_BASE_URL.");
    const response = await fetch(`${base.replace(/\/$/, "")}/checkouts`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "access_token": apiKey },
      body: JSON.stringify({
        billingTypes: ["PIX", "CREDIT_CARD"], chargeTypes: ["DETACHED"],
        minutesToExpire: 60, externalReference: input.orderId,
        items: [{ name: input.productName, quantity: 1, value: input.amountCents / 100 }],
        callback: { successUrl: input.successUrl, cancelUrl: input.cancelUrl, expiredUrl: input.cancelUrl },
      }),
    });
    const data = await response.json().catch(() => ({})) as { id?: string; link?: string; errors?: unknown };
    if (!response.ok || !data.id || !data.link) throw new Error(`Asaas checkout falhou (HTTP ${response.status}). Confira a API e o payload exigido pela sua conta.`);
    return { checkoutId: data.id, checkoutUrl: data.link };
  }
}

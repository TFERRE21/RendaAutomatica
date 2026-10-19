import type { CheckoutRequest, CheckoutResponse, PaymentGateway } from "@/lib/payments/types";

export class StripeGateway implements PaymentGateway {
  async createCheckout(input: CheckoutRequest): Promise<CheckoutResponse> {
    const secret = process.env.STRIPE_SECRET_KEY;
    if (!secret) throw new Error("Stripe não configurado: defina STRIPE_SECRET_KEY.");
    const body = new URLSearchParams({
      mode: "payment", success_url: input.successUrl, cancel_url: input.cancelUrl,
      customer_email: input.customerEmail, "line_items[0][price_data][currency]": input.currency.toLowerCase(),
      "line_items[0][price_data][product_data][name]": input.productName,
      "line_items[0][price_data][unit_amount]": String(input.amountCents), "line_items[0][quantity]": "1",
      client_reference_id: input.orderId, "metadata[orderId]": input.orderId,
    });
    const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST", headers: { Authorization: `Bearer ${secret}`, "Content-Type": "application/x-www-form-urlencoded" }, body,
    });
    const data = await response.json().catch(() => ({})) as { id?: string; url?: string };
    if (!response.ok || !data.id || !data.url) throw new Error(`Stripe Checkout falhou (HTTP ${response.status}).`);
    return { checkoutId: data.id, checkoutUrl: data.url };
  }
}

export type CheckoutRequest = { orderId: string; productName: string; amountCents: number; currency: "BRL"; customerEmail: string; successUrl: string; cancelUrl: string };
export type CheckoutResponse = { checkoutId: string; checkoutUrl: string };
export interface PaymentGateway { createCheckout(input: CheckoutRequest): Promise<CheckoutResponse>; }

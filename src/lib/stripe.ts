import Stripe from "stripe";

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    typescript: true,
  });
}

// Lazy initialization — only create when actually called at runtime
let _stripe: Stripe | undefined;
export const stripe = new Proxy({} as Stripe, {
  get(_target, prop) {
    if (!_stripe) {
      _stripe = getStripe();
    }
    const val = (_stripe as unknown as Record<string | symbol, unknown>)[prop];
    if (typeof val === "function") {
      return val.bind(_stripe);
    }
    return val;
  },
});

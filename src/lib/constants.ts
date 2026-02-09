export const PLANS = {
  garage: {
    name: "Garage",
    description: "For personal vehicle tracking",
    price: { monthly: 0, yearly: 0 },
    features: [
      "Up to 2 vehicles",
      "Basic maintenance logs",
      "Mileage tracking",
    ],
  },
  pitcrew: {
    name: "Pit Crew",
    description: "For enthusiasts and fleets",
    price: { monthly: 29, yearly: 290 },
    stripePriceId: {
      monthly: process.env.STRIPE_PRO_MONTHLY_PRICE_ID!,
      yearly: process.env.STRIPE_PRO_YEARLY_PRICE_ID!,
    },
    features: [
      "Unlimited vehicles",
      "Live GPS tracking",
      "Diagnostic alerts",
      "Service history export",
      "Fleet management",
    ],
  },
} as const;

import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const interval = body.interval === "yearly" ? "yearly" : "monthly";

    const priceId =
      interval === "yearly"
        ? process.env.STRIPE_PRO_YEARLY_PRICE_ID!
        : process.env.STRIPE_PRO_MONTHLY_PRICE_ID!;

    let subscription = await prisma.subscription.findUnique({
      where: { userId: session.user.id },
    });

    let stripeCustomerId = subscription?.stripeCustomerId;

    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: session.user.email!,
        metadata: { userId: session.user.id },
      });
      stripeCustomerId = customer.id;

      if (subscription) {
        await prisma.subscription.update({
          where: { userId: session.user.id },
          data: { stripeCustomerId },
        });
      } else {
        subscription = await prisma.subscription.create({
          data: {
            userId: session.user.id,
            stripeCustomerId,
            status: "INACTIVE",
          },
        });
      }
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing?canceled=true`,
      metadata: { userId: session.user.id },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}

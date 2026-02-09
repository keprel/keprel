import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PricingCards } from "@/components/billing/pricing-cards";
import { ManageSubscriptionButton } from "@/components/billing/manage-subscription-button";

export default async function BillingPage() {
  const session = await auth();
  const subscription = await prisma.subscription.findUnique({
    where: { userId: session!.user.id },
  });

  const isActive = subscription?.status === "ACTIVE" || subscription?.status === "TRIALING";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Billing</h1>
        <p className="text-muted-foreground">Manage your subscription and billing</p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Current Plan</CardTitle>
            <CardDescription>
              {isActive
                ? `Pit Crew plan — renews ${subscription?.stripeCurrentPeriodEnd ? new Date(subscription.stripeCurrentPeriodEnd).toLocaleDateString() : "soon"}`
                : "Garage plan — upgrade for unlimited vehicles and live tracking"}
            </CardDescription>
          </div>
          <Badge variant={isActive ? "default" : "secondary"}>
            {isActive ? "Pit Crew" : "Garage"}
          </Badge>
        </CardHeader>
        {isActive && (
          <CardContent>
            <ManageSubscriptionButton />
          </CardContent>
        )}
      </Card>

      <PricingCards isSubscribed={isActive} />
    </div>
  );
}

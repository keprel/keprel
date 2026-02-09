import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Car, Gauge, Wrench } from "lucide-react";

export default async function DashboardPage() {
  const session = await auth();
  const subscription = await prisma.subscription.findUnique({
    where: { userId: session!.user.id },
  });

  const isActive = subscription?.status === "ACTIVE" || subscription?.status === "TRIALING";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {session!.user.name ?? "there"}!
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Subscription</CardTitle>
            <CardDescription>Your current plan status</CardDescription>
          </div>
          <Badge variant={isActive ? "default" : "secondary"}>
            {isActive ? "Pit Crew" : "Garage"}
          </Badge>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {isActive
              ? `Your Pit Crew subscription is active${subscription?.stripeCurrentPeriodEnd ? ` until ${new Date(subscription.stripeCurrentPeriodEnd).toLocaleDateString()}` : ""}.`
              : "You are on the Garage plan. Upgrade to Pit Crew for unlimited vehicles and live tracking."}
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Vehicles</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">{isActive ? "Unlimited" : "2 max"} on your plan</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Miles</CardTitle>
            <Gauge className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24,831</div>
            <p className="text-xs text-muted-foreground">Tracked this year</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Next Service</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,200 mi</div>
            <p className="text-xs text-muted-foreground">Oil change due</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

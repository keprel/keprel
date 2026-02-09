"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Garage",
    description: "For personal vehicle tracking",
    price: { monthly: 0, yearly: 0 },
    features: ["Up to 2 vehicles", "Basic maintenance logs", "Mileage tracking"],
    current: true,
  },
  {
    name: "Pit Crew",
    description: "For enthusiasts and fleets",
    price: { monthly: 29, yearly: 290 },
    features: [
      "Unlimited vehicles",
      "Live GPS tracking",
      "Diagnostic alerts",
      "Service history export",
      "Fleet management",
    ],
    current: false,
  },
];

export function PricingCards({ isSubscribed }: { isSubscribed: boolean }) {
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleUpgrade() {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ interval: billing }),
      });
      const data = await res.json();
      if (data.url) {
        router.push(data.url);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={() => setBilling("monthly")}
          className={cn(
            "text-sm font-medium",
            billing === "monthly" ? "text-foreground" : "text-muted-foreground"
          )}
        >
          Monthly
        </button>
        <button
          onClick={() => setBilling("yearly")}
          className={cn(
            "text-sm font-medium",
            billing === "yearly" ? "text-foreground" : "text-muted-foreground"
          )}
        >
          Yearly
          <Badge variant="secondary" className="ml-2">Save 17%</Badge>
        </button>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {plans.map((plan) => (
          <Card key={plan.name} className={cn(plan.name === "Pit Crew" && "border-primary")}>
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
              <div className="pt-2">
                <span className="text-3xl font-bold">
                  ${billing === "monthly" ? plan.price.monthly : plan.price.yearly}
                </span>
                <span className="text-muted-foreground">
                  /{billing === "monthly" ? "mo" : "yr"}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              {plan.name === "Garage" ? (
                <Button variant="outline" className="w-full" disabled>
                  {isSubscribed ? "Downgrade" : "Current plan"}
                </Button>
              ) : (
                <Button
                  className="w-full"
                  onClick={handleUpgrade}
                  disabled={loading || isSubscribed}
                >
                  {isSubscribed ? "Current plan" : loading ? "Loading..." : "Upgrade to Pit Crew"}
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

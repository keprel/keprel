import Link from "next/link";
import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Gauge, Shield, Wrench } from "lucide-react";

const features = [
  {
    icon: Gauge,
    title: "Real-Time Diagnostics",
    description: "Monitor engine health, tire pressure, and performance metrics in real time from any device.",
  },
  {
    icon: Wrench,
    title: "Maintenance Tracking",
    description: "Never miss an oil change again. Automated service reminders based on mileage and time intervals.",
  },
  {
    icon: Shield,
    title: "Theft Protection",
    description: "GPS tracking with instant alerts if your vehicle moves outside its designated zone.",
  },
];

const pricingPlans = [
  {
    name: "Garage",
    price: 0,
    features: ["Up to 2 vehicles", "Basic maintenance logs", "Mileage tracking"],
  },
  {
    name: "Pit Crew",
    price: 29,
    popular: true,
    features: [
      "Unlimited vehicles",
      "Live GPS tracking",
      "Diagnostic alerts",
      "Service history export",
      "Fleet management",
    ],
  },
];

export default async function HomePage() {
  const session = await auth();

  return (
    <div className="flex min-h-screen flex-col">
      {/* Navigation */}
      <header className="border-b border-border">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2 font-bold tracking-wider uppercase">
            <div className="flex h-7 w-7 items-center justify-center rounded bg-primary text-primary-foreground text-sm font-black">
              T
            </div>
            <span>Trak</span>
          </Link>
          <div className="flex items-center gap-4">
            {session?.user ? (
              <Button asChild>
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/sign-in">Sign in</Link>
                </Button>
                <Button asChild>
                  <Link href="/sign-up">Get Started</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto flex max-w-4xl flex-col items-center gap-6 px-6 py-24 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          Your garage,
          <br />
          <span className="text-primary">under control</span>
        </h1>
        <p className="max-w-2xl text-lg text-muted-foreground">
          Trak is the all-in-one platform to monitor your vehicles, schedule maintenance,
          and keep every ride running at peak performance. Start for free.
        </p>
        <div className="flex gap-4">
          {session?.user ? (
            <Button size="lg" asChild>
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
          ) : (
            <>
              <Button size="lg" asChild>
                <Link href="/sign-up">Start Tracking Free</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/sign-in">Sign in</Link>
              </Button>
            </>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-border bg-muted/40">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <h2 className="mb-12 text-center text-3xl font-bold">
            Built for car enthusiasts
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {features.map((feature) => (
              <Card key={feature.title} className="border-0 bg-transparent shadow-none">
                <CardHeader>
                  <feature.icon className="mb-2 h-10 w-10 text-primary" />
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <h2 className="mb-4 text-center text-3xl font-bold">
          Simple, transparent pricing
        </h2>
        <p className="mb-12 text-center text-muted-foreground">
          Start free. Upgrade when your fleet grows.
        </p>
        <div className="mx-auto grid max-w-3xl gap-8 md:grid-cols-2">
          {pricingPlans.map((plan) => (
            <Card key={plan.name} className={plan.popular ? "border-primary" : ""}>
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>
                  <span className="text-3xl font-bold text-foreground">
                    ${plan.price}
                  </span>
                  <span className="text-muted-foreground">/mo</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full"
                  variant={plan.popular ? "default" : "outline"}
                  asChild
                >
                  <Link href={session?.user ? "/billing" : "/sign-up"}>
                    {plan.popular ? "Get Started" : "Start Free"}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground font-bold tracking-wider uppercase">
            <div className="flex h-5 w-5 items-center justify-center rounded bg-primary text-primary-foreground text-xs font-black">
              T
            </div>
            Trak
          </div>
          <p className="text-sm text-muted-foreground" suppressHydrationWarning>
            &copy; {new Date().getFullYear()} Trak. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

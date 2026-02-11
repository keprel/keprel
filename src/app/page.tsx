import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

const cards = [
  {
    title: "Build",
    description: "Startups I've worked with.",
    href: "/projects",
  },
  {
    title: "Explore",
    description: "Places I've been.",
    href: "/travel",
  },
  {
    title: "Connect",
    description: "Got something interesting? Let's talk.",
    href: "/connect",
  },
];

export default function HomePage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-24">
      <section className="mb-20">
        <h1 className="mb-4 text-5xl font-bold tracking-tight sm:text-6xl">
          Will Kepler
        </h1>
        <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">
          I help startups sell and ship. When I'm not doing that, I'm
          adventuring somewhere new. Based in New York.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        {cards.map((card) => (
          <Link key={card.href} href={card.href} className="group">
            <Card className="h-full transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-lg">
                  {card.title}
                  <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform duration-300 group-hover:translate-x-1 group-hover:text-primary" />
                </CardTitle>
                <CardDescription>{card.description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </section>
    </div>
  );
}

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Globe,
  Brain,
  Mail,
  Send,
  Users,
  PhoneCall,
  Cog,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const portfolio = [
  {
    title: "TAM Discovery Engine",
    icon: Globe,
    description:
      "Grid-based Google Places API scraper that maps the total addressable market across every US metro. Overlapping search grids ensure full coverage, then RapidFuzz deduplicates results, scrapes websites for contact emails, and scores each business on data completeness.",
    tech: ["Python", "Google Places API", "SQLite", "RapidFuzz", "BeautifulSoup"],
    metrics: ["36,306 body shops found", "643 ADAS companies found", "51/51 states complete"],
    images: [
      { src: "/portfolio/tam.png", alt: "TAM Builder showing 50-state grid with 36K+ places discovered, phase controls, and progress stats" },
      { src: "/portfolio/adas-tam.png", alt: "ADAS TAM Builder showing 151 cities scanned with Pure ADAS, Hybrid, and Unlikely classifications" },
    ],
  },
  {
    title: "AI Lead Qualification",
    icon: Brain,
    description:
      "Claude analyzes each company's website and classifies them as Pure ADAS, Hybrid, Glass, or Collision Center. Handles ambiguous cases like auto glass companies that also do ADAS calibration. Outputs confidence scores and reasoning for manual review.",
    tech: ["Claude API", "BeautifulSoup", "Python"],
    metrics: ["71 Pure ADAS", "22 Hybrid", "5-phase pipeline per city"],
    images: [
      { src: "/portfolio/leads.png", alt: "Lead database with 14,500+ companies showing scores, business types, enrichment status, and filtering" },
    ],
  },
  {
    title: "Outbound Email Engine",
    icon: Mail,
    description:
      "Four-step cold email sequences (Cold Intro, Follow-up 1, Follow-up 2, Breakup) with Gmail OAuth. Domain warmup ramps from 3 to 75 emails/day over 28 days. Detects replies and bounces automatically, pauses sending on bounce spikes, and tracks per-step reply rates.",
    tech: ["Gmail API", "Claude API", "APScheduler", "Python"],
    metrics: ["867 emails sent", "18 replies", "6.8% Step 1 reply rate"],
    images: [
      { src: "/portfolio/outreach-analytics.png", alt: "Outreach analytics showing reply rates by step and business type, 867 total sent with 2.1% overall reply rate" },
      { src: "/portfolio/settings.png", alt: "Email configuration panel with daily limits, send windows, warmup controls, and sequence step delays" },
    ],
  },
  {
    title: "Direct Mail Campaign System",
    icon: Send,
    description:
      "End-to-end postcard campaign pipeline. Groups leads by state, sorts by rating/reviews, and alternates assignment to create balanced A/B test groups (max 1 difference per state). Generates print-ready mailing lists formatted for Dope Marketing fulfillment.",
    tech: ["Python", "CSV processing", "Dope Marketing API"],
    metrics: ["500 collision centers mailed", "264 ADAS companies mailed", "A/B split tested"],
    images: [
      { src: "/portfolio/postcard-front.png", alt: "Trak direct mail postcard front - What's Your Capture Rate?" },
      { src: "/portfolio/postcard-adas-front.png", alt: "ADAS company postcard variant front design" },
    ],
  },
  {
    title: "Lead Enrichment Pipeline",
    icon: Users,
    description:
      "Multi-source contact discovery. Scrapes company websites for email addresses, searches Apollo API for decision-makers, verifies deliverability via SMTP handshake, and ranks contacts by title seniority (owner > founder > CEO > manager). Each lead gets a quality score based on data completeness.",
    tech: ["Apollo API", "SMTP verification", "BeautifulSoup", "Python"],
    metrics: ["14,500+ leads enriched", "Quality scoring 0-100", "Title-based contact ranking"],
    images: [
      { src: "/portfolio/leads.png", alt: "Enriched lead database showing quality scores, business classification, contact info, and enrichment status" },
    ],
  },
  {
    title: "Sales Intelligence Suite",
    icon: PhoneCall,
    description:
      "Power dialer with AI call prep - type \"prep me for my 3pm call\" and get a full company briefing pulled from HubSpot, email history, and website data. Logs call outcomes to HubSpot CRM. Includes Linear integration for weekly product reports posted to Slack.",
    tech: ["HubSpot API", "Google Calendar API", "Claude API", "Slack SDK", "Linear API"],
    metrics: ["200+ leads in call queue", "AI-generated call briefs", "HubSpot CRM sync"],
    images: [
      { src: "/portfolio/dialer.png", alt: "Power Dialer with call queue, HubSpot integration, filters by type/segment/region, and call history" },
      { src: "/portfolio/intel.png", alt: "Intel Hub with AI call prep, Gmail and Calendar integration, and stored company briefings" },
    ],
  },
  {
    title: "GTM Orchestration Daemon",
    icon: Cog,
    description:
      "24/7 background process running the full lead lifecycle on a cron schedule. Sourcing at 2AM, enrichment at 4AM, sequence queuing at 6AM, email sending 8AM-1PM, reply checking every 15 minutes, daily Slack summary at 6PM. One dashboard ties it all together.",
    tech: ["APScheduler", "Flask", "SQLite", "Python"],
    metrics: ["14,500+ total leads", "424 enriched", "10+ scheduled jobs"],
    images: [
      { src: "/portfolio/dashboard.png", alt: "Main dashboard showing pipeline stats, email activity, warmup progress, and recent send log" },
    ],
  },
];

const navCards = [
  {
    title: "Work",
    description: "What I've been building.",
    href: "/projects",
  },
  {
    title: "Life",
    description: "Where I've been.",
    href: "/travel",
  },
  {
    title: "Connect",
    description: "Let's talk.",
    href: "/connect",
  },
];

export default function HomePage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-24">
      {/* Hero */}
      <section className="mb-20 flex items-center justify-between gap-8">
        <div>
          <h1 className="mb-3 text-5xl font-bold tracking-tight sm:text-6xl">
            Will Kepler
          </h1>
          <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">
            Sales, product, and growth.
            <br />
            Based in NYC. Curious everywhere.
          </p>
        </div>
        <Image
          src="/headshot.jpeg"
          alt="Will Kepler"
          width={96}
          height={96}
          className="h-24 w-24 shrink-0 rounded-full object-cover"
          priority
        />
      </section>

      {/* Portfolio */}
      <section className="mb-20">
        <h2 className="mb-8 text-sm font-medium uppercase tracking-widest text-muted-foreground">
          GTM - some systems I've built
        </h2>
        <div className="space-y-8">
          {portfolio.map((item) => (
            <Card key={item.title} className="overflow-hidden">
              <CardHeader>
                <CardTitle className="flex items-center gap-2.5 text-xl">
                  <item.icon className="h-5 w-5 shrink-0 text-primary" />
                  {item.title}
                </CardTitle>
                <CardDescription className="text-sm leading-relaxed">
                  {item.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Screenshots */}
                <div
                  className={
                    item.images.length > 1
                      ? "grid gap-3 sm:grid-cols-2"
                      : "grid gap-3"
                  }
                >
                  {item.images.map((img) => (
                    <div
                      key={img.src}
                      className="overflow-hidden rounded-lg border border-border"
                    >
                      <Image
                        src={img.src}
                        alt={img.alt}
                        width={1280}
                        height={900}
                        className="w-full object-cover"
                      />
                    </div>
                  ))}
                </div>

                {/* Tech + Metrics */}
                <div className="flex flex-wrap gap-1.5">
                  {item.tech.map((t) => (
                    <Badge key={t} variant="secondary" className="font-normal">
                      {t}
                    </Badge>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  {item.metrics.join(" / ")}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Navigation Cards */}
      <section className="grid gap-4 sm:grid-cols-3">
        {navCards.map((card) => (
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

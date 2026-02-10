import { ArrowUpRight, Github, Linkedin, Mail } from "lucide-react";

const socials = [
  {
    label: "GitHub",
    href: "https://github.com/williamkepler",
    icon: Github,
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/williamkepler",
    icon: Linkedin,
  },
  {
    label: "Email",
    href: "mailto:hello@williamkepler.com",
    icon: Mail,
  },
];

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center px-6 py-24">
        {/* Hero */}
        <section className="mb-16">
          <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
            William Kepler
          </h1>
          <p className="text-lg text-muted-foreground">
            Software engineer, builder, and lifelong learner.
          </p>
        </section>

        {/* About */}
        <section className="mb-16">
          <h2 className="mb-4 text-sm font-medium uppercase tracking-widest text-muted-foreground">
            About
          </h2>
          <p className="leading-relaxed text-foreground/80">
            I build software that solves real problems. Passionate about clean
            architecture, great user experiences, and shipping products that
            people actually want to use. Currently exploring the intersection of
            AI and everyday tools.
          </p>
        </section>

        {/* Links / Socials */}
        <section>
          <h2 className="mb-4 text-sm font-medium uppercase tracking-widest text-muted-foreground">
            Connect
          </h2>
          <div className="flex flex-col gap-2">
            {socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 rounded-lg border border-border px-4 py-3 transition-colors hover:border-primary/50 hover:bg-muted"
              >
                <social.icon className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-primary" />
                <span className="font-medium">{social.label}</span>
                <ArrowUpRight className="ml-auto h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" />
              </a>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-6 py-6">
          <p className="text-sm text-muted-foreground" suppressHydrationWarning>
            &copy; {new Date().getFullYear()} William Kepler
          </p>
        </div>
      </footer>
    </div>
  );
}

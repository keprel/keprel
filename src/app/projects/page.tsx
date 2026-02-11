import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

const projects = [
  { title: "Trak", role: "GTM / Product", location: "NYC", href: "https://adastrak.com" },
  { title: "ADAS Safe", role: "GTM", location: "Miami", href: "https://adas-safe.com" },
  { title: "Spot Pet Insurance", role: "Sales", location: "Miami", href: "https://spotpet.com" },
];

export default function ProjectsPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-24">
      <section className="mb-12">
        <h1 className="mb-4 text-4xl font-bold tracking-tight">Projects</h1>
        <p className="text-muted-foreground">
          Startups I've worked with.
        </p>
      </section>

      <div className="grid gap-4 sm:grid-cols-3">
        {projects.map((project) => (
          <a
            key={project.title}
            href={project.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Card className="transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5">
              <CardHeader>
                <CardTitle className="text-lg">{project.title}</CardTitle>
                <CardDescription>
                  {project.role} · {project.location}
                </CardDescription>
              </CardHeader>
            </Card>
          </a>
        ))}
      </div>
    </div>
  );
}

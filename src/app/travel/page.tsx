import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

const trips = [
  { place: "Nicaragua", src: "/travel/nicaragua.jpg" },
  { place: "Chile", src: "/travel/chile.jpg" },
  { place: "El Salvador", src: "/travel/el-salvador.mov", video: true },
  { place: "Panama", src: "/travel/panama.jpg" },
  { place: "Cuba", src: "/travel/cuba.jpg" },
  { place: "Brazil", src: "/travel/brazil.mov", video: true },
  { place: "Colombia", src: "/travel/colombia.jpg" },
  { place: "Atlantic Ocean", src: "/travel/atlantic-ocean.jpg" },
  { place: "Dominican Republic", src: "/travel/dominican-republic.jpg" },
  { place: "Trinidad & Tobago", src: "/travel/trinidad-tobago.jpg" },
  { place: "Guatemala", src: "/travel/guatemala.mov", video: true },
  { place: "Montreal", src: "/travel/montreal.jpg" },
  { place: "Costa Rica", src: "/travel/costa-rica.mov", video: true },
  { place: "Sint Maarten", src: "/travel/sint-maarten.jpg" },
];

export default function TravelPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-24">
      <section className="mb-12">
        <h1 className="mb-4 text-4xl font-bold tracking-tight">Travel</h1>
        <p className="text-muted-foreground">
          A few highlights.
        </p>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {trips.map((trip) => (
          <Card
            key={trip.place}
            className="overflow-hidden transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
          >
            <div className="relative h-48 bg-muted">
              {"video" in trip && trip.video ? (
                <video
                  src={trip.src}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="h-full w-full object-cover"
                />
              ) : (
                <Image
                  src={trip.src}
                  alt={trip.place}
                  fill
                  className="object-cover"
                />
              )}
            </div>
            <CardContent className="pt-4">
              <h2 className="text-lg font-semibold">{trip.place}</h2>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

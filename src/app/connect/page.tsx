import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

export default function ConnectPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-24">
      <section className="mb-12">
        <h1 className="mb-4 text-4xl font-bold tracking-tight">Connect</h1>
        <p className="text-muted-foreground">
          Startups, freelance, or just a good idea - I'm always down to talk.
        </p>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Send me a note</CardTitle>
          <CardDescription>
            I'll be in touch.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            action="https://formsubmit.co/will@adastrak.com"
            method="POST"
            className="space-y-4"
          >
            <input type="hidden" name="_captcha" value="false" />
            <input type="hidden" name="_next" value="" />
            <div>
              <label
                htmlFor="name"
                className="mb-1.5 block text-sm font-medium text-foreground/80"
              >
                Name
              </label>
              <Input id="name" name="name" placeholder="Your name" required />
            </div>
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-medium text-foreground/80"
              >
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
              />
            </div>
            <div>
              <label
                htmlFor="message"
                className="mb-1.5 block text-sm font-medium text-foreground/80"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                placeholder="What's on your mind?"
                required
                className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
            <Button type="submit" className="w-full">
              Send Message
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

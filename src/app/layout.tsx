import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Linkedin } from "lucide-react";
import { Nav } from "@/components/nav";
import { PasswordGate } from "@/components/password-gate";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Will Kepler",
  description: "Sales, product, and the occasional adventure.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <PasswordGate>
          <div className="flex min-h-screen flex-col">
            <Nav />
            <main className="flex-1">{children}</main>
            <footer className="border-t border-border/50">
              <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-6">
                <p className="text-sm text-muted-foreground" suppressHydrationWarning>
                  &copy; {new Date().getFullYear()} Will Kepler
                </p>
                <a
                  href="https://www.linkedin.com/in/will-kepler-811300264/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground transition-colors hover:text-primary"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-4 w-4" />
                </a>
              </div>
            </footer>
          </div>
        </PasswordGate>
      </body>
    </html>
  );
}

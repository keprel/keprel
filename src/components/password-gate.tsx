"use client";

import { useState, useEffect, type ReactNode } from "react";
import { Laptop, Compass } from "lucide-react";

const STORAGE_KEY = "site-auth";
const PASSWORD = "password";

type Phase = "password" | "intro" | "authenticated";

export function PasswordGate({ children }: { children: ReactNode }) {
  const [phase, setPhase] = useState<Phase>("password");
  const [checking, setChecking] = useState(true);
  const [value, setValue] = useState("");
  const [passwordFading, setPasswordFading] = useState(false);
  const [introFading, setIntroFading] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(STORAGE_KEY) === "true") {
      setPhase("authenticated");
    }
    setChecking(false);
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (value === PASSWORD) {
      sessionStorage.setItem(STORAGE_KEY, "true");
      // Fade out password screen
      setPasswordFading(true);
      setTimeout(() => {
        setPhase("intro");
        // Hold intro for ~4s, then fade out
        setTimeout(() => {
          setIntroFading(true);
          setTimeout(() => setPhase("authenticated"), 600);
        }, 4000);
      }, 500);
    }
  }

  if (checking) return null;

  if (phase === "password") {
    return (
      <>
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center bg-background transition-opacity duration-500 ${
            passwordFading ? "opacity-0" : "opacity-100"
          }`}
        >
          <form onSubmit={handleSubmit}>
            <input
              type="password"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              autoFocus
              className="w-48 border-b border-border/40 bg-transparent text-center font-mono text-sm text-foreground/70 outline-none placeholder:text-transparent focus:border-primary/50"
              spellCheck={false}
              autoComplete="off"
            />
          </form>
        </div>
        <div className="opacity-0" aria-hidden>
          {children}
        </div>
      </>
    );
  }

  if (phase === "intro") {
    return (
      <>
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center bg-background transition-opacity duration-600 ${
            introFading ? "opacity-0" : "opacity-100"
          }`}
        >
          <div className="flex items-center gap-0">
            {/* Left side — Laptop */}
            <div className="flex w-48 flex-col items-center gap-3 opacity-0 animate-[fade-in_0.6s_ease-out_0.2s_forwards]">
              <Laptop
                size={40}
                strokeWidth={1.2}
                className="text-foreground/80"
                style={{
                  filter: "drop-shadow(0 0 8px var(--color-primary))",
                }}
              />
              <span
                className="inline-block overflow-hidden whitespace-nowrap border-r-2 border-transparent font-mono text-sm text-muted-foreground"
                style={{
                  animation:
                    "typing 1.2s steps(8) 1s forwards, blink-cursor 0.7s step-end 1s 5",
                  maxWidth: 0,
                }}
              >
                working.
              </span>
            </div>

            {/* Divider */}
            <div className="mx-8 h-24 w-px bg-border/30 opacity-0 animate-[fade-in_0.4s_ease-out_0.4s_forwards]" />

            {/* Right side — Compass */}
            <div className="flex w-48 flex-col items-center gap-3 opacity-0 animate-[fade-in_0.6s_ease-out_1s_forwards]">
              <Compass
                size={40}
                strokeWidth={1.2}
                className="text-foreground/80"
                style={{
                  filter: "drop-shadow(0 0 8px var(--color-primary))",
                }}
              />
              <span
                className="inline-block overflow-hidden whitespace-nowrap border-r-2 border-transparent font-mono text-sm text-muted-foreground"
                style={{
                  animation:
                    "typing 1.5s steps(13) 1.8s forwards, blink-cursor 0.7s step-end 1.8s 5",
                  maxWidth: 0,
                }}
              >
                adventuring.
              </span>
            </div>
          </div>
        </div>
        <div className="opacity-0" aria-hidden>
          {children}
        </div>
      </>
    );
  }

  return <div className="animate-fade-in">{children}</div>;
}

"use client";

import { useState, useEffect, useCallback, type ReactNode } from "react";
import { Laptop, Compass } from "lucide-react";
import { MapPuzzle } from "./map-puzzle/map-puzzle";

const STORAGE_KEY = "site-auth";

type Phase = "puzzle" | "intro" | "authenticated";

export function PasswordGate({ children }: { children: ReactNode }) {
  const [phase, setPhase] = useState<Phase>("puzzle");
  const [checking, setChecking] = useState(true);
  const [puzzleFading, setPuzzleFading] = useState(false);
  const [introFading, setIntroFading] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(STORAGE_KEY) === "true") {
      setPhase("authenticated");
    }
    setChecking(false);
  }, []);

  const handlePuzzleSolved = useCallback(() => {
    sessionStorage.setItem(STORAGE_KEY, "true");
    setPuzzleFading(true);
    setTimeout(() => {
      setPhase("intro");
      setTimeout(() => {
        setIntroFading(true);
        setTimeout(() => setPhase("authenticated"), 600);
      }, 4000);
    }, 500);
  }, []);

  if (checking) return null;

  if (phase === "puzzle") {
    return (
      <>
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center bg-background transition-opacity duration-500 ${
            puzzleFading ? "opacity-0" : "opacity-100"
          }`}
        >
          <MapPuzzle onSolved={handlePuzzleSolved} />
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
          <div className="flex flex-col items-center gap-0 sm:flex-row">
            {/* Left side — Laptop */}
            <div className="flex w-36 flex-col items-center gap-3 opacity-0 sm:w-48 animate-[fade-in_0.6s_ease-out_0.2s_forwards]">
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
            <div className="my-6 h-px w-16 bg-border/30 opacity-0 sm:mx-8 sm:my-0 sm:h-24 sm:w-px animate-[fade-in_0.4s_ease-out_0.4s_forwards]" />

            {/* Right side — Compass */}
            <div className="flex w-36 flex-col items-center gap-3 opacity-0 sm:w-48 animate-[fade-in_0.6s_ease-out_1s_forwards]">
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

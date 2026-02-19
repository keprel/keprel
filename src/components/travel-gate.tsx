"use client";

import { useState, useEffect, type ReactNode } from "react";

const STORAGE_KEY = "travel-auth";
const PASSWORD = "password";

export function TravelGate({ children }: { children: ReactNode }) {
  const [unlocked, setUnlocked] = useState(false);
  const [checking, setChecking] = useState(true);
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(STORAGE_KEY) === "true") {
      setUnlocked(true);
    }
    setChecking(false);
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (value === PASSWORD) {
      sessionStorage.setItem(STORAGE_KEY, "true");
      setUnlocked(true);
    } else {
      setError(true);
      setValue("");
    }
  }

  if (checking) return null;

  if (unlocked) return <>{children}</>;

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-6">
      <form onSubmit={handleSubmit} className="flex w-full max-w-xs flex-col gap-4">
        <h2 className="text-center text-lg font-semibold tracking-tight">
          Enter password
        </h2>
        <input
          type="password"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setError(false);
          }}
          placeholder="Password"
          autoFocus
          className="rounded-md border border-border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-primary"
        />
        {error && (
          <p className="text-center text-sm text-red-500">Wrong password.</p>
        )}
        <button
          type="submit"
          className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

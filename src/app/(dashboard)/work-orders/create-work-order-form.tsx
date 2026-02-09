"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function CreateWorkOrderForm() {
  const router = useRouter();
  const [bodyShop, setBodyShop] = useState("");
  const [roNumber, setRoNumber] = useState("");
  const [mode, setMode] = useState<"estimate" | "vin">("estimate");
  const [vin, setVin] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.set("bodyShop", bodyShop);
      formData.set("roNumber", roNumber);

      if (mode === "vin" && vin) {
        formData.set("vin", vin);
      }
      if (mode === "estimate" && file) {
        formData.set("file", file);
      }

      const res = await fetch("/api/work-orders", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create work order");
      }

      const data = await res.json();
      router.push(`/work-orders/${data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="bodyShop">Body Shop</Label>
        <Input
          id="bodyShop"
          value={bodyShop}
          onChange={(e) => setBodyShop(e.target.value)}
          placeholder="Enter body shop name"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="roNumber">RO Number</Label>
        <Input
          id="roNumber"
          value={roNumber}
          onChange={(e) => setRoNumber(e.target.value)}
          placeholder="Enter RO number"
          required
        />
      </div>

      <div className="space-y-3">
        <Label>Vehicle Information</Label>
        <div className="flex gap-2">
          <Button
            type="button"
            variant={mode === "estimate" ? "default" : "outline"}
            size="sm"
            onClick={() => setMode("estimate")}
          >
            Upload Estimate
          </Button>
          <Button
            type="button"
            variant={mode === "vin" ? "default" : "outline"}
            size="sm"
            onClick={() => setMode("vin")}
          >
            Enter VIN
          </Button>
        </div>

        {mode === "estimate" ? (
          <div className="space-y-2">
            <Input
              type="file"
              accept=".pdf,.png,.jpg,.jpeg"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            <p className="text-xs text-muted-foreground">
              PDF, PNG, or JPG up to 10MB
            </p>
          </div>
        ) : (
          <Input
            value={vin}
            onChange={(e) => setVin(e.target.value)}
            placeholder="Enter VIN"
            maxLength={17}
          />
        )}
      </div>

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      <Button type="submit" disabled={loading || !bodyShop || !roNumber}>
        {loading ? "Creating..." : "Create Work Order"}
      </Button>
    </form>
  );
}

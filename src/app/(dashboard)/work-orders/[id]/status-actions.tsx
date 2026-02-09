"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const STATUS_CONFIG: Record<
  string,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline"; next: string | null; nextLabel: string | null }
> = {
  OPEN: {
    label: "Open",
    variant: "outline",
    next: "IN_PROGRESS",
    nextLabel: "Start Work",
  },
  IN_PROGRESS: {
    label: "In Progress",
    variant: "secondary",
    next: "INVOICED",
    nextLabel: "Mark as Invoiced",
  },
  INVOICED: {
    label: "Invoiced",
    variant: "default",
    next: "COMPLETED",
    nextLabel: "Mark Completed",
  },
  COMPLETED: {
    label: "Completed",
    variant: "default",
    next: null,
    nextLabel: null,
  },
};

interface StatusActionsProps {
  workOrderId: string;
  currentStatus: string;
  hasLineItems: boolean;
}

export function StatusActions({
  workOrderId,
  currentStatus,
  hasLineItems,
}: StatusActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const config = STATUS_CONFIG[currentStatus];

  async function handleAdvance() {
    if (!config?.next) return;

    if (config.next === "INVOICED") {
      const endpoint = `/api/work-orders/${workOrderId}/invoice`;
      setLoading(true);
      try {
        const res = await fetch(endpoint, { method: "POST" });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to invoice");
        }
        router.refresh();
      } catch (err) {
        alert(err instanceof Error ? err.message : "Failed to update status");
      } finally {
        setLoading(false);
      }
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/work-orders/${workOrderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: config.next }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update status");
      }

      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update status");
    } finally {
      setLoading(false);
    }
  }

  if (!config) return null;

  const invoiceDisabled = config.next === "INVOICED" && !hasLineItems;

  return (
    <div className="flex items-center gap-3">
      <Badge variant={config.variant}>{config.label}</Badge>
      {config.next && (
        <Button
          size="sm"
          onClick={handleAdvance}
          disabled={loading || invoiceDisabled}
        >
          {loading ? "Updating..." : config.nextLabel}
        </Button>
      )}
      {invoiceDisabled && (
        <span className="text-xs text-muted-foreground">
          Add line items before invoicing
        </span>
      )}
    </div>
  );
}

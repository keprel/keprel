"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { LineItemForm } from "./line-item-form";
import type { WorkOrderLineItem } from "@/types/work-orders";

interface PricingSectionProps {
  workOrderId: string;
  initialItems: WorkOrderLineItem[];
  disabled: boolean;
}

export function PricingSection({
  workOrderId,
  initialItems,
  disabled,
}: PricingSectionProps) {
  const [items, setItems] = useState<WorkOrderLineItem[]>(initialItems);

  const grandTotal = items.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );

  async function handleDelete(itemId: string) {
    try {
      const res = await fetch(
        `/api/work-orders/${workOrderId}/line-items/${itemId}`,
        { method: "DELETE" }
      );

      if (!res.ok) {
        throw new Error("Failed to delete line item");
      }

      setItems((prev) => prev.filter((i) => i.id !== itemId));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Delete failed");
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Pricing</h3>

      <div className="rounded-md border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-4 py-2 text-left font-medium">Description</th>
              <th className="px-4 py-2 text-right font-medium w-20">Qty</th>
              <th className="px-4 py-2 text-right font-medium w-28">Unit Price</th>
              <th className="px-4 py-2 text-right font-medium w-28">Total</th>
              {!disabled && <th className="w-10" />}
            </tr>
          </thead>
          <tbody>
            {items.length === 0 && (
              <tr>
                <td
                  colSpan={disabled ? 4 : 5}
                  className="px-4 py-6 text-center text-muted-foreground"
                >
                  No line items yet
                </td>
              </tr>
            )}
            {items.map((item) => (
              <tr key={item.id} className="border-b border-border last:border-0">
                <td className="px-4 py-2">{item.description}</td>
                <td className="px-4 py-2 text-right">{item.quantity}</td>
                <td className="px-4 py-2 text-right">
                  ${item.unitPrice.toFixed(2)}
                </td>
                <td className="px-4 py-2 text-right">
                  ${(item.quantity * item.unitPrice).toFixed(2)}
                </td>
                {!disabled && (
                  <td className="px-2 py-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-destructive hover:text-destructive"
                      onClick={() => handleDelete(item.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
          {items.length > 0 && (
            <tfoot>
              <tr className="border-t border-border bg-muted/50">
                <td
                  colSpan={3}
                  className="px-4 py-2 text-right font-semibold"
                >
                  Grand Total
                </td>
                <td className="px-4 py-2 text-right font-semibold">
                  ${grandTotal.toFixed(2)}
                </td>
                {!disabled && <td />}
              </tr>
            </tfoot>
          )}
        </table>
      </div>

      {!disabled && (
        <LineItemForm
          workOrderId={workOrderId}
          onAdd={(item) => setItems((prev) => [...prev, item])}
        />
      )}
    </div>
  );
}

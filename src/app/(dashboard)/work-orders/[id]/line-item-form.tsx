"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { WorkOrderLineItem } from "@/types/work-orders";

interface LineItemFormProps {
  workOrderId: string;
  onAdd: (item: WorkOrderLineItem) => void;
}

export function LineItemForm({ workOrderId, onAdd }: LineItemFormProps) {
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [unitPrice, setUnitPrice] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`/api/work-orders/${workOrderId}/line-items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description,
          quantity: parseInt(quantity, 10),
          unitPrice: parseFloat(unitPrice),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to add line item");
      }

      const item: WorkOrderLineItem = await res.json();
      onAdd(item);
      setDescription("");
      setQuantity("1");
      setUnitPrice("");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to add line item");
    } finally {
      setLoading(false);
    }
  }

  const isValid =
    description.trim() !== "" &&
    parseInt(quantity, 10) >= 1 &&
    parseFloat(unitPrice) >= 0 &&
    !isNaN(parseFloat(unitPrice));

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-2">
      <div className="flex-1">
        <Input
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>
      <div className="w-20">
        <Input
          type="number"
          placeholder="Qty"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          required
        />
      </div>
      <div className="w-28">
        <Input
          type="number"
          placeholder="Unit Price"
          min="0"
          step="0.01"
          value={unitPrice}
          onChange={(e) => setUnitPrice(e.target.value)}
          required
        />
      </div>
      <Button type="submit" size="sm" disabled={loading || !isValid}>
        {loading ? "..." : "Add"}
      </Button>
    </form>
  );
}

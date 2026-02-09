import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ClipboardList, ChevronRight, Plus } from "lucide-react";

const STATUS_BADGES: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  OPEN: { label: "Open", variant: "outline" },
  IN_PROGRESS: { label: "In Progress", variant: "secondary" },
  INVOICED: { label: "Invoiced", variant: "default" },
  COMPLETED: { label: "Completed", variant: "default" },
};

export default async function WorkOrdersPage() {
  const session = await auth();
  const workOrders = await prisma.workOrder.findMany({
    where: { userId: session!.user.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      bodyShop: true,
      roNumber: true,
      vin: true,
      status: true,
      createdAt: true,
      _count: { select: { documents: true, lineItems: true } },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Work Orders</h1>
          <p className="text-muted-foreground">
            Manage and track your work orders.
          </p>
        </div>
        <Button asChild>
          <Link href="/work-orders/create">
            <Plus className="h-4 w-4 mr-2" />
            Create Work Order
          </Link>
        </Button>
      </div>

      {workOrders.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <ClipboardList className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium">No work orders yet</p>
            <p className="text-sm text-muted-foreground mb-4">
              Create your first work order to get started.
            </p>
            <Button asChild>
              <Link href="/work-orders/create">Create Work Order</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>All Work Orders</CardTitle>
            <CardDescription>
              {workOrders.length} work order{workOrders.length !== 1 ? "s" : ""}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {workOrders.map((wo) => {
              const badge = STATUS_BADGES[wo.status] ?? {
                label: wo.status,
                variant: "outline" as const,
              };

              return (
                <Link
                  key={wo.id}
                  href={`/work-orders/${wo.id}`}
                  className="flex items-center justify-between rounded-lg border border-border p-4 transition-colors hover:bg-accent"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <ClipboardList className="h-5 w-5 text-muted-foreground shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">
                        {wo.bodyShop} — RO# {wo.roNumber}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(wo.createdAt).toLocaleDateString()}
                        {wo.vin ? ` — VIN: ${wo.vin}` : ""}
                        {" — "}
                        {wo._count.documents} doc{wo._count.documents !== 1 ? "s" : ""},
                        {" "}
                        {wo._count.lineItems} item{wo._count.lineItems !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant={badge.variant}>{badge.label}</Badge>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </Link>
              );
            })}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

import { notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft } from "lucide-react";
import { DOCUMENT_CATEGORIES } from "@/types/work-orders";
import { DocumentUploadCard } from "./document-upload-card";
import { PricingSection } from "./pricing-section";
import { StatusActions } from "./status-actions";

export default async function WorkOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  const { id } = await params;

  const workOrder = await prisma.workOrder.findUnique({
    where: { id, userId: session!.user.id },
    include: {
      documents: {
        select: {
          id: true,
          workOrderId: true,
          category: true,
          fileName: true,
          fileSize: true,
          mimeType: true,
          createdAt: true,
        },
        orderBy: { createdAt: "asc" },
      },
      lineItems: {
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!workOrder) notFound();

  const isLocked =
    workOrder.status === "INVOICED" || workOrder.status === "COMPLETED";

  return (
    <div className="space-y-6">
      <div>
        <Button variant="ghost" size="sm" asChild className="mb-2">
          <Link href="/work-orders">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Work Orders
          </Link>
        </Button>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">
            {workOrder.bodyShop} — RO# {workOrder.roNumber}
          </h1>
          <StatusActions
            workOrderId={workOrder.id}
            currentStatus={workOrder.status}
            hasLineItems={workOrder.lineItems.length > 0}
          />
        </div>
        {workOrder.vin && (
          <p className="text-muted-foreground">VIN: {workOrder.vin}</p>
        )}
        <p className="text-xs text-muted-foreground mt-1">
          Created {new Date(workOrder.createdAt).toLocaleDateString()}
          {workOrder.invoicedAt &&
            ` — Invoiced ${new Date(workOrder.invoicedAt).toLocaleDateString()}`}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Documentation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {DOCUMENT_CATEGORIES.map((cat) => (
              <DocumentUploadCard
                key={cat.key}
                workOrderId={workOrder.id}
                categoryKey={cat.key}
                label={cat.label}
                acceptedTypes={cat.acceptedTypes}
                multiple={cat.multiple}
                documents={workOrder.documents
                  .filter((d) => d.category === cat.key)
                  .map((d) => ({
                    ...d,
                    createdAt:
                      typeof d.createdAt === "string"
                        ? d.createdAt
                        : (d.createdAt as Date).toISOString(),
                  }))}
                disabled={isLocked}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      <Separator />

      <PricingSection
        workOrderId={workOrder.id}
        initialItems={workOrder.lineItems.map((item) => ({
          ...item,
          createdAt:
            typeof item.createdAt === "string"
              ? item.createdAt
              : (item.createdAt as Date).toISOString(),
        }))}
        disabled={isLocked}
      />
    </div>
  );
}

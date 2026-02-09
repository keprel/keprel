import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, AlertTriangle, Info, AlertCircle, DollarSign } from "lucide-react";
import type { AnalysisResult, Calibration, LineItem, Note } from "@/types/estimates";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EstimateDetailPage({ params }: PageProps) {
  const { id } = await params;
  const session = await auth();
  const estimate = await prisma.estimate.findUnique({
    where: { id, userId: session!.user.id },
  });

  if (!estimate) notFound();

  const vehicleInfo = estimate.vehicleInfo ? JSON.parse(estimate.vehicleInfo) : null;
  const lineItems: LineItem[] = estimate.lineItems ? JSON.parse(estimate.lineItems) : [];
  const calibrations: Calibration[] = estimate.calibrations ? JSON.parse(estimate.calibrations) : [];
  const notes: Note[] = estimate.notes ? JSON.parse(estimate.notes) : [];
  const vehicleLabel = vehicleInfo?.year && vehicleInfo?.make && vehicleInfo?.model
    ? `${vehicleInfo.year} ${vehicleInfo.make} ${vehicleInfo.model}`
    : estimate.fileName;

  const totalCalibrationCost = calibrations.reduce((sum, c) => sum + (c.estimatedCost || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/estimates">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{vehicleLabel}</h1>
          <p className="text-muted-foreground">
            {estimate.fileName} — {new Date(estimate.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {estimate.status === "FAILED" && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-sm text-destructive">
              Analysis failed: {estimate.errorMessage || "Unknown error"}
            </p>
          </CardContent>
        </Card>
      )}

      {notes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Notes & Warnings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {notes.map((note, i) => (
              <div
                key={i}
                className={`flex items-start gap-3 rounded-lg p-3 ${
                  note.severity === "critical"
                    ? "bg-destructive/10 text-destructive"
                    : note.severity === "warning"
                      ? "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400"
                      : "bg-muted text-muted-foreground"
                }`}
              >
                {note.severity === "critical" ? (
                  <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                ) : note.severity === "warning" ? (
                  <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
                ) : (
                  <Info className="h-4 w-4 mt-0.5 shrink-0" />
                )}
                <p className="text-sm">{note.message}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {calibrations.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Required Calibrations</CardTitle>
              <CardDescription>
                {calibrations.length} calibration{calibrations.length !== 1 ? "s" : ""} identified
              </CardDescription>
            </div>
            <div className="flex items-center gap-1 text-sm font-medium">
              <DollarSign className="h-4 w-4" />
              Est. Total: ${totalCalibrationCost.toLocaleString()}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {calibrations.map((cal, i) => (
              <div key={i} className="rounded-lg border border-border p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{cal.system}</h3>
                  <div className="flex items-center gap-2">
                    <PriorityBadge priority={cal.priority} />
                    <Badge variant="outline">{cal.type}</Badge>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{cal.reason}</p>
                {cal.triggeringItems.length > 0 && (
                  <div className="text-xs text-muted-foreground">
                    <span className="font-medium">Triggered by: </span>
                    {cal.triggeringItems.join(", ")}
                  </div>
                )}
                <div className="text-sm font-medium">
                  Est. Cost: ${(cal.estimatedCost || 0).toLocaleString()}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {lineItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Extracted Line Items</CardTitle>
            <CardDescription>
              {lineItems.length} line item{lineItems.length !== 1 ? "s" : ""} from the estimate
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="pb-2 pr-4 font-medium">#</th>
                    <th className="pb-2 pr-4 font-medium">Description</th>
                    <th className="pb-2 pr-4 font-medium">Operation</th>
                    <th className="pb-2 pr-4 font-medium">Category</th>
                    <th className="pb-2 font-medium text-right">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {lineItems.map((item, i) => (
                    <tr key={i} className="border-b border-border last:border-0">
                      <td className="py-2 pr-4 text-muted-foreground">{item.lineNumber}</td>
                      <td className="py-2 pr-4">{item.description}</td>
                      <td className="py-2 pr-4">
                        <Badge variant="outline" className="text-xs">{item.operation}</Badge>
                      </td>
                      <td className="py-2 pr-4 text-muted-foreground">{item.category}</td>
                      <td className="py-2 text-right">${(item.totalPrice || 0).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="text-xs text-muted-foreground text-center pb-4">
        Analyzed {new Date(estimate.createdAt).toLocaleString()} — File size: {(estimate.fileSize / 1024).toFixed(1)} KB
      </div>
    </div>
  );
}

function PriorityBadge({ priority }: { priority: string }) {
  switch (priority) {
    case "Required":
      return <Badge variant="destructive">Required</Badge>;
    case "Recommended":
      return <Badge variant="default">Recommended</Badge>;
    case "Verify":
      return <Badge variant="secondary">Verify</Badge>;
    default:
      return <Badge variant="outline">{priority}</Badge>;
  }
}

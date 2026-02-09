import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UploadEstimateForm } from "./upload-estimate-form";
import Link from "next/link";
import { ScanSearch, ChevronRight } from "lucide-react";
import type { VehicleInfo } from "@/types/estimates";

export default async function EstimatesPage() {
  const session = await auth();
  const estimates = await prisma.estimate.findMany({
    where: { userId: session!.user.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      fileName: true,
      status: true,
      vehicleInfo: true,
      calibrations: true,
      createdAt: true,
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">ADAS Analyzer</h1>
        <p className="text-muted-foreground">
          Upload a collision repair estimate to identify required ADAS calibrations
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upload Estimate</CardTitle>
          <CardDescription>
            Upload a PDF repair estimate to analyze for ADAS calibration requirements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UploadEstimateForm />
        </CardContent>
      </Card>

      {estimates.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Past Analyses</CardTitle>
            <CardDescription>
              {estimates.length} estimate{estimates.length !== 1 ? "s" : ""} analyzed
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {estimates.map((estimate) => {
              const vehicle: VehicleInfo | null = estimate.vehicleInfo
                ? JSON.parse(estimate.vehicleInfo)
                : null;
              const calibrationCount = estimate.calibrations
                ? JSON.parse(estimate.calibrations).length
                : 0;
              const vehicleLabel = vehicle?.year && vehicle?.make && vehicle?.model
                ? `${vehicle.year} ${vehicle.make} ${vehicle.model}`
                : null;

              return (
                <Link
                  key={estimate.id}
                  href={`/estimates/${estimate.id}`}
                  className="flex items-center justify-between rounded-lg border border-border p-4 transition-colors hover:bg-accent"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <ScanSearch className="h-5 w-5 text-muted-foreground shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">
                        {vehicleLabel ?? estimate.fileName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(estimate.createdAt).toLocaleDateString()} — {calibrationCount} calibration{calibrationCount !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <StatusBadge status={estimate.status} />
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

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case "COMPLETED":
      return <Badge variant="default">Completed</Badge>;
    case "ANALYZING":
      return <Badge variant="secondary">Analyzing</Badge>;
    case "FAILED":
      return <Badge variant="destructive">Failed</Badge>;
    default:
      return <Badge variant="outline">Pending</Badge>;
  }
}

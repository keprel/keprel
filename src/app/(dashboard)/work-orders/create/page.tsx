import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { CreateWorkOrderForm } from "../create-work-order-form";

export default function CreateWorkOrderPage() {
  return (
    <div className="space-y-6">
      <div>
        <Button variant="ghost" size="sm" asChild className="mb-2">
          <Link href="/work-orders">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Work Orders
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Create Work Order</h1>
        <p className="text-muted-foreground">
          Start a new work order for a vehicle calibration job.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Work Order Details</CardTitle>
          <CardDescription>
            Enter the body shop, RO number, and optionally upload an estimate or enter a VIN.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CreateWorkOrderForm />
        </CardContent>
      </Card>
    </div>
  );
}

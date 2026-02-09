import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const workOrder = await prisma.workOrder.findUnique({
    where: { id, userId: session.user.id },
    include: { lineItems: true },
  });

  if (!workOrder) {
    return NextResponse.json({ error: "Work order not found" }, { status: 404 });
  }

  if (workOrder.status === "INVOICED" || workOrder.status === "COMPLETED") {
    return NextResponse.json(
      { error: "Work order is already invoiced" },
      { status: 400 }
    );
  }

  if (workOrder.lineItems.length === 0) {
    return NextResponse.json(
      { error: "Cannot invoice a work order with no line items" },
      { status: 400 }
    );
  }

  const updated = await prisma.workOrder.update({
    where: { id },
    data: {
      status: "INVOICED",
      invoicedAt: new Date(),
    },
  });

  return NextResponse.json(updated);
}

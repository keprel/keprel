import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string; itemId: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, itemId } = await params;

  const lineItem = await prisma.workOrderLineItem.findUnique({
    where: { id: itemId },
    include: { workOrder: { select: { userId: true, status: true } } },
  });

  if (!lineItem || lineItem.workOrder.userId !== session.user.id || lineItem.workOrderId !== id) {
    return NextResponse.json({ error: "Line item not found" }, { status: 404 });
  }

  if (lineItem.workOrder.status === "INVOICED" || lineItem.workOrder.status === "COMPLETED") {
    return NextResponse.json(
      { error: "Cannot modify line items on an invoiced work order" },
      { status: 400 }
    );
  }

  await prisma.workOrderLineItem.delete({ where: { id: itemId } });

  return NextResponse.json({ success: true });
}

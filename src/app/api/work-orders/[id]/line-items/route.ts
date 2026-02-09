import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const workOrder = await prisma.workOrder.findUnique({
    where: { id, userId: session.user.id },
  });

  if (!workOrder) {
    return NextResponse.json({ error: "Work order not found" }, { status: 404 });
  }

  if (workOrder.status === "INVOICED" || workOrder.status === "COMPLETED") {
    return NextResponse.json(
      { error: "Cannot modify line items on an invoiced work order" },
      { status: 400 }
    );
  }

  try {
    const body = await req.json();
    const { description, quantity, unitPrice } = body;

    if (!description || quantity == null || unitPrice == null) {
      return NextResponse.json(
        { error: "Description, quantity, and unit price are required" },
        { status: 400 }
      );
    }

    if (typeof quantity !== "number" || quantity < 1) {
      return NextResponse.json(
        { error: "Quantity must be a positive number" },
        { status: 400 }
      );
    }

    if (typeof unitPrice !== "number" || unitPrice < 0) {
      return NextResponse.json(
        { error: "Unit price must be a non-negative number" },
        { status: 400 }
      );
    }

    const lineItem = await prisma.workOrderLineItem.create({
      data: {
        workOrderId: id,
        description,
        quantity,
        unitPrice,
      },
    });

    return NextResponse.json(lineItem, { status: 201 });
  } catch (error) {
    console.error("Failed to add line item:", error);
    return NextResponse.json(
      { error: "Failed to add line item" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
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

  if (!workOrder) {
    return NextResponse.json({ error: "Work order not found" }, { status: 404 });
  }

  return NextResponse.json(workOrder);
}

const VALID_STATUSES = ["OPEN", "IN_PROGRESS", "INVOICED", "COMPLETED"];

export async function PATCH(
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

  try {
    const body = await req.json();
    const { status } = body;

    if (!status || !VALID_STATUSES.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const updated = await prisma.workOrder.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Failed to update work order:", error);
    return NextResponse.json(
      { error: "Failed to update work order" },
      { status: 500 }
    );
  }
}

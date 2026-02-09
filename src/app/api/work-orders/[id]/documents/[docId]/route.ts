import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string; docId: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, docId } = await params;

  const doc = await prisma.workOrderDocument.findUnique({
    where: { id: docId },
    include: { workOrder: { select: { userId: true } } },
  });

  if (!doc || doc.workOrder.userId !== session.user.id || doc.workOrderId !== id) {
    return NextResponse.json({ error: "Document not found" }, { status: 404 });
  }

  return new NextResponse(new Uint8Array(doc.fileData), {
    headers: {
      "Content-Type": doc.mimeType,
      "Content-Disposition": `inline; filename="${doc.fileName}"`,
      "Content-Length": doc.fileSize.toString(),
    },
  });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string; docId: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, docId } = await params;

  const doc = await prisma.workOrderDocument.findUnique({
    where: { id: docId },
    include: { workOrder: { select: { userId: true } } },
  });

  if (!doc || doc.workOrder.userId !== session.user.id || doc.workOrderId !== id) {
    return NextResponse.json({ error: "Document not found" }, { status: 404 });
  }

  await prisma.workOrderDocument.delete({ where: { id: docId } });

  return NextResponse.json({ success: true });
}

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { DOCUMENT_CATEGORIES } from "@/types/work-orders";

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

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const category = formData.get("category") as string | null;

    if (!file || !category) {
      return NextResponse.json(
        { error: "File and category are required" },
        { status: 400 }
      );
    }

    const categoryConfig = DOCUMENT_CATEGORIES.find((c) => c.key === category);
    if (!categoryConfig) {
      return NextResponse.json({ error: "Invalid category" }, { status: 400 });
    }

    if (!(categoryConfig.acceptedTypes as readonly string[]).includes(file.type)) {
      return NextResponse.json(
        { error: "File type not accepted for this category" },
        { status: 400 }
      );
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File must be under 10MB" },
        { status: 400 }
      );
    }

    if (!categoryConfig.multiple) {
      const existing = await prisma.workOrderDocument.findFirst({
        where: { workOrderId: id, category },
      });
      if (existing) {
        await prisma.workOrderDocument.delete({ where: { id: existing.id } });
      }
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const doc = await prisma.workOrderDocument.create({
      data: {
        workOrderId: id,
        category,
        fileName: file.name,
        fileData: buffer,
        fileSize: file.size,
        mimeType: file.type,
      },
      select: {
        id: true,
        workOrderId: true,
        category: true,
        fileName: true,
        fileSize: true,
        mimeType: true,
        createdAt: true,
      },
    });

    return NextResponse.json(doc, { status: 201 });
  } catch (error) {
    console.error("Failed to upload document:", error);
    return NextResponse.json(
      { error: "Failed to upload document" },
      { status: 500 }
    );
  }
}

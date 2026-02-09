import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const bodyShop = formData.get("bodyShop") as string | null;
    const roNumber = formData.get("roNumber") as string | null;
    const vin = formData.get("vin") as string | null;
    const file = formData.get("file") as File | null;

    if (!bodyShop || !roNumber) {
      return NextResponse.json(
        { error: "Body shop and RO number are required" },
        { status: 400 }
      );
    }

    const workOrder = await prisma.workOrder.create({
      data: {
        userId: session.user.id,
        bodyShop,
        roNumber,
        vin: vin || null,
      },
    });

    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        return NextResponse.json(
          { error: "File must be under 10MB" },
          { status: 400 }
        );
      }

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      await prisma.workOrderDocument.create({
        data: {
          workOrderId: workOrder.id,
          category: "REPAIR_ESTIMATE",
          fileName: file.name,
          fileData: buffer,
          fileSize: file.size,
          mimeType: file.type,
        },
      });
    }

    return NextResponse.json({ id: workOrder.id }, { status: 201 });
  } catch (error) {
    console.error("Failed to create work order:", error);
    return NextResponse.json(
      { error: "Failed to create work order" },
      { status: 500 }
    );
  }
}

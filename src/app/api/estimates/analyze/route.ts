import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { anthropic } from "@/lib/anthropic";
import { ADAS_SYSTEM_PROMPT } from "@/lib/adas-prompt";
import type { AnalysisResult } from "@/types/estimates";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let estimateId: string | undefined;

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json({ error: "Only PDF files are accepted" }, { status: 400 });
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "File must be under 10MB" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const estimate = await prisma.estimate.create({
      data: {
        userId: session.user.id,
        fileName: file.name,
        fileData: buffer,
        fileSize: file.size,
        status: "ANALYZING",
      },
    });
    estimateId = estimate.id;

    const base64Data = buffer.toString("base64");

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-5-20250929",
      max_tokens: 8192,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "document",
              source: {
                type: "base64",
                media_type: "application/pdf",
                data: base64Data,
              },
            },
            {
              type: "text",
              text: "Analyze this collision repair estimate and identify all required ADAS calibrations. Return the results as JSON following the system prompt format exactly.",
            },
          ],
        },
      ],
      system: ADAS_SYSTEM_PROMPT,
    });

    const textBlock = response.content.find((block) => block.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      throw new Error("No text response from Claude");
    }

    let jsonText = textBlock.text.trim();
    const fenceMatch = jsonText.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (fenceMatch) {
      jsonText = fenceMatch[1].trim();
    }

    const result: AnalysisResult = JSON.parse(jsonText);

    await prisma.estimate.update({
      where: { id: estimate.id },
      data: {
        status: "COMPLETED",
        lineItems: JSON.stringify(result.lineItems),
        calibrations: JSON.stringify(result.calibrations),
        notes: JSON.stringify(result.notes),
        vehicleInfo: JSON.stringify(result.vehicleInfo),
      },
    });

    return NextResponse.json({ id: estimate.id, ...result });
  } catch (error) {
    console.error("Estimate analysis failed:", error);

    if (estimateId) {
      await prisma.estimate.update({
        where: { id: estimateId },
        data: {
          status: "FAILED",
          errorMessage: error instanceof Error ? error.message : "Analysis failed",
        },
      });
    }

    return NextResponse.json(
      { error: "Analysis failed. Please try again." },
      { status: 500 }
    );
  }
}

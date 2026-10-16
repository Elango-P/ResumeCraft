import { NextRequest, NextResponse } from "next/server";
import { extractText } from "unpdf";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);

    const { totalPages, text } = await extractText(bytes);

    const rawText = Array.isArray(text) ? text.join("\n\n") : String(text || "");
    const cleanedText = rawText
      .replace(/\r\n/g, "\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim();

    const wordCount = cleanedText.split(/\s+/).filter(Boolean).length;

    return NextResponse.json({
      text: cleanedText,
      numPages: totalPages ?? 1,
      wordCount,
      fileName: file.name,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: `Failed to parse PDF document: ${message}` },
      { status: 500 },
    );
  }
}

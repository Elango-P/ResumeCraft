export interface ExtractedFileResult {
  text: string;
  fileName: string;
  fileType: string;
  wordCount: number;
  warnings?: string[];
}

export async function extractTextFromFile(file: File): Promise<ExtractedFileResult> {
  const extension = file.name.split(".").pop()?.toLowerCase() ?? "";

  if (extension === "txt" || extension === "md") {
    const text = await file.text();
    return {
      text: text.trim(),
      fileName: file.name,
      fileType: "text",
      wordCount: text.split(/\s+/).filter(Boolean).length,
    };
  }

  if (extension === "json") {
    const raw = await file.text();
    try {
      const parsed = JSON.parse(raw);
      // Check if it's a ResumeCraft export
      if (parsed && typeof parsed === "object") {
        if ("personal" in parsed) {
          // It's a Resume object
          const lines: string[] = [];
          if (parsed.personal?.fullName) lines.push(parsed.personal.fullName);
          if (parsed.personal?.jobTitle) lines.push(parsed.personal.jobTitle);
          if (parsed.personal?.email) lines.push(parsed.personal.email);
          if (parsed.summary) lines.push("\nSummary:\n" + parsed.summary);
          if (Array.isArray(parsed.experience)) {
            lines.push("\nExperience:");
            for (const exp of parsed.experience) {
              lines.push(`${exp.jobTitle} at ${exp.company}`);
              if (Array.isArray(exp.description)) {
                for (const b of exp.description) lines.push(`• ${b}`);
              }
            }
          }
          if (Array.isArray(parsed.skills)) {
            lines.push("\nSkills:");
            for (const s of parsed.skills) {
              if (Array.isArray(s.skills)) lines.push(`${s.label}: ${s.skills.join(", ")}`);
            }
          }
          const text = lines.join("\n");
          return {
            text,
            fileName: file.name,
            fileType: "json-resume",
            wordCount: text.split(/\s+/).filter(Boolean).length,
          };
        }
      }
      return {
        text: raw,
        fileName: file.name,
        fileType: "json",
        wordCount: raw.split(/\s+/).filter(Boolean).length,
      };
    } catch {
      return {
        text: raw,
        fileName: file.name,
        fileType: "json",
        wordCount: raw.split(/\s+/).filter(Boolean).length,
      };
    }
  }

  if (extension === "pdf") {
    return extractTextFromPdf(file);
  }

  if (extension === "docx") {
    return extractTextFromDocx(file);
  }

  // Fallback: try plain text
  const text = await file.text();
  return {
    text: text.trim(),
    fileName: file.name,
    fileType: "generic",
    wordCount: text.split(/\s+/).filter(Boolean).length,
  };
}

async function extractTextFromPdf(file: File): Promise<ExtractedFileResult> {
  // 1. Try server-side PDFParse extraction first for 100% font/layout fidelity
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/extract-pdf", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();
      if (data.text && typeof data.text === "string" && data.text.trim().length > 0) {
        const text = data.text.trim();
        const wordCount = text.split(/\s+/).filter(Boolean).length;
        const warnings: string[] = [];
        if (wordCount < 40) {
          warnings.push(
            "Only limited text was extracted from this PDF. If this is a scanned image or flattened PDF, please paste the text directly into the Paste tab for 100% accurate ATS scoring.",
          );
        }
        return {
          text,
          fileName: file.name,
          fileType: "pdf",
          wordCount,
          warnings: warnings.length > 0 ? warnings : undefined,
        };
      }
    }
  } catch {
    // If API fetch fails (e.g. offline), continue to client-side fallback
  }

  // 2. Client-side fallback extraction
  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  const latin1 = new TextDecoder("latin1").decode(bytes);

  const textPieces: string[] = [];
  const warnings: string[] = [];

  // 1. Try to extract from uncompressed stream operators (Tj and TJ)
  const tjRegex = /\(([^)]+)\)\s*Tj/g;
  let match: RegExpExecArray | null;
  while ((match = tjRegex.exec(latin1)) !== null) {
    const cleaned = decodePdfString(match[1]);
    if (cleaned.length > 0) textPieces.push(cleaned);
  }

  const tjArrayRegex = /\[([^\]]+)\]\s*TJ/g;
  while ((match = tjArrayRegex.exec(latin1)) !== null) {
    const inner = match[1];
    const subMatches = inner.match(/\(([^)]*)\)/g);
    if (subMatches) {
      const line = subMatches
        .map((s) => decodePdfString(s.slice(1, -1)))
        .join("")
        .trim();
      if (line.length > 0) textPieces.push(line);
    }
  }

  // 2. Try decompressing FlateDecode streams using DecompressionStream if available
  if (textPieces.length < 50 && typeof DecompressionStream !== "undefined") {
    const streamStarts: number[] = [];
    const streamEnds: number[] = [];
    let idx = 0;
    while ((idx = latin1.indexOf("stream\r\n", idx)) !== -1) {
      streamStarts.push(idx + 8);
      idx += 8;
    }
    if (streamStarts.length === 0) {
      idx = 0;
      while ((idx = latin1.indexOf("stream\n", idx)) !== -1) {
        streamStarts.push(idx + 7);
        idx += 7;
      }
    }

    for (const start of streamStarts.slice(0, 30)) {
      const end = latin1.indexOf("endstream", start);
      if (end > start) {
        try {
          const slice = bytes.subarray(start, end);
          // Try decompressing with deflate
          const ds = new DecompressionStream("deflate");
          const writer = ds.writable.getWriter();
          writer.write(slice).catch(() => {});
          writer.close().catch(() => {});
          const reader = ds.readable.getReader();
          const chunks: Uint8Array[] = [];
          let readRes = await reader.read();
          while (!readRes.done) {
            chunks.push(readRes.value);
            readRes = await reader.read();
          }
          const totalLen = chunks.reduce((acc, c) => acc + c.length, 0);
          const decompressed = new Uint8Array(totalLen);
          let offset = 0;
          for (const c of chunks) {
            decompressed.set(c, offset);
            offset += c.length;
          }
          const streamText = new TextDecoder("utf-8").decode(decompressed);

          // Extract text from decompressed stream
          let m: RegExpExecArray | null;
          const streamTj = /\(([^)]+)\)\s*Tj/g;
          while ((m = streamTj.exec(streamText)) !== null) {
            const val = decodePdfString(m[1]);
            if (val.length > 0) textPieces.push(val);
          }
          const streamTJ = /\[([^\]]+)\]\s*TJ/g;
          while ((m = streamTJ.exec(streamText)) !== null) {
            const subs = m[1].match(/\(([^)]*)\)/g);
            if (subs) {
              const line = subs
                .map((s) => decodePdfString(s.slice(1, -1)))
                .join("")
                .trim();
              if (line.length > 0) textPieces.push(line);
            }
          }
        } catch {
          // Stream might not be deflate or corrupted, continue
        }
      }
    }
  }

  let fullText = textPieces.join(" ").replace(/\s+/g, " ").trim();
  const wordCount = fullText.split(/\s+/).filter(Boolean).length;

  if (wordCount < 40) {
    warnings.push(
      "Only limited text could be extracted from this PDF. If this is a scanned/image PDF, please paste your text in the editor tab for the most accurate score.",
    );
  }

  return {
    text: fullText,
    fileName: file.name,
    fileType: "pdf",
    wordCount,
    warnings: warnings.length > 0 ? warnings : undefined,
  };
}

function decodePdfString(str: string): string {
  return str
    .replace(/\\n/g, "\n")
    .replace(/\\r/g, "\r")
    .replace(/\\t/g, "\t")
    .replace(/\\b/g, "\b")
    .replace(/\\f/g, "\f")
    .replace(/\\\(/g, "(")
    .replace(/\\\)/g, ")")
    .replace(/\\\\/g, "\\");
}

async function extractTextFromDocx(file: File): Promise<ExtractedFileResult> {
  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  const text = new TextDecoder("latin1").decode(bytes);

  // Look for XML paragraph and text tags
  const xmlTextMatches = text.match(/<w:t[^>]*>(.*?)<\/w:t>/g);
  if (!xmlTextMatches || xmlTextMatches.length === 0) {
    return {
      text: "",
      fileName: file.name,
      fileType: "docx",
      wordCount: 0,
      warnings: ["Could not parse text from this Word document. Please paste the text directly."],
    };
  }

  const extracted = xmlTextMatches
    .map((tag) => tag.replace(/<[^>]+>/g, ""))
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();

  return {
    text: extracted,
    fileName: file.name,
    fileType: "docx",
    wordCount: extracted.split(/\s+/).filter(Boolean).length,
  };
}

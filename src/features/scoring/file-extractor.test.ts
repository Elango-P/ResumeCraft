import { describe, expect, it } from "vitest";
import { extractText } from "unpdf";

describe("file-extractor and PDF parsing", () => {
  it("extracts text accurately from a PDF document using unpdf", async () => {
    // Generate standard PDF stream
    const pdfContent = [
      "%PDF-1.4",
      "1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj",
      "2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj",
      "3 0 obj<</Type/Page/Parent 2 0 R/Resources<</Font<</F1 4 0 R>>>>/MediaBox[0 0 612 792]/Contents 5 0 R>>endobj",
      "4 0 obj<</Type/Font/Subtype/Type1/BaseFont/Helvetica>>endobj",
      "5 0 obj<</Length 84>>stream",
      "BT /F1 12 Tf 100 700 Td (Alex Morgan - Senior Full Stack Developer) Tj ET",
      "endstream",
      "endobj",
      "xref",
      "0 6",
      "0000000000 65535 f ",
      "0000000009 00000 n ",
      "0000000056 00000 n ",
      "0000000111 00000 n ",
      "0000000212 00000 n ",
      "0000000289 00000 n ",
      "trailer<</Size 6/Root 1 0 R>>",
      "startxref",
      "422",
      "%%EOF",
    ].join("\n");

    const bytes = new TextEncoder().encode(pdfContent);
    const { totalPages, text } = await extractText(bytes);

    const joinedText = Array.isArray(text) ? text.join("\n") : String(text);
    expect(joinedText).toContain("Alex Morgan - Senior Full Stack Developer");
    expect(totalPages).toBe(1);
  });
});

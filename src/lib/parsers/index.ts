import * as XLSX from "xlsx";

export type ParsedContent = {
  text: string;
  base64?: string;
  mediaType?: string;
};

export async function parseFile(
  buffer: Buffer,
  mimeType: string,
  filename: string
): Promise<ParsedContent> {
  if (mimeType === "application/pdf" || filename.endsWith(".pdf")) {
    return parsePDF(buffer);
  }

  if (
    mimeType.includes("spreadsheet") ||
    mimeType.includes("excel") ||
    filename.endsWith(".xlsx") ||
    filename.endsWith(".xls")
  ) {
    return parseExcel(buffer);
  }

  if (mimeType === "text/csv" || filename.endsWith(".csv")) {
    return parseCSV(buffer);
  }

  if (mimeType.startsWith("image/")) {
    return parseImage(buffer, mimeType);
  }

  throw new Error(`Formato não suportado: ${mimeType}`);
}

async function parsePDF(buffer: Buffer): Promise<ParsedContent> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const pdfParse = require("pdf-parse") as (buf: Buffer) => Promise<{ text: string }>;
    const data = await pdfParse(buffer);
    return { text: data.text };
  } catch {
    // Fallback: send as base64 for Claude vision
    return {
      text: "",
      base64: buffer.toString("base64"),
      mediaType: "application/pdf",
    };
  }
}

function parseExcel(buffer: Buffer): ParsedContent {
  const workbook = XLSX.read(buffer, { type: "buffer" });
  const lines: string[] = [];

  for (const sheetName of workbook.SheetNames) {
    const sheet = workbook.Sheets[sheetName];
    const csv = XLSX.utils.sheet_to_csv(sheet);
    lines.push(`=== Planilha: ${sheetName} ===`);
    lines.push(csv);
  }

  return { text: lines.join("\n") };
}

function parseCSV(buffer: Buffer): ParsedContent {
  return { text: buffer.toString("utf-8") };
}

function parseImage(buffer: Buffer, mimeType: string): ParsedContent {
  const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
  const finalMime = validTypes.includes(mimeType) ? mimeType : "image/jpeg";
  return {
    text: "",
    base64: buffer.toString("base64"),
    mediaType: finalMime,
  };
}

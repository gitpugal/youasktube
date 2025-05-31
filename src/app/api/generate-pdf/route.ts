import { NextRequest } from "next/server";
import { marked } from "marked";
import puppeteer from "puppeteer";

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

function sanitizeFilename(name: string): string {
  return name
    .replace(/\s+/g, " ")
    .trim()
    .replace(/ /g, "_")
    .replace(/[^\w\d_.-]/g, "_");
}

async function generatePDFWithRetry(html: string, retries = MAX_RETRIES) {
  let browser;
  try {
    browser = await puppeteer.launch({
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--disable-gpu",
        "--single-process",
        "--no-zygote",
      ],
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
      headless: true,
      protocolTimeout: 0,
      timeout: 0,
    });

    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(0);
    await page.setDefaultTimeout(0);

    await page.setContent(html, {
      waitUntil: "domcontentloaded",
      timeout: 0,
    });

    // Add small delay for rendering stability
    await new Promise((resolve) => setTimeout(resolve, 500));

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "1cm", right: "1cm", bottom: "1cm", left: "1cm" },
    });

    await browser.close();
    return pdfBuffer;
  } catch (error) {
    if (browser) {
      await browser.close().catch(() => {});
    }
    if (retries > 0) {
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
      return generatePDFWithRetry(html, retries - 1);
    }
    throw error;
  }
}

export async function POST(req: NextRequest) {
  const { markdown, title } = await req.json();

  if (!markdown) {
    return new Response(JSON.stringify({ error: "Markdown is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const html = `<!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: sans-serif; padding: 20px; line-height: 1.5; }
          pre { background: #f5f5f5; padding: 10px; overflow-x: auto; }
          code { font-family: monospace; }
        </style>
      </head>
      <body>${marked(markdown)}</body>
    </html>`;

  try {
    const pdfBuffer = await generatePDFWithRetry(html);
    const safeFilename = sanitizeFilename(title || "document") + ".pdf";

    return new Response(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${safeFilename}"`,
      },
    });
  } catch (error) {
    console.error("PDF Generation Failed After Retries:", {
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : String(error),
      chromePath: process.env.PUPPETEER_EXECUTABLE_PATH,
    });

    return new Response(
      JSON.stringify({
        error: "PDF generation service temporarily unavailable",
        suggestion: "Please try again later",
      }),
      {
        status: 503,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

import { NextRequest } from "next/server";
import { marked } from "marked";
import puppeteer from "puppeteer";

function sanitizeFilename(name: string) {
  return name.replace(/[^\w\d_\-\.]/g, "_");
}

export async function POST(req: NextRequest) {
  const { markdown, title } = await req.json();

  if (!markdown) {
    return new Response(JSON.stringify({ error: "Markdown is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Simplified HTML template
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

  let browser;
  try {
    browser = await puppeteer.launch({
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--single-process",
        "--disable-accelerated-2d-canvas",
        "--disable-gpu",
        "--no-zygote",
      ],
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
      headless: true,
      protocolTimeout: 0, // Disable protocol timeout
      timeout: 0, // Disable operation timeout
    });

    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(0);
    await page.setDefaultTimeout(0);

    // Use basic content loading
    await page.setContent(html, {
      waitUntil: "load",
      timeout: 0,
    });

    // Minimal PDF generation
    const pdfBuffer = await page.pdf({
      format: "A4",
      margin: { top: "1cm", right: "1cm", bottom: "1cm", left: "1cm" },
    });

    const safeFilename = sanitizeFilename(title || "document") + ".pdf";

    return new Response(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${safeFilename}"`,
      },
    });
  } catch (error) {
    console.error("PDF Generation Critical Error:", {
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : String(error),
      chromiumPath: process.env.PUPPETEER_EXECUTABLE_PATH,
      systemResources: {
        memory: process.memoryUsage(),
        uptime: process.uptime(),
      },
    });
    return new Response(
      JSON.stringify({
        error: "PDF generation service unavailable",
        suggestion: "Please try again or contact support",
      }),
      {
        status: 503,
        headers: { "Content-Type": "application/json" },
      }
    );
  } finally {
    if (browser) {
      await browser.close().catch(() => {});
    }
  }
}

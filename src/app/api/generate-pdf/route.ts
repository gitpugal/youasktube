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

  const html = `
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { 
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; 
            padding: 2rem; 
            line-height: 1.6; 
            max-width: 800px;
            margin: 0 auto;
          }
          pre { 
            background: #f5f5f5; 
            padding: 1rem; 
            border-radius: 4px;
            overflow-x: auto; 
          }
          code { 
            font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
            font-size: 0.9em;
          }
          h1, h2, h3 {
            margin-top: 1.5em;
            margin-bottom: 0.5em;
          }
          table {
            border-collapse: collapse;
            width: 100%;
            margin: 1em 0;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 8px;
          }
          th {
            background-color: #f2f2f2;
          }
          blockquote {
            border-left: 4px solid #ddd;
            padding-left: 1em;
            color: #666;
            margin-left: 0;
          }
        </style>
      </head>
      <body>${marked(markdown)}</body>
    </html>
  `;

  let browser;
  try {
    browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
      headless: true,
      timeout: 30000,
    });

    const page = await browser.newPage();
    await page.setContent(html, {
      waitUntil: "networkidle0",
      timeout: 30000,
    });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "1cm",
        bottom: "1cm",
        left: "1cm",
        right: "1cm",
      },
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
    console.error("Detailed PDF generation error:", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      env: {
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
        skipDownload: process.env.PUPPETEER_SKIP_CHROMIUM_DOWNLOAD,
      },
    });
    return new Response(JSON.stringify({ error: "Failed to generate PDF" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  } finally {
    if (browser) {
      await browser.close().catch(() => {});
    }
  }
}

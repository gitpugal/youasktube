// // pages/api/generate-pdf/route.ts
import path from "path";
import { mdToPdf } from "md-to-pdf";
import { NextRequest } from "next/server";

// Utility to sanitize filename
function sanitizeFilename(name: string) {
  return name.replace(/[^\w\d_\-\.]/g, "_"); // replace unsafe characters with underscores
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { markdown, title } = body;

  if (!markdown) {
    return new Response(JSON.stringify({ error: "Markdown is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    // const pdf = await mdToPdf(
    //   { content: markdown },
    //   {
    //     dest: undefined,
    //     highlight_style: path.resolve(
    //       process.cwd(),
    //       "node_modules",
    //       "highlight.js",
    //       "styles",
    //       "github"
    //     ),
    //     stylesheet: [],
    //   }
    // );
    const pdf = await mdToPdf(
      { content: markdown },
      {
        dest: undefined,
        highlight_style: path.resolve(
          process.cwd(),
          "node_modules",
          "highlight.js",
          "styles",
          "github"
        ),
        stylesheet: [],
        launch_options: {
          executablePath: "/usr/bin/chromium-browser",
          args: ["--no-sandbox", "--disable-setuid-sandbox"],
        },
      }
    );

    if (!pdf || !pdf.content) {
      return new Response(JSON.stringify({ error: "Failed to generate PDF" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const safeFilename = sanitizeFilename(title || "summary") + ".pdf";

    return new Response(pdf.content, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${safeFilename}"`,
      },
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    return new Response(JSON.stringify({ error: "Failed to generate PDF" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// // // pages/api/generate-pdf/route.ts
// import path from "path";
// import { mdToPdf } from "md-to-pdf";
// import { NextRequest } from "next/server";

// // Utility to sanitize filename
// function sanitizeFilename(name: string) {
//   return name.replace(/[^\w\d_\-\.]/g, "_"); // replace unsafe characters with underscores
// }

// export async function POST(req: NextRequest) {
//   const body = await req.json();
//   const { markdown, title } = body;

//   if (!markdown) {
//     return new Response(JSON.stringify({ error: "Markdown is required" }), {
//       status: 400,
//       headers: { "Content-Type": "application/json" },
//     });
//   }

//   try {
//     // const pdf = await mdToPdf(
//     //   { content: markdown },
//     //   {
//     //     dest: undefined,
//     //     highlight_style: path.resolve(
//     //       process.cwd(),
//     //       "node_modules",
//     //       "highlight.js",
//     //       "styles",
//     //       "github"
//     //     ),
//     //     stylesheet: [],
//     //   }
//     // );
//     const pdf = await mdToPdf(
//       { content: markdown },
//       {
//         dest: undefined,
//         highlight_style: path.resolve(
//           process.cwd(),
//           "node_modules",
//           "highlight.js",
//           "styles",
//           "github"
//         ),
//         stylesheet: [],
//         launch_options: {
//           executablePath: "/usr/bin/chromium-browser",
//           args: ["--no-sandbox", "--disable-setuid-sandbox"],
//         },
//       }
//     );

//     if (!pdf || !pdf.content) {
//       return new Response(JSON.stringify({ error: "Failed to generate PDF" }), {
//         status: 500,
//         headers: { "Content-Type": "application/json" },
//       });
//     }

//     const safeFilename = sanitizeFilename(title || "summary") + ".pdf";

//     return new Response(pdf.content, {
//       status: 200,
//       headers: {
//         "Content-Type": "application/pdf",
//         "Content-Disposition": `attachment; filename="${safeFilename}"`,
//       },
//     });
//   } catch (error) {
//     console.error("Error generating PDF:", error);
//     return new Response(JSON.stringify({ error: "Failed to generate PDF" }), {
//       status: 500,
//       headers: { "Content-Type": "application/json" },
//     });
//   }
// }


// app/api/generate-pdf/route.ts
import { NextRequest } from "next/server";
import { marked } from "marked";
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";

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
        <style>
          body { font-family: sans-serif; padding: 30px; line-height: 1.6; }
          pre { background: #f4f4f4; padding: 10px; overflow-x: auto; }
          code { font-family: monospace; }
        </style>
      </head>
      <body>${marked(markdown)}</body>
    </html>
  `;

  try {
    const browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({ format: "A4" });
    await browser.close();

    const safeFilename = sanitizeFilename(title || "summary") + ".pdf";

    return new Response(pdfBuffer, {
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

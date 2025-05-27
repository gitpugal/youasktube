import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import SessionWrapper from "@/components/SessionWrapper";
import { Roboto } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

const roboto = Roboto({
  weight: "400",
  subsets: ["latin"],
});

// Load fonts with CSS variable names
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});
const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "YouAskTube",
  description:
    "YouAskTube is an AI-powered web app that lets you summarize and interact with YouTube videos using natural language. Paste a video link to generate concise summaries, download them as PDFs, or ask questions and get instant answers based on the video content.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.className}`} suppressHydrationWarning>
      <SessionWrapper>
        <body>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {/* <Logo /> */}
            <div className="absolute inset-0 -z-10 h-full w-full bg-neutral-900 text-gray-100 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
            {children}
            <Toaster position="top-right" />
          </ThemeProvider>
        </body>
      </SessionWrapper>
    </html>
  );
}

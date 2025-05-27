"use client";
import { Button } from "@/components/ui/button";
import { LucideSparkles, LucideFileText, LucideSearch } from "lucide-react";
import Logo from "@/components/Logo";

export default function Home() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center">
      {/* Hero */}
      <Logo />
      <section className="h-screen w-full text-neutral-900 flex items-center justify-center bg-transparent">
        <div className="flex flex-col items-center justify-center gap-6">
          <a href="/about">
            <div className="inline-flex h-full w-fit cursor-pointer justify-center rounded-full bg-white/10 border px-3 py-1 text-xs font-medium leading-5 text-slate-600 backdrop-blur-xl dark:bg-white/5 dark:text-slate-200">
              New Features ⚡️
              <span className="inline-flex items-center pl-2 text-black dark:text-white">
                Read more{" "}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="pl-0.5 text-black dark:text-white"
                >
                  <path d="M5 12h14"></path>
                  <path d="m12 5 7 7-7 7"></path>
                </svg>
              </span>
            </div>
          </a>
          <h2 className="text-center text-3xl font-medium text-gray-900 dark:text-gray-50 sm:text-6xl">
            <span className="text-red-600">Youtube</span> made easy,
            <span className="block animate-text-gradient bg-gradient-to-r from-neutral-900 via-slate-500 to-neutral-500 bg-[200%_auto] bg-clip-text leading-tight text-transparent dark:from-neutral-100 dark:via-slate-400 dark:to-neutral-400">
              insights in seconds.
            </span>
          </h2>
          <div className="mt-10 flex gap-4">
            <a
              href="/new-chat/"
              rel="noopener noreferrer"
              className="inline-flex items-center"
            >
              <button className="inline-flex cursor-pointer items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
                Try now
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="pl-0.5"
                >
                  <path d="M5 12h14"></path>
                  <path d="m12 5 7 7-7 7"></path>
                </svg>
              </button>{" "}
            </a>
            <a href="/about">
              <button className="inline-flex cursor-pointer items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground hover:bg-secondary/80 h-10 px-4 py-2">
                Learn more
              </button>
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 w-full ">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold mb-6">Why YouAskTube?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-4 bg-white/5 border rounded-2xl shadow-md">
              <LucideSparkles className="text-[#ff0033] w-8 h-8 mb-2 mx-auto" />
              <h3 className="font-semibold text-lg">Smart Summaries</h3>
              <p className="text-sm text-gray-600">
                Get concise, AI-generated video summaries instantly.
              </p>
            </div>
            <div className="p-4 bg-white/5 border rounded-2xl shadow-md">
              <LucideFileText className="text-[#ff0033] w-8 h-8 mb-2 mx-auto" />
              <h3 className="font-semibold text-lg">PDF Downloads</h3>
              <p className="text-sm text-gray-600">
                Download neatly formatted summaries as PDF documents.
              </p>
            </div>
            <div className="p-4 bg-white/5 border rounded-2xl shadow-md">
              <LucideSearch className="text-[#ff0033] w-8 h-8 mb-2 mx-auto" />
              <h3 className="font-semibold text-lg">Ask Anything</h3>
              <p className="text-sm text-gray-600">
                Use natural language to ask questions and get instant answers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 w-full  border">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl sm:text-4xl font-bold -900 mb-6">
            How It Works
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 bg-white/5 border rounded-xl shadow-lg hover:shadow-2xl transition-all ease-in-out duration-300">
              <div className="w-16 h-16 mb-4 bg-[#ff0033] text-white rounded-full flex items-center justify-center">
                <LucideFileText className="w-8 h-8" />
              </div>
              <h3 className="font-semibold text-xl ">Paste the Link</h3>
              <p className="text-sm  mt-2">
                Simply paste any YouTube video link and get started.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-white/5 border rounded-xl shadow-lg hover:shadow-2xl transition-all ease-in-out duration-300">
              <div className="w-16 h-16 mb-4 bg-[#ff0033] text-white rounded-full flex items-center justify-center">
                <LucideSparkles className="w-8 h-8" />
              </div>
              <h3 className="font-semibold text-xl ">Instant Summary</h3>
              <p className="text-sm  mt-2">
                Receive an AI-generated summary of the video instantly.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-white/5 border rounded-xl shadow-lg hover:shadow-2xl transition-all ease-in-out duration-300">
              <div className="w-16 h-16 mb-4 bg-[#ff0033] text-white rounded-full flex items-center justify-center">
                <LucideSearch className="w-8 h-8" />
              </div>
              <h3 className="font-semibold text-xl ">Ask Questions</h3>
              <p className="text-sm  mt-2">
                Ask any question about the video and get relevant answers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 w-full border text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Ready to transform how you learn from videos?
          </h2>
          <p className="mb-6 text-sm sm:text-base">
            Jump into YouAskTube and turn YouTube into your personal knowledge
            base.
          </p>
          <a href="/new-chat">
            <Button
              variant="secondary"
              className="bg-white/10 border text-[#ff0033] hover:bg-gray-100"
            >
              Get Started
            </Button>
          </a>
        </div>
      </section>
      <div className="flex items-center justify-center py-8">
        <span className="text-sm text-neutral-800 dark:text-neutral-200">
          Made by
          <a
            href="https://www.linkedin.com/in/pugalarasan/"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-1 text-neutral-950 dark:text-neutral-100 italic"
          >
            @Pugal
          </a>
        </span>
      </div>
    </div>
  );
}

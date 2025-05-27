"use client";
import {
  LucideSparkles,
  LucideFileText,
  LucideSearch,
  LucideBarChart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Logo from "@/components/Logo";

export default function LearnMore() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center px-4">
      <Logo />
      <section className="max-w-5xl w-full text-center py-24 min-h-screen flex items-center justify-center flex-col">
        <h1 className="text-4xl sm:text-6xl font-bold text-neutral-900 dark:text-white mb-4">
          Unlock the <span className="text-red-600">Power</span> of Video
          Understanding
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 font-extralight dark:text-gray-300 max-w-2xl mx-auto">
          YouAskTube helps you break down long YouTube videos into smart,
          digestible insights and answers — all with the help of AI.
        </p>
        <div className="mt-10">
          <Link href="/new-chat">
            <Button className="bg-red-600 text-white hover:bg-red-800">
              Try Now
            </Button>
          </Link>
        </div>
      </section>

      <section className="max-w-6xl w-full py-20  dark:border-gray-700">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
          What You Can Do with YouAskTube
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 text-center items-center justify-center">
          {[
            {
              icon: (
                <LucideSparkles className="w-8 h-8 mx-auto text-[#ff0033]" />
              ),
              title: "AI-Powered Summaries",
              desc: "Cut through the clutter and get a concise breakdown of any video in seconds.",
            },
            {
              icon: (
                <LucideFileText className="w-8 h-8 mx-auto text-[#ff0033]" />
              ),
              title: "Export as PDF",
              desc: "Download your summaries to read later or share with others as neat PDFs.",
            },
            {
              icon: <LucideSearch className="w-8 h-8 mx-auto text-[#ff0033]" />,
              title: "Ask Specific Questions",
              desc: "Stuck on a part of the video? Ask questions in plain language and get answers instantly.",
            },
            {
              icon: (
                <LucideBarChart className="w-8 h-8 mx-auto text-[#ff0033]" />
              ),
              title: "Stay Productive",
              desc: "Consume more content in less time — ideal for students, professionals, and creators.",
            },
          ].map(({ icon, title, desc }, i) => (
            <div
              key={i}
              className="p-6 bg-white/5 border border-gray-300 dark:border-gray-700 rounded-xl shadow hover:shadow-2xl transition-all ease-in-out duration-300"
            >
              {icon}
              <h3 className="font-semibold text-xl mt-4">{title}</h3>
              <p className="text-sm mt-2 text-gray-600 dark:text-gray-300">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-6xl w-full py-24 border-t border-gray-300 dark:border-gray-700 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-6">
          Who is this for?
        </h2>
        <p className="text-md sm:text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto mb-12">
          Whether you're a student trying to learn faster, a researcher diving
          deep into content, or a casual viewer with limited time — YouAskTube
          makes YouTube smarter and more efficient.
        </p>
        <Link href="/new-chat">
          <Button
            variant="secondary"
            className="bg-white/10 border text-[#ff0033] hover:bg-gray-100"
          >
            Get Started Now
          </Button>
        </Link>
      </section>

      <footer className="py-8 text-center text-sm text-neutral-800 dark:text-neutral-200">
        Made by{" "}
        <a
          href="https://www.linkedin.com/in/pugalarasan/"
          target="_blank"
          rel="noopener noreferrer"
          className="italic underline"
        >
          @Pugal
        </a>
      </footer>
    </div>
  );
}

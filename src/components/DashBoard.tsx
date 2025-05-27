"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import UserProfile from "@/components/UserProfile";
import { useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { TbFileDownload } from "react-icons/tb";
import { useRef } from "react";
import { SiAuthy } from "react-icons/si";
import CreditsBadge from "./CreditsBadge";
import { toast } from "sonner";
import YoutubeFrame from "./YoutubeFrame";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import rehypeRaw from "rehype-raw";
import MarkdownViewer from "./MarkdownViewer";

type ChatProps = {
  id: string;
  initialChat: {
    videoUrl: string;
    videoTranscript: string;
    videoSummary: string;
    chatHistory: any;
    title: string | null;
  } | null;
};

export default function DashBoard({ id, initialChat }: ChatProps) {
  const { data: session }: any = useSession();
  const pdfRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  if (!initialChat) {
    return null; // or a loading spinner
  }
  useEffect(() => {
    if (!initialChat) {
      toast.error("Chat not found");
      router.push("/new-chat");
    }
  }, [initialChat, router]);
  const chats = useSelector((state: any) => state.chat.chats);

  useEffect(() => {
    const chatExists =
      chats != null ? chats.some((chat: any) => chat?.id === id) : false;
    if (chats != null && !chatExists) {
      toast.error("Chat Removed");
      router.push("/new-chat");
    }
  }, [chats, id, router]);

  const [youtubeUrl, setYoutubeUrl] = useState(initialChat.videoUrl || "");
  const [videoId, setVideoId] = useState("");
  const [videoSummary, setVideoSummary]: any = useState({
    video_content: initialChat.videoSummary,
    videoTranscript: initialChat.videoTranscript,
    title: initialChat.title, // Optional: fetch title if needed
  });

  const [chat, setChat]: any = useState(initialChat.chatHistory || []);
  const [chatResponse, setChatResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [credits, setCredits] = useState(session?.user?.credits);
  const [creditsChanged, setCreditsChanged] = useState(true);
  const [generatingPDF, setGeneratingPDF] = useState(false);

  useEffect(() => {
    // Extract and set the video ID from the URL on first render
    const extractVideoId = (url: string) => {
      const regExp =
        /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^\s&]+)/;
      const match = url.match(regExp);
      return match && match[1] ? match[1] : "";
    };

    setVideoId(extractVideoId(initialChat.videoUrl));
  }, [initialChat.videoUrl]);

  const handleChat = async () => {
    if (!chatResponse.trim()) return;

    const question = chatResponse;
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          summary: videoSummary?.videoTranscript,
          question,
          title: videoSummary?.title ? videoSummary?.title : "",
          id: id,
          email: session?.user?.email,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Failed to get response from server.");
      }

      setChat((prev: any) => [...prev, { question, answer: data.response }]);
      setCredits((prev: number) => prev - 5);
      setCreditsChanged(true);
      setTimeout(() => {
        setCreditsChanged(false);
      }, 1000);
    } catch (err: any) {
      setChat((prev: any) => [
        ...prev,
        { question, answer: "❌ Failed to fetch response." },
      ]);
      toast.error(err.message || "Error occurred while fetching response.");
    } finally {
      setIsLoading(false);
      setChatResponse("");
    }
  };

  const handleDownloadPDF = async () => {
    try {
      console.log(videoSummary?.video_content);
      setGeneratingPDF(true);

      const res = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          markdown: videoSummary?.video_content,
          title: videoSummary?.title || "summary",
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        toast.error(error.error || "PDF generation failed.");
        return;
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `${videoSummary?.title || "summary"}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      toast.success("PDF is ready and downloading!");
    } catch (error) {
      toast.error("Something went wrong while downloading the PDF.");
    } finally {
      setGeneratingPDF(false);
    }
  };

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chat.length > 0) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [chat]);

  useEffect(() => {
    setCredits(session?.user?.credits);
  }, [session]);

  return (
    <div className="min-h-screen w-full bg-[#212121] px-2 md:px-4 py-10 relative flex flex-col items-center md:pt-10 pt-20">
      <div className="fixed top-5 right-5 z-10 flex flex-row md:flex-col items-stretch md:items-end md:justify-center justify-stretch md:gap-0 gap-3">
        <UserProfile session={session} />
        {credits !== undefined && (
          <div className="mt-3 w-fit md:w-full">
            <CreditsBadge credits={credits} />
          </div>
        )}
      </div>
      {/* YouTube Player */}
      <YoutubeFrame videoId={videoId} />

      <div className="w-full max-w-3xl flex flex-col items-center justify-center gap-8 pb-40 sm:pb-52">
        {/* Locked video info */}
        <div className="text-xs md:text-sm text-gray-300 italic text-center px-4">
          🔒 Video locked for this chat:
          <br />
          <a
            href={youtubeUrl}
            className="text-white font-medium underline break-all"
          >
            {youtubeUrl}
          </a>
        </div>

        {/* Summary */}
        <div
          ref={pdfRef}
          className="w-full relative p-5 md:p-6 sm:p-10 rounded-3xl bg-black/30 shadow-2xl border flex flex-col items-start justify-start gap-5 text-sm md:text-base"
        >
          <div className="w-full flex  h-fit flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <p className="text-lg sm:text-xl font-semibold">Video Summary</p>
            <button
              onClick={handleDownloadPDF}
              className=" border-2 cursor-pointer group sm:top-8 sm:right-8 flex flex-row items-center gap-2 sm:gap-3 bg-white/10 px-3 sm:px-4 py-2 rounded-3xl"
            >
              <span className="font-extralight text-xs sm:text-sm">
                {generatingPDF ? "Generating" : "Download"} PDF
              </span>
              {generatingPDF ? (
                <Loader2 size={20} className="animate-spin text-red-500" />
              ) : (
                <TbFileDownload
                  size={20}
                  className={`sm:size-6 text-red-600 ${
                    !generatingPDF &&
                    "group-hover:rotate-y-360 transition-all duration-450 ease-in"
                  }`}
                />
              )}
            </button>
          </div>
          <MarkdownViewer content={videoSummary?.video_content} />
        </div>

        {/* Chat Box */}
        <div className="flex flex-col gap-6 w-full px-2">
          {chat.map((c: any, index: number) => (
            <div key={index} className="flex flex-col gap-7 w-full">
              <div className="flex justify-end">
                <div className="bg-white/10 text-white px-5 py-4 rounded-3xl rounded-tr-sm w-fit max-w-full text-sm text-right">
                  <MarkdownViewer content={c.question} />
                </div>
              </div>
              <div className="flex flex-col md:flex-row justify-start p-4 sm:p-5  gap-3 items-start">
                <SiAuthy className="text-red-500" size={40} />
                <div className=" text-white  rounded-xl rounded-tl-none w-fit max-w-full text-sm text-left pt-2">
                  <MarkdownViewer content={c.answer} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Input */}
      <div className="w-fit mx-auto rounded-t-4xl fixed bottom-0 bg-[#212121] flex items-center justify-center">
        <div className="flex flex-col sm:flex-row gap-3 mb-5 items-center  w-full sm:w-[100%] min-w-screen   md:min-w-3xl bg-[#363636] p-4 sm:p-5 rounded-4xl  border-white/10">
          <textarea
            placeholder="Ask anything from the video"
            className="w-full text-white bg-transparent  border-white/20 focus:outline-none resize-none px-4 py-2 rounded-md"
            rows={3}
            onChange={(e) => setChatResponse(e.target.value)}
            value={chatResponse}
          />
          <Button
            className={`bg-white text-black  ${
              isLoading ? "rounded-full " : "rounded-lg px-6 py-2"
            } w-full sm:w-auto`}
            onClick={handleChat}
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="animate-spin w-5 h-6" /> : "Run"}
          </Button>
        </div>
      </div>
      <div ref={bottomRef}></div>
    </div>
  );
}

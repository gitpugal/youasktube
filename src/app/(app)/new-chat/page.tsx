"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import UserProfile from "@/components/UserProfile";
import { useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import CreditsBadge from "@/components/CreditsBadge";
import { toast } from "sonner";
import YoutubeFrame from "@/components/YoutubeFrame";
import { FaYoutube } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { addChatId } from "@/store/chatSlice";

export default function NewChatPage() {
  const { data: session }: any = useSession();
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [isVideoLocked, setIsVideoLocked] = useState(false);
  const [isAnalysing, setIsAnalysing] = useState(false);
  const [videoId, setVideoId] = useState("");
  const [credits, setCredits] = useState(session?.user?.credits);
  const router = useRouter();
  const dispatch = useDispatch();

  const extractVideoId = (url: string) => {
    const regExp =
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^\s&]+)/;
    const match = url.match(regExp);
    return match && match[1] ? match[1] : "";
  };

  const handleAnalyze = async () => {
    if (!credits || credits <= 0) {
      toast.error("You reached your credits limit");
      return;
    }
    const id = extractVideoId(youtubeUrl);
    if (!id) {
      toast.error("Please enter a valid YouTube video URL");
      return;
    }

    setIsAnalysing(true);
    setVideoId(id);
    setIsVideoLocked(true);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoId: id, user: session?.user }),
      });

      const data = await response.json();

      if (data?.response?.id) {
        dispatch(
          addChatId({ id: data.response.id, title: data.response.title })
        );
        toast.success("Video analyzed successfully");
        router.push(`/chat/${data.response.id}`);
      } else {
        toast.error("Failed to create chat.");
        setIsVideoLocked(false);
        setVideoId("");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred while analyzing the video.");
      setVideoId("");
      setIsVideoLocked(false);
    } finally {
      setIsAnalysing(false);
    }
  };

  useEffect(() => {
    setCredits(session?.user?.credits);
  }, [session]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#181818] to-[#212121] px-4 py-10 flex flex-col items-center text-white relative">
      {/* Header */}
      <div className="fixed top-5 right-5 z-10 flex flex-row md:flex-col items-stretch md:items-end md:justify-center justify-stretch md:gap-0 gap-3">
        <UserProfile session={session} />
        {credits !== undefined && (
          <div className="mt-3 w-fit md:w-full">
            <CreditsBadge credits={credits} />
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="w-full max-w-4xl flex flex-col items-center mt-15 space-y-10 pb-36">
        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-semibold text-center">
          <FaYoutube
            className="inline-block text-[#ff0033] mr-2 mb-1"
            size={50}
          />
          YouTube AI Chat
        </h1>
        <p className="text-sm text-gray-400 text-center max-w-md">
          Paste a YouTube video link to generate a chat powered by AI. Get
          insights, summaries, and ask questions — all in one chat.
        </p>

        {/* Input Section */}
        <div className="w-full md:max-w-3xl flex flex-col sm:flex-row gap-4">
          <Input
            type="url"
            placeholder="Paste a YouTube video URL"
            className="flex-1 bg-[#2a2a2a] text-white placeholder:text-white/30 border border-white/10 px-4 py-4 text-base rounded-lg focus:ring-2 focus:ring-white/30"
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
            disabled={isVideoLocked}
          />
          <Button
            className="bg-white text-black px-6 py-4 rounded-lg hover:bg-gray-200 transition disabled:opacity-60"
            onClick={handleAnalyze}
            disabled={isVideoLocked || isAnalysing}
          >
            {isAnalysing ? (
              <>
                <Loader2 className="animate-spin w-5 h-5" /> Hang on tight
                there...
              </>
            ) : (
              "Analyze"
            )}
          </Button>
        </div>

        {/* Video Locked Message */}
        {isVideoLocked && (
          <div className="text-sm text-gray-400 text-center italic mt-2 max-w-xl break-words">
            🔒 Video locked for this chat:
            <br />
            <a
              href={youtubeUrl}
              className="text-white underline font-medium break-all"
              target="_blank"
              rel="noopener noreferrer"
            >
              {youtubeUrl}
            </a>
          </div>
        )}

        {/* YouTube Player */}
        <YoutubeFrame videoId={videoId} />
      </div>
    </div>
  );
}

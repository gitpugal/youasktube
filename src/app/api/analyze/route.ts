// app/api/analyze/route.ts

import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { videoId, user } = body;
    const userRecord = await prisma.user.findUnique({
      where: {
        email: user?.email,
      },
      select: {
        credits: true,
        id: true,
      },
    });
    if (!userRecord) {
      return NextResponse.json(
        { error: "No such user in the system" },
        { status: 404 }
      );
    }

    if (!userRecord.credits || userRecord.credits <= 0) {
      return NextResponse.json({ error: "No credits left" }, { status: 403 });
    }

    // Step 1: Call the LLM/FastAPI backend
    const llmResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/transcribe/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: videoId }),
      }
    );

    if (!llmResponse.ok) {
      return NextResponse.json(
        { error: "Failed to fetch transcription" },
        { status: llmResponse.status }
      );
    }
    const FASTAPI_URL = `${process.env.NEXT_PUBLIC_API_URL}/chat`;
    const data = await llmResponse.json();
    const summary = data.response.video_content;

    console.log(data);
    const apiResponse = await fetch(FASTAPI_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        summary,
        userQuestion:
          "Generate a clear, well-organized summary of this YouTube video transcript in professional markdown format. Include:\n\n1. **Title** of the video\n2. A short **introduction** (2–3 sentences)\n3. Key **sections or topics** covered, each with a bolded heading and 2–4 bullet points summarizing the content\n4. A **conclusion** (1–2 lines) summarizing the core takeaway.\n\nDo NOT include code blocks, explanations about markdown, or any references to transcripts or prompts. Just return clean, visually-appealing markdown ready to go into a PDF.",
        title: data.response.title,
      }),
    });

    if (!apiResponse.ok) {
      throw new Error("FastAPI request failed");
    }

    const { response } = await apiResponse.json();

    // Step 2: Create chat in DB
    const newChat = await prisma.chat.create({
      data: {
        userId: userRecord?.id, // assuming userId is stored as email
        title: data.response.title,
        videoUrl: `https://www.youtube.com/watch?v=${videoId}`,
        videoTranscript: summary, // or use "\n" for line breaks
        videoSummary: response,
        chatHistory: [], // initialize empty array or provide initial Q&A if available
      },
    });

    // Step 3: Return chat ID
    return NextResponse.json({
      response: {
        id: newChat.id,
        video_content: summary,
        title: newChat.title,
      },
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

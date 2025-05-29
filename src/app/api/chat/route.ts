import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

const FASTAPI_URL = `${process.env.NEXT_PUBLIC_API_URL}/chat`; // or your deployed FastAPI URL

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { summary, question, title, id, email } = body;

  if (!summary || !question) {
    return NextResponse.json(
      { error: "Missing summary or question" },
      { status: 400 }
    );
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
      select: {
        credits: true,
      },
    });
    if (!user) {
      return NextResponse.json(
        { error: "No such user in the system" },
        { status: 404 }
      );
    }

    if (user.credits <= 0) {
      return NextResponse.json({ error: "No credits left" }, { status: 403 });
    }

    // 🔗 Call FastAPI backend
    const apiResponse = await fetch(FASTAPI_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        summary,
        userQuestion: question,
        title,
      }),
    });

    if (!apiResponse.ok) {
      throw new Error("FastAPI request failed");
    }

    const { response } = await apiResponse.json();

    // 🧠 Update chat history in DB
    const previousChatHistory = await prisma.chat.findUnique({
      where: { id },
      select: { chatHistory: true },
    });

    const currentChat = Array.isArray(previousChatHistory?.chatHistory)
      ? previousChatHistory.chatHistory
      : [];

    const updatedChat = [...currentChat, { question, answer: response }];

    const chat = await prisma.chat.update({
      where: { id },
      data: { chatHistory: updatedChat },
    });
    await prisma.user.update({
      where: { email },
      data: {
        credits: {
          decrement: 5,
        },
      },
    });

    return NextResponse.json({ response });
  } catch (err) {
    console.error("Error:", err);
    return NextResponse.json(
      { error: "LLM failed to respond" },
      { status: 500 }
    );
  }
}

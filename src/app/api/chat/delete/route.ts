// app/api/chat/delete/route.ts

import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, user } = body;

    const deletedChat = await prisma.chat.delete({
      where: {
        id: id,
        user: {
          email: user.email,
        },
      },
    });

    return NextResponse.json({
      response: {
        id,
      },
    });
  } catch (error) {
    console.error("Error in POST /api/chat/de;lete:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

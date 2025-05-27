import { PrismaClient } from "@prisma/client";
import DashBoard from "@/components/DashBoard";
const prisma = new PrismaClient();

export default async function ChatPage({ params }: any) {
  const { id } = await params;
  const chat = await prisma.chat.findUnique({
    where: { id: id },
  });

  return <DashBoard id={id} initialChat={chat} />;
}

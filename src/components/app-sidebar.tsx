"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "./ui/button";
import { signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { Ellipsis, Trash2Icon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useDispatch, useSelector } from "react-redux";
import { setChatIds, deleteChatId } from "@/store/chatSlice";
import { title } from "process";
import { RootState } from "@/store/store";

type Chat = {
  id: string;
  title: string;
};

export function AppSidebar() {
  const { data: session } = useSession();
  const chats = useSelector((state: RootState) => state.chat.chats);
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchChats = async () => {
      if (!session?.user?.email) return;

      const res = await fetch(`/api/user-chats?email=${session.user.email}`);
      const data: Chat[] = await res.json();

      // Dispatch to Redux only
      dispatch(
        setChatIds(
          data.length > 0
            ? data.map((chat) => ({ id: chat.id, title: chat.title }))
            : []
        )
      );
    };

    fetchChats();
  }, [session?.user?.email, dispatch]);

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch("/api/chat/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          user: session?.user,
        }),
      });

      if (response.ok) {
        dispatch(deleteChatId(id));
      }
    } catch (error) {
      alert(error);
    }
  };

  return (
    <Sidebar variant="inset" className="bg-neutral-900 text-white p-2 z-50">
      <SidebarHeader className="flex flex-row items-center justify-between px-3 py-2 pt-5 w-full">
        <SidebarTrigger className="relative" />
        <a href="/new-chat" className="w-6 h-6 text-white opacity-70">
          <img src="/new-chat.svg" alt="New Chat" />
        </a>
      </SidebarHeader>

      <SidebarContent className="space-y-2 pt-5 px-2 md:px-0">
        {chats &&
          chats.length > 0 &&
          chats.map((chat: any) => {
            const isActive = pathname === `/chat/${chat.id}`;
            return (
              <div
                className={`w-full flex flex-row items-center justify-between text-left font-light text-sm cursor-pointer p-2 rounded-md overflow-hidden transition-colors duration-200 ${
                  isActive
                    ? "bg-neutral-800 text-white font-medium"
                    : "hover:bg-neutral-800"
                }`}
                key={chat.id}
              >
                <button
                  onClick={() => router.push(`/chat/${chat.id}`)}
                  className="w-10/12 cursor-pointer text-left"
                >
                  <span className="block w-full truncate text-ellipsis whitespace-nowrap">
                    {chat.title}
                  </span>
                </button>
                <Popover>
                  <PopoverTrigger>
                    <Ellipsis className="cursor-pointer" />
                  </PopoverTrigger>
                  <PopoverContent className="w-40 flex flex-col gap-2 items-start justify-evenly p-2">
                    <Button
                      onClick={() => handleDelete(chat.id)}
                      variant={"ghost"}
                      className="w-full flex flex-row items-center gap-4 justify-start"
                    >
                      <Trash2Icon />
                      <span>Delete</span>
                    </Button>
                  </PopoverContent>
                </Popover>
              </div>
            );
          })}
      </SidebarContent>

      <SidebarFooter>
        <Button variant={"outline"} onClick={() => signOut()}>
          Logout
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}

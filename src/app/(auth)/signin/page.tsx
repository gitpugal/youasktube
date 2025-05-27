"use client";

import Logo from "@/components/Logo";
import { signIn } from "next-auth/react";
import { SiAuthy } from "react-icons/si";
import { toast } from "sonner";

export default function Login() {
  async function handleSignUpWithGoogle() {
    try {
      const callbackUrl =
        process.env.NODE_ENV === "production"
          ? "http://localhost:3000/new-chat"
          : "http://localhost:3000/new-chat";

      const response = await signIn("google", {
        callbackUrl,
        redirect: false,
      });
    } catch (e) {
      toast.error(e + "");
    }
  }
  return (
    <div className="w-full h-screen flex flex-col gap-5 items-center justify-center my-auto">
      <Logo />
      <h1 className="font-semibold text-[#ff0033] text-2xl sm:text-3xl tracking-tight">
        <SiAuthy className="inline-block mr-1 mb-1" />
        Login
      </h1>
      <button
        type="button"
        onClick={handleSignUpWithGoogle}
        className="cursor-pointer px-8 h-11 flex items-center justify-center gap-3 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
      >
        <img
          src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
          alt="Google"
          className="w-5 h-5"
        />
        Continue with Google
      </button>
    </div>
  );
}

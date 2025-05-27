import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],

  callbacks: {
    async signIn({ user }) {
      const existingUser = await prisma.user.findUnique({
        where: { email: user.email! },
      });

      if (!existingUser) {
        await prisma.user.create({
          data: {
            email: user.email!,
            name: user.name,
            credits: 50, // default credits
          },
        });
      }

      return true;
    },

    async session({ session }: any) {
      if (session.user?.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: session.user.email },
          select: { id: true, credits: true },
        });

        if (dbUser) {
          session.user.id = dbUser.id;
          (session.user as any).credits = dbUser.credits;
        }
      }
      return session;
    },
  },

  pages: {
    signIn: "/signin",
  },

  debug: process.env.NODE_ENV === "development",
};

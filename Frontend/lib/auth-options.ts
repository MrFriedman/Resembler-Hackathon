import type { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { getApiBase } from "@/lib/demo";

export const authOptions: NextAuthOptions = {
  providers: [
    Credentials({
      name: "Account",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email?.toString().trim() || "";
        const password = credentials?.password?.toString() || "";
        if (!email || !password) return null;

        const base = getApiBase();
        if (!base) return null;

        try {
          const response = await fetch(`${base}/api/user/account`);
          if (!response.ok) return null;
          const user = (await response.json()) as {
            username?: string;
            full_name?: string;
            email?: string;
          };
          return {
            id: user.username || "user",
            name: user.full_name || email,
            email: user.email || email,
          };
        } catch {
          return null;
        }
      },
    }),
  ],
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  pages: { signIn: "/login" },
};

"use client";

import { SessionProvider } from "next-auth/react";
import type { ReactNode } from "react";
import { isDemoMode } from "@/lib/demo";
import { demoAuthSession } from "@/lib/demo-data";

export default function AuthProvider({ children }: { children: ReactNode }) {
  if (isDemoMode()) {
    return (
      <SessionProvider
        session={demoAuthSession}
        refetchOnWindowFocus={false}
        refetchInterval={0}
      >
        {children}
      </SessionProvider>
    );
  }

  return <SessionProvider>{children}</SessionProvider>;
}

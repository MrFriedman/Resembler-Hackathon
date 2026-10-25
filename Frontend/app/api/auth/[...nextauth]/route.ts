import { NextRequest, NextResponse } from "next/server";
import { isDemoMode } from "@/lib/demo";
import { demoAuthSession } from "@/lib/demo-data";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ nextauth: string[] }> };

function demoAuth(request: NextRequest) {
  const path = request.nextUrl.pathname;
  if (path.endsWith("/session")) {
    return NextResponse.json(demoAuthSession);
  }
  if (path.endsWith("/csrf")) {
    return NextResponse.json({ csrfToken: "demo" });
  }
  if (path.endsWith("/providers")) {
    return NextResponse.json({
      credentials: { id: "credentials", name: "Demo", type: "credentials" },
    });
  }
  return NextResponse.json({
    ok: true,
    url: "/dashboard",
    user: demoAuthSession.user,
  });
}

async function liveAuth(request: NextRequest, context: RouteContext) {
  if (!process.env.NEXTAUTH_SECRET) {
    return NextResponse.json(
      { message: "NEXTAUTH_SECRET is required when demo mode is off." },
      { status: 500 }
    );
  }
  const { default: NextAuth } = await import("next-auth");
  const { authOptions } = await import("@/lib/auth-options");
  const handler = NextAuth(authOptions) as (
    request: NextRequest,
    context: RouteContext
  ) => Promise<Response>;
  return handler(request, context);
}

export async function GET(request: NextRequest, context: RouteContext) {
  if (isDemoMode()) return demoAuth(request);
  return liveAuth(request, context);
}

export async function POST(request: NextRequest, context: RouteContext) {
  if (isDemoMode()) return demoAuth(request);
  return liveAuth(request, context);
}

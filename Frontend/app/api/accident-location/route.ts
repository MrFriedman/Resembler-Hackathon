import { NextResponse } from "next/server";
import { getApiBase, isDemoMode } from "@/lib/demo";
import { demoSeed } from "@/lib/demo-data";

export async function GET() {
  if (isDemoMode()) {
    const first = demoSeed.mapPoints[0];
    return NextResponse.json({
      accident: [first.lng, first.lat],
      points: demoSeed.mapPoints,
    });
  }

  const base = getApiBase();
  if (!base) {
    return NextResponse.json({ message: "NEXT_PUBLIC_API_URL is not set." }, { status: 503 });
  }

  try {
    const response = await fetch(`${base}/api/accident-location`);
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json({ message: "The map API could not be reached." }, { status: 502 });
  }
}

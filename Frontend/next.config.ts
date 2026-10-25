import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // This app lives in Frontend/, and the repo root has its own lockfile.
  // Keep tracing rooted here so Vercel does not treat the parent as the app.
  outputFileTracingRoot: path.join(__dirname),
};

export default nextConfig;

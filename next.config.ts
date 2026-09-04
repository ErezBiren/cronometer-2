import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    // Vercel sets this at build time; baked into the client bundle so the
    // deployed version is visible without relying on runtime env exposure.
    NEXT_PUBLIC_GIT_SHA: process.env.VERCEL_GIT_COMMIT_SHA ?? "",
  },
};

export default nextConfig;

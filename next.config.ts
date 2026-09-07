import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    // Vercel sets this at build time; baked into the client bundle so the
    // deployed version is visible without relying on runtime env exposure.
    NEXT_PUBLIC_GIT_SHA: process.env.VERCEL_GIT_COMMIT_SHA ?? "",
  },
  images: {
    // Food images are either local (/public/images/*) or, for foods created
    // via the "Create Food" form, hotlinked from Unsplash — both need to be
    // allowed for next/image to optimize them.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;

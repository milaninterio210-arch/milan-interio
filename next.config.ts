import type { NextConfig } from "next";
import fs from "node:fs";
import path from "node:path";

// Ensure the brand favicon overrides the default Next.js/Vercel favicon
const sourceIcon = path.join(process.cwd(), "public", "Logo", "milaninterio-favicon.png");
const appFavicon = path.join(process.cwd(), "src", "app", "favicon.ico");
const appIcon = path.join(process.cwd(), "src", "app", "icon.png");
const publicFavicon = path.join(process.cwd(), "public", "favicon.ico");

if (fs.existsSync(sourceIcon)) {
  try {
    fs.copyFileSync(sourceIcon, appFavicon);
    fs.copyFileSync(sourceIcon, appIcon);
    fs.copyFileSync(sourceIcon, publicFavicon);
  } catch (err) {
    console.error("Failed to sync favicon:", err);
  }
}

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/favicon.ico",
        destination: "/Logo/milaninterio-favicon.png",
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;

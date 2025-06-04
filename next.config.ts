import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [
      "res.cloudinary.com",
      "www.facebook.com",
      "www.citypng.com",
      "example.com",
      "platform-lookaside.fbsbx.com",
      "graph.facebook.com"
    ], // ✅ Thêm Cloudinary vào đây
  },

  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
};

export default nextConfig;

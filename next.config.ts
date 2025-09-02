import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {

    formats: ['image/webp', 'image/avif',],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'restaurant-tms-strapi.onrender.com',
      },
    ],

  },

};

export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  images: {
    formats: ["image/webp", "image/avif"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "restaurant-tms-strapi.onrender.com",
      },
    ],
  },
};

module.exports = nextConfig;

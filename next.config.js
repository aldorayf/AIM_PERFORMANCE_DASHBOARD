/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static optimization for better performance
  reactStrictMode: true,
  // Optimize images
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;

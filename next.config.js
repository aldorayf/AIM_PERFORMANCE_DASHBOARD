/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // Enable static optimization for better performance
  reactStrictMode: true,
  // Optimize images
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  trailingSlash: true,
  reactStrictMode: false,
  swcMinify: false,
  experimental: {
    esmExternals: false,
  },
  images: { 
    unoptimized: true,
    domains: ['books.toscrape.com', 'images.pexels.com']
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NODE_ENV === 'production' 
      ? 'https://book-explorer-backend-yijl.onrender.com/api'
      : 'http://localhost:5000/api'
  }
};

module.exports = nextConfig;
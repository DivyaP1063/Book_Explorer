/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  output: 'export',
  trailingSlash: true,
  distDir: 'out',
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
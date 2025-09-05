/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { 
    unoptimized: true,
    domains: ['books.toscrape.com', 'images.pexels.com']
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NODE_ENV === 'production' 
      ? 'https://your-backend-url.herokuapp.com/api'
      : 'http://localhost:5000/api'
  }
};

module.exports = nextConfig;
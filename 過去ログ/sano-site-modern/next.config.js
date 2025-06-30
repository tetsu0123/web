/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  reactStrictMode: false,
  compiler: {
    emotion: true,
    removeConsole: process.env.NODE_ENV === 'production',
  },
  images: {
    unoptimized: true,
    formats: ['image/avif', 'image/webp'],
  },
  trailingSlash: true,
  productionBrowserSourceMaps: false,
}

module.exports = nextConfig
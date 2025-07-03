/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/official',
  assetPrefix: '/official',
  reactStrictMode: false,
  compiler: {
    emotion: true,
  },
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  // Disable all development features
  productionBrowserSourceMaps: false,
  devIndicators: {
    autoPrerender: false,
    buildActivity: false,
  },
}

module.exports = nextConfig
import type { NextConfig } from 'next'

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
  openAnalyzer: false,
  analyzerMode: 'json',
})

const nextConfig: NextConfig = {
  images: {
    formats: ['image/webp'],
  },
  compress: true,
  poweredByHeader: false,
  experimental: {
    optimizePackageImports: ['recharts', 'lucide-react'],
  },
}

export default withBundleAnalyzer(nextConfig)

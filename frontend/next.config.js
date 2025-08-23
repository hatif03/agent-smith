/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Fix webpack hash generation issues
  experimental: {
    forceSwcTransforms: true,
  },
  webpack: (config, { dev, isServer }) => {
    // Fix for webpack hash generation issue with WasmHash
    if (!dev) {
      config.optimization.chunkIds = 'named';
      config.optimization.moduleIds = 'named';
    }
    return config;
  },
}

module.exports = nextConfig

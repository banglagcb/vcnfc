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
  // Improve development stability
  experimental: {
    // Optimize for development
    optimizeCss: false,
  },
  // Ensure proper webpack configuration for development
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      // Optimize hot reloading
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      };
    }
    return config;
  },
  // Configure server-side rendering properly
  poweredByHeader: false,
  // Optimize for development
  swcMinify: true,
};

export default nextConfig;

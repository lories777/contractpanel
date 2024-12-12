/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      canvas: false,
      encoding: false,
    };
    // Add support for puppeteer in Next.js
    config.resolve.fallback = {
      ...config.resolve.fallback,
      child_process: false,
      fs: false,
      net: false,
      tls: false,
      'aws-crt': false,
    };
    return config;
  },
  outputFileTracingIncludes: {
    '/api/contracts/[id]/pdf/**': ['node_modules/**/*'],
  },
}

module.exports = nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Vercel deployment settings
  reactStrictMode: true,
  swcMinify: true,
  
  // For Tesseract.js worker files
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
      };
    }
    return config;
  },
};

export default nextConfig;

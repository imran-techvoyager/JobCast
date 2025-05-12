import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ['clone-deep'],
  webpack: (config, { isServer }) => {
    // Type assertion for Webpack configuration
    const newConfig = { ...config };
    
    newConfig.module?.rules?.push({
      test: /node_modules\/clone-deep\/utils\.js/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['next/babel'],
        }
      }
    });

    return newConfig;
  }
};

export default nextConfig;
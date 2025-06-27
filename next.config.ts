import type { NextConfig } from 'next';
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin';

const nextConfig: NextConfig = {
  webpack(config) {
    config.plugins.push(new CaseSensitivePathsPlugin());
    return config;
  },
};

export default nextConfig;

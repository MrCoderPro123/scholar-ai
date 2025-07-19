import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  // IMPORTANT: Add 'output: 'export'' for static site generation
  output: 'export',

  // IMPORTANT: Configure basePath for GitHub Pages
  // Your GitHub Pages URL is https://MrCoderPro123.github.io/scholar-ai/
  // So, the basePath should be '/scholar-ai'
  basePath: '/scholar-ai',

  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    // IMPORTANT: Disable image optimization for static export
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images-na.ssl-images-amazon.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'm.media-amazon.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'books.google.com',
        port: '',
        pathname: '/**',
      }
    ],
  },
  // Optional: If you're using the App Router and have issues with refresh leading to 404s,
  // consider uncommenting trailingSlash (though it can sometimes cause other issues).
  // trailingSlash: true,
};

export default nextConfig;
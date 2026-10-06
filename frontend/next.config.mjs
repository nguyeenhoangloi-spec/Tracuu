/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'nctu.edu.vn',
      },
      {
        protocol: 'https',
        hostname: 'tracuu.nctu.edu.vn',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/tracuu/:path*',
        destination: 'http://127.0.0.1:3001/api/tracuu/:path*',
      },
    ];
  },
};

export default nextConfig;

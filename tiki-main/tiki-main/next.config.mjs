/** @type {import('next').NextConfig} */
const nextConfig = {
  compress: true,
  reactStrictMode: true,
  logging: {
    fetches: {
      failed: true,
    },
  },
  images: {
    domains: ['localhost'],  // Thêm localhost vào danh sách domains được phép sử dụng
  },
};

export default nextConfig;

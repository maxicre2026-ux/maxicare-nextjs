/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // يسمح بوجود تحذيرات/أخطاء ESLint أثناء build الإنتاج
  },
};

module.exports = nextConfig;
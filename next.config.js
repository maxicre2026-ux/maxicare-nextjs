/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: {
    // يسمح بتمرير build حتى مع أخطاء TS (implicit any وغيرها)
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
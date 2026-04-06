/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
  output: 'export',
  // Dodajemy basePath TYLKO jeśli budujemy projekt na produkcję (GitHub Pages)
  basePath: isProd ? '/el-app' : '',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;

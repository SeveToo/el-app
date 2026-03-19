/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // To jest kluczowe dla GitHub Pages
  basePath: '/el-app', // Tu wpisujesz nazwę swojego repozytorium
  images: {
    unoptimized: true, // GitHub Pages to serwer statyczny, Next.js Image Optimization tu nie zadziała
  },
};

export default nextConfig;

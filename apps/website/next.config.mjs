/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  experimental: {
    serverComponentsExternalPackages: ['@surgbc/egw-writings-shared', '@surgbc/egw-pdf-generator'],
  },
  images: {
    domains: [],
  },
  // Build configuration - support both Docker and static export
  output: process.env.BUILD_MODE === 'static' ? 'export' : 'standalone',
  trailingSlash: true,
  distDir: process.env.BUILD_MODE === 'static' ? 'out' : '.next',
  // SEO optimizations
  generateEtags: true,
  poweredByHeader: false,
  compress: true,
  // Performance optimizations
  swcMinify: true,
  modularizeImports: {
    '@heroicons/react/24/outline': {
      transform: '@heroicons/react/24/outline/{{member}}',
    },
    '@heroicons/react/24/solid': {
      transform: '@heroicons/react/24/solid/{{member}}',
    },
    'lucide-react': {
      transform: 'lucide-react/dist/esm/icons/{{kebabCase member}}',
    },
  },
};

export default nextConfig;
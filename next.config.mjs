/** @type {import('next').NextConfig} */
const nextConfig = {
  // ─── App Router ───────────────────────────────────────────────────────────
  reactStrictMode: true,

  // ─── Incremental Migration: skip legacy Vite src/ type-checking ──────────
  // The src/ directory belongs to the Vite stack. Type-checking it during
  // `npm run next:build` exhausts the V8 heap (2GB+) because Next.js tries
  // to run tsc over 1600+ modules. Enable once migration to App Router is
  // complete and src/ is fully removed.
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  // ─── Server-only packages — never sent to the browser bundle ─────────────
  serverExternalPackages: [
    '@prisma/client',
    'prisma',
    'mongoose',
    'express',
    'nodemailer',
    'socket.io',
    'multer',
  ],

  // ─── Environment Variables ────────────────────────────────────────────────
  env: {
    NEXT_PUBLIC_APP_NAME: 'White Caves Real Estate',
    NEXT_PUBLIC_BRAND_COLOR: '#EF4444',
  },

  // ─── Image Optimisation ───────────────────────────────────────────────────
  images: {
    domains: ['res.cloudinary.com', 'images.unsplash.com', 'cdn.whitecaves.ae'],
    formats: ['image/avif', 'image/webp'],
  },

  // ─── Webpack ──────────────────────────────────────────────────────────────
  // Root cause: the src/ tree contains test files (*.test.ts) that import
  // `node:fs`, `node:path`, `node:url`. Next.js webpack scans these files and
  // fails on the `node:` URI scheme.
  //
  // Two-layer fix:
  //   Layer 1 — Ignore test/spec files completely (IgnorePlugin)
  //   Layer 2 — Strip `node:` prefix for any remaining Node built-in imports
  //             (NormalModuleReplacementPlugin)
  //   Layer 3 — Fallback: false for all Node built-ins on the client bundle
  webpack(config, { webpack: wp, isServer }) {
    // ── Layer 1: Exclude all test & spec files from the Next.js bundle ──────
    config.plugins.push(
      new wp.IgnorePlugin({
        resourceRegExp: /\.(test|spec)\.(ts|tsx|js|jsx)$/,
      })
    );

    // ── Layer 2: Strip `node:` prefix so webpack resolves normally ──────────
    // This handles packages that use the modern `import x from 'node:fs'` syntax
    config.plugins.push(
      new wp.NormalModuleReplacementPlugin(/^node:/, (resource) => {
        resource.request = resource.request.replace(/^node:/, '');
      })
    );

    // ── Layer 3: Client bundle — exclude all Node built-ins ─────────────────
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        url: false,
        crypto: false,
        stream: false,
        http: false,
        https: false,
        net: false,
        tls: false,
        os: false,
        child_process: false,
        buffer: false,
        util: false,
        assert: false,
        zlib: false,
        events: false,
        querystring: false,
        module: false,
        perf_hooks: false,
        worker_threads: false,
        dns: false,
        dgram: false,
      };
    }

    return config;
  },

  // ─── Redirects ────────────────────────────────────────────────────────────
  async redirects() {
    return [
      { source: '/index.html', destination: '/', permanent: true },
    ];
  },

  // ─── Security Headers ─────────────────────────────────────────────────────
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(self)',
          },
        ],
      },
    ];
  },
};

export default nextConfig;

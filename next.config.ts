import type { NextConfig } from "next";

/**
 * Security headers for all responses
 */
const securityHeaders = [
  {
    // Prevent clickjacking attacks
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    // Prevent MIME type sniffing
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    // Control referrer information
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    // Enforce HTTPS (enable in production)
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains',
  },
  {
    // Prevent XSS attacks in older browsers
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },
  {
    // Control browser features
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  },
  {
    // Content Security Policy
    // Note: 'unsafe-inline' for styles is needed for CSS-in-JS/Tailwind
    // In production, consider using nonce-based CSP for scripts
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      // Production: Remove unsafe-inline and use nonce-based approach
      // Development may still need 'unsafe-inline' for HMR
      process.env.NODE_ENV === 'production'
        ? "script-src 'self'"
        : "script-src 'self' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self' data:",
      "connect-src 'self' https://*.walletconnect.com https://*.walletconnect.org wss://*.walletconnect.com wss://*.walletconnect.org",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; '),
  },
];

const nextConfig: NextConfig = {
  // Security headers
  async headers() {
    return [
      {
        // Apply to all routes
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },

  // Proxy API calls through Next.js to avoid cross-origin cookie issues in development
  async rewrites() {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
    return [
      {
        source: '/api/:path*',
        destination: `${apiBaseUrl}/api/:path*`,
      },
    ];
  },

  // Strict React mode for development
  reactStrictMode: true,

  // Powered by header removal (security through obscurity)
  poweredByHeader: false,

  // Image optimization configuration
  images: {
    remotePatterns: [
      // Add trusted image domains here
      // Example:
      // {
      //   protocol: 'https',
      //   hostname: 'cdn.example.com',
      // },
    ],
  },

  // Bundle optimization
  experimental: {
    // Optimize package imports for better tree-shaking
    optimizePackageImports: [
      'lucide-react',
      '@radix-ui/react-avatar',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-popover',
      '@radix-ui/react-select',
      '@radix-ui/react-tabs',
      '@radix-ui/react-tooltip',
    ],
  },
};

export default nextConfig;

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
    // Adjust script-src and connect-src based on your actual domains
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline'", // unsafe-eval needed for dev, remove in strict prod
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
};

export default nextConfig;

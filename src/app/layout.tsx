import type { Metadata, Viewport } from 'next'
import { Press_Start_2P, VT323 } from 'next/font/google'
import { Providers } from './providers'
import './globals.css'

// Press Start 2P - Pixel font for retro terminal aesthetic
const pressStart2P = Press_Start_2P({
  variable: '--font-pixel',
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
})

// VT323 - Retro CRT terminal font for code
const vt323 = VT323({
  variable: '--font-mono',
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'AGENTAURI.AI SYSTEM TERMINAL',
    template: '%s | agentauri.ai',
  },
  description:
    'Reputation infrastructure for autonomous AI agents. Monitor blockchain events, create automated triggers, and query agent reputation data on the ERC-8004 protocol.',
  keywords: ['ERC-8004', 'blockchain', 'reputation', 'AI agents', 'Web3', 'Ethereum'],
  authors: [{ name: 'Agentauri Team' }],
  creator: 'agentauri.ai',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'agentauri.ai',
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  themeColor: '#0a0a0a',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${pressStart2P.variable} ${vt323.variable} font-pixel`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

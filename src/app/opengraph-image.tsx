import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'agentauri.ai - ERC-8004 Reputation Dashboard'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function OGImage() {
  return new ImageResponse(
    <div
      style={{
        background: '#0A0A0A',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '80px',
      }}
    >
      {/* Left side - Logo */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: '-8px',
        }}
      >
        <span
          style={{
            fontSize: '120px',
            fontWeight: 700,
            color: '#FFFFFF',
            lineHeight: 0.85,
          }}
        >
          8
        </span>
        <span
          style={{
            fontSize: '120px',
            fontWeight: 700,
            color: '#FFFFFF',
            lineHeight: 0.85,
          }}
        >
          0
        </span>
        <span
          style={{
            fontSize: '120px',
            fontWeight: 700,
            color: '#FFFFFF',
            lineHeight: 0.85,
          }}
        >
          0
        </span>
        <span
          style={{
            fontSize: '120px',
            fontWeight: 700,
            color: '#FFFFFF',
            lineHeight: 0.85,
          }}
        >
          4
        </span>
        <span
          style={{
            fontSize: '48px',
            fontWeight: 600,
            color: '#CCFF00',
            marginTop: '8px',
          }}
        >
          .dev
        </span>
      </div>

      {/* Right side - Tagline */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: '24px',
          maxWidth: '600px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: '8px',
          }}
        >
          <span
            style={{
              fontSize: '64px',
              fontWeight: 700,
              color: '#CCFF00',
              textTransform: 'uppercase',
              letterSpacing: '-0.02em',
            }}
          >
            AUTOMATE.
          </span>
          <span
            style={{
              fontSize: '64px',
              fontWeight: 700,
              color: '#FFFFFF',
              textTransform: 'uppercase',
              letterSpacing: '-0.02em',
            }}
          >
            VERIFY.
          </span>
          <span
            style={{
              fontSize: '64px',
              fontWeight: 700,
              color: '#FFFFFF',
              textTransform: 'uppercase',
              letterSpacing: '-0.02em',
            }}
          >
            TRUST.
          </span>
        </div>
        <span
          style={{
            fontSize: '24px',
            fontWeight: 400,
            color: '#6B6B6B',
            textAlign: 'right',
          }}
        >
          ERC-8004 Reputation Dashboard
        </span>
      </div>
    </div>,
    {
      ...size,
    }
  )
}

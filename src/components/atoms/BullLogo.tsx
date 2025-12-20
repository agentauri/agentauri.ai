'use client'

/**
 * AgentAuri Bull Logo
 * Pixel art bull logo representing Taurus - strength and reliability
 */

import { cn } from '@/lib/utils'

type LogoVariant = 'filled' | 'outline' | 'minimal'
type LogoAnimation = 'none' | 'pulse' | 'breathe'

interface LogoBullProps {
  /** Size in pixels */
  size?: number
  /** Logo variant style */
  variant?: LogoVariant
  /** Glow effect */
  glow?: boolean
  /** Animation type */
  animation?: LogoAnimation
  /** Custom color (default: terminal green) */
  color?: string
  /** Additional CSS classes */
  className?: string
}

/**
 * Main Bull Logo - Filled variant
 * Classic bull head in pixel art style
 */
export function LogoBull({
  size = 64,
  variant = 'filled',
  glow = true,
  animation = 'none',
  color = '#33FF33',
  className,
}: LogoBullProps) {
  const dimColor = color === '#33FF33' ? '#1a8c1a' : color
  const bgColor = '#0a0a0a'

  const animationClass = {
    none: '',
    pulse: 'animate-pulse',
    breathe: 'logo-breathe',
  }[animation]

  const glowStyle = glow
    ? {
        filter: `drop-shadow(0 0 8px ${color}) drop-shadow(0 0 16px ${color}80)`,
      }
    : undefined

  if (variant === 'outline') {
    return (
      <svg
        viewBox="0 0 16 16"
        width={size}
        height={size}
        fill="none"
        stroke={color}
        strokeWidth="0"
        className={cn(animationClass, className)}
        style={glowStyle}
      >
        {/* Corna sinistra */}
        <rect x="0" y="2" width="2" height="2" fill={color} />
        <rect x="2" y="4" width="2" height="2" fill={color} />
        {/* Corna destra */}
        <rect x="14" y="2" width="2" height="2" fill={color} />
        <rect x="12" y="4" width="2" height="2" fill={color} />
        {/* Orecchie */}
        <rect x="2" y="6" width="2" height="2" fill={color} />
        <rect x="12" y="6" width="2" height="2" fill={color} />
        {/* Testa - contorno top */}
        <rect x="4" y="4" width="8" height="2" fill={color} />
        {/* Testa - contorno sides */}
        <rect x="4" y="6" width="2" height="4" fill={color} />
        <rect x="10" y="6" width="2" height="4" fill={color} />
        {/* Interno vuoto */}
        <rect x="6" y="6" width="4" height="4" fill={bgColor} />
        {/* Occhi (outline = punti) */}
        <rect x="5" y="7" width="1" height="1" fill={color} />
        <rect x="10" y="7" width="1" height="1" fill={color} />
        {/* Muso - contorno */}
        <rect x="4" y="10" width="2" height="2" fill={color} />
        <rect x="10" y="10" width="2" height="2" fill={color} />
        <rect x="6" y="12" width="4" height="2" fill={color} />
        {/* Narici */}
        <rect x="6" y="11" width="1" height="1" fill={color} />
        <rect x="9" y="11" width="1" height="1" fill={color} />
        {/* Anello naso */}
        <rect x="7" y="13" width="2" height="1" fill={color} />
        <rect x="6" y="14" width="1" height="1" fill={color} />
        <rect x="9" y="14" width="1" height="1" fill={color} />
      </svg>
    )
  }

  if (variant === 'minimal') {
    return (
      <svg
        viewBox="0 0 16 16"
        width={size}
        height={size}
        fill={color}
        className={cn(animationClass, className)}
        style={glowStyle}
      >
        {/* Corna sinistra */}
        <rect x="1" y="2" width="2" height="2" />
        <rect x="3" y="4" width="2" height="2" />
        {/* Corna destra */}
        <rect x="13" y="2" width="2" height="2" />
        <rect x="11" y="4" width="2" height="2" />
        {/* Testa semplificata */}
        <rect x="5" y="5" width="6" height="2" />
        <rect x="4" y="7" width="8" height="4" />
        {/* Occhi */}
        <rect x="5" y="8" width="2" height="2" fill={bgColor} />
        <rect x="9" y="8" width="2" height="2" fill={bgColor} />
        {/* Muso */}
        <rect x="6" y="11" width="4" height="3" />
        {/* Narici */}
        <rect x="7" y="12" width="1" height="1" fill={bgColor} />
        <rect x="8" y="12" width="1" height="1" fill={bgColor} />
      </svg>
    )
  }

  // Default: filled variant
  return (
    <svg
      viewBox="0 0 16 16"
      width={size}
      height={size}
      fill={color}
      className={cn(animationClass, className)}
      style={glowStyle}
    >
      {/* Corna sinistra */}
      <rect x="0" y="2" width="2" height="2" />
      <rect x="2" y="4" width="2" height="2" />
      {/* Corna destra */}
      <rect x="14" y="2" width="2" height="2" />
      <rect x="12" y="4" width="2" height="2" />
      {/* Orecchie */}
      <rect x="2" y="6" width="2" height="2" />
      <rect x="12" y="6" width="2" height="2" />
      {/* Testa - top */}
      <rect x="4" y="4" width="8" height="2" />
      {/* Testa - sides */}
      <rect x="4" y="6" width="2" height="4" />
      <rect x="10" y="6" width="2" height="4" />
      {/* Testa - fill */}
      <rect x="6" y="6" width="4" height="4" fill={dimColor} />
      {/* Occhi */}
      <rect x="5" y="7" width="2" height="2" fill={bgColor} />
      <rect x="9" y="7" width="2" height="2" fill={bgColor} />
      {/* Muso */}
      <rect x="4" y="10" width="8" height="2" />
      <rect x="6" y="12" width="4" height="2" />
      {/* Narici */}
      <rect x="6" y="11" width="1" height="1" fill={bgColor} />
      <rect x="9" y="11" width="1" height="1" fill={bgColor} />
      {/* Anello naso */}
      <rect x="7" y="13" width="2" height="1" />
      <rect x="6" y="14" width="1" height="1" />
      <rect x="9" y="14" width="1" height="1" />
    </svg>
  )
}

/**
 * Animated Bull Logo with continuous glow pulse
 */
export function LogoBullAnimated({
  size = 64,
  variant = 'filled',
  className,
}: Omit<LogoBullProps, 'animation' | 'glow'>) {
  return (
    <div
      className={cn('logo-pulse-glow inline-block', className)}
      style={{
        animation: 'logoPulse 2s ease-in-out infinite',
      }}
    >
      <LogoBull size={size} variant={variant} glow={true} animation="none" />
      <style jsx>{`
        @keyframes logoPulse {
          0%, 100% {
            filter: drop-shadow(0 0 8px #33FF33) drop-shadow(0 0 16px #33FF3380);
          }
          50% {
            filter: drop-shadow(0 0 12px #33FF33) drop-shadow(0 0 24px #33FF33) drop-shadow(0 0 36px #33FF3340);
          }
        }
      `}</style>
    </div>
  )
}

/**
 * Bull Logo with boot/reveal animation
 */
export function LogoBullBoot({
  size = 64,
  variant = 'filled',
  duration = 1500,
  onComplete,
  className,
}: Omit<LogoBullProps, 'animation' | 'glow'> & {
  duration?: number
  onComplete?: () => void
}) {
  return (
    <div
      className={cn('logo-boot inline-block', className)}
      style={{
        animation: `logoBootIn ${duration}ms ease-out forwards`,
      }}
      onAnimationEnd={onComplete}
    >
      <LogoBull size={size} variant={variant} glow={true} />
      <style jsx>{`
        @keyframes logoBootIn {
          0% {
            opacity: 0;
            transform: scale(0.8);
            filter: blur(4px) drop-shadow(0 0 0 #33FF33);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.05);
            filter: blur(0) drop-shadow(0 0 20px #33FF33);
          }
          100% {
            opacity: 1;
            transform: scale(1);
            filter: blur(0) drop-shadow(0 0 8px #33FF33) drop-shadow(0 0 16px #33FF3380);
          }
        }
      `}</style>
    </div>
  )
}

/**
 * Bull Logo with glitch effect on hover
 */
export function LogoBullGlitch({
  size = 64,
  variant = 'filled',
  className,
}: Omit<LogoBullProps, 'animation' | 'glow'>) {
  return (
    <div
      className={cn('logo-glitch inline-block cursor-pointer', className)}
      style={{
        position: 'relative',
      }}
    >
      <LogoBull size={size} variant={variant} glow={true} className="logo-glitch-main" />
      <style jsx>{`
        .logo-glitch:hover {
          animation: glitchShake 0.3s ease-in-out;
        }
        .logo-glitch:hover .logo-glitch-main {
          filter: drop-shadow(0 0 8px #66FF66) drop-shadow(0 0 16px #66FF6680);
        }
        @keyframes glitchShake {
          0%, 100% { transform: translate(0, 0); }
          10% { transform: translate(-2px, 1px); }
          20% { transform: translate(2px, -1px); }
          30% { transform: translate(-1px, 2px); }
          40% { transform: translate(1px, -2px); }
          50% { transform: translate(-2px, -1px); }
          60% { transform: translate(2px, 1px); }
          70% { transform: translate(-1px, -2px); }
          80% { transform: translate(1px, 2px); }
          90% { transform: translate(-2px, 1px); }
        }
      `}</style>
    </div>
  )
}

/**
 * Logo with text "AGENTAURI" next to it
 */
export function LogoBullWithText({
  size = 32,
  variant = 'filled',
  glow = true,
  className,
}: LogoBullProps) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <LogoBull size={size} variant={variant} glow={glow} />
      <span
        className="typo-ui tracking-wider"
        style={{
          color: '#33FF33',
          textShadow: glow ? '0 0 10px #33FF33, 0 0 20px #33FF3380' : undefined,
        }}
      >
        AGENTAURI
      </span>
    </div>
  )
}

export type { LogoBullProps, LogoVariant, LogoAnimation }

import type { CSSProperties } from 'react';

/* ── Store badges ─────────────────────────────────────────────────────────────
 * App Store + Google Play download badges, redrawn as crisp SVG so they scale on
 * the sky without raster fuzz. Standard black pill, white art + wordmark.
 * ──────────────────────────────────────────────────────────────────────────── */

interface BadgeProps {
  href?: string;
  height?: number;
  style?: CSSProperties;
}

const pill = (height: number): CSSProperties => ({
  display: 'inline-flex',
  height,
  borderRadius: height * 0.18,
  overflow: 'hidden',
  transition: 'transform var(--t-micro) var(--ease), box-shadow var(--t-micro) var(--ease)',
  boxShadow: '0 10px 24px -10px rgba(15,55,95,0.55)',
});

function hoverLift(e: React.MouseEvent<HTMLAnchorElement>, on: boolean) {
  e.currentTarget.style.transform = on ? 'translateY(-2px)' : 'translateY(0)';
}

export function AppStoreBadge({ href = 'https://apps.apple.com/', height = 56, style }: BadgeProps) {
  const w = height * 3.0;
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label="Download on the App Store"
      style={{ ...pill(height), ...style }}
      onMouseEnter={(e) => hoverLift(e, true)}
      onMouseLeave={(e) => hoverLift(e, false)}
    >
      <svg width={w} height={height} viewBox="0 0 180 60" role="img" aria-hidden>
        <rect width="180" height="60" rx="11" fill="#1B1A19" />
        <rect x="0.5" y="0.5" width="179" height="59" rx="10.5" fill="none" stroke="#3A3937" />
        {/* Apple logo */}
        <path
          fill="#fff"
          d="M40.6 31.3c0-3.4 2.8-5 2.9-5.1-1.6-2.3-4-2.6-4.9-2.7-2.1-.2-4 1.2-5.1 1.2-1 0-2.7-1.2-4.4-1.2-2.3 0-4.4 1.3-5.5 3.4-2.4 4.1-.6 10.1 1.7 13.4 1.1 1.6 2.4 3.4 4.1 3.3 1.7-.1 2.3-1.1 4.3-1.1s2.6 1.1 4.4 1c1.8 0 3-1.6 4.1-3.2 1.3-1.9 1.8-3.6 1.9-3.7-.1 0-3.5-1.4-3.5-5.3zM37.3 21.3c.9-1.1 1.5-2.7 1.4-4.3-1.3.1-3 .9-4 2-.9 1-1.6 2.6-1.4 4.1 1.5.1 3-.7 4-1.8z"
        />
        {/* text */}
        <text x="55" y="25" fill="#fff" fontFamily="-apple-system, Helvetica, Arial, sans-serif" fontSize="9" letterSpacing="0.5">Download on the</text>
        <text x="55" y="44" fill="#fff" fontFamily="-apple-system, Helvetica, Arial, sans-serif" fontSize="20" fontWeight="600" letterSpacing="-0.4">App Store</text>
      </svg>
    </a>
  );
}

export function GooglePlayBadge({ href = 'https://play.google.com/store', height = 56, style }: BadgeProps) {
  const w = height * 3.0;
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label="Get it on Google Play"
      style={{ ...pill(height), ...style }}
      onMouseEnter={(e) => hoverLift(e, true)}
      onMouseLeave={(e) => hoverLift(e, false)}
    >
      <svg width={w} height={height} viewBox="0 0 180 60" role="img" aria-hidden>
        <rect width="180" height="60" rx="11" fill="#1B1A19" />
        <rect x="0.5" y="0.5" width="179" height="59" rx="10.5" fill="none" stroke="#3A3937" />
        {/* Play triangle */}
        <g transform="translate(22 17)">
          <path fill="#00D3FF" d="M0 1.3v23.4c0 .9.9 1.4 1.6 1L13 19 1.6.3C.9-.1 0 .4 0 1.3z" />
          <path fill="#00F076" d="M1.6.3 13 19l4.5-4.5L4.2-.4C3.2-1 2.2-.3 1.6.3z" />
          <path fill="#FFCE00" d="M13 19l-1.7 6.4 9.1-5.2c1.1-.6 1.1-2.2 0-2.9l-2.9-1.7L13 19z" />
          <path fill="#FF3A44" d="M1.6 25.7c.6.6 1.6.7 2.6.1l13.3-7.6L13 13.7 1.6 25.7z" />
        </g>
        <text x="55" y="25" fill="#fff" fontFamily="-apple-system, Helvetica, Arial, sans-serif" fontSize="9" letterSpacing="1.2">GET IT ON</text>
        <text x="55" y="44" fill="#fff" fontFamily="-apple-system, Helvetica, Arial, sans-serif" fontSize="19" fontWeight="600" letterSpacing="-0.3">Google Play</text>
      </svg>
    </a>
  );
}

export function StoreBadges({ height = 56, style, className }: { height?: number; style?: CSSProperties; className?: string }) {
  return (
    <div className={className} style={{ display: 'flex', gap: '0.9rem', flexWrap: 'wrap', alignItems: 'center', ...style }}>
      <AppStoreBadge height={height} />
      <GooglePlayBadge height={height} />
    </div>
  );
}

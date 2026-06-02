import type { CSSProperties } from 'react';

/* ── CloudIcon ────────────────────────────────────────────────────────────────
 * The brand's "screen-in-sky" ad treatment, recreated for the web: a soft cloud
 * squircle (PIL-composited from the brand sky photo → /brand/icons/cloud-*.png)
 * with a crisp flat app glyph floating in front. The glyph stays vector so it is
 * sharp at any DPI; the cloud stays photographic. Gentle perpetual float (CSS,
 * compositor-only). One component, many apps - consistent, scalable.
 * ──────────────────────────────────────────────────────────────────────────── */

export type AppGlyph = 'whatsapp' | 'slack' | 'messages' | 'notes' | 'mail' | 'gmail';

/* Flat app glyphs - drawn to read at ~56–96px, each on a transparent ground. */
const GLYPHS: Record<AppGlyph, React.ReactNode> = {
  whatsapp: (
    <svg viewBox="0 0 64 64" width="100%" height="100%" aria-hidden>
      <circle cx="32" cy="32" r="30" fill="#25D366" />
      <path
        fill="#fff"
        d="M32 13.5c-10.2 0-18.5 8.3-18.5 18.5 0 3.3.9 6.5 2.5 9.3L13.5 50.5l9.5-2.5c2.7 1.5 5.8 2.3 9 2.3 10.2 0 18.5-8.3 18.5-18.5S42.2 13.5 32 13.5z"
      />
      <path
        fill="#25D366"
        d="M32 16.8c8.4 0 15.2 6.8 15.2 15.2S40.4 47.2 32 47.2c-2.9 0-5.7-.8-8.1-2.3l-.6-.3-5.6 1.5 1.5-5.5-.4-.6a15 15 0 0 1-2.3-8c0-8.4 6.8-15.2 15.5-15.2z"
      />
      <path
        fill="#fff"
        d="M26.3 24.2c-.4-.9-.8-.9-1.1-.9h-1c-.3 0-.9.1-1.4.7-.5.5-1.8 1.8-1.8 4.4s1.9 5.1 2.1 5.5c.3.4 3.7 5.9 9.1 8 4.5 1.8 5.4 1.4 6.4 1.3 1-.1 3.2-1.3 3.6-2.6.5-1.3.5-2.4.3-2.6-.1-.2-.5-.4-1-.6-.5-.3-3.2-1.6-3.7-1.8-.5-.2-.9-.3-1.2.3-.4.5-1.4 1.7-1.7 2.1-.3.4-.6.4-1.2.1-.5-.3-2.3-.8-4.3-2.7-1.6-1.4-2.7-3.1-3-3.7-.3-.5 0-.8.2-1.1.2-.2.5-.6.8-.9.2-.3.3-.5.5-.9.2-.4.1-.7 0-.9-.1-.3-1.1-2.8-1.5-3.7z"
      />
    </svg>
  ),
  slack: (
    <svg viewBox="0 0 64 64" width="100%" height="100%" aria-hidden>
      <g>
        <path fill="#36C5F0" d="M22.6 33.4a4.7 4.7 0 1 1-4.7-4.7h4.7v4.7z" />
        <path fill="#36C5F0" d="M25 33.4a4.7 4.7 0 0 1 9.4 0v11.8a4.7 4.7 0 1 1-9.4 0V33.4z" />
        <path fill="#2EB67D" d="M29.7 22.6a4.7 4.7 0 1 1 4.7-4.7v4.7h-4.7z" />
        <path fill="#2EB67D" d="M29.7 25a4.7 4.7 0 0 1 0 9.4H17.9a4.7 4.7 0 1 1 0-9.4h11.8z" />
        <path fill="#ECB22E" d="M40.5 29.7a4.7 4.7 0 1 1 4.7 4.7h-4.7v-4.7z" />
        <path fill="#ECB22E" d="M38.1 29.7a4.7 4.7 0 0 1-9.4 0V17.9a4.7 4.7 0 1 1 9.4 0v11.8z" />
        <path fill="#E01E5A" d="M33.4 40.5a4.7 4.7 0 1 1-4.7 4.7v-4.7h4.7z" />
        <path fill="#E01E5A" d="M33.4 38.1a4.7 4.7 0 0 1 0-9.4h11.8a4.7 4.7 0 1 1 0 9.4H33.4z" />
      </g>
    </svg>
  ),
  messages: (
    <svg viewBox="0 0 64 64" width="100%" height="100%" aria-hidden>
      <defs>
        <linearGradient id="cm-msg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5BF675" />
          <stop offset="1" stopColor="#1FAD3A" />
        </linearGradient>
      </defs>
      <path
        fill="url(#cm-msg)"
        d="M32 8C18.7 8 8 17.4 8 29c0 6.6 3.5 12.5 9 16.3-.6 2.9-2 5.7-4 8 .1.4.4.7.8.7 3.8-.2 7.4-1.6 10.4-3.6 2.5.7 5.1 1.1 7.8 1.1 13.3 0 24-9.4 24-21S45.3 8 32 8z"
      />
    </svg>
  ),
  notes: (
    <svg viewBox="0 0 64 64" width="100%" height="100%" aria-hidden>
      <rect x="9" y="8" width="46" height="48" rx="9" fill="#FEFBEF" />
      <path d="M9 17a9 9 0 0 1 9-9h28a9 9 0 0 1 9 9v3H9v-3z" fill="#FFD159" />
      <g stroke="#E7C778" strokeWidth="2.4" strokeLinecap="round">
        <line x1="17" y1="30" x2="47" y2="30" />
        <line x1="17" y1="38" x2="47" y2="38" />
        <line x1="17" y1="46" x2="37" y2="46" />
      </g>
    </svg>
  ),
  mail: (
    <svg viewBox="0 0 64 64" width="100%" height="100%" aria-hidden>
      <defs>
        <linearGradient id="cm-mail" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2AA9FF" />
          <stop offset="1" stopColor="#0A7CEB" />
        </linearGradient>
      </defs>
      <rect x="7" y="13" width="50" height="38" rx="9" fill="url(#cm-mail)" />
      <path
        fill="none"
        stroke="#fff"
        strokeWidth="3"
        strokeLinejoin="round"
        strokeLinecap="round"
        d="M13 21l19 15 19-15"
      />
    </svg>
  ),
  gmail: (
    <svg viewBox="0 0 64 64" width="100%" height="100%" aria-hidden>
      <rect x="8" y="14" width="48" height="36" rx="6" fill="#fff" />
      <path fill="#EA4335" d="M8 20a6 6 0 0 1 6-6h2l16 12L48 14h2a6 6 0 0 1 6 6l-24 18L8 20z" />
      <path fill="#34A853" d="M8 20v24a6 6 0 0 0 6 6h6V24l-12-9z" opacity="0" />
      <path fill="#4285F4" d="M50 50h-6V24l12-9v29a6 6 0 0 1-6 6z" />
      <path fill="#34A853" d="M14 50h6V24L8 20v24a6 6 0 0 0 6 6z" />
      <path fill="#FBBC04" d="M8 20l24 18V26L20 17l-6-3a6 6 0 0 0-6 6z" opacity="0" />
    </svg>
  ),
};

interface CloudIconProps {
  app: AppGlyph;
  /** Cloud texture variant 1–4 (/brand/icons/cloud-N.png). */
  cloud?: 1 | 2 | 3 | 4;
  /** Rendered box size in px (responsive caller can override via style). */
  size?: number;
  /** Glyph size as a fraction of the box (default 0.46). */
  glyphScale?: number;
  /** Float animation delay (s) so a cluster drifts out of phase. */
  delay?: number;
  /** Float duration (s). */
  duration?: number;
  style?: CSSProperties;
  className?: string;
}

export function CloudIcon({
  app,
  cloud = 1,
  size = 96,
  glyphScale = 0.46,
  delay = 0,
  duration = 7,
  style,
  className,
}: CloudIconProps) {
  return (
    <div
      className={`cloud-icon${className ? ` ${className}` : ''}`}
      style={{
        width: size,
        height: size,
        position: 'relative',
        backgroundImage: `url('/brand/icons/cloud-${cloud}.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: 'drop-shadow(0 18px 26px rgba(20,70,120,0.28))',
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`,
        ...style,
      }}
      aria-hidden
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            width: `${glyphScale * 100}%`,
            height: `${glyphScale * 100}%`,
            filter: 'drop-shadow(0 4px 6px rgba(20,60,110,0.30))',
          }}
        >
          {GLYPHS[app]}
        </div>
      </div>
    </div>
  );
}

import type { CSSProperties } from 'react';

interface WordmarkProps {
  style?: CSSProperties;
  small?: boolean;
}

/**
 * Pocket Voice wordmark. Geometric sub-mark + setwidth-tight wordmark.
 * Not a microphone. Not a soundwave. A precision dot inside an aperture —
 * the moment voice becomes language.
 */
export function Wordmark({ style, small }: WordmarkProps) {
  const size = small ? 18 : 22;
  return (
    <span
      aria-label="Pocket Voice"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.6rem',
        fontWeight: 500,
        letterSpacing: '-0.02em',
        fontSize: small ? 'var(--step--1)' : 'var(--step-0)',
        ...style,
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 22 22"
        fill="none"
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="10" stroke="currentColor" strokeOpacity="0.4" />
        <circle cx="11" cy="11" r="6" stroke="currentColor" strokeOpacity="0.7" />
        <circle cx="11" cy="11" r="2.6" fill="currentColor" />
      </svg>
      <span>
        Pocket <span style={{ color: 'var(--ink-1)' }}>Voice</span>
      </span>
    </span>
  );
}

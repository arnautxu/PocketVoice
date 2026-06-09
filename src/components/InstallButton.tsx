import type { CSSProperties } from 'react';

interface InstallButtonProps {
  size?: 'sm' | 'lg';
  label?: string;
  href?: string;
  /** For use on a blue/dark surface: Paper button, Blue Deep text. */
  inverted?: boolean;
  /** Show the Apple glyph before the label (default on — every CTA is an App Store download). */
  apple?: boolean;
  style?: CSSProperties;
}

/** Apple logo glyph — sits before the label, matching the Wispr/App-Store download button. */
function AppleMark({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 384 512"
      fill="currentColor"
      aria-hidden
      style={{ flexShrink: 0, marginTop: '-0.12em' }}
    >
      <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
    </svg>
  );
}

/**
 * Primary CTA - the Blue + Paper brand moment (Manual v6 pairings).
 *
 * Default: Pocket Blue background, Paper text, a soft lifting border + Apple glyph
 * (Wispr-style). Hover deepens to Blue Deep. Press: scale(0.97) (emil-design-eng).
 * Only one primary button should be visible per viewport at any time.
 */
export function InstallButton({
  size = 'lg',
  label = 'Download for iPhone',
  href = 'https://apps.apple.com/',
  inverted = false,
  apple = true,
  style,
}: InstallButtonProps) {
  const isLg = size === 'lg';

  const base = inverted ? 'var(--pv-paper)' : 'var(--pv-blue)';
  const baseText = inverted ? 'var(--pv-blue-deep)' : 'var(--pv-paper)';
  const hover = inverted ? 'var(--pv-fog)' : 'var(--pv-blue-deep)';
  // a soft contrasting hairline so the button lifts off the photographic sky
  const edge = inverted ? 'rgba(11,24,41,0.10)' : 'rgba(255,255,255,0.30)';
  const edgeHover = inverted ? 'rgba(11,24,41,0.16)' : 'rgba(255,255,255,0.42)';

  return (
    <a
      className="pv-cta"
      href={href}
      target="_blank"
      rel="noreferrer"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: isLg ? '0.7ch' : '0.55ch',
        padding: isLg ? '0.8ch 2.2ch' : '0.5ch 1.5ch',
        background: base,
        color: baseText,
        fontFamily: 'var(--font-text)',
        fontSize: isLg ? 'var(--step-0)' : 'var(--step--1)',
        fontWeight: 600,
        letterSpacing: '0.01em',
        border: `1px solid ${edge}`,
        borderRadius: '0.6ch',
        boxShadow: inverted ? 'none' : 'var(--shadow-blue)',
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        transition: `background var(--t-micro) var(--ease),
                     border-color var(--t-micro) var(--ease),
                     transform var(--t-micro) var(--ease)`,
        ...style,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = hover;
        e.currentTarget.style.borderColor = edgeHover;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = base;
        e.currentTarget.style.borderColor = edge;
      }}
    >
      {apple && <AppleMark size={isLg ? 17 : 14} />}
      {label}
    </a>
  );
}

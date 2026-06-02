import type { CSSProperties } from 'react';

interface InstallButtonProps {
  size?: 'sm' | 'lg';
  label?: string;
  href?: string;
  /** For use on a blue/dark surface: Paper button, Blue Deep text. */
  inverted?: boolean;
  style?: CSSProperties;
}

/**
 * Primary CTA - the Blue + Paper brand moment (Manual v6 pairings).
 *
 * Default: Pocket Blue background, Paper text. Hover deepens to Blue Deep.
 * Press: scale(0.97) for tactile feedback (emil-design-eng).
 * Only one primary button should be visible per viewport at any time.
 */
export function InstallButton({
  size = 'lg',
  label = 'Download for iPhone',
  href = 'https://apps.apple.com/',
  inverted = false,
  style,
}: InstallButtonProps) {
  const isLg = size === 'lg';

  const base = inverted ? 'var(--pv-paper)' : 'var(--pv-blue)';
  const baseText = inverted ? 'var(--pv-blue-deep)' : 'var(--pv-paper)';
  const hover = inverted ? 'var(--pv-fog)' : 'var(--pv-blue-deep)';

  return (
    <a
      className="pv-cta"
      href={href}
      target="_blank"
      rel="noreferrer"
      style={{
        display: 'inline-block',
        padding: isLg ? '0.8ch 2.5ch' : '0.5ch 1.75ch',
        background: base,
        color: baseText,
        fontFamily: 'var(--font-text)',
        fontSize: isLg ? 'var(--step-0)' : 'var(--step--1)',
        fontWeight: 500,
        letterSpacing: '0.01em',
        border: `1px solid ${base}`,
        borderRadius: '0.5ch',
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
        e.currentTarget.style.borderColor = hover;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = base;
        e.currentTarget.style.borderColor = base;
      }}
    >
      {label}
    </a>
  );
}

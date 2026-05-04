import type { CSSProperties } from 'react';

interface InstallButtonProps {
  size?: 'sm' | 'lg';
  label?: string;
  href?: string;
  style?: CSSProperties;
}

/**
 * Primary CTA — the one permitted Signal Blue moment on the marketing page.
 *
 * Default: paper background, ink text (clean, high-contrast).
 * Hover/active: Signal Blue background, paper text (one brand-maximum moment).
 *
 * Only one primary button should be visible per viewport at any time.
 * Color rules are baked in — do not override via style prop.
 */
export function InstallButton({
  size = 'lg',
  label = 'Download for iPhone',
  href = 'https://apps.apple.com/',
  style,
}: InstallButtonProps) {
  const isLg = size === 'lg';

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      style={{
        display: 'inline-block',
        padding: isLg ? '0.7ch 2.5ch' : '0.4ch 1.75ch',
        background: 'var(--color-paper)',
        color: 'var(--color-ink)',
        fontFamily: 'var(--font-mono)',
        fontSize: isLg ? 'var(--step-0)' : 'var(--step--1)',
        fontWeight: 400,
        letterSpacing: '0.02em',
        border: '1px solid var(--color-paper)',
        borderRadius: 0,
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        transition: `background var(--t-micro) var(--ease),
                     color var(--t-micro) var(--ease),
                     border-color var(--t-micro) var(--ease)`,
        ...style,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'var(--color-signal)';
        e.currentTarget.style.color = 'var(--color-paper)';
        e.currentTarget.style.borderColor = 'var(--color-signal)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'var(--color-paper)';
        e.currentTarget.style.color = 'var(--color-ink)';
        e.currentTarget.style.borderColor = 'var(--color-paper)';
      }}
    >
      {label}
    </a>
  );
}

import type { CSSProperties } from 'react';

interface CaretProps {
  /** Whether the caret is actively blinking. Defaults to true. */
  active?: boolean;
  style?: CSSProperties;
}

/**
 * The central brand element. A text-insertion caret.
 *
 * Rules:
 * - Use at insertion points: before empty states, in typewriter sequences.
 * - Use as brand signature: |Pocket Voice (via <Wordmark />).
 * - Never decorative. Never multiple on screen unless all are insertion points.
 *
 * Blink cycle: 1.2s total - fade-in 200ms, hold 400ms, fade-out 200ms, hold 400ms.
 * Color: var(--color-signal) - Signal Blue #1F44FF. One of the only two allowed uses.
 */
export function Caret({ active = true, style }: CaretProps) {
  return (
    <span
      aria-hidden="true"
      style={{
        display: 'inline-block',
        width: 'var(--caret-width, 2px)',
        height: '0.8em',
        background: 'var(--color-signal)',
        verticalAlign: 'baseline',
        position: 'relative',
        top: '0.05em',
        flexShrink: 0,
        animation: active ? 'pv-caret 1.2s linear infinite' : 'none',
        opacity: active ? undefined : 1,
        ...style,
      }}
    />
  );
}

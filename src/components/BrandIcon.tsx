import type { CSSProperties } from 'react';

interface BrandIconProps {
  style?: CSSProperties;
  size?: number | string;
  /** Inverted: dark mark on white circular background — for use on dark surfaces */
  inverted?: boolean;
}

/**
 * The Pocket Voice mark — geometric "P" from Icon.svg.
 *
 * Default: inherits currentColor (use on light backgrounds).
 * Inverted: black mark on white circle (use on dark backgrounds as app icon).
 */
export function BrandIcon({ style, size = '2rem', inverted = false }: BrandIconProps) {
  if (inverted) {
    return (
      <span
        aria-hidden="true"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: size,
          height: size,
          borderRadius: '50%',
          background: 'var(--color-paper)',
          flexShrink: 0,
          ...style,
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512.1 512.1"
          fill="var(--surface-0)"
          aria-hidden="true"
          style={{ width: '58%', height: '58%' }}
        >
          <path d="M228.3,512.1v-178.6c-10,0-19.8-.9-29.6-2.6-9.8-1.7-19.1-4.7-27.9-8.9-8.8-4.2-16.9-9.8-24.1-16.7-7.3-6.9-13.3-14.7-18.1-23.5-4.8-8.8-8-18.1-9.8-27.9-1.7-9.8-2.6-19.6-2.6-29.6s.9-19.8,2.6-29.6c1.7-9.8,5-18.9,9.8-27.6,4.8-8.6,10.8-16.4,18.1-23.3,7.3-6.9,15.3-12.4,24.1-16.7,8.8-4.2,18.1-7.2,27.9-8.9,9.8-1.7,19.6-2.6,29.6-2.6h134.9v396.2h-45.4V154.4h-44.2v357.8h-45.4Z" />
        </svg>
      </span>
    );
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512.1 512.1"
      fill="var(--color-signal)"
      aria-hidden="true"
      style={{ width: size, height: size, flexShrink: 0, ...style }}
    >
      <path d="M228.3,512.1v-178.6c-10,0-19.8-.9-29.6-2.6-9.8-1.7-19.1-4.7-27.9-8.9-8.8-4.2-16.9-9.8-24.1-16.7-7.3-6.9-13.3-14.7-18.1-23.5-4.8-8.8-8-18.1-9.8-27.9-1.7-9.8-2.6-19.6-2.6-29.6s.9-19.8,2.6-29.6c1.7-9.8,5-18.9,9.8-27.6,4.8-8.6,10.8-16.4,18.1-23.3,7.3-6.9,15.3-12.4,24.1-16.7,8.8-4.2,18.1-7.2,27.9-8.9,9.8-1.7,19.6-2.6,29.6-2.6h134.9v396.2h-45.4V154.4h-44.2v357.8h-45.4Z" />
    </svg>
  );
}

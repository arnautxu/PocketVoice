import type { CSSProperties } from 'react';

/**
 * Pocket Voice symbol - the official engineered mark (Brand Manual v6).
 * Vector taken verbatim from the brand deliverable (…/Logo · *_Icon.svg) and
 * recolored to `currentColor` so it themes from a single source.
 *
 * viewBox 0 0 165 244.6 · stem + radiating "voice" rays.
 */

interface SymbolProps {
  size?: number | string;
  color?: string;
  title?: string;
  style?: CSSProperties;
}

/** The bare mark. Inherits `color` (default Pocket Blue). */
export function BrandSymbol({ size = '2rem', color = 'var(--pv-blue)', title, style }: SymbolProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 165 244.6"
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      fill="currentColor"
      style={{ height: size, width: 'auto', display: 'block', flexShrink: 0, color, ...style }}
    >
      <path d="M75.2,74.1c6.7,3.6,12.2,9,15.9,15.6l62.6-36.8-9.7-9.8-54.7,33.1-1-1,33.6-54.3-9.7-9.8-37.6,62.5.4.4Z" />
      <path d="M164.9,93.4v-13.7c0,0-70.5,17.5-70.5,17.5,1.1,3.7,1.8,7.6,1.8,11.6s-.6,7.8-1.7,11.4l70.2,18.3v-13.7c0,0-62-15.3-62-15.3v-1.4s62.2-14.6,62.2-14.6Z" />
      <path d="M75,143.6l36.9,62.9,9.8-9.7-33-54.7,1-1,54.3,33.7,9.8-9.7-62.4-37.6c-3.7,6.8-9.4,12.4-16.3,16Z" />
      <polygon points="36.2 146.8 66.3 146.9 67.6 146.9 85.2 217.7 71.4 217.6 56.9 155.4 55.4 155.4 49.2 244.6 0 244.6 0 0 50.1 0 55.2 62.2 56.6 62.2 72 0 85.7 0 67.3 70.8 66.8 70.8 36.2 70.8 36.2 89.7 36.2 127.6 36.2 146.8" />
    </svg>
  );
}

interface BrandIconProps {
  size?: number | string;
  color?: string;
  /** Render inside an iOS squircle tile (app-icon treatment). */
  squircle?: boolean;
  /** Squircle fill - default Pocket Blue; mark becomes Paper. */
  tile?: string;
  title?: string;
  style?: CSSProperties;
}

/**
 * BrandIcon - the symbol, optionally in an iOS app-icon tile.
 * `squircle`: Pocket-Blue squircle, Paper symbol at 58% (Manual v6 · 06.1).
 */
export function BrandIcon({
  size = '2rem',
  color = 'var(--pv-blue)',
  squircle = false,
  tile = 'var(--pv-blue)',
  title,
  style,
}: BrandIconProps) {
  if (!squircle) return <BrandSymbol size={size} color={color} title={title} style={style} />;

  return (
    <span
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : undefined}
      aria-label={title}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: size,
        height: size,
        borderRadius: '22.37%', // iOS squircle approximation
        background: tile,
        flexShrink: 0,
        ...style,
      }}
    >
      <BrandSymbol size="58%" color="var(--pv-paper)" />
    </span>
  );
}

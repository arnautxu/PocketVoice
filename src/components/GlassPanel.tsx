import type { CSSProperties, ReactNode, Ref } from 'react';
import GlassSurface from './GlassSurface';

/* ── GlassPanel ───────────────────────────────────────────────────────────────
 * Adapter that drops React Bits' GlassSurface onto our full-width content
 * panels. GlassSurface owns the refractive glass (SVG displacement in Chromium,
 * frosted-blur fallback elsewhere); the inner wrapper owns the section's own
 * grid/padding layout — so swapping a panel is just changing its wrapper tag.
 * `reveal` (GSAP one-shot) rides on the GlassSurface container.
 * ──────────────────────────────────────────────────────────────────────────── */
interface GlassPanelProps {
  children: ReactNode;
  /** classes for the glass container (e.g. "reveal"). */
  className?: string;
  /** classes for the inner layout wrapper (e.g. "speak-grid"). */
  innerClassName?: string;
  /** the section's layout styles (grid / padding) — applied to the inner wrapper. */
  innerStyle?: CSSProperties;
  /** ref onto the inner wrapper (for in-view observers that targeted the panel). */
  innerRef?: Ref<HTMLDivElement>;
  /** Blue brand-moment variant (FromPocket). */
  blue?: boolean;
  borderRadius?: number;
  id?: string;
}

export function GlassPanel({
  children,
  className = '',
  innerClassName,
  innerStyle,
  innerRef,
  blue = false,
  borderRadius = 28,
  id,
}: GlassPanelProps) {
  return (
    <GlassSurface
      width="100%"
      height="auto"
      borderRadius={borderRadius}
      backgroundOpacity={blue ? 0 : 0.18}
      saturation={1.4}
      blur={11}
      className={`glass-surface--panel${blue ? ' glass-surface--blue' : ''} ${className}`}
    >
      <div id={id} ref={innerRef} className={innerClassName} style={{ width: '100%', ...innerStyle }}>
        {children}
      </div>
    </GlassSurface>
  );
}

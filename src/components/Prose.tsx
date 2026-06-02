import type { CSSProperties, ReactNode } from 'react';

/**
 * Long-form editorial content wrapper.
 * Applies Inter (font-sans) internally.
 * Any <code>, <kbd>, or <pre> inside automatically renders in IoskeleyMono.
 * Any <TranscriptionDisplay> inside also overrides back to mono - see that component.
 *
 * USE ONLY FOR:
 * - Blog post bodies (>80 words)
 * - Article / documentation content
 * - Case study narratives
 * - Changelog entries
 *
 * DO NOT USE FOR:
 * - Headlines (use <Heading />)
 * - CTAs or buttons (use <Button />)
 * - Nav items - always mono
 * - Any content that carries the brand voice
 */
interface ProseProps {
  children: ReactNode;
  style?: CSSProperties;
  className?: string;
}

export function Prose({ children, style, className }: ProseProps) {
  return (
    <div
      className={`prose${className ? ` ${className}` : ''}`}
      style={style}
    >
      {children}
    </div>
  );
}

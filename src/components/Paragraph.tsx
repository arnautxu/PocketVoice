import type { CSSProperties, ReactNode } from 'react';

interface ParagraphProps {
  children: ReactNode;
  style?: CSSProperties;
  /** Override the pilcrow color. Defaults to var(--ink-2). */
  pilcrowColor?: string;
}

/**
 * A paragraph block that appends ¶ (pilcrow) at the end.
 *
 * Rules:
 * - Use ¶ only at the end of a real paragraph block. Never decoratively.
 * - Use ⏎ (not rendered by this component) for line breaks within a related block.
 * - Max prose width: 65ch.
 */
export function Paragraph({ children, style, pilcrowColor = 'var(--ink-2)' }: ParagraphProps) {
  return (
    <p
      style={{
        margin: 0,
        maxWidth: 'var(--max-prose, 65ch)',
        lineHeight: 1.6,
        ...style,
      }}
    >
      {children}
      <span
        aria-hidden="true"
        style={{
          color: pilcrowColor,
          marginLeft: '0.15ch',
          userSelect: 'none',
        }}
      >
        ¶
      </span>
    </p>
  );
}

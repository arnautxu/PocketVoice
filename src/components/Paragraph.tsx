import type { CSSProperties, ReactNode } from 'react';

interface ParagraphProps {
  children: ReactNode;
  style?: CSSProperties;
}

/**
 * A prose paragraph block - Satoshi, capped at 65ch for comfortable reading.
 */
export function Paragraph({ children, style }: ParagraphProps) {
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
    </p>
  );
}

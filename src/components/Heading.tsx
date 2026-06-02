import type { CSSProperties, ReactNode } from 'react';

/**
 * Brand-locked heading. H1–H3 render in Erode (display serif); level 4 in
 * Satoshi Medium (text), per Brand Manual v6 scale (Erode tops the scale,
 * Satoshi handles everything below H3).
 */
interface HeadingProps {
  level?: 1 | 2 | 3 | 4;
  children: ReactNode;
  style?: CSSProperties;
  className?: string;
  id?: string;
}

const sizeMap: Record<NonNullable<HeadingProps['level']>, string> = {
  1: 'var(--step-5)',
  2: 'var(--step-3)',
  3: 'var(--step-2)',
  4: 'var(--step-1)',
};

const weightMap: Record<NonNullable<HeadingProps['level']>, number> = {
  1: 400,
  2: 400,
  3: 400,
  4: 500,
};

export function Heading({ level = 2, children, style, className, id }: HeadingProps) {
  const Tag = (`h${level}`) as 'h1' | 'h2' | 'h3' | 'h4';

  return (
    <Tag
      id={id}
      className={className}
      style={{
        fontFamily: level === 4 ? 'var(--font-text)' : 'var(--font-display)',
        fontSize: sizeMap[level],
        fontWeight: weightMap[level],
        lineHeight: 1.1,
        letterSpacing: level === 4 ? '0' : '-0.015em',
        color: 'var(--ink-0)',
        margin: 0,
        ...style,
      }}
    >
      {children}
    </Tag>
  );
}

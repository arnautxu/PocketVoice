import type { CSSProperties, ReactNode } from 'react';

/**
 * Brand-locked heading.
 * Always renders in IoskeleyMono — no override is possible.
 * Use for all marketing headlines and section titles.
 * Never apply font-sans to a heading; that's an anti-pattern per the type system.
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
        fontFamily: 'var(--font-mono)',
        fontSize: sizeMap[level],
        fontWeight: weightMap[level],
        lineHeight: 1.1,
        letterSpacing: '-0.02em',
        color: 'var(--ink-0)',
        margin: 0,
        ...style,
      }}
    >
      {children}
    </Tag>
  );
}

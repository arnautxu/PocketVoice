import type { CSSProperties, ReactNode } from 'react';

/**
 * Small utility text at 10–12px.
 * One of the few legitimate uses of Inter in the Pocket Voice type system.
 *
 * USE FOR:
 * - Tooltips
 * - Form field labels and helper text
 * - Error messages
 * - Timestamps and metadata (dates, counts, file sizes)
 *
 * DO NOT USE FOR:
 * - Branded small text (stat labels, feature labels in pricing - those stay mono)
 * - Nav items or CTA text - always mono regardless of size
 * - Any copy that touches brand identity
 */
interface MicrocopyProps {
  children: ReactNode;
  as?: 'span' | 'p' | 'label' | 'small' | 'time';
  style?: CSSProperties;
  className?: string;
  htmlFor?: string;
}

export function Microcopy({ children, as: Tag = 'span', style, className, htmlFor }: MicrocopyProps) {
  return (
    <Tag
      className={className}
      htmlFor={Tag === 'label' ? htmlFor : undefined}
      style={{
        fontFamily: 'var(--font-sans)',
        fontSize: 'var(--step--1)',
        lineHeight: 1.5,
        color: 'var(--ink-2)',
        ...style,
      }}
    >
      {children}
    </Tag>
  );
}

import type { CSSProperties, ReactNode } from 'react';

/**
 * Renders user-transcribed text - the literal output of Pocket Voice.
 * Always IoskeleyMono. Even inside a <Prose> container, this overrides back to mono.
 * This is the product output and must carry the brand signature without exception.
 *
 * The !important on font-mono ensures the prose container's font-sans
 * cannot bleed into transcription text.
 */
interface TranscriptionDisplayProps {
  children: ReactNode;
  /** Visual variant: 'raw' for spoken input, 'polished' for composed output */
  variant?: 'raw' | 'polished';
  style?: CSSProperties;
  className?: string;
}

export function TranscriptionDisplay({
  children,
  variant = 'polished',
  style,
  className,
}: TranscriptionDisplayProps) {
  return (
    <span
      className={`font-mono${className ? ` ${className}` : ''}`}
      style={{
        fontFamily: 'var(--font-mono)',
        fontSize: variant === 'polished' ? 'var(--step-1)' : 'var(--step-0)',
        lineHeight: variant === 'polished' ? 1.4 : 1.5,
        letterSpacing: variant === 'polished' ? '-0.01em' : 0,
        color: variant === 'polished' ? 'var(--ink-0)' : 'var(--ink-1)',
        ...style,
      }}
    >
      {children}
    </span>
  );
}

import { ArrowUpRight } from '@phosphor-icons/react';
import { motion } from 'framer-motion';

interface InstallButtonProps {
  size?: 'sm' | 'lg';
  label?: string;
  href?: string;
}

export function InstallButton({
  size = 'lg',
  label = 'Get Pocket Voice',
  href = 'https://apps.apple.com/',
}: InstallButtonProps) {
  const isLg = size === 'lg';

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noreferrer"
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 320, damping: 22 }}
      className="install"
      data-size={size}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: isLg ? '0.875rem' : '0.5rem',
        padding: isLg ? '0.95rem 1.4rem' : '0.55rem 0.95rem',
        background: 'var(--ink-0)',
        color: 'var(--surface-0)',
        borderRadius: '999px',
        fontSize: isLg ? 'var(--step-0)' : 'var(--step--1)',
        fontWeight: 500,
        letterSpacing: '-0.01em',
        boxShadow:
          'inset 0 1px 0 rgba(255,255,255,0.6), 0 1px 0 oklch(0.05 0.01 270 / 0.6), 0 12px 32px -12px oklch(0.05 0.01 270 / 0.7)',
        transition: 'transform var(--t-quick) var(--ease-out)',
        willChange: 'transform',
      }}
    >
      <span style={{ position: 'relative', display: 'inline-block' }}>
        <span aria-hidden style={{ marginRight: '0.55em', fontSize: '0.95em' }}>
          {/* Geometric sub-mark — not a microphone, not an Apple logo. */}
          <svg
            width={isLg ? 14 : 12}
            height={isLg ? 14 : 12}
            viewBox="0 0 14 14"
            fill="none"
          >
            <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.4" opacity="0.35" />
            <circle cx="7" cy="7" r="2.2" fill="currentColor" />
          </svg>
        </span>
        {label}
      </span>
      <ArrowUpRight size={isLg ? 16 : 14} weight="bold" />
    </motion.a>
  );
}

import { ArrowUpRight } from '@phosphor-icons/react';
import { motion } from 'framer-motion';

interface InstallButtonProps {
  size?: 'sm' | 'lg';
  label?: string;
  href?: string;
}

export function InstallButton({
  size = 'lg',
  label = 'Download for iPhone',
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
        gap: isLg ? '0.7rem' : '0.5rem',
        padding: isLg ? '0.85rem 1.35rem 0.85rem 1.05rem' : '0.5rem 1rem 0.5rem 0.75rem',
        background: 'var(--ink-0)',
        color: 'var(--surface-0)',
        borderRadius: '999px',
        fontSize: isLg ? 'var(--step-0)' : 'calc(var(--step--1) * 0.95)',
        fontWeight: 500,
        letterSpacing: '-0.012em',
        boxShadow:
          'inset 0 1px 0 oklch(1 0 0 / 0.55), 0 1px 0 oklch(0.04 0.01 264 / 0.6), 0 18px 36px -18px oklch(0.04 0.01 264 / 0.85)',
        transition: 'transform var(--t-quick) var(--ease-out)',
        willChange: 'transform',
      }}
    >
      <span aria-hidden style={{ display: 'inline-flex' }}>
        {/* Geometric sub-mark — not a microphone, not an Apple logo. */}
        <svg
          width={isLg ? 14 : 12}
          height={isLg ? 14 : 12}
          viewBox="0 0 14 14"
          fill="none"
        >
          <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.2" opacity="0.3" />
          <circle cx="7" cy="7" r="3.6" stroke="currentColor" strokeWidth="1.2" opacity="0.55" />
          <circle cx="7" cy="7" r="1.6" fill="currentColor" />
        </svg>
      </span>
      <span>{label}</span>
      <ArrowUpRight size={isLg ? 15 : 13} weight="bold" />
    </motion.a>
  );
}

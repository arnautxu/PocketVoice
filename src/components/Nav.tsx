import { motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { useState } from 'react';
import { InstallButton } from './InstallButton';
import { Wordmark } from './Wordmark';

export function Nav() {
  const { scrollY } = useScroll();
  const [solid, setSolid] = useState(false);

  useMotionValueEvent(scrollY, 'change', (y) => {
    setSolid(y > 32);
  });

  return (
    <motion.header
      initial={{ y: -8, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1], delay: 0.3 }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        padding: '1.1rem 0',
        backdropFilter: solid ? 'saturate(140%) blur(14px)' : 'none',
        background: solid
          ? 'oklch(0.14 0.005 270 / 0.55)'
          : 'transparent',
        borderBottom: solid ? '1px solid var(--hairline)' : '1px solid transparent',
        transition:
          'background var(--t-base) var(--ease-out), border-color var(--t-base) var(--ease-out), backdrop-filter var(--t-base) var(--ease-out)',
      }}
    >
      <div
        className="rail"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '2rem',
        }}
      >
        <Wordmark small />
        <nav
          aria-label="Primary"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '2rem',
            color: 'var(--ink-1)',
            fontSize: 'var(--step--1)',
          }}
        >
          <a className="navlink" href="#magic">
            How it works
          </a>
          <a className="navlink" href="#different">
            Different
          </a>
          <a className="navlink" href="#anywhere">
            Anywhere
          </a>
          <a className="navlink" href="#speed">
            Speed
          </a>
          <InstallButton size="sm" />
        </nav>
      </div>
      <style>{`
        .navlink {
          position: relative;
          padding: 4px 2px;
          transition: color var(--t-quick) var(--ease-out);
        }
        .navlink:hover { color: var(--ink-0); }
        @media (max-width: 720px) {
          nav .navlink { display: none; }
        }
      `}</style>
    </motion.header>
  );
}

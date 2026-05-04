import { motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { useState } from 'react';
import { InstallButton } from './InstallButton';
import { Wordmark } from './Wordmark';

export function Nav() {
  const { scrollY } = useScroll();
  const [solid, setSolid] = useState(false);

  useMotionValueEvent(scrollY, 'change', (y) => {
    setSolid(y > 40);
  });

  return (
    <motion.header
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1], delay: 0.1 }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        padding: '1.25ch 0',
        background: solid ? 'rgba(10, 10, 10, 0.88)' : 'transparent',
        borderBottom: solid ? '1px solid var(--hairline)' : '1px solid transparent',
        backdropFilter: solid ? 'blur(12px)' : 'none',
        transition:
          'background var(--t-macro) var(--ease), border-color var(--t-macro) var(--ease)',
      }}
    >
      <div
        className="rail"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '2ch',
        }}
      >
        <Wordmark height="2rem" />

        <nav
          aria-label="Primary"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '2ch',
            fontSize: 'var(--step--1)',
          }}
        >
          <a className="navlink" href="#magic">How it works</a>
          <a className="navlink" href="#different">Different</a>
          <a className="navlink" href="#anywhere">Anywhere</a>
          <a className="navlink" href="#speed">Speed</a>
          <InstallButton size="sm" label="Download" />
        </nav>
      </div>
    </motion.header>
  );
}

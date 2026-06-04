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
        background: solid ? 'rgba(250, 250, 248, 0.82)' : 'transparent',
        borderBottom: solid ? '1px solid var(--hairline)' : '1px solid transparent',
        backdropFilter: solid ? 'blur(14px) saturate(1.4)' : 'none',
        WebkitBackdropFilter: solid ? 'blur(14px) saturate(1.4)' : 'none',
        transition:
          'background var(--t-macro) var(--ease), border-color var(--t-macro) var(--ease)',
        // When transparent over the cloud hero, remap ink tokens to light so the
        // logo + links stay legible; solid state uses the default dark tokens.
        ...(solid ? {} : { ['--ink-0']: '#fff', ['--ink-1']: 'rgba(255,255,255,0.88)' }),
      } as React.CSSProperties}
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
        <Wordmark height="2rem" tone={solid ? 'ink' : 'paper'} />

        <nav
          aria-label="Primary"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '2ch',
            fontSize: 'var(--step--1)',
          }}
        >
          <a className="navlink" href="#speak">How it works</a>
          <a className="navlink" href="#different">Different</a>
          <a className="navlink" href="#anywhere">Anywhere</a>
          <a className="navlink" href="#speed">Speed</a>
          <InstallButton size="sm" label="Download" />
        </nav>
      </div>
    </motion.header>
  );
}

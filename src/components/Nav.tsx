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
        // Over the sky the bar is a translucent navy that keeps light type legible
        // at every altitude — a strip of stratosphere that follows you down.
        background: solid ? 'rgba(9, 20, 44, 0.55)' : 'transparent',
        borderBottom: solid ? '1px solid var(--rule-sky-soft)' : '1px solid transparent',
        backdropFilter: solid ? 'blur(16px) saturate(1.3)' : 'none',
        WebkitBackdropFilter: solid ? 'blur(16px) saturate(1.3)' : 'none',
        ['--ink-0' as string]: 'var(--cloud-white)',
        ['--ink-1' as string]: 'rgba(234, 240, 248, 0.82)',
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
        <a href="#top" aria-label="Pocket Voice — top">
          <Wordmark height="1.85rem" tone="paper" />
        </a>

        <nav
          aria-label="Primary"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '2.5ch',
            fontSize: 'var(--step--1)',
          }}
        >
          <a className="navlink" href="#demo">Try it</a>
          <a className="navlink" href="#surface">Surfaces</a>
          <a className="navlink" href="#close">Pricing</a>
          <InstallButton size="sm" label="Download" />
        </nav>
      </div>
    </motion.header>
  );
}

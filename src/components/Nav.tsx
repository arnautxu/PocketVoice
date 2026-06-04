import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { InstallButton } from './InstallButton';
import { Wordmark } from './Wordmark';

export function Nav() {
  // A plain scroll listener (not framer's useScroll) so the state is reliable in
  // every runtime. The bar carries a stratosphere-navy scrim at ALL times — over
  // the navy hero top it's invisible, but it's already there to catch the bright
  // cloud field and warm band below, so the logo + links never wash out. Scrolling
  // only deepens it slightly and draws the hairline.
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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
        // Always-on navy scrim, dense enough (≥0.82) that white type clears WCAG AA
        // even over the brightest near-white cloud; deepens to 0.9 once scrolled.
        background: solid ? 'rgba(9, 20, 44, 0.9)' : 'rgba(9, 20, 44, 0.82)',
        borderBottom: solid ? '1px solid rgba(234, 240, 248, 0.16)' : '1px solid transparent',
        backdropFilter: 'blur(16px) saturate(1.3)',
        WebkitBackdropFilter: 'blur(16px) saturate(1.3)',
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

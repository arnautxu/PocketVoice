import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { InstallButton } from './InstallButton';
import { Wordmark } from './Wordmark';
import { usePlatform } from '../hooks/usePlatform';
import { COMPANY_JOBS, POCKET_SITE } from '../config/links';

/* ══════════════════════════════════════════════════════════════════════════════
 * HEADER — a floating, centred liquid-glass bar (anything-style: air above it, not
 * pinned to the very top edge, not full-bleed). Navy-tinted frost so Paper type
 * clears WCAG AA over every zone of the descent it scrolls beneath.
 *   logo + name  ·  Product / For you / Pocket / Company  ·  platform-aware Download
 * Mobile: logo · download · hamburger → dropdown sheet.
 * ════════════════════════════════════════════════════════════════════════════ */

const LINKS = [
  { label: 'Product', href: '#features' },
  { label: 'For you', href: '#for-you' },
  { label: 'Pocket', href: POCKET_SITE, external: true },
  { label: 'Company', href: COMPANY_JOBS, external: true },
] as const;

export function Nav() {
  const [solid, setSolid] = useState(false);
  // while the mobile top Get banner is showing (page near the top) the header sits
  // below it; matches MobileGetBanner's scrollY>320 hide threshold.
  const [belowBanner, setBelowBanner] = useState(true);
  const [open, setOpen] = useState(false);
  const { storeHref, downloadLabel } = usePlatform();

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setSolid(y > 40);
      setBelowBanner(y <= 300);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // close the sheet on Escape / when a link is chosen
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <motion.header
      className={`site-header${belowBanner ? ' is-below-banner' : ''}`}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1], delay: 0.1 }}
    >
      <div className={`site-header__bar${solid ? ' is-solid' : ''}`}>
        <a href="#top" aria-label="Pocket Voice, back to top" style={{ display: 'inline-flex' }}>
          <Wordmark height="1.55rem" tone="paper" />
        </a>

        <nav aria-label="Primary" className="site-header__nav is-center">
          {LINKS.map((l) => (
            <a
              key={l.label}
              className="navlink"
              href={l.href}
              {...('external' in l && l.external ? { target: '_blank', rel: 'noreferrer' } : {})}
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="site-header__right">
          <InstallButton size="sm" label={downloadLabel} href={storeHref} />
          <button
            type="button"
            className="header-menu-btn"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {open && (
        <div className="header-sheet" role="menu">
          {LINKS.map((l) => (
            <a
              key={l.label}
              role="menuitem"
              href={l.href}
              onClick={() => setOpen(false)}
              {...('external' in l && l.external ? { target: '_blank', rel: 'noreferrer' } : {})}
            >
              {l.label}
              {'external' in l && l.external ? <ArrowIcon /> : null}
            </a>
          ))}
        </div>
      )}
    </motion.header>
  );
}

function MenuIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
    </svg>
  );
}
function CloseIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
    </svg>
  );
}
function ArrowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden style={{ opacity: 0.6 }}>
      <path d="M7 17L17 7M9 7h8v8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

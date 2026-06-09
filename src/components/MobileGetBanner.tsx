import { useEffect, useState } from 'react';
import { usePlatform } from '../hooks/usePlatform';

/* ══════════════════════════════════════════════════════════════════════════════
 * MOBILE "GET" BANNER — the App-Store-style banner (Wispr pattern). A top bar shows
 * at the top of the page; once you scroll past the hero it slides away and a bottom
 * bar slides up, keeping "Get" always one tap away. Mobile only (CSS display).
 *
 * Dismissable: an X closes it for the session (persisted). On close it fires
 * `pv-get-dismissed` so the floating header can rise back to its resting offset.
 * ════════════════════════════════════════════════════════════════════════════ */

export const GET_DISMISSED_KEY = 'pv-get-dismissed';
export const GET_DISMISSED_EVENT = 'pv-get-dismissed';

export function MobileGetBanner() {
  const [scrolled, setScrolled] = useState(false);
  const [dismissed, setDismissed] = useState(true); // assume dismissed until we read storage (no flash)
  const { storeHref } = usePlatform();

  useEffect(() => {
    setDismissed(localStorage.getItem(GET_DISMISSED_KEY) === '1');
    const onScroll = () => setScrolled(window.scrollY > 320);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const dismiss = () => {
    setDismissed(true);
    try {
      localStorage.setItem(GET_DISMISSED_KEY, '1');
    } catch {
      /* ignore */
    }
    window.dispatchEvent(new Event(GET_DISMISSED_EVENT));
  };

  if (dismissed) return null;

  return (
    <>
      <div className={`get-banner get-banner--top${scrolled ? ' is-hidden' : ''}`} aria-hidden={scrolled}>
        <Body href={storeHref} onClose={dismiss} />
      </div>
      <div className={`get-banner get-banner--bottom${scrolled ? ' is-shown' : ''}`} aria-hidden={!scrolled}>
        <Body href={storeHref} onClose={dismiss} />
      </div>
    </>
  );
}

function Body({ href, onClose }: { href: string; onClose: () => void }) {
  return (
    <>
      <button type="button" className="get-banner__close" aria-label="Dismiss" onClick={onClose}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
        </svg>
      </button>
      <span className="get-banner__app">
        <img className="get-banner__icon" src="/icon.svg" alt="" aria-hidden width={38} height={38} />
        <span className="get-banner__meta">
          <b>Pocket Voice</b>
          <span>Type out loud · Free</span>
        </span>
      </span>
      <a className="get-banner__btn" href={href} target="_blank" rel="noreferrer">Get</a>
    </>
  );
}

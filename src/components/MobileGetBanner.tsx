import { useEffect, useState } from 'react';
import { usePlatform } from '../hooks/usePlatform';

/* ══════════════════════════════════════════════════════════════════════════════
 * MOBILE "GET" BANNER — the App-Store-style banner (Wispr pattern). A top bar shows
 * at the top of the page; once you scroll past the hero it slides away and a bottom
 * bar slides up, keeping "Get" always one tap away. Mobile only (CSS display).
 * ════════════════════════════════════════════════════════════════════════════ */

export function MobileGetBanner() {
  const [scrolled, setScrolled] = useState(false);
  const { storeHref } = usePlatform();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 320);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <div className={`get-banner get-banner--top${scrolled ? ' is-hidden' : ''}`} aria-hidden={scrolled}>
        <Body href={storeHref} />
      </div>
      <div className={`get-banner get-banner--bottom${scrolled ? ' is-shown' : ''}`} aria-hidden={!scrolled}>
        <Body href={storeHref} />
      </div>
    </>
  );
}

function Body({ href }: { href: string }) {
  return (
    <>
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

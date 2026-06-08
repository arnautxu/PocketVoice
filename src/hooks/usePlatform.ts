import { useEffect, useState } from 'react';
import { STORE_DEFAULT, STORE_IPHONE, STORE_MAC } from '../config/links';

export type Platform = 'mac' | 'ios' | 'other';

export interface PlatformInfo {
  platform: Platform;
  /** Correct store URL for the detected platform. */
  storeHref: string;
  /** Short CTA label, e.g. "Download for Mac" / "Download for iPhone". */
  downloadLabel: string;
  /** True until the first client-side detection has run (avoids SSR/first-paint flash). */
  pending: boolean;
}

/**
 * Detect whether the visitor is on a Mac or an iPhone so we can suggest the
 * right download. Primary signal is the user-agent / platform string; as the
 * notes ask, we fall back to screen width when the UA is inconclusive
 * (≤ the largest iPhone width ⇒ treat as iPhone, otherwise Mac).
 *
 * Runs only on the client. Until it has, `pending` is true and we expose a
 * neutral default so the first paint never shows the wrong platform.
 */
export function usePlatform(): PlatformInfo {
  const [platform, setPlatform] = useState<Platform>('other');
  const [pending, setPending] = useState(true);

  useEffect(() => {
    setPlatform(detectPlatform());
    setPending(false);

    // Re-evaluate on resize/orientation only while UA was inconclusive (the
    // width fallback can flip). UA-based results are stable, so this is cheap.
    const onResize = () => setPlatform(detectPlatform());
    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
  }, []);

  if (platform === 'mac') {
    return { platform, storeHref: STORE_MAC, downloadLabel: 'Download for Mac', pending };
  }
  if (platform === 'ios') {
    return { platform, storeHref: STORE_IPHONE, downloadLabel: 'Download for iPhone', pending };
  }
  return { platform, storeHref: STORE_DEFAULT, downloadLabel: 'Download', pending };
}

/** The largest iPhone logical width (e.g. 16 Pro Max ≈ 440px). Below this we assume phone. */
const IPHONE_MAX_WIDTH = 480;

function detectPlatform(): Platform {
  if (typeof navigator === 'undefined') return 'other';

  const ua = navigator.userAgent || '';
  const plat = (navigator.platform || '').toLowerCase();
  const touchPoints = navigator.maxTouchPoints || 0;

  // iPhone / iPod — explicit in the UA.
  if (/iPhone|iPod/.test(ua)) return 'ios';

  // iPadOS 13+ reports as "MacIntel" with touch — treat tablets as iOS for the
  // App Store suggestion (it's the same mobile listing).
  const isIpadOS = plat === 'macintel' && touchPoints > 1;
  if (isIpadOS || /iPad/.test(ua)) return 'ios';

  // Genuine Mac (no touch).
  if (plat.startsWith('mac') || /Macintosh/.test(ua)) return 'mac';

  // Inconclusive UA → fall back to screen width per the brief.
  if (typeof window !== 'undefined') {
    return window.innerWidth <= IPHONE_MAX_WIDTH ? 'ios' : 'mac';
  }
  return 'other';
}

/* ──────────────────────────────────────────────────────────────────────────
 * Single source of truth for every outbound link on the site.
 *
 * ⚠️ STORE URLS: swap these two placeholders for the real App Store listings
 * the moment they exist. Every download CTA, the nav button, the mobile "Get"
 * banner and the final CTA all read from here — change them once, here.
 * ────────────────────────────────────────────────────────────────────────── */

/** Mac App Store listing. TODO: replace with the real URL. */
export const STORE_MAC = 'https://apps.apple.com/app/pocket-voice/id000000000?mt=12';

/** iPhone App Store listing. TODO: replace with the real URL. */
export const STORE_IPHONE = 'https://apps.apple.com/app/pocket-voice/id000000000';

/** Generic store link used before platform is known (SSR / first paint). */
export const STORE_DEFAULT = STORE_IPHONE;

/** Pocket — the physical device / parent brand. */
export const POCKET_SITE = 'https://heypocket.com/';

/** Company / careers. */
export const COMPANY_JOBS =
  'https://heypocket.notion.site/Jobs-at-Pocket-26a67978de338047b6cbe30fdbc89923';

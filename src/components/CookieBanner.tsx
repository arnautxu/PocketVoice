import { useEffect, useState } from 'react';

/* ══════════════════════════════════════════════════════════════════════════════
 * COOKIE BANNER — a small in-brand glass card, bottom-left (full-width on mobile,
 * sitting above the Get bar). Choice persisted to localStorage so it doesn't return.
 * ════════════════════════════════════════════════════════════════════════════ */

const KEY = 'pv-cookie-consent';

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) setVisible(true);
    } catch {
      setVisible(true); // storage blocked — still show once this session
    }
  }, []);

  const decide = (value: 'accepted' | 'declined') => {
    try {
      localStorage.setItem(KEY, value);
    } catch {
      /* ignore — best effort */
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="cookie" role="dialog" aria-label="Cookie notice" aria-live="polite">
      <p>
        We use a few cookies to understand how Pocket Voice is used and to make it better. See our{' '}
        <a href="/legal/privacy">privacy policy</a>.
      </p>
      <div className="cookie-actions">
        <button type="button" className="cookie-btn cookie-btn--accept" onClick={() => decide('accepted')}>
          Accept
        </button>
        <button type="button" className="cookie-btn cookie-btn--decline" onClick={() => decide('declined')}>
          Decline
        </button>
      </div>
    </div>
  );
}

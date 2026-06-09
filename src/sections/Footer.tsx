import { Wordmark } from '../components/Wordmark';
import { COMPANY_JOBS, POCKET_SITE } from '../config/links';

/* ══════════════════════════════════════════════════════════════════════════════
 * FOOTER — the big, in-brand close (anything-style): a deep blue cloud field with
 * the name set enormous across the base. The descent lands on Paper above; the
 * footer is the one deliberate return to the sky — clouds + blue, name in lights.
 * ════════════════════════════════════════════════════════════════════════════ */

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="big-footer">
      <div className="big-footer-clouds" aria-hidden />

      <div className="rail" style={{ display: 'flex', justifyContent: 'space-between', gap: '2.5rem', flexWrap: 'wrap' }}>
        <div style={{ display: 'grid', gap: '1rem', maxWidth: '28ch' }}>
          <Wordmark height="1.7rem" tone="paper" />
          <p style={{ margin: 0, color: 'var(--ink-1)', fontSize: 'var(--step-0)', lineHeight: 1.5 }}>
            Your voice is your fastest keyboard. From Pocket.
          </p>
        </div>

        <nav className="big-footer__links" aria-label="Footer">
          <div className="big-footer__col">
            <FootHead>Product</FootHead>
            <a href="#features">Product</a>
            <a href="#for-you">For you</a>
            <a href="#pricing">Pricing</a>
          </div>
          <div className="big-footer__col">
            <FootHead>Company</FootHead>
            <a href={POCKET_SITE} target="_blank" rel="noreferrer">Pocket</a>
            <a href={COMPANY_JOBS} target="_blank" rel="noreferrer">Careers</a>
            <a href="mailto:hello@heypocket.com">Contact</a>
          </div>
          <div className="big-footer__col">
            <FootHead>Legal</FootHead>
            <a href="/legal/privacy">Privacy</a>
            <a href="/legal/terms">Terms</a>
          </div>
        </nav>
      </div>

      {/* the name, enormous — the real lockup, full-width, filled with the cloud sky */}
      <div className="rail">
        <div className="big-footer__wordmark" aria-hidden />
      </div>

      <div className="rail big-footer__bottom">
        <span>© {year} Open Vision Engineering Inc.</span>
        <span>Type out loud.</span>
      </div>
    </footer>
  );
}

function FootHead({ children }: { children: React.ReactNode }) {
  return (
    <span style={{ color: 'var(--ink-2)', fontSize: 'var(--step--1)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
      {children}
    </span>
  );
}

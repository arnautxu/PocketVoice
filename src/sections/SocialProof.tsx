/* ══════════════════════════════════════════════════════════════════════════════
 * SOCIAL PROOF — the count + a press/credibility strip, set into the lower sky. The
 * "86k" is the brand-accent moment. Logos are text-wordmark placeholders for now;
 * drop real SVGs into /public/brand/logos and swap `label` for `<img src=…>` — the
 * .proof-logo class already handles the monochrome-on-sky treatment.
 * ════════════════════════════════════════════════════════════════════════════ */

const LOGOS = ['TechCrunch', 'Product Hunt', 'The Verge', 'Wired', 'Fast Company'];

export function SocialProof() {
  return (
    <section className="sec alt-light" aria-label="Loved by people everywhere" style={{ paddingBlock: 'var(--space-lg)' }}>
      <div className="rail" style={{ display: 'grid', gap: 'clamp(2rem, 5vh, 3.25rem)', justifyItems: 'center' }}>
        <div className="proof">
          <div className="proof-figure">
            <span
              className="tabular"
              style={{ fontFamily: 'var(--font-text)', fontWeight: 700, fontSize: 'var(--step-6)', lineHeight: 0.9, letterSpacing: '-0.03em', color: 'var(--accent-sky)' }}
            >
              86k
            </span>
            <span style={{ fontSize: 'var(--step-0)', color: 'var(--ink-1)' }}>people typing out loud</span>
          </div>
          <p style={{ margin: 0, maxWidth: '24ch', fontFamily: 'var(--font-display)', fontSize: 'var(--step-2)', lineHeight: 1.2, textAlign: 'center', color: 'var(--ink-0)' }}>
            From Pocket, the team behind the device 86,000 people already speak to.
          </p>
        </div>

        <div className="proof-logos" aria-label="As featured in">
          {LOGOS.map((name) => (
            <span
              key={name}
              className="proof-logo"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                height: 'auto',
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--step-1)',
                fontWeight: 500,
                letterSpacing: '-0.01em',
                color: 'var(--ink-1)',
                filter: 'none',
              }}
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

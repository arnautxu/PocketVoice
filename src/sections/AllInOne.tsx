import { InteractivePhone } from '../components/InteractivePhone';

/* ══════════════════════════════════════════════════════════════════════════════
 * ALL-IN-ONE — one app, everywhere you'd type. The interactive phone carries the
 * proof now: tap the mic and Pocket Voice records, composes and sends inside a real
 * app; the app icons switch the surface, and the same press is composed for each
 * register. The text-list of surfaces became those tappable app icons.
 * ════════════════════════════════════════════════════════════════════════════ */

export function AllInOne() {
  return (
    <section id="all-in-one" className="sec alt-light" style={{ position: 'relative' }}>
      <div className="rail" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.05fr) minmax(0, 0.75fr)', gap: 'var(--space-md)', alignItems: 'center' }}>
        <div className="all-in-one-copy on-sky" style={{ display: 'grid', gap: 'clamp(1.5rem, 3.5vh, 2.25rem)' }}>
          <span className="sec-eyebrow">One app · everywhere you type</span>
          <h2 style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 400, letterSpacing: '-0.022em', fontSize: 'var(--step-4)', lineHeight: 1.02, maxWidth: '16ch', color: 'var(--ink-0)' }}>
            Wherever you&rsquo;d type, <span style={{ color: 'var(--accent-sky)', fontStyle: 'italic' }}>talk instead.</span>
          </h2>
          <p style={{ margin: 0, maxWidth: '46ch', fontSize: 'var(--step-1)', lineHeight: 1.5, color: 'var(--ink-1)' }}>
            One press works in every app on your phone and Mac. Pocket Voice reads the surface before
            it writes: a thought in Notes becomes an idea, a reply in Mail becomes prose, a line in
            Slack stays a quip.
          </p>
          <p style={{ margin: 0, maxWidth: '40ch', fontSize: 'var(--step-0)', lineHeight: 1.5, color: 'var(--ink-2)' }}>
            Try it &mdash; tap an app, then the mic. Same press, composed for wherever it lands. &rarr;
          </p>
        </div>

        {/* the product — interactive */}
        <div className="all-in-one-phone" style={{ display: 'flex', justifyContent: 'center' }}>
          <InteractivePhone />
        </div>
      </div>
    </section>
  );
}

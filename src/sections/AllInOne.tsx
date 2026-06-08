import { HeroPhone } from '../components/HeroPhone';

/* ══════════════════════════════════════════════════════════════════════════════
 * ALL-IN-ONE — one app, everywhere you'd type. Calls, ideas, chats, emails: the
 * same press, composed for wherever it lands. Still high in the sky (alt-dark), the
 * product device featured alongside a few surface examples. The same spoken vapor
 * (left) becomes the right register on the right.
 * ════════════════════════════════════════════════════════════════════════════ */

const USES = ['Emails', 'Slack & chats', 'Notes & ideas', 'Call follow-ups', 'Issues & tickets', 'Search bars'];

const EXAMPLES = [
  { surface: 'Mail', register: 'Email', spoken: 'hey anna loved the deck two thoughts on pricing', output: 'Anna, loved the deck. Two thoughts on the pricing section when you have a moment.' },
  { surface: 'Slack', register: 'Message', spoken: 'pushed the fix could someone smoke test before we ship', output: 'Pushed the fix, could someone smoke-test before we deploy?' },
  { surface: 'Notes', register: 'Idea', spoken: 'um idea pocket but for meetings auto summary after', output: 'Idea: Pocket, but for meetings, an automatic summary after each call.' },
];

export function AllInOne() {
  return (
    <section id="all-in-one" className="sec alt-light" style={{ position: 'relative' }}>
      <div className="rail" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.1fr) minmax(0, 0.7fr)', gap: 'var(--space-md)', alignItems: 'center' }}>
        <div className="all-in-one-copy on-sky" style={{ display: 'grid', gap: 'clamp(1.5rem, 3.5vh, 2.25rem)' }}>
          <span className="sec-eyebrow">One app · everywhere you type</span>
          <h2 style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 400, letterSpacing: '-0.022em', fontSize: 'var(--step-4)', lineHeight: 1.02, maxWidth: '16ch', color: 'var(--ink-0)' }}>
            Wherever you&rsquo;d type, <span style={{ color: 'var(--accent-sky)', fontStyle: 'italic' }}>talk instead.</span>
          </h2>
          <p style={{ margin: 0, maxWidth: '48ch', fontSize: 'var(--step-1)', lineHeight: 1.5, color: 'var(--ink-1)' }}>
            One press works in every app on your phone and Mac. Pocket Voice reads the surface before
            it writes: a thought in Notes becomes an idea, a reply in Mail becomes prose.
          </p>

          {/* use-case chips */}
          <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
            {USES.map((u) => (
              <li
                key={u}
                style={{
                  fontSize: 'var(--step--1)',
                  padding: '0.45rem 0.9rem',
                  borderRadius: 999,
                  border: '1px solid var(--glass-edge)',
                  background: 'var(--glass-sky)',
                  backdropFilter: 'var(--glass-blur)',
                  WebkitBackdropFilter: 'var(--glass-blur)',
                  color: 'var(--ink-1)',
                }}
              >
                {u}
              </li>
            ))}
          </ul>

          {/* a few surface examples — voice → right register */}
          <ul style={{ margin: '0.5rem 0 0', padding: 0, listStyle: 'none', display: 'grid' }}>
            {EXAMPLES.map((ex) => (
              <li key={ex.surface} className="transcript surface-row reveal" style={{ padding: 'clamp(0.85rem, 2vh, 1.15rem) 0', borderTop: '1px solid var(--rule)' }}>
                <div style={{ display: 'grid', gap: '0.5rem' }}>
                  <span className="track-label">{ex.surface}</span>
                  <p className="vapor" style={{ margin: 0, fontSize: 'var(--step-0)', color: 'var(--ink-1)', textShadow: 'none' }}>&ldquo;{ex.spoken}&rdquo;</p>
                </div>
                <div className="transcript-rule" aria-hidden />
                <div style={{ display: 'grid', gap: '0.5rem' }}>
                  <span className="track-label" style={{ justifySelf: 'start' }}>{ex.register}</span>
                  <p style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 'var(--step-1)', lineHeight: 1.3, color: 'var(--ink-0)' }}>{ex.output}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* the product */}
        <div className="all-in-one-phone" style={{ display: 'flex', justifyContent: 'center' }}>
          <HeroPhone />
        </div>
      </div>
    </section>
  );
}

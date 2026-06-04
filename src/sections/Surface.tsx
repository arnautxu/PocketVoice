import { AssetSlot } from '../components/AssetSlot';

/* ══════════════════════════════════════════════════════════════════════════════
 * SURFACE — the clearing air. We have descended out of the cloud; the page is
 * bright now and the ink is sharp. Same spoken vapor (left, Erode), composed for
 * the register of each surface (right, Satoshi). One continuous transcript of how
 * one voice lands in every app.
 * ════════════════════════════════════════════════════════════════════════════ */

const EXAMPLES = [
  {
    surface: 'Mail',
    register: 'Email',
    spoken: 'hey anna loved the deck, two thoughts on pricing',
    output: 'Anna — thanks for the deck. Two thoughts on the pricing section when you have a moment.',
  },
  {
    surface: 'Slack',
    register: 'Message',
    spoken: 'pushed the fix could someone smoke test before we ship',
    output: '@channel: pushed the fix. Could someone smoke-test before we deploy to prod?',
  },
  {
    surface: 'Linear',
    register: 'Issue',
    spoken: 'cls 148 payment retry loops on 402',
    output: 'CLS-148: payment retry loops on 402. Needs root-cause before the next release.',
  },
  {
    surface: 'Notion',
    register: 'Doc',
    spoken: 'q3 review context decisions follow ups',
    output: 'Q3 review — context, decisions made, and follow-ups still open.',
  },
  {
    surface: 'WhatsApp',
    register: 'Reply',
    spoken: 'on my way five minutes',
    output: 'On my way — five minutes.',
  },
];

export function Surface() {
  return (
    <section id="surface" className="section-light alt-light" style={{ padding: 'clamp(5rem, 11vh, 9rem) 0' }}>
      <div className="rail" style={{ display: 'grid', gap: 'clamp(2.5rem, 6vh, 4rem)' }}>
        {/* Header — asymmetric, left */}
        <header className="grid-12">
          <div style={{ gridColumn: 'span 8', display: 'grid', gap: '1.5rem' }}>
            <span className="track-label" style={{ color: 'var(--ink-1)' }}>
              <span aria-hidden style={{ display: 'inline-block', width: '2ch', height: 1, background: 'var(--ink-2)' }} />
              Any app &middot; one press
            </span>
            <h2 className="ink-out" style={{ margin: 0, fontSize: 'var(--step-4)', lineHeight: 1.04, fontWeight: 600 }}>
              Same voice. <span style={{ color: 'var(--ink-1)', fontWeight: 500 }}>Right register.</span>
            </h2>
            <p style={{ margin: 0, maxWidth: '52ch', fontSize: 'var(--step-1)', lineHeight: 1.5, color: 'var(--ink-1)' }}>
              Pocket Voice reads the surface before it writes. A thought in Linear becomes a ticket;
              a reply in Mail becomes prose. The same spoken sentence, composed for where it lands.
            </p>
          </div>
        </header>

        {/* The transcript across surfaces */}
        <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'grid' }}>
          {EXAMPLES.map((ex) => (
            <li
              key={ex.surface}
              className="transcript surface-row reveal"
              style={{ padding: 'clamp(1.5rem, 3.5vh, 2.25rem) 0', borderTop: '1px solid var(--rule)' }}
            >
              {/* VOICE — vapor */}
              <div style={{ display: 'grid', gap: '0.9rem' }}>
                <span className="track-label">{ex.surface}</span>
                <p className="vapor" style={{ margin: 0, fontSize: 'var(--step-1)', color: 'var(--ink-2)', textShadow: 'none' }}>
                  &ldquo;{ex.spoken}&rdquo;
                </p>
              </div>

              <div className="transcript-rule" aria-hidden />

              {/* TEXT — ink */}
              <div style={{ display: 'grid', gap: '0.9rem' }}>
                <span className="track-label" style={{ justifySelf: 'start' }}>{ex.register}</span>
                <p className="ink-out" style={{ margin: 0, fontSize: 'var(--step-2)', lineHeight: 1.28, fontWeight: 500 }}>
                  {ex.output}
                </p>
              </div>
            </li>
          ))}
        </ul>

        {/* Stats + a product slot for the surface picker */}
        <div className="grid-12 surface-stats" style={{ alignItems: 'center', paddingTop: 'clamp(1rem, 3vh, 2rem)' }}>
          <div style={{ gridColumn: 'span 6', display: 'flex', gap: 'clamp(2rem, 6vw, 4.5rem)', flexWrap: 'wrap' }}>
            <Stat figure="108" label="languages — switch mid-sentence, no toggle" />
            <Stat figure="94%" label="tone match — human-rated, internal corpus" />
          </div>
          <div style={{ gridColumn: '8 / -1' }}>
            <AssetSlot label="In-app surface detection" note="app picker UI · 16:10" ratio="16 / 10" />
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ figure, label }: { figure: string; label: string }) {
  return (
    <div style={{ display: 'grid', gap: '0.5ch', maxWidth: '20ch' }}>
      <span
        className="tabular"
        style={{ fontFamily: 'var(--font-text)', fontWeight: 700, fontSize: 'var(--step-5)', lineHeight: 0.9, letterSpacing: '-0.03em', color: 'var(--ink-0)' }}
      >
        {figure}
      </span>
      <span style={{ fontSize: 'var(--step--1)', color: 'var(--ink-2)', lineHeight: 1.4 }}>{label}</span>
    </div>
  );
}

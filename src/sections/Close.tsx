import { InstallButton } from '../components/InstallButton';

/* ══════════════════════════════════════════════════════════════════════════════
 * CLOSE — the landing. We have descended all the way through the atmosphere and
 * come to rest in clear, bright air, a cloud bank still drifting at eye level. The
 * ink is fully resolved here: graphite on near-white sky. Brand statement + a flat
 * editorial price table on solid ground.
 * ════════════════════════════════════════════════════════════════════════════ */

const ROWS = [
  { label: 'Daily use', free: '30 min', pro: 'Unlimited' },
  { label: 'Languages', free: '3', pro: 'All 108' },
  { label: 'Speed', free: 'Standard', pro: 'Priority' },
];

export function Close() {
  return (
    <section
      id="close"
      className="section-light alt-light"
      style={{ position: 'relative', isolation: 'isolate', overflow: 'hidden', padding: 'var(--space-xl) 0' }}
    >
      {/* full-bleed cloud bank at eye level, fading up into clear air */}
      <div className="cloud-bleed cloud-ground" aria-hidden style={{ opacity: 0.9 }} />

      <div className="rail grid-12 close-grid" style={{ alignItems: 'start', rowGap: 'clamp(2.5rem, 6vh, 4rem)' }}>
        {/* Brand statement */}
        <div style={{ gridColumn: 'span 5', display: 'grid', gap: '1.75rem' }}>
          <span className="track-label" style={{ color: 'var(--ink-1)' }}>
            <span aria-hidden style={{ display: 'inline-block', width: '2ch', height: 1, background: 'var(--ink-2)' }} />
            From Pocket
          </span>
          <h2 className="vapor" style={{ margin: 0, fontSize: 'var(--step-5)', lineHeight: 1.0, letterSpacing: '-0.02em', maxWidth: '11ch', color: 'var(--graphite)', textShadow: 'none' }}>
            Press once.
            <br />
            {/* headline accent — Blue Deep italic (the descent's "landed" blue). Over
                the bright, variable cloud bleed Blue Deep holds ~5–6:1; Pocket Blue
                would be a borderline 3.5:1 and dip below AA over the lighter cloud. */}
            <span style={{ color: 'var(--blue-deep)', fontStyle: 'italic' }}>Walk away.</span>
          </h2>
          <p style={{ margin: 0, maxWidth: '42ch', fontSize: 'var(--step-1)', lineHeight: 1.6, color: 'var(--ink-1)' }}>
            Pocket Voice exists to get out of your way. Speak your thought; by the time your hand
            reaches the keyboard, the message is already written &mdash; in the right words, for the
            right surface.
          </p>
          <div>
            <InstallButton size="lg" />
          </div>
        </div>

        {/* Price table — solid ground card */}
        <div
          style={{
            gridColumn: '7 / -1',
            border: '1px solid rgba(17, 21, 28, 0.12)',
            borderRadius: 12,
            // raised toward opaque so the Free/Pro values never read as faint gray
            // over a bright cloud showing through — solid contrast ground for type
            background: 'rgba(255, 255, 255, 0.94)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            overflow: 'hidden',
            boxShadow: '0 30px 70px -34px rgba(8, 22, 48, 0.28)',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1.1fr 1fr 1fr',
              alignItems: 'baseline',
              gap: '1.5ch',
              padding: 'clamp(1.25rem, 3vw, 1.75rem)',
              borderBottom: '1px solid var(--rule)',
            }}
          >
            <span className="track-label">Plan</span>
            <span style={{ fontSize: 'var(--step-1)', fontWeight: 600, color: 'var(--graphite-1)' }}>Free</span>
            <span style={{ fontSize: 'var(--step-1)', fontWeight: 600, color: 'var(--cobalt)' }}>Pro</span>
          </div>
          {ROWS.map((r, i) => (
            <div
              key={r.label}
              style={{
                display: 'grid',
                gridTemplateColumns: '1.1fr 1fr 1fr',
                gap: '1.5ch',
                alignItems: 'baseline',
                padding: 'clamp(1rem, 2.4vw, 1.4rem) clamp(1.25rem, 3vw, 1.75rem)',
                borderBottom: i < ROWS.length - 1 ? '1px solid var(--rule)' : 'none',
              }}
            >
              <span style={{ color: 'var(--graphite-1)', fontSize: 'var(--step--1)', letterSpacing: '0.04em', fontWeight: 500 }}>{r.label}</span>
              <span style={{ color: 'var(--graphite)', fontSize: 'var(--step-0)', fontWeight: 500 }}>{r.free}</span>
              <span style={{ color: 'var(--graphite)', fontSize: 'var(--step-0)', fontWeight: 600 }}>{r.pro}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

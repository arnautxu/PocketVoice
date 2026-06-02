import { Caret } from './Caret';
import { useInViewOnce } from '../hooks/useInViewOnce';
import { useTypeIn } from '../hooks/useTypeIn';

/* ── VoiceTransform ───────────────────────────────────────────────────────────
 * Visualizes the Speak promise: messy spoken input → one polished sentence.
 * The raw line shows filler words struck out (what you said); a 180 ms divider
 * separates it from the composed result, which types itself in on scroll. Lives
 * directly on the parent .glass panel - no card-in-card; structure via hairlines.
 * ──────────────────────────────────────────────────────────────────────────── */

/* Raw spoken tokens - `cut: true` are the disfluencies Pocket Voice removes. */
const SPOKEN: { t: string; cut?: boolean }[] = [
  { t: 'um, ', cut: true },
  { t: 'so like ', cut: true },
  { t: 'can you, ', cut: true },
  { t: 'can you send maya the launch deck by friday, thanks' },
];

const RESULT = 'Hi Maya, could you send the launch deck by Friday? Thanks.';

/* Compositor-only voice line - bars scale on a staggered loop. */
function Waveform() {
  const bars = [0.35, 0.6, 0.9, 0.55, 1, 0.7, 0.4, 0.75, 0.5, 0.85, 0.6, 0.3];
  return (
    <span className="pv-wave" aria-hidden>
      {bars.map((h, i) => (
        <span
          key={i}
          style={{
            ['--h' as string]: h,
            animationDelay: `${(i % 6) * 0.12}s`,
          }}
        />
      ))}
    </span>
  );
}

export function VoiceTransform() {
  const [ref, inView] = useInViewOnce<HTMLDivElement>('-15% 0px');
  const typed = useTypeIn(RESULT, inView, 900);
  const done = typed >= RESULT.length;

  return (
    <div ref={ref} style={{ width: '100%' }}>
      {/* what you said */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.9ch',
          marginBottom: '1.1rem',
        }}
      >
        <span
          aria-hidden
          style={{
            width: 9,
            height: 9,
            borderRadius: 999,
            background: 'var(--pv-danger)',
            boxShadow: '0 0 0 4px rgba(217,75,58,0.18)',
            flexShrink: 0,
          }}
        />
        <Waveform />
        <span
          style={{
            fontSize: 'var(--step--1)',
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: 'var(--ink-2)',
            fontWeight: 600,
          }}
        >
          What you said
        </span>
      </div>

      <p
        style={{
          fontSize: 'var(--step-1)',
          lineHeight: 1.5,
          color: 'var(--ink-2)',
          margin: '0 0 1.5rem',
        }}
      >
        {SPOKEN.map((s, i) =>
          s.cut ? (
            <span
              key={i}
              className={inView ? 'pv-cut pv-cut-go' : 'pv-cut'}
              style={{ ['--cut-delay' as string]: `${0.15 + i * 0.12}s` }}
            >
              {s.t}
            </span>
          ) : (
            <span key={i} style={{ color: 'var(--ink-1)' }}>
              {s.t}
            </span>
          ),
        )}
      </p>

      {/* 180 ms divider */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1.25ch',
          margin: '0 0 1.5rem',
          color: 'var(--ink-2)',
        }}
      >
        <span style={{ height: 1, flex: 1, background: 'var(--hairline-strong)' }} />
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.6ch',
            fontSize: 'var(--step--1)',
            fontVariantNumeric: 'tabular-nums',
            letterSpacing: '0.04em',
            color: 'var(--pv-blue-deep)',
            fontWeight: 600,
          }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden>
            <line x1="12" y1="5" x2="12" y2="19" />
            <polyline points="6 13 12 19 18 13" />
          </svg>
          180&nbsp;ms
        </span>
        <span style={{ height: 1, flex: 1, background: 'var(--hairline-strong)' }} />
      </div>

      {/* composed result */}
      <p
        aria-label={RESULT}
        style={{
          fontSize: 'var(--step-2)',
          fontFamily: 'var(--font-display)',
          lineHeight: 1.2,
          letterSpacing: '-0.01em',
          color: 'var(--ink-0)',
          margin: 0,
          minHeight: '2.4em',
        }}
      >
        <span aria-hidden>{RESULT.slice(0, typed)}</span>
        <Caret active={!done} style={{ marginLeft: '0.12ch' }} />
      </p>
    </div>
  );
}

import { useEffect, useState } from 'react';

/* ══════════════════════════════════════════════════════════════════════════════
 * VOICE → TEXT — a compact, auto-looping demonstration of the core promise, set
 * into the hero sky. Three beats, left → right: sound BARS (you speak) · a SEAM
 * (the condensation) · finished TEXT (what Pocket Voice writes). While "listening"
 * the raw transcript shows with its fillers and repeats; on "resolve" those strike
 * out and the clean sentence precipitates in Erode. Loops gently; reduced motion
 * holds the resolved end-state.
 * ════════════════════════════════════════════════════════════════════════════ */

type Phase = 'listening' | 'resolving' | 'done';

// One token = a word + whether it survives composition. Struck tokens are the
// fillers / repeats Pocket Voice removes.
const TOKENS: Array<{ w: string; cut?: boolean }> = [
  { w: 'um', cut: true },
  { w: 'can you' },
  { w: 'can you', cut: true },
  { w: 'send me the' },
  { w: 'the', cut: true },
  { w: 'notes by friday' },
  { w: 'like', cut: true },
  { w: 'before the standup' },
];

const CLEAN = 'Can you send me the notes by Friday, before the standup?';

const prefersReduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

export function VoiceToText() {
  const [phase, setPhase] = useState<Phase>(prefersReduced() ? 'done' : 'listening');

  useEffect(() => {
    if (prefersReduced()) return; // hold resolved state, no loop
    let timers: ReturnType<typeof setTimeout>[] = [];
    const run = () => {
      setPhase('listening');
      timers.push(setTimeout(() => setPhase('resolving'), 2200));
      timers.push(setTimeout(() => setPhase('done'), 3100));
      timers.push(setTimeout(run, 6000)); // hold the finished line, then replay
    };
    run();
    return () => timers.forEach(clearTimeout);
  }, []);

  const live = phase === 'listening';
  const struck = phase !== 'listening';

  return (
    <div className={`v2t reveal${live ? ' is-live' : ''}`} aria-hidden="true">
      {/* BARS — you speak */}
      <div className="v2t-bars">
        {BARHEIGHTS.map((h, i) => (
          <span key={i} className="v2t-bar" style={{ animationDelay: `${i * 0.07}s`, ['--h' as string]: h }} />
        ))}
      </div>

      {/* SEAM — the condensation */}
      <div className="v2t-seam" aria-hidden>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M5 9l7 7 7-7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {/* TEXT — what Pocket Voice writes */}
      <div className="v2t-out">
        <span className="v2t-label">{phase === 'done' ? 'Written' : 'Heard'}</span>
        {phase === 'done' ? (
          <p className="v2t-text v2t-clean condense-in" key="clean">{CLEAN}</p>
        ) : (
          <p className="v2t-text v2t-raw">
            {TOKENS.map((t, i) => (
              <span key={i}>
                {t.cut && struck ? <s>{t.w}</s> : t.w}{' '}
              </span>
            ))}
          </p>
        )}
      </div>
    </div>
  );
}

// A fixed, organic-looking set so the waveform reads as speech, not a uniform comb.
const BARHEIGHTS = ['0.4', '0.7', '0.5', '0.9', '0.6', '1', '0.7', '0.45', '0.8', '0.55', '0.85', '0.5'];

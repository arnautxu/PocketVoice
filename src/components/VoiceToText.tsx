import { useEffect, useRef, useState } from 'react';

/* ══════════════════════════════════════════════════════════════════════════════
 * VOICE → TEXT — the hero's core promise, enacted in ONE place. A synthetic audio
 * waveform (you speak) condenses, in the SAME stage, into finished text — and the
 * edits Pocket Voice makes are shown one at a time, each named as it happens:
 *   listening (wave)  →  raw transcript  →  remove fillers  →  fix wording
 *                     →  punctuation + caps  →  tone matched to the surface.
 * Rotates through Email · Slack · Notes. Auto-loops; reduced motion holds the
 * finished line of the first example. Decorative (aria-hidden) — the headline copy
 * carries the real promise for assistive tech.
 * ════════════════════════════════════════════════════════════════════════════ */

// One spoken token and what the tool does with it.
//   keep   — survives; `out` is its formatted form (caps / punctuation appear here)
//   filler — removed ("um", "like", a repeated word, a false start)
//   fix    — mis-said / mis-spelled; `raw` is replaced by `out`
type Tok = { t: 'keep' | 'filler' | 'fix'; raw: string; out?: string };
type Example = { surface: string; tokens: Tok[] };

const EXAMPLES: Example[] = [
  {
    surface: 'Email',
    tokens: [
      { t: 'filler', raw: 'um' },
      { t: 'keep', raw: 'can you', out: 'Can you' },
      { t: 'keep', raw: 'send me the', out: 'send me the' },
      { t: 'fix', raw: 'noats', out: 'notes' },
      { t: 'keep', raw: 'by', out: 'by' },
      { t: 'fix', raw: 'fryday', out: 'Friday,' },
      { t: 'filler', raw: 'like' },
      { t: 'keep', raw: 'before the standup', out: 'before the standup?' },
    ],
  },
  {
    surface: 'Slack',
    tokens: [
      { t: 'keep', raw: 'pushed the', out: 'Pushed the' },
      { t: 'filler', raw: 'the' },
      { t: 'keep', raw: 'fix', out: 'fix,' },
      { t: 'keep', raw: 'could someone', out: 'could someone' },
      { t: 'fix', raw: 'smoke test', out: 'smoke-test' },
      { t: 'keep', raw: 'before we', out: 'before we' },
      { t: 'filler', raw: 'uh' },
      { t: 'keep', raw: 'ship', out: 'ship?' },
    ],
  },
  {
    surface: 'Notes',
    tokens: [
      { t: 'filler', raw: 'um' },
      { t: 'keep', raw: 'idea', out: 'Idea:' },
      { t: 'keep', raw: 'pocket', out: 'Pocket,' },
      { t: 'keep', raw: 'but for meetings', out: 'but for meetings,' },
      { t: 'fix', raw: 'auto sumary', out: 'an automatic summary' },
      { t: 'keep', raw: 'after each call', out: 'after each call.' },
    ],
  },
];

// The animation reads as a fixed sequence of beats. Each beat holds for `dur` ms.
type Step = 'listen' | 'raw' | 'cut' | 'fix' | 'punct' | 'done';
const TIMELINE: Array<{ step: Step; dur: number }> = [
  { step: 'listen', dur: 1600 },
  { step: 'raw', dur: 1000 },
  { step: 'cut', dur: 950 },
  { step: 'fix', dur: 1000 },
  { step: 'punct', dur: 1000 },
  { step: 'done', dur: 2100 },
];
const ORDER: Step[] = ['listen', 'raw', 'cut', 'fix', 'punct', 'done'];
const rank = (s: Step) => ORDER.indexOf(s);

// What the tool is doing right now — shown as a small badge so the EDITS are legible.
const EDIT_LABEL: Partial<Record<Step, string>> = {
  cut: 'Removing fillers',
  fix: 'Fixing wording',
  punct: 'Punctuation + caps',
};
const STATUS_LABEL: Record<Step, string> = {
  listen: 'Listening',
  raw: 'Transcribing',
  cut: 'Editing',
  fix: 'Editing',
  punct: 'Editing',
  done: 'Written',
};

const prefersReduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

export function VoiceToText() {
  const reduced = prefersReduced();
  const [ex, setEx] = useState(0);
  const [step, setStep] = useState<Step>(reduced ? 'done' : 'listen');
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    if (reduced) return; // hold the finished first example, no loop
    let exIdx = 0;
    const clear = () => { timers.current.forEach(clearTimeout); timers.current = []; };
    const runExample = () => {
      clear();
      setEx(exIdx);
      let t = 0;
      TIMELINE.forEach(({ step: s, dur }) => {
        timers.current.push(setTimeout(() => setStep(s), t));
        t += dur;
      });
      // advance to the next example after the full timeline
      timers.current.push(
        setTimeout(() => {
          exIdx = (exIdx + 1) % EXAMPLES.length;
          runExample();
        }, t),
      );
    };
    runExample();
    return clear;
  }, [reduced]);

  const example = EXAMPLES[ex];
  const r = rank(step);
  const live = step === 'listen';
  const showWave = step === 'listen'; // the wave owns the stage only while listening
  const showLine = r >= rank('raw');
  const done = step === 'done';
  const editLabel = EDIT_LABEL[step];

  return (
    <div className={`v2t reveal${live ? ' is-live' : ''}`} aria-hidden="true">
      {/* status — what's happening, and (when finished) which surface the tone matched */}
      <div className="v2t-status">
        <span className="v2t-status-label">
          <span className={`v2t-dot${live ? ' is-live' : ''}`} aria-hidden /> {STATUS_LABEL[step]}
        </span>
        <span className={`v2t-surface${done ? ' is-on' : ''}`}>{example.surface} tone</span>
      </div>

      {/* the stage — wave and text share the SAME box; the wave condenses into the words */}
      <div className="v2t-stage">
        <div className={`v2t-wave${showWave ? ' is-on' : ''}${live ? ' is-live' : ''}`} aria-hidden>
          {BARHEIGHTS.map((h, i) => (
            <span key={i} className="v2t-bar" style={{ animationDelay: `${i * 0.06}s`, ['--h' as string]: h }} />
          ))}
        </div>

        <p className={`v2t-line${showLine ? ' is-on' : ''}${done ? ' is-clean' : ''}`}>
          {example.tokens.map((tk, i) => {
            const isCut = tk.t === 'filler' && r >= rank('cut');
            // when each token flips to its formatted `out`
            const flip =
              (tk.t === 'fix' && r >= rank('fix')) ||
              (tk.t === 'keep' && r >= rank('punct'));
            const justFixed = tk.t === 'fix' && step === 'fix';
            const text = (flip && tk.out ? tk.out : tk.raw) + (i < example.tokens.length - 1 ? ' ' : '');
            return (
              <span
                key={i}
                className={
                  'v2t-tok' +
                  (tk.t === 'filler' ? ' is-filler' : '') +
                  (isCut ? ' is-cut' : '') +
                  (justFixed ? ' is-flash' : '') +
                  (flip ? ' is-out' : '')
                }
              >
                {text}
              </span>
            );
          })}
        </p>

        {/* the edit currently being applied — names the tool's work */}
        <span className={`v2t-edit${editLabel ? ' is-on' : ''}`} aria-hidden>
          {editLabel ?? ''}
        </span>
      </div>
    </div>
  );
}

// A fixed, organic set so the waveform reads as speech, not a uniform comb.
const BARHEIGHTS = [
  '0.30', '0.55', '0.40', '0.75', '0.50', '0.95', '0.62', '0.38', '1', '0.58',
  '0.82', '0.46', '0.70', '0.34', '0.60', '0.88', '0.50', '0.72', '0.42', '0.64',
];

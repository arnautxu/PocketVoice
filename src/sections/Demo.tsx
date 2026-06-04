import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Readout } from '../components/Readout';
import { useInViewOnce } from '../hooks/useInViewOnce';

/* ══════════════════════════════════════════════════════════════════════════════
 * DEMO — the condensation. The metaphor, enacted: you speak, and formless vapor
 * (raw words, Erode, blurred, drifting in cloud) precipitates into crisp ink
 * (Satoshi, razor-sharp, on clear ground). The 0→180 ms counter is the moment of
 * condensation. Web Speech API drives it live; a scripted line stands in elsewhere.
 * Movement 2: the receipts — 180 ms measured against the field.
 * ════════════════════════════════════════════════════════════════════════════ */

/* ── Web Speech API (not yet in all TS DOM libs) ─────────────────────────────── */
interface SR extends EventTarget {
  interimResults: boolean;
  continuous: boolean;
  maxAlternatives: number;
  lang: string;
  onresult: ((e: SREvent) => void) | null;
  onspeechend: (() => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}
interface SRResult { readonly isFinal: boolean; 0: { transcript: string } }
interface SREvent extends Event { results: SRResult[] & { length: number } }
type SRConstructor = new () => SR;
const getSR = (): SRConstructor | null =>
  ((window as unknown as Record<string, unknown>).SpeechRecognition as SRConstructor) ??
  ((window as unknown as Record<string, unknown>).webkitSpeechRecognition as SRConstructor) ??
  null;

type Phase = 'idle' | 'listening' | 'thinking' | 'reveal' | 'unsupported';

/* Polish: strip fillers, fix casing, add terminal punctuation. */
function polish(raw: string): string {
  let text = raw.trim();
  text = text.replace(
    /\b(um+|uh+|er+|ah+|like|you know|i mean|basically|actually|literally|right so|so um|kind of|sort of)\b,?\s*/gi,
    ' ',
  );
  text = text.replace(/\s+/g, ' ').trim();
  if (!text) return '';
  text = text.charAt(0).toUpperCase() + text.slice(1);
  text = text.replace(/\bi\b/g, 'I');
  if (!/[.!?…]$/.test(text)) text += '.';
  return text;
}

const ease = [0.4, 0, 0.2, 1] as const;
const snap = [0.16, 1, 0.3, 1] as const;

/* Droplet-streaks for the condensation seam — staggered so the precipitation reads
 * as continuous rain rather than a metronome. */
const SEAM_DRIPS = [
  { left: 14, delay: 0,    dur: 2.4 },
  { left: 30, delay: 0.9,  dur: 2.9 },
  { left: 46, delay: 0.4,  dur: 2.2 },
  { left: 60, delay: 1.4,  dur: 3.1 },
  { left: 74, delay: 0.7,  dur: 2.6 },
  { left: 88, delay: 1.8,  dur: 2.8 },
] as const;

/* Word-by-word condensation for the resolved ink: each word precipitates out of a
 * blur and settles sharp, staggered left→right — vapor becoming crisp text. */
const inkContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05, delayChildren: 0.04 } },
};
const inkWord = {
  // each word arrives out of the cloud — drifting in from the vapor side (left),
  // blurred, then settling razor-sharp on the ground.
  hidden: { opacity: 0, filter: 'blur(10px)', x: -12, y: 9 },
  show: {
    opacity: 1,
    filter: 'blur(0px)',
    x: 0,
    y: 0,
    transition: { duration: 0.42, ease: snap },
  },
};

export function Demo() {
  const [phase, setPhase] = useState<Phase>('idle');
  const [interim, setInterim] = useState('');
  const [polished, setPolished] = useState('');
  const recognitionRef = useRef<SR | null>(null);
  const transcriptRef = useRef('');

  useEffect(() => {
    if (!getSR()) setPhase('unsupported');
    return () => recognitionRef.current?.abort();
  }, []);

  const start = useCallback(() => {
    const SRC = getSR();
    if (!SRC) return;
    recognitionRef.current?.abort();

    const rec = new SRC();
    rec.interimResults = true;
    rec.continuous = false;
    rec.maxAlternatives = 1;
    recognitionRef.current = rec;
    transcriptRef.current = '';

    setPhase('listening');
    setInterim('');
    setPolished('');

    rec.onresult = (e: SREvent) => {
      let text = '';
      for (let i = 0; i < e.results.length; i++) text += e.results[i][0].transcript;
      transcriptRef.current = text;
      setInterim(text);
    };
    rec.onspeechend = () => rec.stop();
    rec.onend = () => {
      if (!transcriptRef.current) {
        setPhase('idle');
        return;
      }
      setPhase('thinking');
      window.setTimeout(() => {
        setPolished(polish(transcriptRef.current));
        setPhase('reveal');
      }, 420);
    };
    rec.onerror = () => setPhase('idle');
    rec.start();
  }, []);

  const reset = useCallback(() => {
    recognitionRef.current?.abort();
    setPhase('idle');
    setInterim('');
    setPolished('');
    transcriptRef.current = '';
  }, []);

  const showVapor = phase === 'listening' || (interim && phase !== 'reveal');

  return (
    <section id="demo" className="section-light alt-dark" style={{ position: 'relative', padding: 'var(--space-xl) 0' }}>
      <div className="rail" style={{ display: 'grid', gap: 'var(--space-lg)' }}>
        {/* ── Header ─────────────────────────────────────────────────────── */}
        <header style={{ display: 'grid', gap: '1.5rem', maxWidth: '24ch' }}>
          <Eyebrow>Try it &mdash; your microphone, right here</Eyebrow>
          <h2 className="vapor" style={{ margin: 0, fontSize: 'var(--step-5)', lineHeight: 1.0, letterSpacing: '-0.02em' }}>
            Say something.
            <br />
            {/* the words are still vapor here — white, not yet condensed. A blue
                accent on the blue sky fails AA (1.9:1); the italic carries the accent. */}
            <span style={{ color: 'var(--cloud-white)', fontStyle: 'italic' }}>Watch it condense.</span>
          </h2>
        </header>

        {/* ── Movement 1: the condensation ───────────────────────────────── */}
        <div
          className="condense-card"
          style={{
            position: 'relative',
            isolation: 'isolate',
            overflow: 'hidden',
            borderRadius: 14,
            border: '1px solid var(--rule-sky)',
            display: 'grid',
            gridTemplateColumns: '0.92fr 1.08fr',
          }}
        >
          {/* dramatic cumulus behind the vapor side */}
          <div className="cloud-bleed cloud-demo" aria-hidden style={{ inset: 0 }} />
          <div
            className="sky-scrim"
            aria-hidden
            style={{
              // veil the vapor column to a dark, stormy blue (cloud texture still
              // reads through) so the Erode vapor stays AA over even the brightest
              // cumulus; clears at the seam where the bright ink card begins
              background:
                'linear-gradient(100deg, rgba(7,19,42,0.88) 0%, rgba(7,19,42,0.84) 40%, rgba(7,19,42,0.42) 47%, rgba(7,19,42,0) 53%)',
            }}
          />

          {/* PRECIPITATION — the condensation falling at the seam. Droplet-streaks
              rain down where vapor meets ground; they intensify the moment the voice
              is in flight and condensing. */}
          <div
            className={`condense-seam${phase === 'listening' || phase === 'thinking' || phase === 'reveal' ? ' is-active' : ''}`}
            aria-hidden
          >
            {SEAM_DRIPS.map((d) => (
              <span
                key={d.left}
                className="drip"
                style={{ left: `${d.left}%`, animationDelay: `${d.delay}s`, animationDuration: `${d.dur}s` }}
              />
            ))}
          </div>

          {/* VAPOR — you say */}
          <div
            className="condense-vapor"
            style={{
              position: 'relative',
              minHeight: 'clamp(230px, 32vh, 300px)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.2rem',
              padding: 'clamp(1.6rem, 3.5vw, 2.6rem)',
            }}
          >
            <span className="track-label" style={{ color: 'rgba(234,240,248,0.92)' }}>
              <span className="rec-dot" aria-hidden style={{ opacity: phase === 'listening' ? 1 : 0.4 }} />
              you say
            </span>
            <motion.p
              aria-live="polite"
              className="vapor"
              initial={false}
              animate={
                phase === 'thinking'
                  // the moment of condensation: vapor is pulled across the seam and
                  // evaporates — blurring out, lifting, drifting toward the ink side
                  ? { filter: 'blur(16px)', opacity: 0, x: 52, y: -18 }
                  : phase === 'reveal'
                    // a faint residue lingers, soft against the razor-crisp ink
                    ? { filter: 'blur(5px)', opacity: 0.32, x: 0, y: 0 }
                    : showVapor
                      // live speech: nearly sharp, still hanging in the air
                      ? { filter: 'blur(0.6px)', opacity: 0.96, x: 0, y: 0 }
                      // idle: unresolved vapor, soft and translucent
                      : { filter: 'blur(6px)', opacity: 0.6, x: 0, y: 0 }
              }
              transition={{ duration: phase === 'thinking' ? 0.5 : 0.3, ease }}
              style={{
                margin: 0,
                fontSize: 'var(--step-3)',
                minHeight: '2.4em',
                willChange: 'filter, transform, opacity',
              }}
            >
              {phase === 'unsupported' ? (
                <span style={{ opacity: 0.85 }}>
                  Live mic needs Chrome or Safari. Sample:{' '}
                  &ldquo;um can you send the notes by friday&rdquo;
                </span>
              ) : interim ? (
                <>
                  {interim}
                  {phase === 'listening' && <LiveCaret />}
                </>
              ) : (
                <span style={{ opacity: 0.85 }}>
                  {phase === 'idle' ? 'Press the button and speak…' : ''}
                  {phase === 'listening' && <LiveCaret />}
                </span>
              )}
            </motion.p>
          </div>

          {/* INK — Pocket Voice writes, on clear ground */}
          <div
            className="condense-ink"
            style={{
              position: 'relative',
              // the ground. Its left edge is the seam: a thin mist where the dark
              // cloud bleeds in and resolves to Paper — so the two halves read as one
              // continuous condensation field, not two boxes with a rule between them.
              background:
                'linear-gradient(100deg, rgba(7,19,42,0.40) 0%, rgba(7,19,42,0) 6%), linear-gradient(180deg, var(--paper) 0%, var(--paper-deep) 100%)',
              borderLeft: 'none',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.2rem',
              padding: 'clamp(1.6rem, 3.5vw, 2.6rem)',
              // clear ground: resolve ink tokens to graphite so the Readout and any
              // ink-token consumer render dark on this bright panel (the section is
              // .alt-dark, which would otherwise make them cloud-white → invisible)
              ['--ink-0' as string]: 'var(--graphite)',
              ['--ink-1' as string]: 'var(--graphite-1)',
              ['--ink-2' as string]: 'var(--graphite-2)',
            }}
          >
            <span
              style={{
                display: 'flex',
                alignItems: 'baseline',
                justifyContent: 'space-between',
                gap: '1.5ch',
                flexWrap: 'wrap',
              }}
            >
              <span className="track-label" style={{ color: 'var(--graphite-2)' }}>Pocket&nbsp;Voice writes</span>
              {(phase === 'reveal' || phase === 'thinking') && (
                <Readout run={phase === 'reveal'} size="var(--step-1)" />
              )}
            </span>
            <div style={{ minHeight: '2.4em', display: 'grid', gap: '0.7rem', alignContent: 'start' }}>
              <AnimatePresence mode="wait">
                {phase === 'reveal' ? (
                  <motion.div key="out" initial={false} style={{ display: 'grid', gap: '0.7rem' }}>
                    {/* Precipitation: each word condenses out of the blur and settles
                        razor-sharp, left to right, like droplets resolving on glass. */}
                    <motion.p
                      className="ink-out"
                      variants={inkContainer}
                      initial="hidden"
                      animate="show"
                      style={{ margin: 0, fontSize: 'var(--step-3)' }}
                    >
                      {polished.split(' ').map((w, i) => (
                        <motion.span
                          key={`${i}-${w}`}
                          variants={inkWord}
                          style={{ display: 'inline-block', marginRight: '0.28em', willChange: 'filter, transform, opacity' }}
                        >
                          {w}
                        </motion.span>
                      ))}
                    </motion.p>
                    <div className="ink-baseline" aria-hidden />
                  </motion.div>
                ) : (
                  <motion.span
                    key="status"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    style={{
                      color: 'var(--graphite-2)',
                      fontSize: 'var(--step-1)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '1ch',
                    }}
                  >
                    {phase === 'thinking' && <Pulse />}
                    {phase === 'thinking' ? 'condensing…' : 'waiting for your voice'}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Controls — span both columns, on the clear ground */}
          <div
            className="condense-controls"
            style={{
              gridColumn: '1 / -1',
              background: 'var(--paper-deep)',
              borderTop: '1px solid var(--rule)',
              padding: 'clamp(1.1rem, 3vw, 1.6rem) clamp(1.6rem, 3.5vw, 2.6rem)',
              display: 'flex',
              gap: '1.5ch',
              alignItems: 'center',
              flexWrap: 'wrap',
            }}
          >
            {phase === 'unsupported' ? (
              <span style={{ color: 'var(--graphite-2)', fontSize: 'var(--step--1)' }}>
                Open in Chrome or Safari to try your own voice.
              </span>
            ) : phase !== 'reveal' ? (
              <MicButton
                active={phase === 'listening'}
                disabled={phase === 'thinking'}
                onClick={phase === 'listening' ? reset : start}
              />
            ) : (
              <>
                <PillButton onClick={start} filled>
                  <RecIcon /> try again
                </PillButton>
                <PillButton onClick={reset}>clear</PillButton>
              </>
            )}
            {phase === 'listening' && (
              <span style={{ color: 'var(--graphite-2)', fontSize: 'var(--step--1)', letterSpacing: '0.04em' }}>
                speak now &middot; click again to stop
              </span>
            )}
          </div>
        </div>

        {/* ── Movement 2: the receipts ───────────────────────────────────── */}
        <SpeedProof />
      </div>
    </section>
  );
}

/* ── Speed proof ─────────────────────────────────────────────────────────────── */
const ROWS = [
  { name: 'Pocket Voice', ms: 180, primary: true },
  { name: 'Wispr Flow', ms: 460, primary: false },
  { name: 'Superwhisper', ms: 540, primary: false },
  { name: 'Aqua Voice', ms: 610, primary: false },
  { name: 'Apple Dictation', ms: 920, primary: false },
];
const MAX = Math.max(...ROWS.map((r) => r.ms));

function SpeedProof() {
  const [ref, inView] = useInViewOnce<HTMLDivElement>('-15% 0px');
  return (
    <div ref={ref} style={{ display: 'grid', gap: 'var(--space-sm)' }}>
      <header style={{ display: 'grid', gap: '0.75rem' }}>
        <h3 className="vapor" style={{ margin: 0, fontWeight: 400, fontSize: 'var(--step-2)', letterSpacing: '-0.02em' }}>
          180&nbsp;ms, measured.
        </h3>
        <p className="tabular" style={{ margin: 0, color: 'var(--ink-2)', fontSize: 'var(--step--1)' }}>
          iPhone 15 Pro &middot; 30-second utterance &middot; 50-run median &middot; April 2026.
        </p>
      </header>
      <ol style={{ margin: 0, padding: 0, listStyle: 'none', display: 'grid', gap: 0 }}>
        {ROWS.map((r, i) => (
          <Bar key={r.name} row={r} index={i} active={inView} />
        ))}
      </ol>
    </div>
  );
}

function Bar({ row, index, active }: { row: (typeof ROWS)[number]; index: number; active: boolean }) {
  const target = (row.ms / MAX) * 100;
  const [count, setCount] = useState(0);
  const raf = useRef(0);

  useEffect(() => {
    if (!active) return;
    let start = 0;
    const dur = 1000 + index * 100;
    const tick = (now: number) => {
      if (!start) start = now;
      const t = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - t, 4);
      setCount(Math.round(row.ms * eased));
      if (t < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [active, row.ms, index]);

  return (
    <li
      className="speed-bar"
      style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 3fr) auto',
        gap: '2ch',
        alignItems: 'center',
        padding: '1.25ch 0',
        borderBottom: '1px solid var(--rule-sky)',
      }}
    >
      <span
        className="speed-bar-name"
        style={{
          color: row.primary ? 'var(--cloud-white)' : 'var(--ink-1)',
          fontSize: 'var(--step-0)',
          fontWeight: row.primary ? 600 : 400,
        }}
      >
        {row.name}
      </span>
      <div className="bar-track" style={{ background: 'var(--rule-sky)' }}>
        <motion.span
          className="bar-fill"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: active ? target / 100 : 0 }}
          transition={{ duration: 1.0 + index * 0.1, ease, delay: index * 0.04 }}
          // Winner = solid cloud-white; competitors dimmed. (Pocket Blue is only
          // ~1.4:1 on the blue sky here — the bold white number + solid short bar is
          // the standout, not colour.)
          style={{ background: 'var(--cloud-white)', opacity: row.primary ? 1 : 0.42 }}
        />
      </div>
      <span
        className="tabular"
        style={{
          color: row.primary ? 'var(--cloud-white)' : 'var(--ink-1)',
          fontSize: 'var(--step-0)',
          minWidth: '5.5ch',
          textAlign: 'right',
          fontWeight: row.primary ? 700 : 400,
        }}
      >
        {count}
        <span style={{ color: row.primary ? 'var(--ink-1)' : 'var(--ink-2)', marginLeft: '0.5ch', fontSize: 'var(--step--1)' }}>ms</span>
      </span>
    </li>
  );
}

/* ── Controls & bits ─────────────────────────────────────────────────────────── */
function MicButton({ active, disabled, onClick }: { active: boolean; disabled: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={active ? 'Stop recording' : 'Press to speak'}
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '1ch',
        padding: '0.85ch 2ch',
        // idle = Pocket Black (brand token, not a near-black default); recording
        // flips to Pocket Blue (the live/primary signal).
        border: '1px solid var(--pocket-black)',
        background: active ? 'var(--live)' : 'var(--pocket-black)',
        borderColor: active ? 'var(--live)' : 'var(--pocket-black)',
        color: 'var(--paper)',
        fontSize: 'var(--step--1)',
        fontWeight: 500,
        letterSpacing: '0.04em',
        borderRadius: 6,
        cursor: disabled ? 'default' : 'pointer',
        opacity: disabled ? 0.45 : 1,
        transition: 'background 120ms var(--ease), transform 100ms var(--ease)',
      }}
      onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.97)'; }}
      onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
    >
      {active ? <StopIcon /> : <RecIcon />}
      {active ? 'stop' : 'press to speak'}
      {active && <ListeningRing />}
    </button>
  );
}

function PillButton({ onClick, filled, children }: { onClick: () => void; filled?: boolean; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '1ch',
        padding: '0.8ch 1.75ch',
        border: '1px solid var(--graphite)',
        background: 'transparent',
        color: filled ? 'var(--graphite)' : 'var(--graphite-2)',
        borderColor: filled ? 'var(--graphite)' : 'var(--rule-strong)',
        fontSize: 'var(--step--1)',
        fontWeight: 500,
        letterSpacing: '0.04em',
        borderRadius: 6,
        cursor: 'pointer',
        transition: 'background 120ms var(--ease), color 120ms var(--ease)',
      }}
      onMouseEnter={(e) => {
        if (!filled) return;
        e.currentTarget.style.background = 'var(--graphite)';
        e.currentTarget.style.color = 'var(--paper)';
      }}
      onMouseLeave={(e) => {
        if (!filled) return;
        e.currentTarget.style.background = 'transparent';
        e.currentTarget.style.color = 'var(--graphite)';
      }}
    >
      {children}
    </button>
  );
}

function ListeningRing() {
  return (
    <span
      aria-hidden
      style={{
        position: 'absolute',
        inset: -4,
        borderRadius: 8,
        border: '1px solid var(--live)',
        opacity: 0.5,
        animation: 'pv-pulse 1.6s ease-out infinite',
        pointerEvents: 'none',
      }}
    />
  );
}

function LiveCaret() {
  return (
    <span
      aria-hidden
      style={{
        display: 'inline-block',
        width: 2,
        height: '0.9em',
        background: 'var(--live)',
        marginLeft: '0.2ch',
        verticalAlign: 'text-bottom',
        animation: 'pv-caret 1.2s linear infinite',
      }}
    />
  );
}

function Pulse() {
  return (
    <span style={{ position: 'relative', display: 'inline-block', width: 8, height: 8 }}>
      <span style={{ position: 'absolute', inset: 0, borderRadius: 999, background: 'var(--live)' }} />
      <span
        style={{
          position: 'absolute',
          inset: -3,
          borderRadius: 999,
          border: '1px solid var(--live)',
          opacity: 0.5,
          animation: 'pv-pulse 1.4s ease-out infinite',
        }}
      />
    </span>
  );
}

function RecIcon() {
  return (
    <svg width="11" height="14" viewBox="0 0 11 14" fill="none" aria-hidden>
      <rect x="3" y="0" width="5" height="9" rx="2.5" fill="currentColor" />
      <path d="M1 6.5C1 9.26 3.01 11.5 5.5 11.5S10 9.26 10 6.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      <line x1="5.5" y1="11.5" x2="5.5" y2="13.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function StopIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden>
      <rect x="1" y="1" width="8" height="8" fill="currentColor" />
    </svg>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="track-label" style={{ color: 'var(--ink-1)' }}>
      <span aria-hidden style={{ display: 'inline-block', width: '2ch', height: 1, background: 'var(--ink-2)' }} />
      {children}
    </span>
  );
}

import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Readout } from '../components/Readout';
import { useInViewOnce } from '../hooks/useInViewOnce';

/* ══════════════════════════════════════════════════════════════════════════════
 * DEMO — "Try it." The condensation, enacted as a vertical TRANSFORMATION COLUMN:
 * vapor at the top (the raw transcript, with real disfluencies) precipitates DOWN
 * into ink at the bottom (the composed message, crisp Pocket Black). A real circular
 * mic button sits below, with a live Web-Audio waveform bridging it up into the panel
 * so button + column read as one instrument. Web Speech API drives it live; a
 * convincing scripted line stands in when there's no recognition or mic permission.
 * Movement 2 (the receipts) follows.
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
  onerror: ((e: { error?: string }) => void) | null;
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

type Phase = 'idle' | 'listening' | 'composing' | 'done';

/* ── Language helpers — strip fillers, mark the diff, compose the clean line ───── */
const FILLER_PHRASE = /\b(um+|uh+|er+|ah+|hmm+|like|you know|i mean|kind of|sort of|sorta|kinda|basically|actually|literally|right so|so um|i guess)\b[,]?\s*/gi;
const FILLER_WORD = /^(um+|uh+|er+|ah+|hmm+|like|basically|actually|literally|so|well|just|really|okay|ok)$/i;
const WEEKDAYS = /\b(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/gi;
const clean = (w: string) => w.toLowerCase().replace(/[.,!?…]/g, '');

/** Compose the finished message: strip fillers, collapse stutters, fix casing + stops. */
function compose(raw: string): string {
  let text = ` ${raw.trim()} `.replace(FILLER_PHRASE, ' ');
  text = text.replace(/\b(\w+)(\s+\1\b)+/gi, '$1');           // collapse repeated words ("the the")
  text = text.replace(/\s+([,.!?])/g, '$1').replace(/\s+/g, ' ').trim();
  if (!text) return '';
  text = text.charAt(0).toUpperCase() + text.slice(1);
  text = text.replace(/\bi\b/g, 'I');
  text = text.replace(WEEKDAYS, (d) => d.charAt(0).toUpperCase() + d.slice(1).toLowerCase());
  if (!/[.!?…]$/.test(text)) text += /\b(can|could|would|will|are|do|does|did|is|may)\b/i.test(text.split(' ')[0]) ? '?' : '.';
  return text;
}

/** Tokenise the raw transcript and flag which words get removed (the diff). */
function diff(raw: string): { w: string; cut: boolean }[] {
  const words = raw.trim().split(/\s+/).filter(Boolean);
  const out: { w: string; cut: boolean }[] = [];
  for (let i = 0; i < words.length; i++) {
    const lw = clean(words[i]);
    const next = clean(words[i + 1] || '');
    if ((lw === 'you' && next === 'know') || (lw === 'i' && next === 'mean') ||
        (lw === 'kind' && next === 'of') || (lw === 'sort' && next === 'of')) {
      out.push({ w: words[i], cut: true });
      out.push({ w: words[++i], cut: true });
      continue;
    }
    const dup = i > 0 && lw === clean(words[i - 1]) && lw.length > 1;
    out.push({ w: words[i], cut: FILLER_WORD.test(lw) || dup });
  }
  return out;
}

const RAW_SCRIPT = 'um can you send me the the notes by friday like before the standup';

/* Idle preview — a faint "before / after" ghost so the panel is never dead space and
 * the payoff is telegraphed before the first tap. */
const GHOST_RAW = 'um can you send the notes by friday';
const GHOST_INK = 'Can you send the notes by Friday?';

const EASE = [0.4, 0, 0.2, 1] as const;
const SNAP = [0.16, 1, 0.3, 1] as const;

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);
  return reduced;
}

const METRICS = [
  { figure: '180', unit: 'ms', label: 'end of speech to text' },
  { figure: '108', unit: '', label: 'languages, no toggle' },
  { figure: '94', unit: '%', label: 'tone match, human-rated' },
] as const;

export function Demo() {
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState<Phase>('idle');
  const [scripted, setScripted] = useState(false);
  const [interim, setInterim] = useState('');
  const [tokens, setTokens] = useState<{ w: string; cut: boolean }[]>([]);
  const [composed, setComposed] = useState('');
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);

  const recRef = useRef<SR | null>(null);
  const transcriptRef = useRef('');
  const doneRef = useRef(false);   // guards a single compose per run (onend + manual stop can race)
  const audioRef = useRef<{ ctx?: AudioContext; stream?: MediaStream; src?: MediaStreamAudioSourceNode }>({});
  const timers = useRef<number[]>([]);

  const clearTimers = () => { timers.current.forEach(clearTimeout); timers.current.forEach(clearInterval); timers.current = []; };

  const stopAudio = useCallback(() => {
    const a = audioRef.current;
    try { a.src?.disconnect(); } catch { /* noop */ }
    a.stream?.getTracks().forEach((t) => t.stop());
    a.ctx?.close().catch(() => { /* noop */ });
    audioRef.current = {};
    setAnalyser(null);
  }, []);

  const finalize = useCallback((raw: string) => {
    if (doneRef.current) return;        // already composing/composed this run
    doneRef.current = true;
    stopAudio();
    if (!raw.trim()) { setPhase('idle'); return; }
    transcriptRef.current = raw;
    setInterim(raw);
    setTokens(diff(raw));
    setPhase('composing');
    timers.current.push(window.setTimeout(() => {
      setComposed(compose(raw));
      setPhase('done');
    }, reduced ? 240 : 520));
  }, [reduced, stopAudio]);

  const runScripted = useCallback(() => {
    doneRef.current = false;
    setScripted(true);
    setPhase('listening');
    setInterim('');
    setComposed('');
    setTokens([]);
    const words = RAW_SCRIPT.split(' ');
    let i = 0;
    const stream = window.setInterval(() => {
      i += 1;
      setInterim(words.slice(0, i).join(' '));
      if (i >= words.length) {
        clearInterval(stream);
        timers.current.push(window.setTimeout(() => finalize(RAW_SCRIPT), reduced ? 300 : 700));
      }
    }, reduced ? 40 : 115);
    timers.current.push(stream);
  }, [finalize, reduced]);

  const startSR = useCallback((SRC: SRConstructor) => {
    recRef.current?.abort();
    const rec = new SRC();
    rec.interimResults = true;
    rec.continuous = false;
    rec.maxAlternatives = 1;
    recRef.current = rec;
    transcriptRef.current = '';
    doneRef.current = false;
    setScripted(false);
    setPhase('listening');
    setInterim('');
    setComposed('');
    setTokens([]);

    let errored = '';
    rec.onresult = (e: SREvent) => {
      let text = '';
      for (let i = 0; i < e.results.length; i++) text += e.results[i][0].transcript;
      transcriptRef.current = text;
      setInterim(text);
    };
    // Natural end-of-utterance pause → stop → compose.
    rec.onspeechend = () => rec.stop();
    // The single compose path. `aborted`/`no-speech` are benign (we stopped on
    // purpose) — compose what we have; only a denied/blocked mic falls to scripted.
    rec.onend = () => {
      if (transcriptRef.current.trim()) finalize(transcriptRef.current);
      else if (errored === 'not-allowed' || errored === 'service-not-allowed') { stopAudio(); runScripted(); }
      else { stopAudio(); setPhase('idle'); }
    };
    rec.onerror = (e) => { errored = e.error ?? 'error'; };
    rec.start();
  }, [finalize, runScripted, stopAudio]);

  const start = useCallback(async () => {
    clearTimers();
    const SRC = getSR();
    if (!SRC) { runScripted(); return; }
    // One permission prompt for the mic; the analyser drives the live waveform and
    // grants Speech Recognition reuse of the same permission. Denied → scripted.
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const Ctx = (window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext);
      const ctx = new Ctx();
      const src = ctx.createMediaStreamSource(stream);
      const an = ctx.createAnalyser();
      an.fftSize = 128;
      an.smoothingTimeConstant = 0.82;
      src.connect(an);
      audioRef.current = { ctx, stream, src };
      setAnalyser(an);
    } catch {
      runScripted();
      return;
    }
    try { startSR(SRC); } catch { stopAudio(); runScripted(); }
  }, [runScripted, startSR, stopAudio]);

  const onTap = useCallback(() => {
    if (phase === 'listening') {
      if (scripted) { clearTimers(); finalize(interim || RAW_SCRIPT); }
      else recRef.current?.stop();
    } else if (phase === 'idle' || phase === 'done') {
      start();
    }
  }, [phase, scripted, interim, finalize, start]);

  useEffect(() => () => { clearTimers(); recRef.current?.abort(); stopAudio(); }, [stopAudio]);

  return (
    <section id="demo" className="section-light alt-dark" style={{ position: 'relative', padding: 'var(--space-xl) 0' }}>
      <div className="rail" style={{ display: 'grid', gap: 'var(--space-xl)' }}>
        <div className="demo-grid">
          {/* ── LEFT: the copy ─────────────────────────────────────────────── */}
          <div className="demo-copy">
            <Eyebrow>Try it &mdash; your microphone, right here</Eyebrow>
            <h2
              className="vapor"
              style={{ margin: '1.4rem 0 0', fontSize: 'var(--step-4)', lineHeight: 1.02, letterSpacing: '-0.02em' }}
            >
              Say something.
              <br />
              {/* blue on the blue sky fails AA; the italic carries the accent (brand rule) */}
              <span style={{ color: 'var(--cloud-white)', fontStyle: 'italic' }}>Watch it condense.</span>
            </h2>
            <p style={{ margin: '1.4rem 0 0', maxWidth: '34ch', fontSize: 'var(--step-0)', lineHeight: 1.55, color: 'var(--ink-1)' }}>
              Talk the way you actually talk &mdash; fillers, false starts and all. Pocket&nbsp;Voice
              strikes the noise and lands the finished message in&nbsp;ink.
            </p>

            <dl className="demo-metrics">
              {METRICS.map((m) => (
                <div key={m.label} style={{ display: 'grid', gap: '0.35ch' }}>
                  <dd className="tabular" style={{ margin: 0, fontWeight: 600, fontSize: 'var(--step-2)', color: 'var(--cloud-white)', letterSpacing: '-0.02em', lineHeight: 1 }}>
                    {m.figure}
                    {m.unit && <span style={{ fontSize: '0.5em', fontWeight: 500, color: 'var(--ink-1)', marginLeft: '0.3ch', letterSpacing: '0.02em' }}>{m.unit}</span>}
                  </dd>
                  <dt style={{ fontSize: 'var(--step--1)', color: 'var(--ink-2)' }}>{m.label}</dt>
                </div>
              ))}
            </dl>
          </div>

          {/* ── RIGHT: the demo (panel + waveform + mic) ────────────────────── */}
          <div className="demo-stage">
            <TransformPanel phase={phase} scripted={scripted} interim={interim} tokens={tokens} composed={composed} reduced={reduced} />
            <MicControl phase={phase} scripted={scripted} analyser={analyser} reduced={reduced} onTap={onTap} />
          </div>
        </div>

        {/* ── Movement 2: the receipts ───────────────────────────────────── */}
        <SpeedProof />
      </div>
    </section>
  );
}

/* ── The vertical transformation column ───────────────────────────────────────── */
function TransformPanel({
  phase, scripted, interim, tokens, composed, reduced,
}: {
  phase: Phase; scripted: boolean; interim: string;
  tokens: { w: string; cut: boolean }[]; composed: string; reduced: boolean;
}) {
  const live = phase === 'listening';
  const resolving = phase === 'composing' || phase === 'done';
  const idle = phase === 'idle';
  const pad = 'clamp(1.4rem, 3vw, 1.9rem)';

  return (
    <div className="demo-panel" aria-label="Live transcription">
      {/* device chrome — a sheet handle reads the panel as a considered object */}
      <span className="demo-panel-handle" aria-hidden />

      {/* VAPOR — what we heard (softer, greyer, looser) */}
      <div className="demo-zone demo-zone--vapor" style={{ padding: `clamp(1.6rem,3.4vw,2.1rem) ${pad} clamp(1.1rem,2.4vw,1.5rem)` }}>
        <span className="track-label" style={{ color: 'var(--graphite-2)' }}>
          <span className="rec-dot" aria-hidden style={{ opacity: live ? 1 : 0.2, animationPlayState: live ? 'running' : 'paused' }} />
          Heard
        </span>
        <p aria-live="polite" className="demo-heard">
          {idle ? (
            <span style={{ opacity: 0.5 }}>
              {GHOST_RAW.split(' ').map((w, i) => (
                <span key={i} style={{ marginRight: '0.3em', textDecoration: /^(um|the)$/i.test(w) ? 'line-through' : 'none', textDecorationColor: 'var(--ash)', color: 'var(--graphite-2)' }}>{w}</span>
              ))}
            </span>
          ) : resolving ? (
            tokens.map((t, i) => (
              <motion.span
                key={`${i}-${t.w}`}
                initial={false}
                animate={t.cut
                  ? { opacity: reduced ? 0.3 : 0.32, y: reduced ? 0 : -3, filter: reduced ? 'blur(0px)' : 'blur(0.5px)' }
                  : { opacity: 0.92, y: 0 }}
                transition={{ duration: 0.55, ease: EASE, delay: reduced ? 0 : Math.min(i * 0.03, 0.45) }}
                style={{
                  display: 'inline-block', marginRight: '0.3em',
                  color: t.cut ? 'var(--graphite-2)' : 'var(--graphite-1)',
                  textDecoration: t.cut ? 'line-through' : 'none', textDecorationColor: 'var(--ash)',
                }}
              >
                {t.w}
              </motion.span>
            ))
          ) : (
            <>
              {interim || <span style={{ color: 'var(--graphite-2)' }}>Listening&hellip;</span>}
              {live && <LiveCaret />}
            </>
          )}
        </p>
      </div>

      {/* SEAM — the fall: vapor precipitates into ink */}
      <div className="demo-seam" aria-hidden>
        <Precipitation active={resolving && !reduced} />
        <ChevronDown active={resolving} />
      </div>

      {/* INK — the composed message (crisp, on cleaner ground) */}
      <div className="demo-zone demo-zone--ink" style={{ padding: `clamp(1.1rem,2.4vw,1.5rem) ${pad} clamp(1.6rem,3.4vw,2.1rem)` }}>
        <span style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '1ch' }}>
          <span className="track-label" style={{ color: 'var(--graphite-2)' }}>Composed</span>
          {resolving && (
            <motion.span
              key={phase}
              initial={false}
              animate={phase === 'done' && !reduced ? { scale: [1, 1.16, 1] } : {}}
              transition={{ duration: 0.5, times: [0, 0.3, 1], ease: EASE }}
              style={{ transformOrigin: 'right center' }}
            >
              <Readout run={resolving} size="var(--step-0)" />
            </motion.span>
          )}
        </span>
        <div style={{ minHeight: '3.2em', display: 'grid', alignContent: 'start' }}>
          <AnimatePresence mode="wait">
            {phase === 'done' ? (
              <motion.p
                key="ink"
                className="demo-ink"
                initial="hidden" animate="show"
                variants={{ hidden: {}, show: { transition: { staggerChildren: reduced ? 0 : 0.05, delayChildren: 0.05 } } }}
              >
                {composed.split(' ').map((w, i) => (
                  <motion.span
                    key={`${i}-${w}`}
                    variants={reduced
                      ? { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.2 } } }
                      : { hidden: { opacity: 0, filter: 'blur(9px)', y: -10 }, show: { opacity: 1, filter: 'blur(0px)', y: 0, transition: { duration: 0.46, ease: SNAP } } }}
                    style={{ display: 'inline-block', marginRight: '0.28em', willChange: 'filter, transform, opacity' }}
                  >
                    {w}
                  </motion.span>
                ))}
              </motion.p>
            ) : idle ? (
              <p className="demo-ink" style={{ opacity: 0.4 }}>{GHOST_INK}</p>
            ) : (
              <motion.span
                key="status"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
                style={{ color: 'var(--graphite-2)', fontSize: 'var(--step-0)', display: 'inline-flex', alignItems: 'center', gap: '1ch' }}
              >
                {phase === 'composing' ? <><Pulse /> Composing…</> : 'Keep going — pause when you’re done.'}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
        {scripted && phase === 'done' && (
          <span style={{ fontSize: 'var(--step--1)', color: 'var(--graphite-2)' }}>
            Sample run &mdash; open in Chrome or Safari and allow the mic to use your own voice.
          </span>
        )}
      </div>
    </div>
  );
}

function ChevronDown({ active }: { active: boolean }) {
  return (
    <span aria-hidden className="demo-seam-chevron" style={{ opacity: active ? 1 : 0 }}>
      <svg width="16" height="9" viewBox="0 0 16 9" fill="none">
        <path d="M1 1l7 6 7-6" stroke="var(--pocket-blue)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

/* Falling droplet-streaks at the seam — condensation, only while resolving. */
const DRIPS = [{ l: 18, d: 0 }, { l: 40, d: 0.5 }, { l: 58, d: 0.2 }, { l: 78, d: 0.7 }] as const;
function Precipitation({ active }: { active: boolean }) {
  return (
    <div style={{ position: 'absolute', inset: '0 0 auto 0', height: 0, opacity: active ? 1 : 0, transition: 'opacity 300ms var(--ease)' }}>
      {DRIPS.map((d) => (
        <span
          key={d.l}
          style={{
            position: 'absolute',
            top: 0,
            left: `${d.l}%`,
            width: 1,
            height: 26,
            background: 'linear-gradient(180deg, transparent, rgba(14,142,206,0.5), transparent)',
            animation: active ? `pv-precip 2.4s linear ${d.d}s infinite` : 'none',
          }}
        />
      ))}
    </div>
  );
}

/* ── Mic control: circular Pocket-Blue button + live waveform bridge ──────────── */
function MicControl({
  phase, scripted, analyser, reduced, onTap,
}: {
  phase: Phase; scripted: boolean; analyser: AnalyserNode | null; reduced: boolean; onTap: () => void;
}) {
  const live = phase === 'listening';
  const composing = phase === 'composing';

  const label =
    phase === 'listening' ? 'Listening — tap to stop'
    : phase === 'composing' ? 'Composing your message'
    : phase === 'done' ? 'Tap to record again'
    : 'Tap to speak';

  const waveState: WaveState = live ? (scripted ? 'sim' : 'live') : composing ? 'settle' : phase === 'done' ? 'rest' : 'idle';

  return (
    <div className="demo-mic">
      {/* the bridge: a recessed track that carries the waveform down from the panel
          into the button, so column + control read as one instrument */}
      <div className={`demo-bridge${live ? ' is-live' : ''}`}>
        <Waveform analyser={analyser} state={waveState} reduced={reduced} />
      </div>
      <span className="demo-connector" aria-hidden />

      <button
        type="button"
        onClick={onTap}
        disabled={composing}
        aria-label={label}
        aria-pressed={live}
        className={`demo-mic-btn${live ? ' is-live' : ''}`}
        style={{ opacity: composing ? 0.55 : 1, cursor: composing ? 'default' : 'pointer' }}
      >
        {live ? <StopGlyph /> : <MicGlyph />}
        {live && !reduced && <span className="demo-mic-ring" aria-hidden />}
        {idleState(phase) && !reduced && <span className="demo-mic-ring demo-mic-ring--idle" aria-hidden />}
      </button>

      <span aria-live="polite" className="demo-mic-label">
        {composing ? <><Pulse light /> {label}</> : label}
      </span>
    </div>
  );
}

const idleState = (p: Phase) => p === 'idle' || p === 'done';

type WaveState = 'idle' | 'live' | 'sim' | 'settle' | 'rest';
const BARS = 33;
function Waveform({ analyser, state, reduced }: { analyser: AnalyserNode | null; state: WaveState; reduced: boolean }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = ref.current;
    if (!host) return;
    const bars = Array.from(host.children) as HTMLElement[];

    const mid = (BARS - 1) / 2;

    if (reduced) {
      // static, gentle — no animation loop. A calm centre-weighted shape, not a line.
      bars.forEach((b, i) => {
        const dist = Math.abs(i - mid) / mid;
        const v = (state === 'live' || state === 'sim') ? 0.4 - dist * 0.28 : 0.2 - dist * 0.12;
        b.style.transform = `scaleY(${Math.max(0.1, v)})`;
        b.style.opacity = (state === 'live' || state === 'sim') ? '1' : '0.55';
      });
      return;
    }

    let raf = 0;
    let t = 0;
    const data = analyser ? new Uint8Array(analyser.frequencyBinCount) : null;

    const draw = () => {
      t += 0.016;
      if (state === 'live' && analyser && data) analyser.getByteFrequencyData(data);
      for (let i = 0; i < bars.length; i++) {
        const dist = Math.abs(i - mid) / mid;             // 0 centre → 1 edge
        const taper = 1 - dist * 0.55;                    // centre-weighted envelope
        let v: number;
        if (state === 'live' && analyser && data) {
          const bin = Math.floor(dist * data.length * 0.7);
          v = (data[bin] / 255) * 2.4 * taper + 0.08;
        } else if (state === 'sim') {
          v = (0.26 + Math.abs(Math.sin(t * 7 + i * 0.55)) * (0.7 + 0.3 * Math.sin(t * 2.7 + i)) * 0.7) * taper;
        } else if (state === 'settle') {
          v = (0.14 + 0.06 * Math.sin(t * 3 + i)) * taper;
        } else if (state === 'rest') {
          v = 0.1 * taper + 0.05;
        } else {
          // idle: a soft, breathing presence — inviting, never a dead line
          v = (0.16 + 0.1 * (0.5 + 0.5 * Math.sin(t * 1.7 + i * 0.5))) * taper;
        }
        bars[i].style.transform = `scaleY(${Math.max(0.07, Math.min(1, v))})`;
        bars[i].style.opacity = state === 'live' || state === 'sim' ? '1' : state === 'idle' ? '0.62' : '0.8';
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [analyser, state, reduced]);

  return (
    <div ref={ref} className="demo-wave" aria-hidden>
      {Array.from({ length: BARS }).map((_, i) => (
        <span key={i} className="demo-wave-bar" />
      ))}
    </div>
  );
}

/* ── Speed proof (Movement 2) — unchanged ─────────────────────────────────────── */
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
        style={{ color: row.primary ? 'var(--cloud-white)' : 'var(--ink-1)', fontSize: 'var(--step-0)', fontWeight: row.primary ? 600 : 400 }}
      >
        {row.name}
      </span>
      <div className="bar-track" style={{ background: 'var(--rule-sky)' }}>
        <motion.span
          className="bar-fill"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: active ? target / 100 : 0 }}
          transition={{ duration: 1.0 + index * 0.1, ease: EASE, delay: index * 0.04 }}
          style={{ background: 'var(--cloud-white)', opacity: row.primary ? 1 : 0.42 }}
        />
      </div>
      <span
        className="tabular"
        style={{ color: row.primary ? 'var(--cloud-white)' : 'var(--ink-1)', fontSize: 'var(--step-0)', minWidth: '5.5ch', textAlign: 'right', fontWeight: row.primary ? 700 : 400 }}
      >
        {count}
        <span style={{ color: row.primary ? 'var(--ink-1)' : 'var(--ink-2)', marginLeft: '0.5ch', fontSize: 'var(--step--1)' }}>ms</span>
      </span>
    </li>
  );
}

/* ── Bits ─────────────────────────────────────────────────────────────────────── */
function LiveCaret() {
  return (
    <span aria-hidden style={{ display: 'inline-block', width: 2, height: '0.95em', background: 'var(--pocket-blue)', marginLeft: '0.2ch', verticalAlign: 'text-bottom', animation: 'pv-caret 1.2s linear infinite' }} />
  );
}

function Pulse({ light }: { light?: boolean }) {
  const c = light ? 'var(--pocket-blue)' : 'var(--live)';
  return (
    <span style={{ position: 'relative', display: 'inline-block', width: 8, height: 8 }}>
      <span style={{ position: 'absolute', inset: 0, borderRadius: 999, background: c }} />
      <span style={{ position: 'absolute', inset: -3, borderRadius: 999, border: `1px solid ${c}`, opacity: 0.5, animation: 'pv-pulse 1.4s ease-out infinite' }} />
    </span>
  );
}

function MicGlyph() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="9" y="2.5" width="6" height="11.5" rx="3" fill="currentColor" />
      <path d="M5.5 11a6.5 6.5 0 0 0 13 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <line x1="12" y1="17.5" x2="12" y2="21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function StopGlyph() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden>
      <rect x="6" y="6" width="10" height="10" rx="2.5" fill="currentColor" />
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

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { Caret } from '../components/Caret';
import { InstallButton } from '../components/InstallButton';
import { Wordmark } from '../components/Wordmark';
import { HeroScene } from '../scene/HeroScene';

/* ── Typewriter ──────────────────────────────────────────────────────────── */
/* Recursive setTimeout — each char gets its own delay.                       */
/* Sine ease-in-out: slow start → fast middle → slow end. ±20% jitter.       */
function useTypeIn(text: string, startMs: number, msPerChar = 14) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let tid: number;
    const outer = window.setTimeout(() => {
      let i = 0;
      const tick = () => {
        i++;
        setCount(i);
        if (i < text.length) {
          tid = window.setTimeout(tick, heroCharDelay(i, text, msPerChar));
        }
      };
      tid = window.setTimeout(tick, heroCharDelay(0, text, msPerChar));
    }, startMs);
    return () => { clearTimeout(outer); clearTimeout(tid); };
  }, [text, startMs, msPerChar]);
  return count;
}

function heroCharDelay(i: number, text: string, base: number): number {
  const t = text.length > 1 ? i / (text.length - 1) : 0.5;
  const speed = 0.3 + 0.7 * Math.sin(t * Math.PI);
  const prev = text[i - 1] ?? '';
  const punctBonus = /[.,;:!?…—]/.test(prev) ? base * 3.5 : 0;
  const spaceBonus  = prev === ' ' ? base * 0.4 : 0;
  const jitter = (Math.random() * 0.4 - 0.2) * base;
  return Math.max(5, base / speed + jitter + punctBonus + spaceBonus);
}

/* ── Headline copy ───────────────────────────────────────────────────────── */
const LINE1 = 'speak once.';
const LINE2 = 'the right sentence appears.';
const PARA  = "Pocket Voice reads the surface you're writing in. A reply in Mail becomes an email. A note in Linear becomes a ticket. Your voice, composed correctly — 180 ms after you stop speaking. Any app. 108 languages.";

/* Timing constants — calibrated for elastic typewriter (avg ~20ms/char).    */
const T_LINE1_START = 500;
const T_LINE1_END   = T_LINE1_START + 270;   /* "speak once." ~11 chars × 18ms avg + punct */
const T_LINE2_START = T_LINE1_END + 220;
const T_LINE2_END   = T_LINE2_START + 750;   /* "the right sentence appears." ~27 chars     */
const T_CARET_END   = T_LINE2_END + 150;
const T_PARA_START  = T_LINE2_END + 380;
const T_CTA_START   = T_PARA_START + 500;
const T_STATS_START = T_CTA_START + 200;
const T_DEMO_START  = T_CTA_START + 400; /* demo fades in after CTA */

/* ── Demo script ─────────────────────────────────────────────────────────── */
const SCRIPT = [
  {
    spoken:  "reply to amelia, tell her tuesday is out, i'll be in lisbon, can we do wednesday or thursday afternoon",
    polished: "Amelia — Tuesday doesn't work, I'll be in Lisbon. Wednesday or Thursday afternoon?",
    locale: 'Mail',
  },
  {
    spoken:  "tell david the deploy is live ask him to run the payments smoke test and close the pr if everything looks good",
    polished: "David, the deploy is live. Run the payments smoke test and close the PR if it looks clean.",
    locale: 'Slack',
  },
  {
    spoken:  "q3 churn was enterprise renewals not pricing the smb numbers actually held up better than we expected",
    polished: "Q3 churn: enterprise renewals, not pricing. SMB outperformed the model.",
    locale: 'Notion',
  },
] as const;

const ease = [0.4, 0, 0.2, 1];

/* ── Component ───────────────────────────────────────────────────────────── */
export function Hero() {
  const line1Chars = useTypeIn(LINE1, T_LINE1_START);
  const line2Chars = useTypeIn(LINE2, T_LINE2_START);

  const [showPara,  setShowPara]  = useState(false);
  const [showCta,   setShowCta]   = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showDemo,  setShowDemo]  = useState(false);
  const [endCaret,  setEndCaret]  = useState(false);

  useEffect(() => {
    const timers = [
      window.setTimeout(() => setEndCaret(true),  T_CARET_END),
      window.setTimeout(() => setShowPara(true),  T_PARA_START),
      window.setTimeout(() => setShowCta(true),   T_CTA_START),
      window.setTimeout(() => setShowStats(true), T_STATS_START),
      window.setTimeout(() => setShowDemo(true),  T_DEMO_START),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  /* Demo state */
  const [step,        setStep]        = useState(0);
  const [phase,       setPhase]       = useState<'idle' | 'speaking' | 'thinking' | 'reveal'>('idle');
  const [spokenChars, setSpokenChars] = useState(0);
  const timers = useRef<number[]>([]);
  const current = SCRIPT[step];

  useEffect(() => {
    if (!showDemo) return;
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setSpokenChars(0);
    setPhase('speaking');

    const text = current.spoken;
    const tickEvery = 4400 / text.length;
    let i = 0;
    const speakTick = () => {
      i++;
      setSpokenChars(i);
      if (i < text.length) {
        timers.current.push(window.setTimeout(speakTick, tickEvery));
      } else {
        timers.current.push(
          window.setTimeout(() => setPhase('thinking'), 80),
          window.setTimeout(() => setPhase('reveal'),   380),
          window.setTimeout(() => {
            setPhase('idle');
            setStep((s) => (s + 1) % SCRIPT.length);
          }, 4200),
        );
      }
    };
    timers.current.push(window.setTimeout(speakTick, 220));
    return () => { timers.current.forEach(clearTimeout); timers.current = []; };
  }, [showDemo, step, current.spoken]);

  return (
    <section
      id="magic"
      style={{
        position: 'relative',
        minHeight: '100dvh',
        display: 'grid',
        alignItems: 'center',
        overflow: 'hidden',
      }}
    >
      <HeroScene />

      <div
        className="rail"
        style={{
          position: 'relative',
          zIndex: 1,
          paddingTop: 'clamp(7rem, 16vh, 11rem)',
          paddingBottom: 'clamp(4rem, 10vh, 7rem)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 26rem), 1fr))',
          gap: 'clamp(3rem, 6vw, 5rem)',
          alignItems: 'center',
        }}
      >
        {/* ── Left: headline + CTA ──────────────────────────────────────── */}
        <div>
          <Wordmark
            height="clamp(3.5rem, 6vw, 5.5rem)"
            style={{
              marginBottom: '3ch',
              opacity: 0,
              animation: 'pv-char-in 0.4s var(--ease) 0.1s forwards',
            }}
          />

          <div
            aria-hidden="true"
            style={{
              fontFamily: 'var(--font-mono)',
              color: 'var(--surface-2)',
              fontSize: 'var(--step--1)',
              letterSpacing: '0.08em',
              marginBottom: '3ch',
              opacity: 0,
              animation: 'pv-char-in 0.3s var(--ease) 0.3s forwards',
              userSelect: 'none',
            }}
          >
            {'─'.repeat(32)}
          </div>

          <h1
            style={{
              fontSize: 'var(--step-5)',
              fontWeight: 400,
              lineHeight: 0.96,
              letterSpacing: '-0.02em',
              margin: '0 0 2ch',
            }}
          >
            <span aria-label={LINE1} style={{ display: 'block', minHeight: '1.1em' }}>
              <span aria-hidden>{LINE1.slice(0, line1Chars)}</span>
            </span>
            <span
              aria-label={LINE2}
              style={{ display: 'block', color: 'var(--ink-1)', minHeight: '1.1em', position: 'relative' }}
            >
              <span aria-hidden>{LINE2.slice(0, line2Chars)}</span>
              {endCaret && line2Chars >= LINE2.length && (
                <Caret active style={{ marginLeft: '0.2ch', top: '0.12em', fontSize: 'var(--step-5)' }} />
              )}
            </span>
          </h1>

          {showPara && (
            <p
              style={{
                color: 'var(--ink-1)',
                maxWidth: '46ch',
                fontSize: 'var(--step-0)',
                lineHeight: 1.65,
                margin: '0 0 3ch',
                opacity: 0,
                animation: 'pv-char-in 0.3s var(--ease) forwards',
              }}
            >
              {PARA}
              <span aria-hidden style={{ color: 'var(--ink-2)', marginLeft: '0.15ch' }}>¶</span>
            </p>
          )}

          {showCta && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '2ch',
                flexWrap: 'wrap',
                marginBottom: '4ch',
                opacity: 0,
                animation: 'pv-char-in 0.3s var(--ease) forwards',
              }}
            >
              <InstallButton size="lg" />
              <a
                href="#different"
                style={{
                  color: 'var(--ink-1)',
                  fontSize: 'var(--step-0)',
                  borderBottom: '1px solid var(--hairline-strong)',
                  paddingBottom: '0.1ch',
                  transition: 'color var(--t-micro) var(--ease)',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--ink-0)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--ink-1)')}
              >
                See how it works
              </a>
            </div>
          )}

          {showStats && (
            <div
              style={{
                display: 'flex',
                color: 'var(--ink-2)',
                fontFamily: 'var(--font-mono)',
                fontSize: 'var(--step--1)',
                letterSpacing: '0.06em',
                opacity: 0,
                animation: 'pv-char-in 0.3s var(--ease) forwards',
              }}
            >
              <span>iPhone</span>
              <span style={{ padding: '0 1.5ch', color: 'var(--surface-3)' }}>──</span>
              <span>180 ms median</span>
              <span style={{ padding: '0 1.5ch', color: 'var(--surface-3)' }}>──</span>
              <span>108 languages</span>
              <span style={{ padding: '0 1.5ch', color: 'var(--surface-3)' }}>──</span>
              <span>On-device</span>
            </div>
          )}
        </div>

        {/* ── Right: live demo ──────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={showDemo ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ duration: 0.4, ease }}
        >
          <header
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              marginBottom: 'clamp(1.25rem, 3vh, 2rem)',
            }}
          >
            <Eyebrow>How it feels</Eyebrow>
            <span style={{ color: 'var(--ink-2)', fontSize: 'var(--step--1)', letterSpacing: '0.08em' }}>
              {current.locale}
            </span>
          </header>

          <div
            style={{
              border: '1px solid var(--hairline)',
              padding: 'clamp(1.25rem, 3vw, 2rem)',
              background: 'var(--surface-1)',
            }}
          >
            <div style={{ display: 'grid', gap: '1.5rem' }}>
              <Row label="You said">
                <span
                  style={{
                    color: 'var(--ink-1)',
                    fontSize: 'var(--step-0)',
                    lineHeight: 1.5,
                    minHeight: '3.5em',
                    display: 'inline',
                  }}
                >
                  {current.spoken.slice(0, spokenChars)}
                  <DemoCaret active={phase === 'speaking'} />
                </span>
              </Row>

              <div aria-hidden style={{ color: 'var(--surface-3)', fontSize: 'var(--step--1)', letterSpacing: '0.1em', userSelect: 'none' }}>
                {'─'.repeat(40)}
              </div>

              <Row label="It wrote" minHeight="5em">
                <AnimatePresence mode="wait">
                  {phase === 'reveal' ? (
                    <motion.span
                      key={`polished-${step}`}
                      initial={{ opacity: 0, filter: 'blur(4px)' }}
                      animate={{ opacity: 1, filter: 'blur(0px)' }}
                      exit={{ opacity: 0, filter: 'blur(4px)' }}
                      transition={{ duration: 0.28, ease }}
                      style={{
                        display: 'block',
                        fontSize: 'var(--step-1)',
                        lineHeight: 1.4,
                        letterSpacing: '-0.01em',
                        color: 'var(--ink-0)',
                      }}
                    >
                      {current.polished}
                      <span aria-hidden style={{ color: 'var(--ink-2)', marginLeft: '0.15ch' }}>¶</span>
                    </motion.span>
                  ) : (
                    <motion.span
                      key={`status-${step}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: phase === 'thinking' ? 1 : 0.5 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      style={{
                        color: 'var(--ink-2)',
                        fontSize: 'var(--step-0)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '1ch',
                        minHeight: '1.4em',
                      }}
                    >
                      <Pulse />
                      {phase === 'thinking' ? 'composing…' : 'listening'}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Row>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ── Sub-components ──────────────────────────────────────────────────────── */
function Row({ label, children, minHeight }: { label: string; children: React.ReactNode; minHeight?: string }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'clamp(5.5rem, 12vw, 7.5rem) 1fr', gap: '1.25rem', alignItems: 'start' }}>
      <span style={{ color: 'var(--ink-2)', fontSize: 'var(--step--1)', letterSpacing: '0.06em', paddingTop: '0.2em' }}>{label}</span>
      <div style={{ minHeight, position: 'relative' }}>{children}</div>
    </div>
  );
}

function DemoCaret({ active }: { active: boolean }) {
  return (
    <span
      aria-hidden
      style={{
        display: 'inline-block',
        width: 2,
        height: '0.8em',
        background: 'var(--color-signal)',
        marginLeft: '0.2ch',
        verticalAlign: 'baseline',
        position: 'relative',
        top: '0.05em',
        opacity: active ? undefined : 0,
        animation: active ? 'pv-caret 1.2s linear infinite' : 'none',
      }}
    />
  );
}

function Pulse() {
  return (
    <span style={{ position: 'relative', display: 'inline-block', width: 8, height: 8 }}>
      <span style={{ position: 'absolute', inset: 0, borderRadius: 999, background: 'var(--ink-2)' }} />
      <span style={{ position: 'absolute', inset: -3, borderRadius: 999, border: '1px solid var(--ink-2)', opacity: 0.5, animation: 'pv-pulse 1.4s ease-out infinite' }} />
    </span>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '1ch', color: 'var(--ink-2)', fontSize: 'var(--step--1)', letterSpacing: '0.08em' }}>
      <span aria-hidden style={{ display: 'inline-block', width: '2ch', height: 1, background: 'var(--ink-2)' }} />
      {children}
    </span>
  );
}

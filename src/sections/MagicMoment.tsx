import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useInViewOnce } from '../hooks/useInViewOnce';
import { useReducedMotion } from '../hooks/useReducedMotion';

/**
 * Scripted reenactment: messy spoken thought → polished sentence.
 * Real timing approximating the product's behaviour. No fake claims.
 */
const SCRIPT = [
  {
    spoken:
      "ok so um can you reply to mireia and tell her uh the meeting on tuesday won't work for me because i'll be in lisbon and ask her to suggest like wednesday or thursday afternoon instead",
    polished:
      "Hi Mireia — Tuesday won't work for me, I'll be in Lisbon. Could we move it to Wednesday or Thursday afternoon?",
    locale: 'EN',
  },
  {
    spoken:
      "diga li al jordi que el deploy ja està fet, que faci el smoke test del payments i si tot va bé que tanqui la pr",
    polished:
      "Hey Jordi — the deploy is live. Could you run the payments smoke test and close the PR if everything looks good?",
    locale: 'CA → EN',
  },
  {
    spoken:
      "alright let me think... the q3 churn was actually mostly enterprise renewals not pricing, but the smb numbers held up better than we expected",
    polished:
      "Q3 churn came from enterprise renewals, not pricing. SMB held up better than expected.",
    locale: 'EN',
  },
] as const;

export function MagicMoment() {
  const [ref, inView] = useInViewOnce<HTMLDivElement>('-25% 0px');
  const reduced = useReducedMotion();
  const [step, setStep] = useState(0);
  const [phase, setPhase] = useState<'idle' | 'speaking' | 'thinking' | 'reveal'>('idle');
  const [spokenChars, setSpokenChars] = useState(0);
  const timers = useRef<number[]>([]);

  const current = SCRIPT[step];

  // Run the demo loop once it enters view.
  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      // Reduced-motion: snap to final state, cycle slowly.
      setPhase('reveal');
      setSpokenChars(current.spoken.length);
      const id = window.setTimeout(() => {
        setStep((s) => (s + 1) % SCRIPT.length);
      }, 5400);
      timers.current.push(id);
      return () => {
        timers.current.forEach(clearTimeout);
        timers.current = [];
      };
    }

    timers.current.forEach(clearTimeout);
    timers.current = [];

    setSpokenChars(0);
    setPhase('speaking');

    const text = current.spoken;
    const totalSpeak = 4400;
    const frames = text.length;
    const tickEvery = totalSpeak / frames;

    let i = 0;
    const speakTick = () => {
      i++;
      setSpokenChars(i);
      if (i < frames) {
        const id = window.setTimeout(speakTick, tickEvery);
        timers.current.push(id);
      } else {
        // brief 'thinking', then reveal
        const t1 = window.setTimeout(() => setPhase('thinking'), 80);
        const t2 = window.setTimeout(() => setPhase('reveal'), 380);
        const t3 = window.setTimeout(() => {
          setStep((s) => (s + 1) % SCRIPT.length);
        }, 4200);
        timers.current.push(t1, t2, t3);
      }
    };
    const id0 = window.setTimeout(speakTick, 220);
    timers.current.push(id0);

    return () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
  }, [inView, step, reduced, current.spoken]);

  return (
    <section
      id="magic"
      ref={ref}
      style={{
        position: 'relative',
        padding: 'clamp(6rem, 12vh, 10rem) 0',
      }}
    >
      <div
        className="rail"
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr)',
          gap: 'clamp(2.5rem, 6vh, 4rem)',
        }}
      >
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '1.5rem' }}>
          <Eyebrow>The moment it earns its place</Eyebrow>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              color: 'var(--ink-2)',
              fontSize: 'var(--step--1)',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
            }}
          >
            {current.locale}
          </span>
        </header>

        <h2
          style={{
            margin: 0,
            fontSize: 'var(--step-4)',
            letterSpacing: '-0.035em',
            lineHeight: 1.02,
            fontWeight: 500,
            maxWidth: '24ch',
          }}
        >
          You ramble. You pause.
          <br />
          <span style={{ color: 'var(--ink-1)' }}>It writes what you meant.</span>
        </h2>

        <DemoFrame
          phase={phase}
          spoken={current.spoken.slice(0, spokenChars)}
          polished={current.polished}
        />
      </div>
    </section>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.55rem',
        color: 'var(--ink-2)',
        fontFamily: 'var(--font-mono)',
        fontSize: 'var(--step--1)',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
      }}
    >
      <span
        aria-hidden
        style={{
          display: 'inline-block',
          width: 14,
          height: 1,
          background: 'var(--ink-2)',
        }}
      />
      {children}
    </span>
  );
}

function DemoFrame({
  phase,
  spoken,
  polished,
}: {
  phase: 'idle' | 'speaking' | 'thinking' | 'reveal';
  spoken: string;
  polished: string;
}) {
  return (
    <div
      style={{
        position: 'relative',
        border: '1px solid var(--hairline)',
        borderRadius: 28,
        padding: 'clamp(1.5rem, 4vw, 2.75rem)',
        background:
          'linear-gradient(180deg, oklch(0.17 0.005 270) 0%, oklch(0.15 0.005 270) 100%)',
        boxShadow: 'var(--shadow-soft)',
        overflow: 'hidden',
      }}
    >
      {/* Ambient accent wash, tied to phase */}
      <motion.div
        aria-hidden
        animate={{
          opacity: phase === 'idle' ? 0 : phase === 'reveal' ? 0.25 : 0.6,
        }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        style={{
          position: 'absolute',
          inset: -1,
          background:
            'radial-gradient(60% 80% at 0% 0%, var(--accent-soft), transparent 60%)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.75rem', position: 'relative' }}>
        <Row label="You said">
          <span
            style={{
              color: 'var(--ink-1)',
              fontSize: 'var(--step-1)',
              lineHeight: 1.45,
              letterSpacing: '-0.01em',
              fontFamily: 'var(--font-sans)',
              minHeight: '3em',
              display: 'inline',
            }}
          >
            {spoken}
            <Caret active={phase === 'speaking'} />
          </span>
        </Row>

        <Divider />

        <Row label="What you meant">
          <AnimatePresence mode="wait">
            {phase === 'reveal' ? (
              <motion.span
                key="polished"
                initial={{ opacity: 0, y: 6, filter: 'blur(4px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.42, ease: [0.23, 1, 0.32, 1] }}
                style={{
                  display: 'inline-block',
                  fontSize: 'var(--step-2)',
                  lineHeight: 1.35,
                  letterSpacing: '-0.015em',
                  color: 'var(--ink-0)',
                  fontWeight: 500,
                }}
              >
                {polished}
              </motion.span>
            ) : (
              <motion.span
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: phase === 'thinking' ? 1 : 0.5 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                style={{
                  color: 'var(--ink-2)',
                  fontSize: 'var(--step-1)',
                  fontFamily: 'var(--font-mono)',
                  letterSpacing: 0,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.55rem',
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
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'clamp(7rem, 14vw, 9rem) 1fr', gap: '1.25rem', alignItems: 'baseline' }}>
      <span
        style={{
          color: 'var(--ink-2)',
          fontFamily: 'var(--font-mono)',
          fontSize: 'var(--step--1)',
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
        }}
      >
        {label}
      </span>
      <div>{children}</div>
    </div>
  );
}

function Divider() {
  return <span style={{ height: 1, background: 'var(--hairline)' }} />;
}

function Caret({ active }: { active: boolean }) {
  return (
    <span
      aria-hidden
      style={{
        display: 'inline-block',
        width: 2,
        height: '0.95em',
        background: 'var(--accent)',
        marginLeft: 4,
        transform: 'translateY(2px)',
        opacity: active ? 1 : 0,
        animation: active ? 'pv-caret 1s steps(2, end) infinite' : 'none',
      }}
    />
  );
}

function Pulse() {
  return (
    <span style={{ position: 'relative', width: 8, height: 8 }}>
      <span
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 999,
          background: 'var(--accent)',
        }}
      />
      <span
        style={{
          position: 'absolute',
          inset: -3,
          borderRadius: 999,
          border: '1px solid var(--accent)',
          opacity: 0.5,
          animation: 'pv-pulse 1.4s ease-out infinite',
        }}
      />
    </span>
  );
}

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useTypeIn } from '../hooks/useTypeIn';
import { useInViewOnce } from '../hooks/useInViewOnce';

const SCRIPT = [
  {
    spoken:
      "could you reply to amelia and let her know tuesday won't work, i'll be in lisbon, suggest wednesday or thursday afternoon instead",
    polished:
      "Amelia, Tuesday won't work, I'll be in Lisbon. Could we move it to Wednesday or Thursday afternoon?",
    locale: 'English',
  },
  {
    spoken:
      "let david know the deploy is live, ask him to run the payments smoke test and close the pull request if everything looks clean",
    polished:
      "David, the deploy is live. Could you run the payments smoke test and close the PR if it looks clean?",
    locale: 'English',
  },
  {
    spoken:
      "the q3 churn was mostly enterprise renewals, not pricing, and the smb numbers held up a little better than we modeled",
    polished:
      "Q3 churn came from enterprise renewals, not pricing. SMB held up slightly better than modeled.",
    locale: 'English',
  },
] as const;

const ease = [0.4, 0, 0.2, 1];

const H2_L1 = 'You think out loud.';
const H2_L2 = 'It writes what you meant.';
const T_L2  = H2_L1.length * 12 + 160;

export function MagicMoment() {
  const [ref, inView] = useInViewOnce<HTMLDivElement>('-25% 0px');
  const l1 = useTypeIn(H2_L1, inView);
  const l2 = useTypeIn(H2_L2, inView, T_L2);
  const [step, setStep]   = useState(0);
  const [phase, setPhase] = useState<'idle' | 'speaking' | 'thinking' | 'reveal'>('idle');
  const [spokenChars, setSpokenChars] = useState(0);
  const timers = useRef<number[]>([]);

  const current = SCRIPT[step];

  useEffect(() => {
    if (!inView) return;
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setSpokenChars(0);
    setPhase('speaking');

    const text = current.spoken;
    const totalSpeak = 4400;
    const tickEvery = totalSpeak / text.length;
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
          window.setTimeout(() => setStep((s) => (s + 1) % SCRIPT.length), 4200),
        );
      }
    };
    timers.current.push(window.setTimeout(speakTick, 220));

    return () => { timers.current.forEach(clearTimeout); timers.current = []; };
  }, [inView, step, current.spoken]);

  return (
    <section
      id="magic"
      ref={ref}
      style={{ position: 'relative', padding: 'clamp(6rem, 12vh, 10rem) 0' }}
    >
      <div
        className="rail"
        style={{ display: 'grid', gap: 'clamp(2.5rem, 6vh, 4rem)' }}
      >
        <header
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            flexWrap: 'wrap',
            gap: '1.5rem',
          }}
        >
          <Eyebrow>How it feels</Eyebrow>
          <span
            style={{
              color: 'var(--ink-2)',
              fontSize: 'var(--step--1)',
              letterSpacing: '0.08em',
            }}
          >
            {current.locale}
          </span>
        </header>

        <h2
          style={{
            margin: 0,
            fontSize: 'var(--step-4)',
            letterSpacing: '-0.03em',
            lineHeight: 1.0,
            fontWeight: 400,
            maxWidth: '22ch',
          }}
        >
          <span aria-label={H2_L1} style={{ display: 'block', minHeight: '1.05em' }}>
            <span aria-hidden>{H2_L1.slice(0, l1)}</span>
          </span>
          <span aria-label={H2_L2} style={{ display: 'block', color: 'var(--ink-1)', minHeight: '1.05em' }}>
            <span aria-hidden>{H2_L2.slice(0, l2)}</span>
          </span>
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
        gap: '1ch',
        color: 'var(--ink-2)',
        fontSize: 'var(--step--1)',
        letterSpacing: '0.08em',
      }}
    >
      <span aria-hidden style={{ display: 'inline-block', width: '2ch', height: 1, background: 'var(--ink-2)' }} />
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
        padding: 'clamp(1.5rem, 4vw, 2.75rem)',
        background: 'var(--surface-1)',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '2rem',
          position: 'relative',
        }}
      >
        <Row label="You said">
          <span
            style={{
              color: 'var(--ink-1)',
              fontSize: 'var(--step-1)',
              lineHeight: 1.5,
              minHeight: '3em',
              display: 'inline',
            }}
          >
            {spoken}
            <DemoCaret active={phase === 'speaking'} />
          </span>
        </Row>

        {/* Mono dash separator */}
        <div
          aria-hidden="true"
          className="pv-rule"
          style={{
            color: 'var(--surface-3)',
            fontSize: 'var(--step--1)',
            letterSpacing: '0.1em',
            userSelect: 'none',
          }}
        >
          {'─'.repeat(48)}
        </div>

        <Row label="It wrote">
          <AnimatePresence mode="wait">
            {phase === 'reveal' ? (
              <motion.span
                key="polished"
                initial={{ opacity: 0, filter: 'blur(3px)' }}
                animate={{ opacity: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease }}
                style={{
                  display: 'inline-block',
                  fontSize: 'var(--step-2)',
                  lineHeight: 1.35,
                  letterSpacing: '-0.015em',
                  color: 'var(--ink-0)',
                  fontWeight: 400,
                }}
              >
                {polished}
                <span aria-hidden style={{ color: 'var(--ink-2)', marginLeft: '0.15ch' }}>¶</span>
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
                  letterSpacing: 0,
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
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div
      className="demo-row"
      style={{
        display: 'grid',
        gridTemplateColumns: 'clamp(6rem, 14vw, 9rem) 1fr',
        gap: '1.5rem',
        alignItems: 'baseline',
      }}
    >
      <span
        style={{
          color: 'var(--ink-2)',
          fontSize: 'var(--step--1)',
          letterSpacing: '0.06em',
        }}
      >
        {label}
      </span>
      <div>{children}</div>
    </div>
  );
}

/* Local caret for the demo — same blink rules, white accent */
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
      <span
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 999,
          background: 'var(--ink-2)',
        }}
      />
      <span
        style={{
          position: 'absolute',
          inset: -3,
          borderRadius: 999,
          border: '1px solid var(--ink-2)',
          opacity: 0.5,
          animation: 'pv-pulse 1.4s ease-out infinite',
        }}
      />
    </span>
  );
}

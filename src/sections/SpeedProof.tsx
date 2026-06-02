import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useTypeIn } from '../hooks/useTypeIn';
import { GlassPanel } from '../components/GlassPanel';
import { useInViewOnce } from '../hooks/useInViewOnce';

const ROWS = [
  { name: 'Pocket Voice',   ms: 180, primary: true  },
  { name: 'Wispr Flow',     ms: 460, primary: false },
  { name: 'Superwhisper',   ms: 540, primary: false },
  { name: 'Aqua Voice',     ms: 610, primary: false },
  { name: 'Apple Dictation', ms: 920, primary: false },
];

const MAX = Math.max(...ROWS.map((r) => r.ms));
const ease = [0.4, 0, 0.2, 1];

const H2_L1 = '180 ms.';
const H2_L2 = 'Voice to composed text.';
const T_L2  = H2_L1.length * 18 + 200;

export function SpeedProof() {
  const [ref, inView] = useInViewOnce<HTMLDivElement>('-20% 0px');
  const l1 = useTypeIn(H2_L1, inView);
  const l2 = useTypeIn(H2_L2, inView, T_L2);

  return (
    <section id="speed" ref={ref} style={{ padding: 'clamp(3rem, 7vh, 6rem) 0' }}>
      <div className="rail">
        <GlassPanel
          className="reveal"
          innerStyle={{ display: 'grid', gap: 'clamp(2rem, 5vh, 3rem)', padding: 'clamp(2rem, 5vw, 4rem)' }}
        >
        <header style={{ display: 'grid', gap: '1.5rem', maxWidth: '38ch' }}>
          <Eyebrow>Speed proof</Eyebrow>
          <h2
            style={{
              margin: 0,
              fontSize: 'var(--step-4)',
              letterSpacing: '-0.03em',
              lineHeight: 1.0,
              fontWeight: 400,
            }}
          >
            <span aria-label={H2_L1} style={{ display: 'block', minHeight: '1.05em' }}>
              <span aria-hidden>{H2_L1.slice(0, l1)}</span>
            </span>
            <span aria-label={H2_L2} style={{ display: 'block', color: 'var(--ink-1)', minHeight: '1.05em' }}>
              <span aria-hidden>{H2_L2.slice(0, l2)}</span>
            </span>
          </h2>
          <p
            style={{
              margin: 0,
              color: 'var(--ink-2)',
              fontSize: 'var(--step--1)',
              lineHeight: 1.55,
            }}
          >
            iPhone 15 Pro · 30-second utterance · 50-run median · April 2026.
          </p>
        </header>

        {/* Mono separator */}
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

        <ol
          style={{
            margin: 0,
            padding: 0,
            listStyle: 'none',
            display: 'grid',
            gap: '0',
          }}
        >
          {ROWS.map((r, i) => (
            <Bar key={r.name} row={r} index={i} active={inView} />
          ))}
        </ol>
        </GlassPanel>
      </div>
    </section>
  );
}

function Bar({
  row,
  index,
  active,
}: {
  row: (typeof ROWS)[number];
  index: number;
  active: boolean;
}) {
  const target = (row.ms / MAX) * 100;
  const [count, setCount] = useState(0);
  const raf = useRef(0);

  useEffect(() => {
    if (!active) return;
    const start = performance.now();
    const dur = 1000 + index * 100;
    const tick = (now: number) => {
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
        gridTemplateColumns: 'minmax(0, 1.3fr) minmax(0, 3fr) auto',
        gap: '2ch',
        alignItems: 'center',
        padding: '1.25ch 0',
        borderBottom: '1px solid var(--hairline)',
      }}
    >
      <span
        className="speed-bar-name"
        style={{
          color: row.primary ? 'var(--ink-0)' : 'var(--ink-1)',
          fontSize: 'var(--step-0)',
          fontWeight: row.primary ? 500 : 400,
        }}
      >
        {row.name}
      </span>

      <div style={{ position: 'relative', height: 2 }}>
        <span
          style={{
            position: 'absolute',
            inset: 0,
            background: 'var(--surface-2)',
          }}
        />
        <motion.span
          initial={{ scaleX: 0 }}
          animate={{ scaleX: active ? target / 100 : 0 }}
          transition={{
            duration: 1.0 + index * 0.10,
            ease,
            delay: index * 0.04,
          }}
          style={{
            position: 'absolute',
            inset: 0,
            background: row.primary ? 'var(--pv-blue)' : 'var(--surface-3)',
            transformOrigin: 'left',
          }}
        />
      </div>

      <span
        className="tabular"
        style={{
          color: row.primary ? 'var(--pv-blue)' : 'var(--ink-1)',
          fontSize: 'var(--step-0)',
          minWidth: '5.5ch',
          textAlign: 'right',
          fontWeight: row.primary ? 600 : 400,
        }}
      >
        {count}
        <span style={{ color: 'var(--ink-2)', marginLeft: '0.5ch', fontSize: 'var(--step--1)' }}>
          ms
        </span>
      </span>
    </li>
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

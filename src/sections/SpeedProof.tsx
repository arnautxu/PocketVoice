import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useInViewOnce } from '../hooks/useInViewOnce';

const ROWS = [
  { name: 'Pocket Voice', ms: 180, primary: true },
  { name: 'Wispr Flow',   ms: 460, primary: false },
  { name: 'Superwhisper', ms: 540, primary: false },
  { name: 'Aqua Voice',   ms: 610, primary: false },
  { name: 'Apple Dictation', ms: 920, primary: false },
];

const MAX = Math.max(...ROWS.map((r) => r.ms));

export function SpeedProof() {
  const [ref, inView] = useInViewOnce<HTMLDivElement>('-20% 0px');

  return (
    <section id="speed" ref={ref} style={{ padding: 'clamp(7rem, 12vh, 10rem) 0' }}>
      <div className="rail" style={{ display: 'grid', gap: 'clamp(2.5rem, 6vh, 4rem)' }}>
        <header style={{ display: 'grid', gap: '1.25rem', maxWidth: '36ch' }}>
          <Eyebrow>Speed proof</Eyebrow>
          <h2
            style={{
              margin: 0,
              fontSize: 'var(--step-4)',
              letterSpacing: '-0.045em',
              lineHeight: 1.0,
              fontWeight: 400,
            }}
          >
            Median time from
            <br />
            <span style={{ color: 'var(--ink-1)' }}>end of utterance to polished text.</span>
          </h2>
          <p style={{ margin: 0, color: 'var(--ink-2)', fontSize: 'var(--step--1)', fontFamily: 'var(--font-mono)', letterSpacing: '0.01em' }}>
            iPhone 15 Pro — same device, same 30‑second utterance, 50‑run median, April 2026.
          </p>
        </header>

        <ol
          style={{
            margin: 0,
            padding: 0,
            listStyle: 'none',
            display: 'grid',
            gap: '1.1rem',
            borderTop: '1px solid var(--hairline)',
            paddingTop: '2rem',
          }}
        >
          {ROWS.map((r, i) => (
            <Bar key={r.name} row={r} index={i} active={inView} />
          ))}
        </ol>
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
    const dur = 1100 + index * 120;
    const startVal = 0;
    const tick = (now: number) => {
      const t = Math.min((now - start) / dur, 1);
      // ease-out quart
      const eased = 1 - Math.pow(1 - t, 4);
      setCount(Math.round(startVal + (row.ms - startVal) * eased));
      if (t < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [active, row.ms, index]);

  return (
    <li
      style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 3fr) auto',
        gap: '1.5rem',
        alignItems: 'center',
        padding: '1rem 0',
        borderBottom: '1px solid var(--hairline)',
      }}
    >
      <span
        style={{
          color: row.primary ? 'var(--ink-0)' : 'var(--ink-1)',
          fontSize: 'var(--step-0)',
          fontWeight: row.primary ? 460 : 380,
          letterSpacing: '-0.012em',
        }}
      >
        {row.name}
      </span>
      <div style={{ position: 'relative', height: 14 }}>
        <span
          style={{
            position: 'absolute',
            inset: 0,
            background: 'var(--surface-2)',
            borderRadius: 999,
            opacity: 0.5,
          }}
        />
        <motion.span
          initial={{ scaleX: 0 }}
          animate={{ scaleX: active ? target / 100 : 0 }}
          transition={{
            duration: 1.1 + index * 0.12,
            ease: [0.23, 1, 0.32, 1],
            delay: index * 0.05,
          }}
          style={{
            position: 'absolute',
            inset: 0,
            background: row.primary
              ? 'linear-gradient(90deg, var(--accent), oklch(0.78 0.13 250))'
              : 'oklch(0.45 0.005 270)',
            borderRadius: 999,
            transformOrigin: 'left',
            boxShadow: row.primary ? '0 0 24px var(--accent-glow)' : 'none',
          }}
        />
      </div>
      <span
        className="tabular"
        style={{
          color: row.primary ? 'var(--ink-0)' : 'var(--ink-1)',
          fontSize: 'var(--step-0)',
          letterSpacing: '-0.01em',
          minWidth: '5.2ch',
          textAlign: 'right',
          fontWeight: row.primary ? 460 : 380,
        }}
      >
        {count}
        <span style={{ color: 'var(--ink-2)', marginLeft: 4, fontSize: 'var(--step--1)' }}>ms</span>
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
        gap: '0.55rem',
        color: 'var(--ink-2)',
        fontFamily: 'var(--font-mono)',
        fontSize: 'var(--step--1)',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
      }}
    >
      <span aria-hidden style={{ display: 'inline-block', width: 14, height: 1, background: 'var(--ink-2)' }} />
      {children}
    </span>
  );
}

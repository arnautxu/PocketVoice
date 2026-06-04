import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';

interface ReadoutProps {
  /** Final value in ms. */
  value?: number;
  /** Start the count when this is true. */
  run: boolean;
  /** Count-up duration, ms. */
  duration?: number;
  size?: CSSProperties['fontSize'];
  style?: CSSProperties;
}

/**
 * The hero number. Counts up to `value` ms in vermilion (the live, in-flight
 * colour), then settles to ink once it lands — speech resolving into text, in
 * colour. Reused in the hero and the live demo.
 */
export function Readout({ value = 180, run, duration = 900, size = 'var(--step-2)', style }: ReadoutProps) {
  const [count, setCount] = useState(0);
  const [landed, setLanded] = useState(false);
  const raf = useRef(0);

  useEffect(() => {
    if (!run) {
      setCount(0);
      setLanded(false);
      return;
    }
    let start = 0;
    const tick = (now: number) => {
      if (!start) start = now;
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 4);
      setCount(Math.round(value * eased));
      if (t < 1) raf.current = requestAnimationFrame(tick);
      else setLanded(true);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [run, value, duration]);

  return (
    <span
      className="tabular"
      style={{
        display: 'inline-flex',
        alignItems: 'baseline',
        gap: '0.3ch',
        fontSize: size,
        fontWeight: 500,
        letterSpacing: '-0.02em',
        color: landed ? 'var(--ink-0)' : 'var(--live)',
        transition: 'color 240ms var(--ease)',
        ...style,
      }}
    >
      {count}
      <span style={{ fontSize: '0.5em', fontWeight: 500, color: landed ? 'var(--ink-2)' : 'var(--live)', letterSpacing: '0.04em' }}>
        ms
      </span>
    </span>
  );
}

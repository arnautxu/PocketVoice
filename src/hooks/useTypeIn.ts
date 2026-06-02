import { useEffect, useState } from 'react';

/**
 * Organic typewriter that starts when `triggered` becomes true.
 *
 * Uses recursive setTimeout (not setInterval) so each character can have a
 * different delay. The curve is sine ease-in-out: slow start, fast middle,
 * slow end. Punctuation adds a natural pause. ±20% random jitter.
 *
 * `startDelay` lets you chain lines: pass (prevLine.length * msPerChar + gap).
 */
export function useTypeIn(
  text: string,
  triggered: boolean,
  startDelay = 0,
  msPerChar = 22,
) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!triggered) return;
    let tid: number;

    tid = window.setTimeout(() => {
      let i = 0;
      const tick = () => {
        i++;
        setCount(i);
        if (i < text.length) {
          tid = window.setTimeout(tick, charDelay(i, text, msPerChar));
        }
      };
      tid = window.setTimeout(tick, charDelay(0, text, msPerChar));
    }, startDelay);

    return () => clearTimeout(tid);
  }, [triggered, text, startDelay, msPerChar]);

  return count;
}

/**
 * Variable delay before revealing the character at index `i`.
 * Sine ease-in-out: peaks speed at 50% of the text, slow at both edges.
 */
function charDelay(i: number, text: string, base: number): number {
  const t = text.length > 1 ? i / (text.length - 1) : 0.5;

  // Sine curve: speed = 1 at t=0.5, ~0.3 at both edges
  const speed = 0.3 + 0.7 * Math.sin(t * Math.PI);

  // Punctuation pause on the char we just typed
  const prev = text[i - 1] ?? '';
  const punctBonus = /[.,;:!?…-]/.test(prev) ? base * 3.5 : 0;
  const spaceBonus  = prev === ' ' ? base * 0.4 : 0;

  // ±20% jitter for organic feel
  const jitter = (Math.random() * 0.4 - 0.2) * base;

  return Math.max(5, base / speed + jitter + punctBonus + spaceBonus);
}

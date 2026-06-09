import { useEffect, useRef, useState } from 'react';
import { useInViewOnce } from '../hooks/useInViewOnce';

/* ══════════════════════════════════════════════════════════════════════════════
 * SOCIAL PROOF — the count + a press/credibility strip, set into the lower sky. The
 * "+86k" is the brand-accent moment: it counts up from 0 the first time it scrolls
 * into view. Press logos are monochrome SVGs treated grayscale-on-sky; the files in
 * /public/brand/press are PLACEHOLDER wordmarks — drop the real outlet logos in at
 * the same paths to swap them 1:1. (Only show press you've genuinely earned.)
 * ════════════════════════════════════════════════════════════════════════════ */

const LOGOS = [
  { name: 'TechCrunch', src: '/brand/press/techcrunch.svg' },
  { name: 'Product Hunt', src: '/brand/press/producthunt.svg' },
  { name: 'The Verge', src: '/brand/press/theverge.svg' },
  { name: 'Wired', src: '/brand/press/wired.svg' },
  { name: 'Fast Company', src: '/brand/press/fastcompany.svg' },
];

const TARGET = 86_000;

const prefersReduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

/** Counts 0 → TARGET once, when scrolled into view. Renders as "+Nk". */
function CountUp() {
  const [ref, inView] = useInViewOnce<HTMLSpanElement>('-20% 0px');
  const [val, setVal] = useState(0);
  const raf = useRef<number>();

  useEffect(() => {
    if (!inView) return;
    if (prefersReduced()) { setVal(TARGET); return; }
    const start = performance.now();
    const DURATION = 1700;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / DURATION);
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      setVal(Math.round(eased * TARGET));
      if (t < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => { if (raf.current) cancelAnimationFrame(raf.current); };
  }, [inView]);

  return (
    <span
      ref={ref}
      className="tabular"
      style={{ fontFamily: 'var(--font-text)', fontWeight: 700, fontSize: 'var(--step-6)', lineHeight: 0.9, letterSpacing: '-0.03em', color: 'var(--accent-sky)' }}
    >
      +{Math.round(val / 1000)}k
    </span>
  );
}

export function SocialProof() {
  return (
    <section className="sec alt-light" aria-label="Loved by people everywhere" style={{ paddingBlock: 'var(--space-lg)' }}>
      <div className="rail" style={{ display: 'grid', gap: 'clamp(2rem, 5vh, 3.25rem)', justifyItems: 'center' }}>
        <div className="proof">
          <div className="proof-figure">
            <CountUp />
            <span style={{ fontSize: 'var(--step-0)', color: 'var(--ink-1)' }}>people typing out loud</span>
          </div>
          <p style={{ margin: 0, maxWidth: '24ch', fontFamily: 'var(--font-display)', fontSize: 'var(--step-2)', lineHeight: 1.2, textAlign: 'center', color: 'var(--ink-0)' }}>
            From Pocket, the team behind the device 86,000 people already speak to.
          </p>
        </div>

        <div className="proof-logos" aria-label="As featured in">
          {LOGOS.map((logo) => (
            <img key={logo.name} className="proof-logo" src={logo.src} alt={logo.name} loading="lazy" decoding="async" draggable={false} />
          ))}
        </div>
      </div>
    </section>
  );
}

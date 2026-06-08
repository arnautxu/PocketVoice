import { useLayoutEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '../lib/gsap';
import { InstallButton } from '../components/InstallButton';
import { VoiceToText } from '../components/VoiceToText';
import { usePlatform } from '../hooks/usePlatform';

/* ══════════════════════════════════════════════════════════════════════════════
 * HERO — full-bleed, centred. A bright cloud sea over stratosphere navy; the slogan
 * "Type out loud" set huge into the sky, the promise beneath it, a platform-aware
 * download, and the looping voice→text strip showing the core transformation. Brand
 * cloud marks drift ambiently around the type (app icons = "any app", struck fillers
 * = "it edits") without pulling focus.
 * ════════════════════════════════════════════════════════════════════════════ */

// Ambient marks scattered to the edges, away from the centred type. dx/dy drive a
// slow alternating drift; secondary marks drop on small screens to avoid crowding.
const AMBIENT: Array<{
  name: string; ar: string; width: string;
  top?: string; bottom?: string; left?: string; right?: string;
  op: number; dx: string; dy: string; dur: string; delay: string; secondary?: boolean;
}> = [
  { name: 'slack',      ar: '560 / 498', width: 'clamp(58px, 7vw, 104px)', top: '16%', left: '7%',  op: 0.55, dx: '10px',  dy: '-18px', dur: '13s', delay: '0s' },
  { name: 'gmail',      ar: '560 / 444', width: 'clamp(52px, 6vw, 92px)',  top: '24%', right: '9%', op: 0.5,  dx: '-12px', dy: '-14px', dur: '15s', delay: '1.2s' },
  { name: 'whatsapp',   ar: '560 / 497', width: 'clamp(48px, 5.5vw, 84px)', bottom: '30%', left: '12%', op: 0.45, dx: '8px', dy: '16px', dur: '17s', delay: '0.6s', secondary: true },
  { name: 'umm',        ar: '560 / 446', width: 'clamp(56px, 6.5vw, 96px)', top: '12%', right: '24%', op: 0.5, dx: '6px', dy: '-12px', dur: '14s', delay: '0.4s', secondary: true },
  { name: 'actually',   ar: '560 / 460', width: 'clamp(58px, 6.5vw, 100px)', bottom: '22%', right: '14%', op: 0.5, dx: '-10px', dy: '14px', dur: '16s', delay: '1.6s' },
  { name: 'faster',     ar: '560 / 440', width: 'clamp(54px, 6vw, 92px)', bottom: '16%', left: '28%', op: 0.42, dx: '12px', dy: '-10px', dur: '18s', delay: '0.9s', secondary: true },
];

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);

  // Layered scroll parallax for depth: as the hero scrolls away the cloud marks
  // drift up + fade, and the type lifts a touch faster — three planes moving at
  // different rates over the Ken-Burns sky. Transform/opacity only; content stays
  // visible if the timeline never runs (reduced motion / backgrounded tab).
  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const trig = { trigger: section, start: 'top top', end: 'bottom top', scrub: 0.6 } as const;
        const amb = section.querySelector('.hero-ambient');
        const stack = section.querySelector('.hero-stack');
        if (amb) gsap.to(amb, { yPercent: -18, opacity: 0.35, ease: 'none', scrollTrigger: trig });
        if (stack) gsap.to(stack, { yPercent: -8, ease: 'none', scrollTrigger: trig });
      });
    }, section);
    const raf = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => { cancelAnimationFrame(raf); ctx.revert(); };
  }, []);

  const { storeHref, downloadLabel } = usePlatform();

  return (
    <section ref={sectionRef} id="top" className="hero-center alt-light">
      {/* clouds come from the page-wide scene photo; just a soft veil for the type */}
      <div className="hero-center-scrim" aria-hidden />

      {/* ambient brand marks drifting around the type */}
      <div className="hero-ambient" aria-hidden="true">
        {AMBIENT.map((c) => (
          <img
            key={c.name}
            src={`/brand/hero/${c.name}.webp`}
            alt=""
            aria-hidden="true"
            loading="eager"
            decoding="async"
            draggable={false}
            className={c.secondary ? 'amb-secondary' : undefined}
            style={{
              top: c.top, bottom: c.bottom, left: c.left, right: c.right,
              width: c.width, aspectRatio: c.ar,
              ['--amb-op' as string]: c.op,
              ['--amb-dx' as string]: c.dx,
              ['--amb-dy' as string]: c.dy,
              ['--amb-dur' as string]: c.dur,
              ['--amb-delay' as string]: c.delay,
            }}
          />
        ))}
      </div>

      <div className="hero-stack rail">
        <span className="sec-eyebrow rise" style={{ color: 'var(--ink-1)', animationDelay: '0.05s' }}>
          <span className="rec-dot" aria-hidden /> Voice to finished text
        </span>

        <h1
          className="hero-h1 rise"
          style={{ animationDelay: '0.1s', color: 'var(--ink-0)', textShadow: '0 1px 18px rgba(255,255,255,0.5)' }}
        >
          Type out loud
        </h1>

        <p className="hero-sub rise" style={{ animationDelay: '0.16s', color: 'var(--ink-1)' }}>
          Your voice is your fastest keyboard.
        </p>

        <div className="hero-cta-row rise" style={{ animationDelay: '0.22s' }}>
          <InstallButton size="lg" label={downloadLabel} href={storeHref} />
          <a href="#features" className="navlink" style={{ color: 'var(--ink-1)', fontSize: 'var(--step-0)' }}>
            See how it works ↓
          </a>
        </div>

        <VoiceToText />
      </div>
    </section>
  );
}

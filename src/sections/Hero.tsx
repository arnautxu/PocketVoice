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
// Few, LARGE marks composed for depth: two big sharp clouds anchor the lower corners
// (foreground), two softer mid clouds sit high in the corners (distance), and one
// faint far puff fills the low-centre gap. The centre stays open for the headline.
// Marks are kept WHOLE (just inside the frame — brand "no crop"), never sliced.
// Composed for a real sky, NOT a grid: sizes vary a lot (huge → tiny), heights are
// staggered (no two share a baseline), every mark sits at its own slight tilt and
// drifts on its own clock. Marks live in the open top + bottom bands so the centred
// headline stays clear; kept WHOLE (brand "no crop"). rot = resting tilt, rotD = how
// far it rocks while floating; dur/delay all differ so nothing pulses in sync.
const AMBIENT: Array<{
  name: string; ar: string; width: string;
  top?: string; bottom?: string; left?: string; right?: string;
  op: number; blur: string; z: number; rot: string; rotD: string;
  dx: string; dy: string; dur: string; delay: string; secondary?: boolean;
}> = [
  // foreground — large, sharp, lower band (staggered heights + sizes)
  { name: 'slack',      ar: '560 / 498', width: 'clamp(86px, 21vw, 330px)', bottom: '1%', left: '1%',  op: 0.92, blur: '0px',   z: 3, rot: '-6deg', rotD: '2.5deg',  dx: '10px',  dy: '-15px', dur: '19s', delay: '0s' },
  { name: 'actually',   ar: '560 / 460', width: 'clamp(74px, 15vw, 232px)', bottom: '9%', right: '0%', op: 0.86, blur: '0.3px', z: 2, rot: '7deg',  rotD: '-3deg',   dx: '-9px',  dy: '-12px', dur: '23s', delay: '0.8s', secondary: true },
  { name: 'whatsapp',   ar: '560 / 497', width: 'clamp(60px, 11vw, 178px)', bottom: '2%', left: '41%', op: 0.78, blur: '0.6px', z: 2, rot: '-4deg', rotD: '3.5deg',  dx: '7px',   dy: '-11px', dur: '17s', delay: '0.3s' },
  // distance — mid, softened, high band (not corner-aligned)
  { name: 'umm',        ar: '560 / 446', width: 'clamp(78px, 11vw, 176px)', top: '4%',  left: '3%',  op: 0.6,  blur: '1.3px', z: 1, rot: '5deg',  rotD: '-2.5deg', dx: '8px',   dy: '-12px', dur: '15s', delay: '0.5s', secondary: true },
  { name: 'gmail',      ar: '560 / 444', width: 'clamp(72px, 10vw, 150px)', top: '11%', right: '4%', op: 0.55, blur: '1.7px', z: 1, rot: '-9deg', rotD: '3deg',    dx: '-10px', dy: '-9px',  dur: '20s', delay: '1.2s', secondary: true },
  { name: 'dictionary', ar: '560 / 470', width: 'clamp(54px, 7vw, 118px)',  top: '3%',  left: '23%', op: 0.42, blur: '2.3px', z: 0, rot: '8deg',  rotD: '-3.5deg', dx: '6px',   dy: '-8px',  dur: '22s', delay: '1.6s', secondary: true },
  // far — small, very soft, low-centre gap beneath the demo card
  { name: 'faster',     ar: '560 / 440', width: 'clamp(56px, 7vw, 120px)',  bottom: '7%', left: '63%', op: 0.45, blur: '2.5px', z: 0, rot: '-7deg', rotD: '4deg',    dx: '8px', dy: '-9px', dur: '18s', delay: '1s', secondary: true },
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
              ['--amb-blur' as string]: c.blur,
              ['--amb-z' as string]: c.z,
              ['--amb-rot' as string]: c.rot,
              ['--amb-rot-d' as string]: c.rotD,
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
          <span className="hero-cta-note">Free to start · iPhone &amp; Mac</span>
        </div>

        <VoiceToText />

        {/* quiet scroll cue, sat below the animation it points at */}
        <a href="#all-in-one" className="hero-scrollcue" aria-label="See how it works">
          See how it works
          <span className="hero-scrollcue__arrow" aria-hidden>↓</span>
        </a>
      </div>
    </section>
  );
}

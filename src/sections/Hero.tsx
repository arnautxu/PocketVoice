import { useLayoutEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '../lib/gsap';
import { StoreBadges } from '../components/StoreBadges';
import { HeroClouds, FLY, REST } from '../components/HeroClouds';
import { HeroPhone } from '../components/HeroPhone';

/* ══════════════════════════════════════════════════════════════════════════════
 * HERO — a two-column product opening. The huge Erode headline + copy + CTAs sit in
 * the left column; the Speak-to-Edit phone is featured on the right, emerging from a
 * cloud bank. The "Expressive · Cloud" brand marks orbit the phone with depth, and
 * the ".umm"/"…actually" filler clouds dissolve upward — echoing the struck words on
 * the screen. A cloud sea bleeds up from the bottom; a left-anchored scrim keeps the
 * type legible while the right side stays bright behind the device.
 * ════════════════════════════════════════════════════════════════════════════ */

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);

  // ── Forward-travelling dolly ─────────────────────────────────────────────────
  // Pin the hero and scrub one master timeline: cloud marks rush toward the viewer
  // from the vanishing point on translateZ (real perspective → they grow + spread
  // radially + pass), one after another; the travelling then RESOLVES on the phone,
  // which arrives from depth and settles sharp as the headline settles with it.
  // Transform (translateZ) + opacity only. Reduced motion / stacked layouts skip the
  // travelling and show the resolved hero (see the matchMedia branches below).
  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const q = (sel: string) => section.querySelector<HTMLElement>(sel);
    const flyEl = (name: string) => q(`.hc-fly[data-cloud="${name}"]`);
    const restEl = (name: string) => q(`.hc-rest[data-cloud="${name}"]`);

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // DESKTOP — the full pinned camera-forward dolly.
      mm.add('(min-width: 1280px) and (prefers-reduced-motion: no-preference)', () => {
        section.classList.add('htravel');   // suppress the on-load .rise; the timeline owns the settle

        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: { trigger: section, start: 'top top', end: '+=115%', pin: true, scrub: 0.7, anticipatePin: 1 },
        });

        const lerp = (x: number, y: number, t: number) => x + (y - x) * t;

        // The environment travels too: the cloud sea pushes forward (scales up) in
        // sync, so the whole volume moves — not just the logos. (Transform only; the
        // descent gradient lives on a different layer and is untouched.)
        const sky = q('.cloud-hero');
        if (sky) {
          gsap.set(sky, { transformOrigin: '50% 58%', willChange: 'transform' });
          tl.fromTo(sky, { scale: 1 }, { scale: 1.16, ease: 'power1.inOut', duration: 1 }, 0);
        }

        // Branded flights: far/hazy → SNAP into the sharp focal band → blur + grow huge
        // as they pass the camera, then fade. Weighty easing, never linear.
        // We drive transform + filter ourselves through a proxy object (onUpdate) rather
        // than letting GSAP diff the multi-function filter STRING — its filter
        // interpolation mangles `brightness` (drops it to 0), which renders the white
        // mark solid black mid-flight. A numeric proxy keeps every channel correct.
        FLY.forEach((c) => {
          const el = flyEl(c.name);
          if (!el) return;
          const [a, b] = c.win;
          const span = b - a;
          // One tween advances a single normalised progress p (0→1) across the flight;
          // onUpdate derives z / opacity / blur / focus piecewise (approach then pass),
          // with the easing baked in. One source of truth → no two-tween race, and we
          // write the filter ourselves so brightness can't be mangled.
          const st = { p: 0 };
          const FOCAL = 0.56;   // share of the flight spent approaching the focal plane
          const apply = () => {
            const p = st.p;
            let z: number, op: number, blur: number, foc: number;
            if (p <= FOCAL) {
              const k = p / FOCAL;
              const e = 1 - (1 - k) * (1 - k);                 // power2.out — decelerate into focus
              z = lerp(c.z0, c.focalZ, e); op = lerp(0, c.peak, e); blur = lerp(c.blurFar, 0, e); foc = e;
            } else {
              const k = (p - FOCAL) / (1 - FOCAL);
              const e = k * k;                                 // power2.in — accelerate past
              z = lerp(c.focalZ, c.zEnd, e); op = lerp(c.peak, 0, e); blur = lerp(0, c.blurNear, e); foc = lerp(1, 0.7, e);
            }
            el.style.transform = `translate(-50%, -50%) translate3d(${c.dx}px, ${c.dy}px, ${z}px)`;
            el.style.opacity = String(op);
            el.style.filter =
              `blur(${blur.toFixed(2)}px) saturate(${lerp(0.5, 1.05, foc).toFixed(3)}) ` +
              `contrast(${lerp(0.85, 1.02, foc).toFixed(3)}) brightness(${lerp(1.16, 1, foc).toFixed(3)})`;
          };
          apply();   // far/hazy start state
          tl.to(st, { p: 1, duration: span, ease: 'none', onUpdate: apply }, a);
        });

        // The resolve: phone arrives from depth last and settles, sharp + stable. It
        // stays fully INVISIBLE while far (opacity 0, not a faint blurry blob in the
        // centre) and only fades up as it dollies into focus — so it "arrives" cleanly
        // instead of lingering as an out-of-focus dark shape through the whole travel.
        const dolly = q('.hero-phone-dolly');
        if (dolly) {
          gsap.set(dolly, { z: -1200, opacity: 0, filter: 'blur(6px)' });
          tl.to(dolly, { opacity: 1, duration: 0.16, ease: 'power1.out' }, 0.5);            // fade up first
          tl.to(dolly, { z: 0, filter: 'blur(0px)', duration: 0.4, ease: 'power2.out' }, 0.5);  // dolly into sharp focus
        }

        // Ambient marks settle in around the resolved hero.
        REST.forEach((c) => {
          const el = restEl(c.name);
          if (!el) return;
          gsap.set(el, { opacity: 0 });
          tl.to(el, { opacity: c.opacity, duration: 0.2 }, c.fadeAt);
        });

        // Headline + copy settle WITH the phone — transform-only (content stays
        // legible the whole way: it never gets trapped hidden, per the house rule).
        const settles: Array<[string, number, number]> = [
          ['.hero-eyebrow', 0.56, 16],
          ['.hero-head', 0.60, 28],
          ['.hero-copy', 0.68, 22],
          ['.hero-cta', 0.74, 18],
          ['.hero-claims', 0.80, 16],
        ];
        settles.forEach(([sel, at, dy]) => {
          const el = q(sel);
          if (!el) return;
          gsap.set(el, { y: dy });
          tl.to(el, { y: 0, duration: 0.2, ease: 'power3.out' }, at);
        });

        return () => section.classList.remove('htravel');
      });

      // STACKED / NARROW — shorter, simpler: the surviving ambient marks fade + a
      // gentle push-in scrubbed over the hero scroll. No pin (the stacked hero is
      // tall; pinning would feel like hijacking). Phone + text keep their on-load entrance.
      mm.add('(max-width: 1279px) and (prefers-reduced-motion: no-preference)', () => {
        const trig = { trigger: section, start: 'top top', end: 'bottom top', scrub: 0.6 } as const;
        REST.filter((c) => c.keep).forEach((c, i) => {
          const el = restEl(c.name);
          if (!el) return;
          gsap.set(el, { opacity: c.opacity });
          gsap.fromTo(el, { z: -200, y: 12 + i * 4 }, { z: 0, y: -22 - i * 6, ease: 'none', scrollTrigger: trig });
        });
      });

      // REDUCED MOTION — no travelling: resolved hero immediately. Fly marks hidden,
      // ambient marks static, phone + text in their natural resting state.
      mm.add('(prefers-reduced-motion: reduce)', () => {
        FLY.forEach((c) => { const el = flyEl(c.name); if (el) gsap.set(el, { opacity: 0 }); });
        REST.forEach((c) => { const el = restEl(c.name); if (el) gsap.set(el, { opacity: c.opacity }); });
      });
    }, section);

    // Triggers are measured at setup — before the async hero imagery (cloud marks +
    // phone) finishes decoding and settles the layout, which leaves the non-pinned
    // stacked push-in's start/end stale. Re-measure after layout settles. (The pinned
    // desktop timeline self-refreshes on pin, but refreshing it again is harmless.)
    const refresh = () => ScrollTrigger.refresh();
    const raf = requestAnimationFrame(refresh);
    const phone = section.querySelector<HTMLImageElement>('img.hero-phone');
    if (phone && !phone.complete) phone.addEventListener('load', refresh);
    window.addEventListener('load', refresh);

    return () => {
      cancelAnimationFrame(raf);
      phone?.removeEventListener('load', refresh);
      window.removeEventListener('load', refresh);
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="top"
      className="section-light alt-dark hero-sky"
      style={{
        position: 'relative',
        isolation: 'isolate',
        overflow: 'hidden',
        // fixed height on desktop so the cloud layer is firmly clipped to the hero —
        // nothing bleeds into the section below. Stacked layout (≤1120) switches back
        // to min-height:auto so the text-over-phone column can grow (responsive.css).
        height: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        // start the content high (just below the nav) instead of centring it in the
        // viewport, which left an empty top third reading as default padding. Nav
        // clearance + one deliberate step above; a full --space-xl below before the
        // descent.
        justifyContent: 'center',
        paddingTop: 'clamp(6rem, 11vh, 8rem)',
        paddingBottom: 'var(--space-xl)',
      }}
    >
      {/* full-bleed cloud sea, rising from the bottom into the navy */}
      <div className="cloud-bleed cloud-hero" aria-hidden />
      {/* scrim — left-anchored veil keeps the type column AA over the cloud sea while
          the right side stays bright behind the phone. */}
      <div className="sky-scrim hero-scrim" aria-hidden />

      {/* brand cloud marks orbiting the phone (behind it; one front accent at z-3) */}
      <HeroClouds />

      <div className="rail hero-grid" style={{ position: 'relative', zIndex: 2, width: '100%' }}>
        <div className="hero-text">
        {/* eyebrow */}
        <span
          className="rise track-label hero-eyebrow"
          style={{ color: 'var(--ink-1)', marginBottom: 'clamp(1.5rem, 4vh, 2.5rem)', animationDelay: '0.05s' }}
        >
          <span className="rec-dot" aria-hidden />
          Live &middot; voice to finished text
        </span>

        {/* the headline, set into the sky */}
        <h1
          className="rise vapor hero-head"
          style={{
            margin: 0,
            // sized so each wrapped line stays inside the strong left veil while
            // still reading huge; the cloud sea owns the right half, full height
            fontSize: 'clamp(2.75rem, 6.2vw, 5.5rem)',
            lineHeight: 1.0,
            letterSpacing: '-0.025em',
            maxWidth: '13ch',
            animationDelay: '0.1s',
          }}
        >
          Speak in clouds.
          <br />
          <span style={{ color: 'var(--cobalt)', fontStyle: 'italic' }}>Land in ink.</span>
        </h1>

        {/* the literal promise — crisp Satoshi, the precision register */}
        <p
          className="rise hero-copy"
          style={{
            margin: 'clamp(1.75rem, 4vh, 2.75rem) 0 0',
            maxWidth: '36ch',
            fontSize: 'var(--step-1)',
            lineHeight: 1.5,
            color: 'var(--ink-1)',
            animationDelay: '0.16s',
          }}
        >
          Press once and talk. Pocket Voice composes the finished message &mdash; punctuation, tone,
          the register of the app you&rsquo;re in &mdash; 180&nbsp;ms after you stop.
        </p>

        {/* CTA */}
        <div
          className="rise hero-cta"
          style={{
            marginTop: 'clamp(1.75rem, 4vh, 2.5rem)',
            display: 'flex',
            alignItems: 'center',
            gap: 'clamp(1.25rem, 3vw, 2.5rem)',
            flexWrap: 'wrap',
            animationDelay: '0.22s',
          }}
        >
          <StoreBadges height={54} />
          {/* Secondary scroll cue. Self-sufficient: a solid Pocket Black pill with
              Paper text (~16:1) so it stays legible on its own — independent of the
              cloud image, and readable even if the image fails to load. */}
          <a
            href="#demo"
            className="pv-cta hero-watch"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.7ch',
              padding: '0.7ch 1.5ch',
              background: 'var(--pocket-black)',
              color: 'var(--paper)',
              border: '1px solid rgba(250, 250, 248, 0.22)',
              borderRadius: '0.5ch',
              fontWeight: 500,
              fontSize: 'var(--step-0)',
              transition: 'background var(--t-micro) var(--ease), border-color var(--t-micro) var(--ease)',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(250,250,248,0.5)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(250,250,248,0.22)'; }}
          >
            Watch it condense &darr;
          </a>
        </div>

        {/* claims — the precision register, tabular */}
        <ul
          aria-label="Key facts"
          className="rise hero-claims"
          style={{
            margin: 'clamp(2.5rem, 6vh, 4rem) 0 0',
            padding: 'clamp(1.5rem, 3.5vh, 2rem) 0 0',
            borderTop: '1px solid var(--rule-sky)',
            listStyle: 'none',
            display: 'flex',
            gap: 'clamp(1.5rem, 5vw, 4.5rem)',
            flexWrap: 'wrap',
            animationDelay: '0.28s',
          }}
        >
          <Claim figure="180 ms" label="end of speech to text" />
          <Claim figure="108" label="languages, no toggle" />
          <Claim figure="94%" label="tone match, human-rated" />
        </ul>
        </div>

        {/* the product, featured — emerging from the cloud bank */}
        <HeroPhone />
      </div>
    </section>
  );
}

function Claim({ figure, label }: { figure: string; label: string }) {
  return (
    <li style={{ display: 'grid', gap: '0.35ch' }}>
      <span
        className="tabular"
        style={{
          fontFamily: 'var(--font-text)',
          fontWeight: 600,
          fontSize: 'var(--step-2)',
          color: 'var(--cloud-white)',
          letterSpacing: '-0.02em',
          lineHeight: 1,
        }}
      >
        {figure}
      </span>
      <span style={{ fontSize: 'var(--step--1)', color: 'var(--ink-2)' }}>{label}</span>
    </li>
  );
}

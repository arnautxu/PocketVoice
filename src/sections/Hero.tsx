import { useEffect, useRef } from 'react';
import { StoreBadges } from '../components/StoreBadges';
import { HeroClouds } from '../components/HeroClouds';
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

  // Light scroll parallax: phone + clouds ride --hero-shift at different rates for
  // depth. Passive + rAF-throttled, transform-only, disabled under reduced motion.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      el.style.setProperty('--hero-shift', String(Math.min(window.scrollY, el.offsetHeight)));
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); if (raf) cancelAnimationFrame(raf); };
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
        minHeight: '100dvh',
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
          className="rise track-label"
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
          className="rise"
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
          className="rise"
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

import { Wordmark } from '../components/Wordmark';
import { StoreBadges } from '../components/StoreBadges';
import { CloudIcon } from '../components/CloudIcon';
import { HeroPhone } from '../components/PhoneFan';

/* ── Screen-in-sky hero ───────────────────────────────────────────────────────
 * The brand's signature ad composition, built for the web: the lockup + a big
 * Erode headline sit over the open blue sky on the left; a single iPhone floats
 * on the right with the brand's cloud-textured app icons orbiting it. All motion
 * is CSS (entrance + perpetual float) so the fold is always alive without rAF.
 * ──────────────────────────────────────────────────────────────────────────── */

/* Orbiting app icons - position (% of stage), cloud variant, size, float timing. */
const ORBIT = [
  { app: 'whatsapp', cloud: 3, top: '14%', left: '2%',   size: 104, delay: 0,   dur: 7.5 },
  { app: 'slack',    cloud: 2, top: '6%',  left: '70%',  size: 116, delay: 0.8, dur: 8.5 },
  { app: 'mail',     cloud: 4, top: '40%', left: '84%',  size: 100, delay: 1.6, dur: 7.0 },
  { app: 'notes',    cloud: 1, top: '62%', left: '0%',   size: 108, delay: 1.2, dur: 8.0 },
  { app: 'messages', cloud: 2, top: '74%', left: '74%',  size: 110, delay: 0.4, dur: 7.8 },
] as const;

export function Hero() {
  return (
    <section
      id="top"
      style={{
        position: 'relative',
        minHeight: '100dvh',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        paddingTop: 'clamp(7rem, 14vh, 11rem)',
        paddingBottom: 'clamp(4rem, 10vh, 8rem)',
      }}
    >
      {/* soft blue scrim - keeps white type legible wherever clouds drift behind it */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(96deg, rgba(8,72,120,0.46) 0%, rgba(10,90,150,0.24) 34%, rgba(10,90,150,0) 58%)',
        }}
      />

      <div className="rail hero-grid" style={{ position: 'relative', zIndex: 1, width: '100%' }}>
        {/* ── Left: lockup + headline + badges ───────────────────────────── */}
        <div className="hero-copy">
          <Wordmark
            tone="paper"
            height="clamp(1.5rem, 2.4vw, 2rem)"
            className="hero-rise"
            style={{ marginBottom: 'clamp(1.5rem, 4vh, 2.75rem)', animationDelay: '0.05s' } as React.CSSProperties}
          />

          <h1
            className="hero-rise"
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 400,
              fontSize: 'var(--step-5)',
              lineHeight: 0.98,
              letterSpacing: '-0.02em',
              color: 'var(--pv-paper)',
              margin: '0 0 0.5em',
              animationDelay: '0.14s',
              textShadow: '0 2px 22px rgba(8,55,95,0.32)',
            }}
          >
            Every app
            <br />
            you&rsquo;d type in
          </h1>

          <p
            className="hero-rise"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--step-2)',
              lineHeight: 1.18,
              color: 'var(--pv-paper)',
              margin: '0 0 0.35em',
              animationDelay: '0.23s',
              textShadow: '0 1px 14px rgba(8,55,95,0.28)',
            }}
          >
            Slack. Mail. Messages. Notes.
          </p>

          <p
            className="hero-rise"
            style={{
              maxWidth: '34ch',
              fontSize: 'var(--step-1)',
              lineHeight: 1.45,
              color: 'rgba(250,250,248,0.88)',
              margin: '0 0 clamp(2rem, 5vh, 2.75rem)',
              animationDelay: '0.32s',
            }}
          >
            If there&rsquo;s a keyboard, you can talk instead.
          </p>

          <StoreBadges
            className="hero-rise"
            height={56}
            style={{ animationDelay: '0.41s' } as React.CSSProperties}
          />
        </div>

        {/* ── Right: floating phone with orbiting cloud icons ─────────────── */}
        <div className="hero-stage" aria-hidden>
          <div className="hero-stage-inner">
            <div className="hero-phone-float">
              <HeroPhone scale={0.62} />
            </div>
            {ORBIT.map((o) => (
              <div
                key={o.app}
                className="hero-orbit"
                style={{ top: o.top, left: o.left, width: o.size }}
              >
                <CloudIcon
                  app={o.app}
                  cloud={o.cloud}
                  size={o.size}
                  delay={o.delay}
                  duration={o.dur}
                  style={{ width: '100%', height: 'auto', aspectRatio: '1 / 1' }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* scroll cue */}
      <div
        aria-hidden
        style={{ position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)' }}
      >
        <span
          style={{
            display: 'block',
            width: 22,
            height: 34,
            borderRadius: 12,
            border: '1.5px solid rgba(255,255,255,0.7)',
            opacity: 0.7,
            position: 'relative',
          }}
        >
          <span className="pv-scroll-dot" style={{ background: 'rgba(255,255,255,0.9)' }} />
        </span>
      </div>
    </section>
  );
}

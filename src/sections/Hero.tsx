import { StoreBadges } from '../components/StoreBadges';

/* ══════════════════════════════════════════════════════════════════════════════
 * HERO — the full sky. The signature opening: a huge Erode headline set INTO the
 * stratosphere, not contained in a card. A cloud sea bleeds up from the bottom and
 * dissolves into deep navy; a gradient scrim keeps the type legible while the sky
 * still owns the frame. Speech is vapor up here; the page will condense it to ink
 * as you descend. No mechanic yet — that is the centerpiece below.
 * ════════════════════════════════════════════════════════════════════════════ */

export function Hero() {
  return (
    <section
      id="top"
      className="section-light alt-dark hero-sky"
      style={{
        position: 'relative',
        isolation: 'isolate',
        overflow: 'hidden',
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        paddingTop: 'clamp(8rem, 16vh, 11rem)',
        paddingBottom: 'clamp(3.5rem, 9vh, 6rem)',
      }}
    >
      {/* full-bleed cloud sea, rising from the bottom into the navy */}
      <div className="cloud-bleed cloud-hero" aria-hidden />
      {/* scrim — the type lives in the lower atmosphere, where the cloud sea reads
          brightest, so the veil is anchored at the bottom: it keeps every line AA
          over even the whitest cumulus while the cloud still billows, lit, in the
          band above the copy. The sky owns the frame; the scrim only earns legibility. */}
      <div className="sky-scrim hero-scrim" aria-hidden />

      <div className="rail" style={{ width: '100%' }}>
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
          <a
            href="#demo"
            className="navlink"
            style={{ color: 'var(--cloud-white)', fontWeight: 500, fontSize: 'var(--step-0)' }}
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

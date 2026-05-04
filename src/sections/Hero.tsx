import { useEffect, useState } from 'react';
import { Caret } from '../components/Caret';
import { InstallButton } from '../components/InstallButton';
import { Wordmark } from '../components/Wordmark';
import { HeroScene } from '../scene/HeroScene';

/* ── Typewriter ──────────────────────────────────────────────────────────── */
function useTypeIn(text: string, startMs: number, msPerChar = 22) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let tid: number;
    const outer = window.setTimeout(() => {
      let i = 0;
      const tick = () => {
        i++;
        setCount(i);
        if (i < text.length) {
          tid = window.setTimeout(tick, heroCharDelay(i, text, msPerChar));
        }
      };
      tid = window.setTimeout(tick, heroCharDelay(0, text, msPerChar));
    }, startMs);
    return () => { clearTimeout(outer); clearTimeout(tid); };
  }, [text, startMs, msPerChar]);
  return count;
}

function heroCharDelay(i: number, text: string, base: number): number {
  const t = text.length > 1 ? i / (text.length - 1) : 0.5;
  const speed = 0.3 + 0.7 * Math.sin(t * Math.PI);
  const prev = text[i - 1] ?? '';
  const punctBonus = /[.,;:!?…—]/.test(prev) ? base * 3.5 : 0;
  const spaceBonus  = prev === ' ' ? base * 0.4 : 0;
  const jitter = (Math.random() * 0.4 - 0.2) * base;
  return Math.max(5, base / speed + jitter + punctBonus + spaceBonus);
}

/* ── Headline copy ───────────────────────────────────────────────────────── */
const LINE1 = 'speak once.';
const LINE2 = 'the right sentence appears.';
const PARA  = "Pocket Voice reads the surface you're writing in. A reply in Mail becomes an email. A note in Linear becomes a ticket. Your voice, composed correctly — 180 ms after you stop speaking. Any app. 108 languages.";

const T_LINE1_START = 500;
const T_LINE1_END   = T_LINE1_START + 420;
const T_LINE2_START = T_LINE1_END + 240;
const T_LINE2_END   = T_LINE2_START + 980;
const T_CARET_END   = T_LINE2_END + 150;
const T_PARA_START  = T_LINE2_END + 380;
const T_CTA_START   = T_PARA_START + 500;
const T_STATS_START = T_CTA_START + 200;

/* ── Component ───────────────────────────────────────────────────────────── */
export function Hero() {
  const line1Chars = useTypeIn(LINE1, T_LINE1_START);
  const line2Chars = useTypeIn(LINE2, T_LINE2_START);

  const [showPara,  setShowPara]  = useState(false);
  const [showCta,   setShowCta]   = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [endCaret,  setEndCaret]  = useState(false);

  useEffect(() => {
    const timers = [
      window.setTimeout(() => setEndCaret(true),  T_CARET_END),
      window.setTimeout(() => setShowPara(true),  T_PARA_START),
      window.setTimeout(() => setShowCta(true),   T_CTA_START),
      window.setTimeout(() => setShowStats(true), T_STATS_START),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <section
      id="magic"
      style={{
        position: 'relative',
        minHeight: '100dvh',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        paddingTop:    'clamp(7rem, 16vh, 11rem)',
        paddingBottom: 'clamp(4rem, 10vh, 7rem)',
      }}
    >
      <HeroScene />

      <div className="rail" style={{ position: 'relative', zIndex: 1 }}>
        {/* Editorial column — copy carries the hero entirely. The right ~40%   */}
        {/* is intentional whitespace so the dot-grid breathes and the headline */}
        {/* lands without competing with a product mockup.                      */}
        <div style={{ maxWidth: 'min(58ch, 62%)' }}>
          <Wordmark
            height="clamp(3.5rem, 6vw, 5.5rem)"
            style={{
              marginBottom: '3ch',
              opacity: 0,
              animation: 'pv-char-in 0.4s var(--ease) 0.1s forwards',
            }}
          />

          <div
            aria-hidden="true"
            style={{
              color: 'var(--surface-2)',
              fontSize: 'var(--step--1)',
              letterSpacing: '0.08em',
              marginBottom: '3ch',
              opacity: 0,
              animation: 'pv-char-in 0.3s var(--ease) 0.3s forwards',
              userSelect: 'none',
            }}
          >
            {'─'.repeat(32)}
          </div>

          <h1
            style={{
              fontSize: 'var(--step-5)',
              fontWeight: 400,
              lineHeight: 0.96,
              letterSpacing: '-0.02em',
              margin: '0 0 2ch',
            }}
          >
            <span aria-label={LINE1} style={{ display: 'block', minHeight: '1.1em' }}>
              <span aria-hidden>{LINE1.slice(0, line1Chars)}</span>
            </span>
            <span
              aria-label={LINE2}
              style={{ display: 'block', color: 'var(--ink-1)', minHeight: '1.1em', position: 'relative' }}
            >
              <span aria-hidden>{LINE2.slice(0, line2Chars)}</span>
              {endCaret && line2Chars >= LINE2.length && (
                <Caret active style={{ marginLeft: '0.2ch', top: '0.12em', fontSize: 'var(--step-5)' }} />
              )}
            </span>
          </h1>

          {showPara && (
            <p
              style={{
                color: 'var(--ink-1)',
                maxWidth: '52ch',
                fontSize: 'var(--step-1)',
                lineHeight: 1.55,
                margin: '0 0 3ch',
                opacity: 0,
                animation: 'pv-char-in 0.3s var(--ease) forwards',
              }}
            >
              {PARA}
              <span aria-hidden style={{ color: 'var(--ink-2)', marginLeft: '0.15ch' }}>¶</span>
            </p>
          )}

          {showCta && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '2ch',
                flexWrap: 'wrap',
                marginBottom: '4ch',
                opacity: 0,
                animation: 'pv-char-in 0.3s var(--ease) forwards',
              }}
            >
              <InstallButton size="lg" />
              <a
                href="#different"
                style={{
                  color: 'var(--ink-1)',
                  fontSize: 'var(--step-0)',
                  borderBottom: '1px solid var(--hairline-strong)',
                  paddingBottom: '0.1ch',
                  transition: 'color var(--t-micro) var(--ease)',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--ink-0)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--ink-1)')}
              >
                See how it works
              </a>
            </div>
          )}

          {showStats && (
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                color: 'var(--ink-2)',
                fontSize: 'var(--step--1)',
                fontVariantNumeric: 'tabular-nums',
                letterSpacing: '0.06em',
                opacity: 0,
                animation: 'pv-char-in 0.3s var(--ease) forwards',
              }}
            >
              <span>iPhone</span>
              <span style={{ padding: '0 1.5ch', color: 'var(--surface-3)' }}>──</span>
              <span>180 ms median</span>
              <span style={{ padding: '0 1.5ch', color: 'var(--surface-3)' }}>──</span>
              <span>108 languages</span>
              <span style={{ padding: '0 1.5ch', color: 'var(--surface-3)' }}>──</span>
              <span>On-device</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

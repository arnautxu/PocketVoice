// PhoneFan.tsx - CSS-3D three-phone fan, no Three.js required.
// Extracted from PocketVoiceHero.tsx with corrected brand tokens.

import { useEffect, useState } from 'react';
import { BrandSymbol } from './BrandIcon';

/* ── Brand tokens (must match design/tokens.css) ─────────────────────────── */
const BLUE   = '#0E8ECE';  // Pocket Blue
const RED    = '#D94B3A';  // record indicator
const INK    = '#1B1A19';  // Pocket Black
const PAPER  = '#FAFAF8';
const MUTED  = '#8A8783';  // Ash
const BORDER = '#E8E6E2';  // Fog
const FONT   = "'Satoshi', ui-sans-serif, system-ui, sans-serif";
const SERIF  = "'Erode', Georgia, serif";

/* ── Animated waveform ───────────────────────────────────────────────────── */
function Waveform() {
  const [t, setT] = useState(0);
  useEffect(() => {
    let raf: number;
    const start = performance.now();
    const tick = (now: number) => {
      setT((now - start) / 1000);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const N = 28;
  const bars = Array.from({ length: N }, (_, i) => {
    const phase = i * 0.6 - t * 6;
    const a = Math.sin(phase) * 0.5 + 0.5;
    const b = Math.sin(phase * 1.7 + 1.2) * 0.5 + 0.5;
    const env = Math.sin((i / N) * Math.PI);
    return 6 + (a * 0.6 + b * 0.4) * 56 * env;
  });

  return (
    <svg viewBox={`0 0 ${N * 10} 72`} width="100%" height="72" style={{ display: 'block' }}>
      {bars.map((h, i) => (
        <rect
          key={i}
          x={i * 10 + 2} y={(72 - h) / 2}
          width="3" height={h} rx="1.5"
          fill={i < N * 0.55 ? '#fff' : '#2E2E2E'}
        />
      ))}
    </svg>
  );
}

/* ── Phone screen contents ───────────────────────────────────────────────── */
function SplashScreen() {
  return (
    <div style={{ width: 390, height: 844, background: INK, color: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '110px 28px 52px', fontFamily: FONT }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ fontSize: 11, color: MUTED, letterSpacing: '0.18em', fontWeight: 600 }}>v0.1 · BETA</div>
        <BrandSymbol size={44} color={BLUE} />
        <div style={{ fontFamily: SERIF, fontSize: 48, fontWeight: 400, lineHeight: 1.0, letterSpacing: '-0.02em' }}>
          Pocket<br />Voice
        </div>
        <div style={{ fontSize: 14, color: '#C8C8C8', lineHeight: 1.6 }}>
          Speak. Polished text appears.
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ background: BLUE, color: '#fff', padding: '16px', fontFamily: FONT, fontSize: 14, fontWeight: 600, borderRadius: 2, textAlign: 'center' }}>
          Get started →
        </div>
        <div style={{ textAlign: 'center', fontSize: 12, color: MUTED }}>
          Already have an account? <span style={{ color: '#fff', textDecoration: 'underline' }}>Sign in</span>
        </div>
      </div>
    </div>
  );
}

function RecorderLiveScreen() {
  return (
    <div style={{ width: 390, height: 844, background: INK, color: '#fff', fontFamily: FONT, display: 'flex', flexDirection: 'column' }}>
      <div style={{ paddingTop: 54 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderBottom: '1px solid #1A1A1A', minHeight: 44 }}>
          <span style={{ fontSize: 13, color: MUTED }}>Cancel</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, fontWeight: 600, letterSpacing: '0.14em' }}>
            <span style={{ width: 8, height: 8, borderRadius: 999, background: RED, boxShadow: '0 0 0 4px rgba(224,50,43,0.25)', display: 'inline-block' }} />
            REC · 00:42
          </span>
          <span style={{ fontSize: 13, fontWeight: 600, color: BLUE }}>Done</span>
        </div>
      </div>
      <div style={{ flex: 1, padding: '24px 20px 0', display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontSize: 10, color: '#6E6E6E', letterSpacing: '0.18em', fontWeight: 600 }}>LIVE TRANSCRIPT</div>
        <div style={{ marginTop: 12, fontSize: 16, lineHeight: 1.6 }}>
          Speak. Polished text appears.{' '}
          <span style={{ color: MUTED }}>Saved as a draft so you can come back to it later when you have</span>
          <span style={{ background: BLUE, display: 'inline-block', width: 6, height: 18, verticalAlign: 'middle', marginLeft: 2 }} />
        </div>
      </div>
      <div style={{ padding: '20px 20px 36px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
        <Waveform />
        <div style={{ width: 96, height: 96, borderRadius: 999, background: RED, border: '2px solid #fff', boxShadow: '0 0 0 8px rgba(224,50,43,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: 22, height: 22, borderRadius: 2, background: '#fff' }} />
        </div>
        <div style={{ display: 'flex', gap: 28, fontSize: 11, color: MUTED, letterSpacing: '0.14em', fontWeight: 600 }}>
          <span>AUTO</span>
          <span style={{ color: '#fff' }}>· 00:42</span>
          <span>EN-US</span>
        </div>
      </div>
    </div>
  );
}

function TranscriptScreen() {
  return (
    <div style={{ width: 390, height: 844, background: PAPER, fontFamily: FONT, display: 'flex', flexDirection: 'column' }}>
      <div style={{ paddingTop: 54 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderBottom: `1px solid ${BORDER}`, minHeight: 44, fontSize: 13, color: INK }}>
          <span>← Library</span>
          <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', color: '#6E6E6E' }}>TUE · 09:14</span>
          <span>Share</span>
        </div>
      </div>
      <div style={{ padding: '22px 20px 0', display: 'flex', flexDirection: 'column', gap: 10, flex: 1, overflow: 'hidden' }}>
        <div style={{ fontSize: 22, fontWeight: 700, lineHeight: 1.2, letterSpacing: '-0.01em', color: INK }}>Tuesday morning notes</div>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', color: '#6E6E6E' }}>3 PARAGRAPHS · 142 WORDS · SAVED</div>
        <div style={{ marginTop: 6, fontSize: 14, lineHeight: 1.65, color: INK }}>
          A pocket you talk into. Out comes a paragraph. The whole point is that you don't have to stop walking, or stop cooking, to write a thought down.{' '}
          <br /><br />
          The trick is the punctuation. Anyone can transcribe. The work is in figuring out where the breath goes - where one thought ends and the next begins.{' '}
          <br /><br />
          So that's what this thing does. You talk. We paragraph.{' '}
        </div>
      </div>
      <div style={{ padding: '10px 14px 14px', borderTop: `1px solid ${BORDER}`, background: PAPER, flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 999, background: INK, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#fff"><polygon points="6 4 20 12 6 20 6 4" /></svg>
          </div>
          <div style={{ flex: 1, height: 3, background: BORDER, position: 'relative' }}>
            <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: '34%', background: INK }} />
          </div>
          <div style={{ fontSize: 11, color: '#6E6E6E' }}>00:24 / 01:08</div>
        </div>
      </div>
    </div>
  );
}

/* ── Notes home - empty state (the "screen-in-sky" hero screen) ──────────── */
function tabIcon(name: string) {
  const common = { width: 22, height: 22, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  switch (name) {
    case 'History': return <svg {...common}><path d="M3 12a9 9 0 1 0 3-6.7L3 8" /><path d="M3 4v4h4" /><path d="M12 8v4l3 2" /></svg>;
    case 'Notes':   return <svg {...common} fill="currentColor" stroke="none"><rect x="4" y="3" width="16" height="18" rx="2.5" /><g stroke="#fff" strokeWidth="1.6"><line x1="8" y1="8" x2="16" y2="8" /><line x1="8" y1="12" x2="16" y2="12" /><line x1="8" y1="16" x2="13" y2="16" /></g></svg>;
    case 'Vocab':   return <svg {...common}><path d="M4 5h16v14H4z" /><path d="M9 5v14" /><path d="M12 9h5M12 13h5" /></svg>;
    case 'Snippets':return <svg {...common}><circle cx="6" cy="6" r="2.5" /><circle cx="6" cy="18" r="2.5" /><path d="M20 4 8.5 16.5M14 10l6 10" /></svg>;
    case 'Tone':    return <svg {...common}><circle cx="12" cy="12" r="9" /><path d="M9 14s1.2 1.5 3 1.5 3-1.5 3-1.5" /><line x1="9" y1="9.5" x2="9.5" y2="9.5" /><line x1="14.5" y1="9.5" x2="15" y2="9.5" /></svg>;
    default: return null;
  }
}

function NotesScreen() {
  const tabs = ['History', 'Notes', 'Vocab', 'Snippets', 'Tone'];
  return (
    <div style={{ width: 390, height: 844, background: '#fff', fontFamily: FONT, display: 'flex', flexDirection: 'column' }}>
      {/* status bar */}
      <div style={{ paddingTop: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 26px 0', fontSize: 14, fontWeight: 600, color: INK }}>
        <span style={{ fontFamily: '-apple-system, system-ui' }}>11:55</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
          <svg width="17" height="11" viewBox="0 0 17 11" fill={INK}><rect x="0" y="7" width="3" height="4" rx="1"/><rect x="4.5" y="5" width="3" height="6" rx="1"/><rect x="9" y="2.5" width="3" height="8.5" rx="1"/><rect x="13.5" y="0" width="3" height="11" rx="1"/></svg>
          <svg width="16" height="12" viewBox="0 0 16 12" fill={INK}><path d="M8 2.2c2.1 0 4 .8 5.4 2.1l1.3-1.3C12.9 1.2 10.6.3 8 .3S3.1 1.2 1.3 3l1.3 1.3C4 3 5.9 2.2 8 2.2z" opacity=".9"/><path d="M8 5.6c1.2 0 2.3.5 3.1 1.3l1.3-1.3C11.2 4.4 9.7 3.8 8 3.8s-3.2.6-4.4 1.8l1.3 1.3C5.7 6.1 6.8 5.6 8 5.6z"/><circle cx="8" cy="9.4" r="1.6"/></svg>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#E8A33D' }}>85</span>
            <svg width="24" height="12" viewBox="0 0 24 12"><rect x="0.5" y="0.5" width="20" height="11" rx="3" fill="none" stroke={INK} opacity=".4"/><rect x="2" y="2" width="14" height="8" rx="1.5" fill="#E8A33D"/><rect x="21.5" y="3.5" width="2" height="5" rx="1" fill={INK} opacity=".4"/></svg>
          </span>
        </span>
      </div>

      {/* header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 24px 6px' }}>
        <span style={{ fontFamily: SERIF, fontSize: 30, fontWeight: 400, color: INK, letterSpacing: '-0.01em' }}>Notes</span>
        <span style={{ width: 36, height: 36, borderRadius: 999, background: '#D7E9F5', color: BLUE, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 600 }}>N</span>
      </div>

      {/* empty state */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, position: 'relative', paddingBottom: 80 }}>
        {/* stacked-notes illustration */}
        <svg width="92" height="80" viewBox="0 0 92 80" aria-hidden>
          <rect x="16" y="14" width="48" height="58" rx="7" fill="#FCEFAF" transform="rotate(-7 40 43)" />
          <rect x="28" y="10" width="48" height="58" rx="7" fill="#FFD75E" />
          <g stroke="#E2B53A" strokeWidth="2.4" strokeLinecap="round">
            <line x1="38" y1="26" x2="66" y2="26" /><line x1="38" y1="35" x2="66" y2="35" /><line x1="38" y1="44" x2="58" y2="44" />
          </g>
        </svg>
        <div style={{ fontSize: 18, fontWeight: 600, color: INK }}>No notes, yet</div>
        <div style={{ fontSize: 13.5, color: MUTED }}>Start writing your first note</div>
        {/* squiggle pointing to FAB */}
        <svg width="58" height="74" viewBox="0 0 58 74" fill="none" stroke={BORDER} strokeWidth="2.4" strokeLinecap="round" style={{ position: 'absolute', right: 36, bottom: 6 }} aria-hidden>
          <path d="M10 4c10 6 2 16 12 20s18-2 22 8-6 18-12 30" />
          <path d="M28 56l4 10 9-6" />
        </svg>
        {/* FAB */}
        <div style={{ position: 'absolute', right: 24, bottom: 14, width: 56, height: 56, borderRadius: 999, background: BLUE, boxShadow: '0 10px 22px -6px rgba(14,142,206,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="26" height="26" viewBox="0 0 24 24" stroke="#fff" strokeWidth="2.4" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        </div>
      </div>

      {/* tab bar */}
      <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', padding: '10px 8px 30px', borderTop: `1px solid ${BORDER}` }}>
        {tabs.map((t) => {
          const active = t === 'Notes';
          return (
            <div key={t} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, color: active ? BLUE : MUTED }}>
              <span style={{ display: 'flex' }}>{tabIcon(t)}</span>
              <span style={{ fontSize: 10.5, fontWeight: active ? 600 : 500 }}>{t}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Phone frame ─────────────────────────────────────────────────────────── */
interface PhoneFrameProps {
  children: React.ReactNode;
  scale?: number;
}

function PhoneFrame({ children, scale = 1 }: PhoneFrameProps) {
  const W = 390, H = 844;
  return (
    <div style={{
      width: W * scale, height: H * scale,
      borderRadius: 28 * scale,
      background: '#0E0E10',
      boxShadow: `0 ${32 * scale}px ${80 * scale}px rgba(0,0,0,0.45), 0 0 0 ${1.5 * scale}px #1A1A1C, inset 0 0 0 ${scale}px #2A2A2C`,
      overflow: 'hidden', position: 'relative', flexShrink: 0,
    }}>
      {/* Dynamic island */}
      <div style={{ position: 'absolute', top: 6 * scale, left: '50%', transform: 'translateX(-50%)', width: 60 * scale, height: 18 * scale, background: '#000', borderRadius: 12 * scale, zIndex: 10 }} />
      {/* Home bar */}
      <div style={{ position: 'absolute', bottom: 5 * scale, left: '50%', transform: 'translateX(-50%)', width: 78 * scale, height: 3 * scale, background: 'rgba(255,255,255,0.25)', borderRadius: 2 * scale, zIndex: 10 }} />
      {/* Status time */}
      <div style={{ position: 'absolute', top: 10 * scale, left: 18 * scale, fontSize: 10 * scale, fontWeight: 700, color: '#fff', fontFamily: '-apple-system, system-ui', zIndex: 20, mixBlendMode: 'difference' }}>9:41</div>
      {/* Screen */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: W, height: H, transform: `scale(${scale})`, transformOrigin: 'top left', borderRadius: 28, overflow: 'hidden' }}>
        {children}
      </div>
    </div>
  );
}

/* ── Three-phone fan ─────────────────────────────────────────────────────── */
interface ThreePhoneFanProps {
  scale?: number;
  leftScreen: React.ReactNode;
  centerScreen: React.ReactNode;
  rightScreen: React.ReactNode;
}

export function ThreePhoneFan({ scale = 0.5, leftScreen, centerScreen, rightScreen }: ThreePhoneFanProps) {
  const W = 390 * scale;
  const H = 844 * scale;
  const overlap = 0.28 * W;
  const totalW = W * 3 - overlap * 2;

  return (
    <div style={{ position: 'relative', width: totalW, height: H * 1.05, perspective: 1200, perspectiveOrigin: '50% 60%' }}>
      {/* Left */}
      <div style={{ position: 'absolute', left: 0, bottom: 0, transform: `rotateY(18deg) rotateX(-2deg) translateY(${H * 0.025}px) scale(0.92)`, transformOrigin: 'bottom center', transformStyle: 'preserve-3d', zIndex: 1, opacity: 0.85 }}>
        <PhoneFrame scale={scale}>{leftScreen}</PhoneFrame>
      </div>
      {/* Center */}
      <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', bottom: 0, zIndex: 3, transformStyle: 'preserve-3d' }}>
        <PhoneFrame scale={scale}>{centerScreen}</PhoneFrame>
      </div>
      {/* Right */}
      <div style={{ position: 'absolute', right: 0, bottom: 0, transform: `rotateY(-18deg) rotateX(-2deg) translateY(${H * 0.025}px) scale(0.92)`, transformOrigin: 'bottom center', transformStyle: 'preserve-3d', zIndex: 1, opacity: 0.85 }}>
        <PhoneFrame scale={scale}>{rightScreen}</PhoneFrame>
      </div>
    </div>
  );
}

/* ── Single hero phone - the Notes screen, for the screen-in-sky composition ─ */
export function HeroPhone({ scale = 0.62 }: { scale?: number }) {
  return <PhoneFrame scale={scale}><NotesScreen /></PhoneFrame>;
}

/* ── Pre-composed hero phones ────────────────────────────────────────────── */
export function HeroPhones({ scale = 0.5 }: { scale?: number }) {
  return (
    <ThreePhoneFan
      scale={scale}
      leftScreen={<SplashScreen />}
      centerScreen={<RecorderLiveScreen />}
      rightScreen={<TranscriptScreen />}
    />
  );
}

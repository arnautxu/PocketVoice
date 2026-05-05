// PocketVoiceHero.tsx
// ─────────────────────────────────────────────────────────────
// Self-contained React hero section for Pocket Voice.
// No Three.js needed — pure CSS 3D transforms + React.
//
// Dependencies: none (only React)
// Fonts: load "Borna" via @font-face in your global CSS
//
// Usage:
//   import PocketVoiceHero from "./PocketVoiceHero";
//   <PocketVoiceHero />
// ─────────────────────────────────────────────────────────────

import React, { useEffect, useState, useRef } from "react";

// ── Brand tokens ──────────────────────────────────────────────
const INK   = "#0A0A0A";
const BLUE  = "#1F3DFF";
const RED   = "#E0322B";
const MUTED = "#9A9A9A";
const BORDER = "#ECECEC";
const FONT  = '"Borna", system-ui, sans-serif';

// ── Animated waveform ─────────────────────────────────────────
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
    <svg viewBox={`0 0 ${N * 10} 72`} width="100%" height="72" style={{ display: "block" }}>
      {bars.map((h, i) => (
        <rect
          key={i}
          x={i * 10 + 2} y={(72 - h) / 2}
          width="3" height={h} rx="1.5"
          fill={i < N * 0.55 ? "#fff" : "#2E2E2E"}
        />
      ))}
    </svg>
  );
}

// ── Phone screen contents ─────────────────────────────────────
function SplashScreen() {
  return (
    <div style={{ width: 390, height: 844, background: INK, color: "#fff", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "110px 28px 52px", fontFamily: FONT }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div style={{ fontSize: 11, color: MUTED, letterSpacing: "0.18em", fontWeight: 600 }}>v0.1 · BETA</div>
        <div style={{ fontSize: 48, fontWeight: 700, lineHeight: 1.0, letterSpacing: "-0.02em" }}>
          Pocket<br />Voice<span style={{ color: BLUE }}>¶</span>
        </div>
        <div style={{ fontSize: 14, color: "#C8C8C8", lineHeight: 1.6 }}>
          A pocket you can talk into.<br />Out comes a paragraph.
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ background: BLUE, color: "#fff", padding: "16px", fontFamily: FONT, fontSize: 14, fontWeight: 600, borderRadius: 2, textAlign: "center" }}>
          Get started →
        </div>
        <div style={{ textAlign: "center", fontSize: 12, color: MUTED }}>
          Already have an account? <span style={{ color: "#fff", textDecoration: "underline" }}>Sign in</span>
        </div>
      </div>
    </div>
  );
}

function RecorderLiveScreen() {
  return (
    <div style={{ width: 390, height: 844, background: INK, color: "#fff", fontFamily: FONT, display: "flex", flexDirection: "column" }}>
      <div style={{ paddingTop: 54 }}>
        {/* App bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", borderBottom: "1px solid #1A1A1A", minHeight: 44 }}>
          <span style={{ fontSize: 13, color: MUTED }}>Cancel</span>
          <span style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11, fontWeight: 600, letterSpacing: "0.14em" }}>
            <span style={{ width: 8, height: 8, borderRadius: 999, background: RED, boxShadow: "0 0 0 4px rgba(224,50,43,0.25)", display: "inline-block" }} />
            REC · 00:42
          </span>
          <span style={{ fontSize: 13, fontWeight: 600, color: BLUE }}>Done</span>
        </div>
      </div>
      <div style={{ flex: 1, padding: "24px 20px 0", display: "flex", flexDirection: "column" }}>
        <div style={{ fontSize: 10, color: "#6E6E6E", letterSpacing: "0.18em", fontWeight: 600 }}>LIVE TRANSCRIPT</div>
        <div style={{ marginTop: 12, fontSize: 16, lineHeight: 1.6 }}>
          A pocket you talk into. Out comes a paragraph.{" "}
          <span style={{ color: BLUE, fontWeight: 700 }}>¶</span>{" "}
          <span style={{ color: MUTED }}>Saved as a draft so you can come back to it later when you have</span>
          <span style={{ background: BLUE, display: "inline-block", width: 6, height: 18, verticalAlign: "middle", marginLeft: 2 }} />
        </div>
      </div>
      <div style={{ padding: "20px 20px 36px", display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
        <Waveform />
        <div style={{ width: 96, height: 96, borderRadius: 999, background: RED, border: "2px solid #fff", boxShadow: "0 0 0 8px rgba(224,50,43,0.18)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: 22, height: 22, borderRadius: 2, background: "#fff" }} />
        </div>
        <div style={{ display: "flex", gap: 28, fontSize: 11, color: MUTED, letterSpacing: "0.14em", fontWeight: 600 }}>
          <span>¶ AUTO</span>
          <span style={{ color: "#fff" }}>· 00:42</span>
          <span>EN-US</span>
        </div>
      </div>
    </div>
  );
}

function TranscriptScreen() {
  return (
    <div style={{ width: 390, height: 844, background: "#fff", fontFamily: FONT, display: "flex", flexDirection: "column" }}>
      <div style={{ paddingTop: 54 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", borderBottom: `1px solid ${BORDER}`, minHeight: 44, fontSize: 13, color: INK }}>
          <span>← Library</span>
          <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", color: "#6E6E6E" }}>TUE · 09:14</span>
          <span>Share</span>
        </div>
      </div>
      <div style={{ padding: "22px 20px 0", display: "flex", flexDirection: "column", gap: 10, flex: 1, overflow: "hidden" }}>
        <div style={{ fontSize: 22, fontWeight: 700, lineHeight: 1.2, letterSpacing: "-0.01em" }}>Tuesday morning notes</div>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", color: "#6E6E6E" }}>3 PARAGRAPHS · 142 WORDS · SAVED</div>
        <div style={{ marginTop: 6, fontSize: 14, lineHeight: 1.65, color: INK }}>
          A pocket you talk into. Out comes a paragraph. The whole point is that you don't have to stop walking, or stop cooking, to write a thought down.{" "}
          <span style={{ color: BLUE, fontWeight: 700 }}>¶</span>
          <br /><br />
          The trick is the punctuation. Anyone can transcribe. The work is in figuring out where the breath goes — where one thought ends and the next begins.{" "}
          <span style={{ color: BLUE, fontWeight: 700 }}>¶</span>
          <br /><br />
          So that's what this thing does. You talk. We paragraph.{" "}
          <span style={{ color: BLUE, fontWeight: 700 }}>¶</span>
        </div>
      </div>
      <div style={{ padding: "10px 14px 14px", borderTop: `1px solid ${BORDER}`, background: "#fff", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 999, background: INK, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#fff"><polygon points="6 4 20 12 6 20 6 4" /></svg>
          </div>
          <div style={{ flex: 1, height: 3, background: BORDER, position: "relative" }}>
            <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: "34%", background: INK }} />
          </div>
          <div style={{ fontSize: 11, color: "#6E6E6E" }}>00:24 / 01:08</div>
        </div>
      </div>
    </div>
  );
}

// ── Phone frame ───────────────────────────────────────────────
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
      background: "#0E0E10",
      boxShadow: `0 ${32 * scale}px ${80 * scale}px rgba(0,0,0,0.35), 0 0 0 ${1.5 * scale}px #1A1A1C, inset 0 0 0 ${scale}px #2A2A2C`,
      overflow: "hidden", position: "relative", flexShrink: 0,
    }}>
      {/* Dynamic island */}
      <div style={{ position: "absolute", top: 6 * scale, left: "50%", transform: "translateX(-50%)", width: 60 * scale, height: 18 * scale, background: "#000", borderRadius: 12 * scale, zIndex: 10 }} />
      {/* Home bar */}
      <div style={{ position: "absolute", bottom: 5 * scale, left: "50%", transform: "translateX(-50%)", width: 78 * scale, height: 3 * scale, background: "rgba(255,255,255,0.25)", borderRadius: 2 * scale, zIndex: 10 }} />
      {/* Status time */}
      <div style={{ position: "absolute", top: 10 * scale, left: 18 * scale, fontSize: 10 * scale, fontWeight: 700, color: "#fff", fontFamily: "-apple-system, system-ui", zIndex: 20, mixBlendMode: "difference" }}>9:41</div>
      {/* Screen */}
      <div style={{ position: "absolute", top: 0, left: 0, width: W, height: H, transform: `scale(${scale})`, transformOrigin: "top left", borderRadius: 28, overflow: "hidden" }}>
        {children}
      </div>
    </div>
  );
}

// ── Three-phone fan ───────────────────────────────────────────
interface ThreePhoneFanProps {
  scale?: number;
  leftScreen: React.ReactNode;
  centerScreen: React.ReactNode;
  rightScreen: React.ReactNode;
}

function ThreePhoneFan({ scale = 0.58, leftScreen, centerScreen, rightScreen }: ThreePhoneFanProps) {
  const W = 390 * scale;
  const H = 844 * scale;
  const overlap = 0.28 * W;
  const totalW = W * 3 - overlap * 2;

  return (
    <div style={{ position: "relative", width: totalW, height: H * 1.05, perspective: 1200, perspectiveOrigin: "50% 60%" }}>
      {/* Left */}
      <div style={{ position: "absolute", left: 0, bottom: 0, transform: `rotateY(18deg) rotateX(-2deg) translateY(${H * 0.025}px) scale(0.92)`, transformOrigin: "bottom center", transformStyle: "preserve-3d", zIndex: 1, opacity: 0.9 }}>
        <PhoneFrame scale={scale}>{leftScreen}</PhoneFrame>
      </div>
      {/* Center */}
      <div style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", bottom: 0, zIndex: 3, transformStyle: "preserve-3d" }}>
        <PhoneFrame scale={scale}>{centerScreen}</PhoneFrame>
      </div>
      {/* Right */}
      <div style={{ position: "absolute", right: 0, bottom: 0, transform: `rotateY(-18deg) rotateX(-2deg) translateY(${H * 0.025}px) scale(0.92)`, transformOrigin: "bottom center", transformStyle: "preserve-3d", zIndex: 1, opacity: 0.9 }}>
        <PhoneFrame scale={scale}>{rightScreen}</PhoneFrame>
      </div>
    </div>
  );
}

// ── Hero ──────────────────────────────────────────────────────
interface PocketVoiceHeroProps {
  onCTA?: () => void;          // callback for the App Store button
  phoneScale?: number;         // default 0.58 — increase for larger phones
}

export default function PocketVoiceHero({ onCTA, phoneScale = 0.58 }: PocketVoiceHeroProps) {
  return (
    <section style={{
      width: "100%", minHeight: "100vh",
      background: INK,
      display: "flex", alignItems: "center", justifyContent: "center",
      gap: 80, padding: "60px 80px",
      position: "relative", overflow: "hidden",
      fontFamily: FONT,
    }}>
      {/* Background glows */}
      <div style={{ position: "absolute", top: "-20%", left: "28%", width: 600, height: 600, borderRadius: "50%", background: "rgba(31,61,255,0.12)", filter: "blur(100px)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "-15%", right: "10%", width: 400, height: 400, borderRadius: "50%", background: "rgba(31,61,255,0.07)", filter: "blur(70px)", pointerEvents: "none" }} />

      {/* Left: copy */}
      <div style={{ display: "flex", flexDirection: "column", gap: 28, maxWidth: 520, flexShrink: 0, zIndex: 1 }}>
        {/* Wordmark */}
        <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 28, letterSpacing: "-0.01em", color: "#fff" }}>
          Pocket Voice<span style={{ color: BLUE }}>¶</span>
        </span>

        {/* Headline */}
        <h1 style={{ fontSize: "clamp(48px, 5vw, 72px)", fontWeight: 700, lineHeight: 1.0, letterSpacing: "-0.025em", color: "#fff", margin: 0 }}>
          You talk.<br />
          <span style={{ color: BLUE }}>¶</span> We<br />
          paragraph.
        </h1>

        {/* Body */}
        <p style={{ fontSize: 18, color: MUTED, lineHeight: 1.65, maxWidth: "34ch", fontWeight: 400, margin: 0 }}>
          Speak into your pocket. Out comes a clean, punctuated paragraph — no editing required.
        </p>

        {/* CTA */}
        <button
          onClick={onCTA}
          style={{
            alignSelf: "flex-start",
            background: BLUE, color: "#fff",
            padding: "14px 28px", border: 0, borderRadius: 2,
            fontFamily: FONT, fontSize: 16, fontWeight: 600,
            letterSpacing: "0.02em", cursor: "pointer",
          }}
        >
          Download on the App Store →
        </button>
      </div>

      {/* Right: phones */}
      <div style={{ flexShrink: 0, zIndex: 1 }}>
        <ThreePhoneFan
          scale={phoneScale}
          leftScreen={<SplashScreen />}
          centerScreen={<RecorderLiveScreen />}
          rightScreen={<TranscriptScreen />}
        />
      </div>
    </section>
  );
}

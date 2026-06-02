import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTypeIn } from '../hooks/useTypeIn';
import { GlassPanel } from '../components/GlassPanel';
import { useInViewOnce } from '../hooks/useInViewOnce';

/* Web Speech API - not yet in all TS DOM libs */
interface SR extends EventTarget {
  interimResults: boolean;
  continuous: boolean;
  maxAlternatives: number;
  lang: string;
  onresult: ((e: SREvent) => void) | null;
  onspeechend: (() => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}
interface SRResult { readonly isFinal: boolean; 0: { transcript: string } }
interface SREvent extends Event { results: SRResult[] & { length: number } }
type SRConstructor = new () => SR;
const getSR = (): SRConstructor | null =>
  (window as unknown as Record<string, unknown>).SpeechRecognition as SRConstructor ??
  (window as unknown as Record<string, unknown>).webkitSpeechRecognition as SRConstructor ??
  null;

type Phase = 'idle' | 'listening' | 'thinking' | 'reveal' | 'unsupported';

/* Simple polish: remove fillers, fix casing, add punctuation */
function polish(raw: string): string {
  let text = raw.trim();
  text = text.replace(
    /\b(um+|uh+|er+|ah+|like|you know|i mean|basically|actually|literally|right so|so um|kind of|sort of)\b,?\s*/gi,
    ' ',
  );
  text = text.replace(/\s+/g, ' ').trim();
  if (!text) return '';
  text = text.charAt(0).toUpperCase() + text.slice(1);
  text = text.replace(/\bi\b/g, 'I');
  if (!/[.!?…]$/.test(text)) text += '.';
  return text;
}

const ease = [0.4, 0, 0.2, 1];

const H2_L1 = 'Try it yourself.';
const H2_L2 = 'Speak. Watch it compose.';
const T_L2  = H2_L1.length * 18 + 200;

export function MicDemo() {
  const [headingRef, headingInView] = useInViewOnce<HTMLElement>('-15% 0px');
  const l1 = useTypeIn(H2_L1, headingInView);
  const l2 = useTypeIn(H2_L2, headingInView, T_L2);
  const [phase, setPhase] = useState<Phase>('idle');
  const [interim, setInterim] = useState('');
  const [polished, setPolished] = useState('');
  const recognitionRef = useRef<SR | null>(null);
  const transcriptRef = useRef('');

  useEffect(() => {
    if (!getSR()) setPhase('unsupported');
    return () => recognitionRef.current?.abort();
  }, []);

  const start = useCallback(() => {
    const SRConstructor = getSR();
    if (!SRConstructor) return;

    recognitionRef.current?.abort();

    const rec = new SRConstructor();
    rec.interimResults = true;
    rec.continuous = false;
    rec.maxAlternatives = 1;
    recognitionRef.current = rec;
    transcriptRef.current = '';

    setPhase('listening');
    setInterim('');
    setPolished('');

    rec.onresult = (e: SREvent) => {
      let text = '';
      for (let i = 0; i < e.results.length; i++) {
        text += e.results[i][0].transcript;
      }
      transcriptRef.current = text;
      setInterim(text);
    };

    rec.onspeechend = () => {
      rec.stop();
    };

    rec.onend = () => {
      if (!transcriptRef.current) {
        setPhase('idle');
        return;
      }
      setPhase('thinking');
      window.setTimeout(() => {
        setPolished(polish(transcriptRef.current));
        setPhase('reveal');
      }, 420);
    };

    rec.onerror = () => setPhase('idle');

    rec.start();
  }, []);

  const reset = useCallback(() => {
    recognitionRef.current?.abort();
    setPhase('idle');
    setInterim('');
    setPolished('');
    transcriptRef.current = '';
  }, []);

  return (
    <section style={{ padding: 'clamp(3rem, 7vh, 6rem) 0' }}>
      <div className="rail">
        <GlassPanel
          className="reveal"
          innerStyle={{ display: 'grid', gap: 'clamp(2rem, 5vh, 3rem)', padding: 'clamp(2rem, 5vw, 4rem)' }}
        >
        <header ref={headingRef} style={{ display: 'grid', gap: '1.5rem', maxWidth: '44ch' }}>
          <Eyebrow>Try it now</Eyebrow>
          <h2
            style={{
              margin: 0,
              fontSize: 'var(--step-4)',
              letterSpacing: '-0.03em',
              lineHeight: 1.0,
              fontWeight: 400,
            }}
          >
            <span aria-label={H2_L1} style={{ display: 'block', minHeight: '1.05em' }}>
              <span aria-hidden>{H2_L1.slice(0, l1)}</span>
            </span>
            <span aria-label={H2_L2} style={{ display: 'block', color: 'var(--ink-1)', minHeight: '1.05em' }}>
              <span aria-hidden>{H2_L2.slice(0, l2)}</span>
            </span>
          </h2>
        </header>

        <div
          style={{
            borderTop: '1px solid var(--hairline)',
            paddingTop: 'clamp(1.5rem, 4vw, 2.5rem)',
          }}
        >
          {phase === 'unsupported' ? (
            <p style={{ color: 'var(--ink-2)', fontSize: 'var(--step-0)', margin: 0 }}>
              Your browser doesn't support live speech recognition. Try Chrome or Safari.
            </p>
          ) : (
            <div style={{ display: 'grid', gap: '2rem' }}>
              {/* You said row */}
              <Row label="You said">
                <span
                  style={{
                    color: 'var(--ink-1)',
                    fontSize: 'var(--step-1)',
                    lineHeight: 1.5,
                    minHeight: '3em',
                    display: 'inline',
                  }}
                >
                  {interim || (
                    <span style={{ color: 'var(--ink-2)' }}>
                      {phase === 'idle' ? 'Press the button below and speak…' : ''}
                    </span>
                  )}
                  {phase === 'listening' && <LiveCaret />}
                </span>
              </Row>

              <Dash />

              {/* It wrote row */}
              <Row label="It wrote">
                <AnimatePresence mode="wait">
                  {phase === 'reveal' ? (
                    <motion.span
                      key="polished"
                      initial={{ opacity: 0, filter: 'blur(4px)' }}
                      animate={{ opacity: 1, filter: 'blur(0px)' }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.32, ease }}
                      style={{
                        display: 'inline-block',
                        fontSize: 'var(--step-2)',
                        lineHeight: 1.35,
                        letterSpacing: '-0.015em',
                        color: 'var(--ink-0)',
                        fontWeight: 400,
                      }}
                    >
                      {polished}
                    </motion.span>
                  ) : (
                    <motion.span
                      key="status"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      style={{
                        color: 'var(--ink-2)',
                        fontSize: 'var(--step-1)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '1ch',
                        minHeight: '1.4em',
                      }}
                    >
                      {phase === 'thinking' && <Pulse />}
                      {phase === 'thinking' ? 'composing…' : 'waiting'}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Row>

              <Dash />

              {/* Controls */}
              <div style={{ display: 'flex', gap: '1.5ch', alignItems: 'center', flexWrap: 'wrap' }}>
                {phase !== 'reveal' ? (
                  <MicButton
                    active={phase === 'listening'}
                    disabled={phase === 'thinking'}
                    onClick={phase === 'listening' ? reset : start}
                  />
                ) : (
                  <>
                    <button
                      onClick={start}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '1ch',
                        padding: '0.7ch 1.5ch',
                        border: '1px solid var(--ink-0)',
                        background: 'transparent',
                        color: 'var(--ink-0)',
                        fontSize: 'var(--step--1)',
                        fontFamily: 'var(--font-mono)',
                        letterSpacing: '0.06em',
                        cursor: 'pointer',
                        transition: 'background 120ms ease-out, color 120ms ease-out',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'var(--ink-0)';
                        e.currentTarget.style.color = 'var(--surface-0)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = 'var(--ink-0)';
                      }}
                    >
                      <RecIcon /> try again
                    </button>
                    <button
                      onClick={reset}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--ink-2)',
                        fontSize: 'var(--step--1)',
                        fontFamily: 'var(--font-mono)',
                        letterSpacing: '0.06em',
                        cursor: 'pointer',
                        padding: '0.7ch 0',
                      }}
                    >
                      clear
                    </button>
                  </>
                )}
                {phase === 'listening' && (
                  <motion.span
                    key="hint"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{
                      color: 'var(--ink-2)',
                      fontSize: 'var(--step--1)',
                      letterSpacing: '0.06em',
                    }}
                  >
                    speak now, click again to stop
                  </motion.span>
                )}
              </div>
            </div>
          )}
        </div>
        </GlassPanel>
      </div>
    </section>
  );
}

function MicButton({
  active,
  disabled,
  onClick,
}: {
  active: boolean;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '1ch',
        padding: '0.7ch 1.75ch',
        border: `1px solid ${active ? 'var(--ink-0)' : 'var(--ink-0)'}`,
        background: active ? 'var(--ink-0)' : 'transparent',
        color: active ? 'var(--surface-0)' : 'var(--ink-0)',
        fontSize: 'var(--step--1)',
        fontFamily: 'var(--font-mono)',
        letterSpacing: '0.06em',
        cursor: disabled ? 'default' : 'pointer',
        opacity: disabled ? 0.4 : 1,
        transition: 'background 120ms ease-out, color 120ms ease-out, transform 100ms ease-out',
      }}
      onMouseEnter={(e) => {
        if (disabled || active) return;
        e.currentTarget.style.background = 'var(--ink-0)';
        e.currentTarget.style.color = 'var(--surface-0)';
      }}
      onMouseLeave={(e) => {
        if (active) return;
        e.currentTarget.style.background = 'transparent';
        e.currentTarget.style.color = 'var(--ink-0)';
      }}
      onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.97)'; }}
      onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
    >
      {active ? <StopIcon /> : <RecIcon />}
      {active ? 'stop' : 'press to speak'}
      {active && <ListeningRing />}
    </button>
  );
}

function ListeningRing() {
  return (
    <span
      aria-hidden
      style={{
        position: 'absolute',
        inset: -4,
        border: '1px solid var(--ink-2)',
        opacity: 0.4,
        animation: 'pv-pulse 1.6s ease-out infinite',
        pointerEvents: 'none',
      }}
    />
  );
}

function LiveCaret() {
  return (
    <span
      aria-hidden
      style={{
        display: 'inline-block',
        width: 2,
        height: '0.8em',
        background: 'var(--color-signal)',
        marginLeft: '0.2ch',
        verticalAlign: 'baseline',
        position: 'relative',
        top: '0.05em',
        animation: 'pv-caret 1.2s linear infinite',
      }}
    />
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div
      className="demo-row"
      style={{
        display: 'grid',
        gridTemplateColumns: 'clamp(6rem, 14vw, 9rem) 1fr',
        gap: '1.5rem',
        alignItems: 'baseline',
      }}
    >
      <span
        style={{
          color: 'var(--ink-2)',
          fontSize: 'var(--step--1)',
          letterSpacing: '0.06em',
        }}
      >
        {label}
      </span>
      <div>{children}</div>
    </div>
  );
}

function Dash() {
  return (
    <div
      aria-hidden="true"
      className="pv-rule"
      style={{
        color: 'var(--surface-3)',
        fontSize: 'var(--step--1)',
        letterSpacing: '0.1em',
        userSelect: 'none',
      }}
    >
      {'─'.repeat(48)}
    </div>
  );
}

function Pulse() {
  return (
    <span style={{ position: 'relative', display: 'inline-block', width: 8, height: 8 }}>
      <span
        style={{ position: 'absolute', inset: 0, borderRadius: 999, background: 'var(--ink-2)' }}
      />
      <span
        style={{
          position: 'absolute',
          inset: -3,
          borderRadius: 999,
          border: '1px solid var(--ink-2)',
          opacity: 0.5,
          animation: 'pv-pulse 1.4s ease-out infinite',
        }}
      />
    </span>
  );
}

function RecIcon() {
  return (
    <svg width="11" height="14" viewBox="0 0 11 14" fill="none" aria-hidden>
      <rect x="3" y="0" width="5" height="9" rx="2.5" fill="currentColor" />
      <path d="M1 6.5C1 9.26 3.01 11.5 5.5 11.5S10 9.26 10 6.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      <line x1="5.5" y1="11.5" x2="5.5" y2="13.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function StopIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden>
      <rect x="1" y="1" width="8" height="8" fill="currentColor" />
    </svg>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '1ch',
        color: 'var(--ink-2)',
        fontSize: 'var(--step--1)',
        letterSpacing: '0.08em',
      }}
    >
      <span aria-hidden style={{ display: 'inline-block', width: '2ch', height: 1, background: 'var(--ink-2)' }} />
      {children}
    </span>
  );
}

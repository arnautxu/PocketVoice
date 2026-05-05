import { motion } from 'framer-motion';
import { useTypeIn } from '../hooks/useTypeIn';
import { useInViewOnce } from '../hooks/useInViewOnce';

/* ── Content ─────────────────────────────────────────────────────────────── */
/*
 * Each card shows the transformation: spoken fragment → adapted output.
 * That's the claim. Prove it on every card.
 */

const ROW1 = [
  {
    surface: 'Mail',
    tone: 'Email',
    spoken: 'hey anna — loved the deck, two thoughts on pricing',
    output: 'Anna, thanks for the deck. Two thoughts on the pricing section, when you have a moment.',
  },
  {
    surface: 'Linear',
    tone: 'Issue',
    spoken: 'cls-148, payment retry loops on 402',
    output: 'CLS-148 — payment retry loops on 402 error. Needs root-cause analysis before next release.',
  },
  {
    surface: 'Slack',
    tone: 'Message',
    spoken: 'pushed the fix, could someone smoke-test',
    output: '@channel — pushed the fix. Could someone smoke-test before we deploy to prod?',
  },
  {
    surface: 'Notion',
    tone: 'Doc',
    spoken: 'q3 review — context, decisions, follow-ups',
    output: 'Q3 review — context, decisions made, follow-ups still open. Last updated today.',
  },
  {
    surface: 'Cursor',
    tone: 'Comment',
    spoken: 'extract this into a hook, state logic is tangled',
    output: '// extract into a hook — the state logic is tangled with the render cycle.',
  },
  {
    surface: 'Bear',
    tone: 'Essay',
    spoken: 'on translating taste from hardware to software',
    output: 'On translating taste from hardware to software. The constraint changes everything.',
  },
];

const ROW2 = [
  {
    surface: 'iMessage',
    tone: 'Reply',
    spoken: 'on my way, five minutes',
    output: 'On my way. Five minutes.',
  },
  {
    surface: 'Drafts',
    tone: 'Note',
    spoken: 'idea — ambient mode, slower interface for mornings',
    output: 'Ambient mode — a slower interface for mornings. No pings. Just words.',
  },
  {
    surface: 'Things',
    tone: 'Task',
    spoken: 'reply to the investor update by friday',
    output: 'Reply to investor update — by Friday.',
  },
  {
    surface: 'WhatsApp',
    tone: 'Reply',
    spoken: "let's speak tomorrow morning",
    output: "Let's speak tomorrow morning. Nine work for you?",
  },
  {
    surface: 'Mail',
    tone: 'Cold reply',
    spoken: 'not the right fit right now but keep us in mind',
    output: 'Thanks for reaching out. Not the right fit at this stage — please do keep us in mind.',
  },
  {
    surface: 'Drafts',
    tone: 'Fragment',
    spoken: 'airports as the last honest mirrors',
    output: 'Airports as the last honest mirrors. A working thought.',
  },
];

const H2_L1 = 'Same voice.';
const H2_L2 = 'Right register.';
const T_L2   = H2_L1.length * 20 + 180;

/* ── Component ───────────────────────────────────────────────────────────── */
export function AnywhereYouType() {
  const [headingRef, headingInView] = useInViewOnce<HTMLElement>('-10% 0px');
  const l1 = useTypeIn(H2_L1, headingInView);
  const l2 = useTypeIn(H2_L2, headingInView, T_L2);

  const row1 = [...ROW1, ...ROW1];
  const row2 = [...ROW2, ...ROW2];

  return (
    <section id="anywhere" style={{ padding: 'clamp(7rem, 12vh, 10rem) 0', overflow: 'hidden' }}>

      {/* ── Header ──────────────────────────────────────────────────── */}
      <div className="rail" style={{ marginBottom: 'clamp(3rem, 6vh, 5rem)' }}>
        <header ref={headingRef} style={{ maxWidth: '44ch' }}>
          <Eyebrow>Any app. One press.</Eyebrow>

          <h2
            style={{
              margin: '1.5ch 0 2ch',
              fontSize: 'var(--step-4)',
              letterSpacing: '-0.03em',
              lineHeight: 1.0,
              fontWeight: 400,
            }}
          >
            <span aria-label={H2_L1} style={{ display: 'block', minHeight: '1.05em' }}>
              <span aria-hidden>{H2_L1.slice(0, l1)}</span>
            </span>
            <span
              aria-label={H2_L2}
              style={{ display: 'block', color: 'var(--ink-1)', minHeight: '1.05em' }}
            >
              <span aria-hidden>{H2_L2.slice(0, l2)}</span>
            </span>
          </h2>

          <p
            style={{
              margin: 0,
              color: 'var(--ink-1)',
              fontSize: 'var(--step-0)',
              lineHeight: 1.65,
              maxWidth: '48ch',
            }}
          >
            Pocket Voice reads the surface before it writes. A thought in Linear becomes a ticket.
            A reply in Mail becomes prose. Same voice — different register, every time.
            <span aria-hidden style={{ color: 'var(--ink-2)', marginLeft: '0.15ch' }}>¶</span>
          </p>
        </header>
      </div>

      {/* ── Two-row marquee ─────────────────────────────────────────── */}
      <div
        style={{
          display: 'grid',
          gap: '1ch',
          maskImage: 'linear-gradient(90deg, transparent 0, #0A0A0A 7%, #0A0A0A 93%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(90deg, transparent 0, #0A0A0A 7%, #0A0A0A 93%, transparent 100%)',
        }}
      >
        {/* Row 1 — scrolls left */}
        <motion.ul
          aria-label="Surfaces Pocket Voice adapts to"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 55, ease: 'linear', repeat: Infinity }}
          style={{ display: 'flex', gap: '1ch', margin: 0, padding: 0, listStyle: 'none', width: 'max-content' }}
        >
          {row1.map((v, i) => (
            <li key={`r1-${i}`} style={{ flex: '0 0 auto' }}>
              <Card {...v} />
            </li>
          ))}
        </motion.ul>

        {/* Row 2 — scrolls right (counter-direction) */}
        <motion.ul
          aria-label="More surfaces Pocket Voice adapts to"
          animate={{ x: ['-50%', '0%'] }}
          transition={{ duration: 50, ease: 'linear', repeat: Infinity }}
          style={{ display: 'flex', gap: '1ch', margin: 0, padding: 0, listStyle: 'none', width: 'max-content' }}
        >
          {row2.map((v, i) => (
            <li key={`r2-${i}`} style={{ flex: '0 0 auto' }}>
              <Card {...v} />
            </li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}

/* ── Card — the transformation proof ────────────────────────────────────── */
interface CardProps {
  surface: string;
  tone: string;
  spoken: string;
  output: string;
}

function Card({ surface, tone, spoken, output }: CardProps) {
  return (
    <div
      style={{
        width: 'clamp(300px, 26vw, 380px)',
        padding: '2ch 2.5ch',
        border: '1px solid var(--hairline)',
        background: 'var(--surface-1)',
        display: 'grid',
        gap: '1.2ch',
        flexShrink: 0,
      }}
    >
      {/* Surface + tone label */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          gap: '1ch',
        }}
      >
        <span
          style={{
            color: 'var(--ink-0)',
            fontSize: 'var(--step--1)',
            fontWeight: 600,
            letterSpacing: '0.06em',
          }}
        >
          {surface.toUpperCase()}
        </span>
        <span
          style={{
            color: 'var(--ink-2)',
            fontSize: 'var(--step--1)',
            letterSpacing: '0.08em',
          }}
        >
          {tone}
        </span>
      </div>

      {/* Rule */}
      <div
        aria-hidden="true"
        style={{
          color: 'var(--surface-3)',
          fontSize: 'calc(var(--step--1) * 0.7)',
          letterSpacing: '0.12em',
          userSelect: 'none',
          lineHeight: 1,
        }}
      >
        {'─'.repeat(34)}
      </div>

      {/* Spoken input — what the user said */}
      <p
        style={{
          margin: 0,
          color: 'var(--ink-2)',
          fontSize: 'var(--step--1)',
          lineHeight: 1.5,
          fontStyle: 'italic',
        }}
      >
        "{spoken}"
      </p>

      {/* Thin hairline — the transformation boundary */}
      <div
        aria-hidden="true"
        style={{ height: '1px', background: 'var(--hairline-strong)' }}
      />

      {/* Written output — what Pocket Voice wrote */}
      <p
        style={{
          margin: 0,
          color: 'var(--ink-0)',
          fontSize: 'var(--step-0)',
          lineHeight: 1.55,
          minHeight: '3em',
        }}
      >
        {output}
        <span aria-hidden style={{ color: 'var(--color-signal)', marginLeft: '0.15ch' }}>¶</span>
      </p>
    </div>
  );
}

/* ── Eyebrow ─────────────────────────────────────────────────────────────── */
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
      <span
        aria-hidden
        style={{ display: 'inline-block', width: '2ch', height: 1, background: 'var(--ink-2)' }}
      />
      {children}
    </span>
  );
}

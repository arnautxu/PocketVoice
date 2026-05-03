import { motion } from 'framer-motion';

const VIGNETTES = [
  { surface: 'iMessage',  fragment: 'On my way. Five minutes.',                     tone: 'Reply' },
  { surface: 'Linear',    fragment: 'CLS‑148 — payment retry loops on 402.',        tone: 'Issue' },
  { surface: 'Notion',    fragment: 'Q3 review — context, decisions, follow‑ups.',  tone: 'Doc' },
  { surface: 'Slack',     fragment: 'Pushed the fix. Could someone smoke‑test?',    tone: 'Message' },
  { surface: 'Mail',      fragment: 'Anna, thanks for the deck. Two thoughts.',     tone: 'Email' },
  { surface: 'Drafts',    fragment: 'Idea — an ambient mode for mornings.',         tone: 'Note' },
  { surface: 'Things',    fragment: 'Reply to the investor update by Friday.',      tone: 'Task' },
  { surface: 'Cursor',    fragment: '// extract this into a hook.',                 tone: 'Comment' },
  { surface: 'Bear',      fragment: 'On translating taste from hardware to software.', tone: 'Essay' },
  { surface: 'WhatsApp',  fragment: 'Let’s speak tomorrow morning.',           tone: 'Reply' },
];

export function AnywhereYouType() {
  const items = [...VIGNETTES, ...VIGNETTES];

  return (
    <section id="anywhere" style={{ padding: 'clamp(7rem, 12vh, 10rem) 0', position: 'relative' }}>
      <div className="rail" style={{ display: 'grid', gap: '2.5rem' }}>
        <header style={{ display: 'grid', gap: '1.25rem', maxWidth: '34ch' }}>
          <Eyebrow>Anywhere you type</Eyebrow>
          <h2
            style={{
              margin: 0,
              fontSize: 'var(--step-4)',
              letterSpacing: '-0.045em',
              lineHeight: 1.0,
              fontWeight: 400,
            }}
          >
            One gesture.
            <br />
            <span style={{ color: 'var(--ink-1)' }}>Every app you already use.</span>
          </h2>
          <p style={{ margin: 0, color: 'var(--ink-1)', fontSize: 'var(--step-0)', fontWeight: 380, letterSpacing: '-0.008em' }}>
            iMessage, Mail, Notion, Linear, Slack, Cursor, Things, WhatsApp.
            Pocket Voice runs system‑wide. Press once. Speak. The right text
            appears in the right place.
          </p>
        </header>
      </div>

      <div
        style={{
          marginTop: 'clamp(3rem, 7vh, 5rem)',
          position: 'relative',
          maskImage:
            'linear-gradient(90deg, transparent 0, black 8%, black 92%, transparent 100%)',
          WebkitMaskImage:
            'linear-gradient(90deg, transparent 0, black 8%, black 92%, transparent 100%)',
          overflow: 'hidden',
        }}
      >
        <motion.ul
          aria-label="Surfaces Pocket Voice writes into"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 56, ease: 'linear', repeat: Infinity }}
          style={{
            display: 'flex',
            gap: '1rem',
            margin: 0,
            padding: 0,
            listStyle: 'none',
            width: 'max-content',
          }}
        >
          {items.map((v, i) => (
            <li key={`${v.surface}-${i}`} style={{ flex: '0 0 auto' }}>
              <Vignette {...v} />
            </li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}

function Vignette({ surface, fragment, tone }: { surface: string; fragment: string; tone: string }) {
  return (
    <div
      style={{
        width: 320,
        padding: '1.4rem 1.5rem',
        borderRadius: 22,
        border: '1px solid var(--hairline)',
        background: 'oklch(0.17 0.005 270)',
        boxShadow: 'var(--shadow-edge)',
        display: 'grid',
        gap: '0.85rem',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <span
          style={{
            color: 'var(--ink-0)',
            fontSize: 'var(--step--1)',
            fontWeight: 500,
            letterSpacing: '-0.005em',
          }}
        >
          {surface}
        </span>
        <span
          className="tabular"
          style={{
            color: 'var(--ink-2)',
            fontSize: 'calc(var(--step--1) * 0.85)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}
        >
          {tone}
        </span>
      </div>
      <p
        style={{
          margin: 0,
          color: 'var(--ink-1)',
          fontSize: 'var(--step-0)',
          letterSpacing: '-0.005em',
          lineHeight: 1.45,
          minHeight: '2.6em',
        }}
      >
        {fragment}
      </p>
      <span
        style={{
          height: 1,
          background:
            'linear-gradient(90deg, var(--accent), transparent 70%)',
          opacity: 0.5,
        }}
      />
    </div>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.55rem',
        color: 'var(--ink-2)',
        fontFamily: 'var(--font-mono)',
        fontSize: 'var(--step--1)',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
      }}
    >
      <span aria-hidden style={{ display: 'inline-block', width: 14, height: 1, background: 'var(--ink-2)' }} />
      {children}
    </span>
  );
}

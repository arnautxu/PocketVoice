import { motion } from 'framer-motion';
import { useTypeIn } from '../hooks/useTypeIn';
import { useInViewOnce } from '../hooks/useInViewOnce';

const VIGNETTES = [
  { surface: 'iMessage',  fragment: 'On my way. Five minutes.',                       tone: 'Reply'   },
  { surface: 'Linear',    fragment: 'CLS-148 — payment retry loops on 402.',          tone: 'Issue'   },
  { surface: 'Notion',    fragment: 'Q3 review — context, decisions, follow-ups.',    tone: 'Doc'     },
  { surface: 'Slack',     fragment: 'Pushed the fix. Could someone smoke-test?',      tone: 'Message' },
  { surface: 'Mail',      fragment: 'Anna, thanks for the deck. Two thoughts.',       tone: 'Email'   },
  { surface: 'Drafts',    fragment: 'Idea — an ambient mode for mornings.',           tone: 'Note'    },
  { surface: 'Things',    fragment: 'Reply to the investor update by Friday.',        tone: 'Task'    },
  { surface: 'Cursor',    fragment: '// extract this into a hook.',                  tone: 'Comment' },
  { surface: 'Bear',      fragment: 'On translating taste from hardware to software.', tone: 'Essay'  },
  { surface: 'WhatsApp',  fragment: "Let's speak tomorrow morning.",                  tone: 'Reply'   },
];

const H2_L1 = 'One press.';
const H2_L2 = 'Every app you already have.';
const T_L2  = H2_L1.length * 18 + 200;

export function AnywhereYouType() {
  const items = [...VIGNETTES, ...VIGNETTES];
  const [headingRef, headingInView] = useInViewOnce<HTMLElement>('-15% 0px');
  const l1 = useTypeIn(H2_L1, headingInView);
  const l2 = useTypeIn(H2_L2, headingInView, T_L2);

  return (
    <section id="anywhere" style={{ padding: 'clamp(7rem, 12vh, 10rem) 0', position: 'relative' }}>
      <div className="rail" style={{ display: 'grid', gap: '2.5rem' }}>
        <header ref={headingRef} style={{ display: 'grid', gap: '1.5rem', maxWidth: '36ch' }}>
          <Eyebrow>Anywhere you type</Eyebrow>
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
          <p
            style={{
              margin: 0,
              color: 'var(--ink-1)',
              fontSize: 'var(--step-0)',
              lineHeight: 1.6,
              maxWidth: '48ch',
            }}
          >
            Pocket Voice runs at the system level — not inside a single app.
            iMessage, Mail, Notion, Linear, Slack, Cursor, Things, WhatsApp.
            Press once. Speak. The text arrives in the right register for that surface.
            <span aria-hidden style={{ color: 'var(--ink-2)', marginLeft: '0.15ch' }}>¶</span>
          </p>
        </header>
      </div>

      <div
        style={{
          marginTop: 'clamp(3rem, 7vh, 5rem)',
          position: 'relative',
          maskImage:
            'linear-gradient(90deg, transparent 0, #0A0A0A 6%, #0A0A0A 94%, transparent 100%)',
          WebkitMaskImage:
            'linear-gradient(90deg, transparent 0, #0A0A0A 6%, #0A0A0A 94%, transparent 100%)',
          overflow: 'hidden',
        }}
      >
        <motion.ul
          aria-label="Surfaces Pocket Voice writes into"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 60, ease: 'linear', repeat: Infinity }}
          style={{
            display: 'flex',
            gap: '1ch',
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
        width: 300,
        padding: '1.5ch 2ch',
        border: '1px solid var(--hairline)',
        background: 'var(--surface-1)',
        display: 'grid',
        gap: '1ch',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <span
          style={{
            color: 'var(--ink-0)',
            fontSize: 'var(--step--1)',
            fontWeight: 500,
          }}
        >
          {surface}
        </span>
        <span
          className="tabular"
          style={{
            color: 'var(--ink-2)',
            fontSize: 'var(--step--1)',
            letterSpacing: '0.08em',
          }}
        >
          {tone}
        </span>
      </div>

      {/* Mono separator */}
      <div
        aria-hidden="true"
        style={{
          color: 'var(--surface-3)',
          fontSize: 'calc(var(--step--1) * 0.75)',
          letterSpacing: '0.1em',
          userSelect: 'none',
        }}
      >
        {'─'.repeat(28)}
      </div>

      <p
        style={{
          margin: 0,
          color: 'var(--ink-1)',
          fontSize: 'var(--step-0)',
          lineHeight: 1.5,
          minHeight: '2.8em',
        }}
      >
        {fragment}
        <span aria-hidden style={{ color: 'var(--ink-2)', marginLeft: '0.15ch' }}>¶</span>
      </p>
    </div>
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

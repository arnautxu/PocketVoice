import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

const POINTS = [
  {
    no: '01',
    title: 'Faster than typing.',
    body:
      'Median latency is 180 ms from end-of-utterance to finalized text. The polished sentence appears before your hand reaches the keyboard.',
    metric: { value: '180', unit: 'ms', caption: 'end → polished text' },
  },
  {
    no: '02',
    title: 'Understands context.',
    body:
      'Pocket Voice reads the surface you\'re writing in. A reply in Mail sounds like an email. A note in Linear sounds like a Linear issue. Same voice, different register.',
    metric: { value: '94%', unit: 'tone match', caption: 'human-rated, internal corpus' },
  },
  {
    no: '03',
    title: 'Speaks 108 languages.',
    body:
      'Code-switch mid-sentence. Mix Catalan and English, Hindi and Tamil, Arabic and French. Pocket Voice keeps up. No setting to flip, no language picker.',
    metric: { value: '108', unit: 'languages', caption: 'inline, no toggle' },
  },
];

const ease = [0.23, 1, 0.32, 1];

export function Differentiators() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const railShift = useTransform(scrollYProgress, [0, 1], [-40, 40]);

  return (
    <section
      id="different"
      ref={sectionRef}
      style={{ position: 'relative', padding: 'clamp(8rem, 14vh, 12rem) 0' }}
    >
      <div
        className="rail"
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.25fr)',
          gap: 'clamp(2rem, 6vw, 5rem)',
          alignItems: 'start',
        }}
      >
        <motion.div
          style={{ y: railShift, position: 'sticky', top: '14vh' }}
        >
          <Eyebrow>Why it's different</Eyebrow>
          <h2
            style={{
              margin: '1.25rem 0 0',
              fontSize: 'var(--step-4)',
              letterSpacing: '-0.04em',
              lineHeight: 0.98,
              fontWeight: 500,
              maxWidth: '15ch',
            }}
          >
            Three things <span style={{ color: 'var(--ink-1)' }}>that have to be true</span> for
            voice to replace typing.
          </h2>
          <p
            style={{
              color: 'var(--ink-1)',
              maxWidth: '38ch',
              fontSize: 'var(--step-0)',
              marginTop: '1.75rem',
            }}
          >
            Most voice apps get one. Some get two. The category leader gets two and a half. Pocket
            Voice was built to get all three at once.
          </p>
        </motion.div>

        <ol
          style={{
            margin: 0,
            padding: 0,
            listStyle: 'none',
            display: 'grid',
            gap: 'clamp(2.5rem, 6vh, 4.5rem)',
          }}
        >
          {POINTS.map((p, i) => (
            <motion.li
              key={p.no}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-15% 0px' }}
              transition={{ duration: 0.7, ease, delay: i * 0.04 }}
              style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 1fr)',
                gap: '1.5rem',
                paddingTop: 'clamp(2rem, 4vh, 3rem)',
                borderTop: '1px solid var(--hairline)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  gap: '1rem',
                }}
              >
                <span
                  className="tabular"
                  style={{
                    color: 'var(--ink-2)',
                    fontSize: 'var(--step--1)',
                    letterSpacing: '0.08em',
                  }}
                >
                  {p.no}
                </span>
                <span
                  className="tabular"
                  style={{
                    color: 'var(--ink-2)',
                    fontSize: 'var(--step--1)',
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                  }}
                >
                  {p.metric.caption}
                </span>
              </div>
              <h3
                style={{
                  margin: 0,
                  fontSize: 'var(--step-3)',
                  letterSpacing: '-0.03em',
                  lineHeight: 1.05,
                  fontWeight: 500,
                }}
              >
                {p.title}
              </h3>
              <p
                style={{
                  color: 'var(--ink-1)',
                  fontSize: 'var(--step-1)',
                  lineHeight: 1.45,
                  letterSpacing: '-0.01em',
                  margin: 0,
                  maxWidth: '52ch',
                }}
              >
                {p.body}
              </p>
              <Metric value={p.metric.value} unit={p.metric.unit} />
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
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

function Metric({ value, unit }: { value: string; unit: string }) {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'baseline',
        gap: '0.5rem',
        marginTop: '0.5rem',
      }}
    >
      <span
        className="tabular"
        style={{
          fontSize: 'var(--step-3)',
          letterSpacing: '-0.04em',
          color: 'var(--ink-0)',
          fontWeight: 500,
        }}
      >
        {value}
      </span>
      <span
        className="tabular"
        style={{
          fontSize: 'var(--step-0)',
          color: 'var(--ink-2)',
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
        }}
      >
        {unit}
      </span>
    </div>
  );
}

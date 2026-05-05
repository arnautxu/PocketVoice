import { motion } from 'framer-motion';
import { InstallButton } from '../components/InstallButton';
import { useTypeIn } from '../hooks/useTypeIn';
import { useInViewOnce } from '../hooks/useInViewOnce';

const ease = [0.4, 0, 0.2, 1];

/* Pricing comparison — canonical composition from brand spec */
const FREE_PLAN  = ['30 min / day', '3 languages', 'Standard speed'];
const PRO_PLAN   = ['Unlimited',    'All languages', 'Priority speed'];

const FP_SEG1 = 'Press once. ';   // 12 chars — default ink
const FP_SEG2 = 'Walk away.';     // 10 chars — ink-1
const FP_FULL = FP_SEG1 + FP_SEG2;

export function FromPocket() {
  const [h2Ref, h2InView] = useInViewOnce<HTMLHeadingElement>('-15% 0px');
  const fc = useTypeIn(FP_FULL, h2InView);

  return (
    <section
      style={{
        position: 'relative',
        padding: 'clamp(8rem, 16vh, 14rem) 0',
        overflow: 'hidden',
      }}
    >
      <div
        className="rail fp-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
          gap: 'clamp(2.5rem, 6vw, 5rem)',
          alignItems: 'start',
        }}
      >
        {/* Left: brand statement */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-15% 0px' }}
          transition={{ duration: 0.3, ease }}
        >
          <Eyebrow>From Pocket</Eyebrow>
          <h2
            ref={h2Ref}
            aria-label={FP_FULL}
            style={{
              margin: '1.5ch 0 2ch',
              fontSize: 'var(--step-4)',
              letterSpacing: '-0.03em',
              lineHeight: 1.0,
              fontWeight: 400,
              maxWidth: '14ch',
            }}
          >
            <span aria-hidden>
              {FP_SEG1.slice(0, Math.min(fc, FP_SEG1.length))}
              {fc > FP_SEG1.length && (
                <span style={{ color: 'var(--ink-1)' }}>
                  {FP_SEG2.slice(0, fc - FP_SEG1.length)}
                </span>
              )}
            </span>
          </h2>
          <p
            style={{
              color: 'var(--ink-1)',
              maxWidth: '44ch',
              fontSize: 'var(--step-0)',
              lineHeight: 1.65,
              margin: '0 0 2.5ch',
            }}
          >
            Pocket Voice exists to get out of your way. Press once. Speak your
            thought. By the time your hand reaches the keyboard, the message is
            already written — in the right words, for the right surface.
            <span aria-hidden style={{ color: 'var(--ink-2)', marginLeft: '0.15ch' }}>¶</span>
          </p>
          <InstallButton size="lg" />
        </motion.div>

        {/* Right: pricing comparison — canonical mono grid composition */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10% 0px' }}
          transition={{ duration: 0.3, ease, delay: 0.06 }}
          style={{
            border: '1px solid var(--hairline)',
            background: 'var(--surface-1)',
            padding: '2.5ch 3ch',
          }}
        >
          {/* Header row */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '2ch',
              fontSize: 'var(--step-0)',
              fontWeight: 500,
              marginBottom: '0.75ch',
            }}
          >
            <span>Free</span>
            <span style={{ color: 'var(--ink-1)' }}>Pro</span>
          </div>

          {/* Mono separator */}
          <div
            aria-hidden="true"
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '2ch',
              color: 'var(--ink-2)',
              fontSize: 'var(--step--1)',
              letterSpacing: '0.08em',
              marginBottom: '1.5ch',
              userSelect: 'none',
            }}
          >
            <span>{'─'.repeat(12)}</span>
            <span>{'─'.repeat(12)}</span>
          </div>

          {/* Feature rows */}
          {FREE_PLAN.map((freeFeature, i) => (
            <div
              key={i}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '2ch',
                color: 'var(--ink-1)',
                fontSize: 'var(--step-0)',
                lineHeight: 1.8,
              }}
            >
              <span>{freeFeature}</span>
              <span style={{ color: 'var(--ink-0)' }}>{PRO_PLAN[i]}</span>
            </div>
          ))}

          {/* Pilcrow */}
          <div
            style={{
              marginTop: '1.5ch',
              color: 'var(--ink-2)',
              fontSize: 'var(--step--1)',
            }}
          >
            <span aria-hidden>¶</span>
          </div>
        </motion.div>
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

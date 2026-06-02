import { InstallButton } from '../components/InstallButton';
import { useTypeIn } from '../hooks/useTypeIn';
import { useInViewOnce } from '../hooks/useInViewOnce';
import { GlassPanel } from '../components/GlassPanel';

const FREE_PLAN = ['30 min / day', '3 languages', 'Standard speed'];
const PRO_PLAN = ['Unlimited', 'All languages', 'Priority speed'];

const FP_SEG1 = 'Press once. ';
const FP_SEG2 = 'Walk away.';
const FP_FULL = FP_SEG1 + FP_SEG2;

export function FromPocket() {
  const [h2Ref, h2InView] = useInViewOnce<HTMLHeadingElement>('-15% 0px');
  const fc = useTypeIn(FP_FULL, h2InView);

  return (
    <section style={{ padding: 'clamp(3rem, 7vh, 7rem) 0' }}>
      <div className="rail">
        <GlassPanel
          blue
          className="reveal"
          innerClassName="fp-grid"
          innerStyle={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
            gap: 'clamp(2.5rem, 6vw, 5rem)',
            alignItems: 'center',
            padding: 'clamp(2.25rem, 5vw, 4rem)',
          }}
        >
          {/* Left: brand statement */}
          <div>
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
                color: 'var(--pv-paper)',
              }}
            >
              <span aria-hidden>
                {FP_SEG1.slice(0, Math.min(fc, FP_SEG1.length))}
                {fc > FP_SEG1.length && (
                  <span style={{ color: 'rgba(250,250,248,0.7)' }}>
                    {FP_SEG2.slice(0, fc - FP_SEG1.length)}
                  </span>
                )}
              </span>
            </h2>
            <p style={{ color: 'var(--ink-1)', maxWidth: '44ch', fontSize: 'var(--step-0)', lineHeight: 1.65, margin: '0 0 2.5ch' }}>
              Pocket Voice exists to get out of your way. Press once. Speak your thought. By the
              time your hand reaches the keyboard, the message is already written, in the right
              words, for the right surface.
            </p>
            <InstallButton size="lg" inverted />
          </div>

          {/* Right: pricing comparison */}
          <div
            style={{
              background: 'rgba(255,255,255,0.10)',
              border: '1px solid rgba(255,255,255,0.18)',
              borderRadius: '16px',
              padding: 'clamp(1.5rem, 3vw, 2.5rem)',
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '2ch',
                fontSize: 'var(--step-0)',
                fontWeight: 500,
                marginBottom: '0.75ch',
                color: 'var(--pv-paper)',
              }}
            >
              <span>Free</span>
              <span style={{ color: 'rgba(250,250,248,0.7)' }}>Pro</span>
            </div>
            <div aria-hidden="true" style={{ height: 1, background: 'rgba(255,255,255,0.18)', margin: '0 0 1.25ch' }} />
            {FREE_PLAN.map((freeFeature, i) => (
              <div
                key={i}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '2ch',
                  color: 'rgba(250,250,248,0.74)',
                  fontSize: 'var(--step-0)',
                  lineHeight: 1.9,
                }}
              >
                <span>{freeFeature}</span>
                <span style={{ color: 'var(--pv-paper)' }}>{PRO_PLAN[i]}</span>
              </div>
            ))}
          </div>
        </GlassPanel>
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
        color: 'rgba(250,250,248,0.7)',
        fontSize: 'var(--step--1)',
        letterSpacing: '0.08em',
      }}
    >
      <span aria-hidden style={{ display: 'inline-block', width: '2ch', height: 1, background: 'rgba(250,250,248,0.5)' }} />
      {children}
    </span>
  );
}

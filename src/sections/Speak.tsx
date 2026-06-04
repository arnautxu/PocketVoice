import { VoiceTransform } from '../components/VoiceTransform';
import { Caret } from '../components/Caret';
import { useInViewOnce } from '../hooks/useInViewOnce';
import { useTypeIn } from '../hooks/useTypeIn';

const LINE1 = 'Speak once.';
const LINE2 = 'The right sentence appears.';
const PARA =
  "Pocket Voice reads the surface you're writing in. A reply in Mail becomes an email. A note in Linear becomes a ticket. Your voice, composed correctly, 180 ms after you stop. Any app. 108 languages.";

export function Speak() {
  const [ref, inView] = useInViewOnce<HTMLDivElement>('-20% 0px');
  const l1 = useTypeIn(LINE1, inView);
  const l2 = useTypeIn(LINE2, inView, LINE1.length * 22 + 220);
  const showCaret = l2 >= LINE2.length;

  return (
    <section id="speak" className="section-light" style={{ padding: 'clamp(4rem, 8vh, 7rem) 0' }}>
      <div className="rail">
        <div
          ref={ref}
          className="reveal speak-grid grid-12"
          style={{ alignItems: 'center' }}
        >
          {/* Copy */}
          <div style={{ gridColumn: 'span 6' }}>
            <h2
              style={{
                fontSize: 'var(--step-4)',
                fontWeight: 400,
                lineHeight: 0.98,
                letterSpacing: '-0.02em',
                margin: '0 0 0.8em',
              }}
            >
              <span aria-label={LINE1} style={{ display: 'block', minHeight: '1.05em' }}>
                <span aria-hidden>{LINE1.slice(0, l1)}</span>
              </span>
              <span
                aria-label={LINE2}
                style={{ display: 'block', color: 'var(--pv-blue)', minHeight: '1.05em', position: 'relative' }}
              >
                <span aria-hidden>{LINE2.slice(0, l2)}</span>
                {showCaret && <Caret active style={{ marginLeft: '0.15ch' }} />}
              </span>
            </h2>

            <p style={{ color: 'var(--ink-1)', maxWidth: '50ch', fontSize: 'var(--step-1)', lineHeight: 1.6, margin: 0 }}>
              {PARA}
            </p>
          </div>

          {/* Said → Written transform */}
          <div style={{ gridColumn: 'span 6', gridColumnStart: 7 }}>
            <VoiceTransform />
          </div>
        </div>
      </div>
    </section>
  );
}

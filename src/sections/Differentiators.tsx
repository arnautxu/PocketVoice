import { useTypeIn } from '../hooks/useTypeIn';
import { useInViewOnce } from '../hooks/useInViewOnce';

const POINTS = [
  {
    no: '01',
    title: 'Done before your hand moves.',
    body:
      '180 ms from the last word you spoke to the finished sentence. The text is already waiting when your fingers reach the keyboard. Tested on iPhone 15 Pro, 50-run median.',
    metric: { value: '180', unit: 'ms', caption: 'end-of-utterance to text' },
  },
  {
    no: '02',
    title: 'Reads where you\'re writing.',
    body:
      'Pocket Voice identifies the surface: Mail, Slack, Linear, Notion. A message to a colleague sounds like a message. An issue description reads like a ticket. Same voice. The right register.',
    metric: { value: '94%', unit: 'tone match', caption: 'human-rated, internal corpus' },
  },
  {
    no: '03',
    title: '108 languages. No toggle.',
    body:
      'Switch mid-sentence. Spanish into English. Mandarin into French. Pocket Voice follows without a language picker, a settings menu, or a second thought.',
    metric: { value: '108', unit: 'languages', caption: 'inline switching, no menu' },
  },
];

const D_SEG1 = 'Three reasons ';      // 14 chars - default ink
const D_SEG2 = 'Pocket Voice';        // 12 chars - ink-1
const D_SEG3 = ' replaces typing.';   // 17 chars - default ink
const D_FULL = D_SEG1 + D_SEG2 + D_SEG3;

export function Differentiators() {
  const [h2Ref, h2InView] = useInViewOnce<HTMLHeadingElement>('-15% 0px');
  const dc = useTypeIn(D_FULL, h2InView);

  return (
    <section id="different" className="section-light" style={{ padding: 'clamp(4rem, 8vh, 7rem) 0' }}>
      <div className="rail">
        <div
          className="reveal diff-grid grid-12"
          style={{ alignItems: 'start' }}
        >
        <div className="diff-sticky" style={{ gridColumn: 'span 4', position: 'sticky', top: '14vh' }}>
          <Eyebrow>Why it's different</Eyebrow>
          <h2
            ref={h2Ref}
            aria-label={D_FULL}
            style={{
              margin: '1.5ch 0 0',
              fontSize: 'var(--step-4)',
              letterSpacing: '-0.03em',
              lineHeight: 0.98,
              fontWeight: 400,
              maxWidth: '16ch',
            }}
          >
            <span aria-hidden>
              {D_SEG1.slice(0, Math.min(dc, D_SEG1.length))}
              {dc > D_SEG1.length && (
                <span style={{ color: 'var(--ink-1)' }}>
                  {D_SEG2.slice(0, Math.min(dc - D_SEG1.length, D_SEG2.length))}
                </span>
              )}
              {dc > D_SEG1.length + D_SEG2.length &&
                D_SEG3.slice(0, dc - D_SEG1.length - D_SEG2.length)}
            </span>
          </h2>
          <p
            style={{
              color: 'var(--ink-1)',
              maxWidth: '36ch',
              fontSize: 'var(--step-0)',
              fontWeight: 400,
              marginTop: '2ch',
              lineHeight: 1.6,
            }}
          >
            Most apps get one. The category leader gets two. Pocket Voice was
            built to get all three at once.
          </p>
        </div>

        <ol
          className="diff-list"
          style={{
            gridColumn: 'span 7',
            gridColumnStart: 6,
            margin: 0,
            padding: 0,
            listStyle: 'none',
            display: 'grid',
            gap: 'clamp(2.5rem, 6vh, 4.5rem)',
          }}
        >
          {POINTS.map((p) => (
            <li
              key={p.no}
              className="diff-item"
              style={{
                display: 'grid',
                gap: '1.25rem',
                paddingTop: 'clamp(2rem, 4vh, 3rem)',
              }}
            >
              {/* Mono dash separator */}
              <div
                aria-hidden="true"
                className="pv-rule"
                style={{
                  color: 'var(--surface-3)',
                  fontSize: 'var(--step--1)',
                  letterSpacing: '0.1em',
                  userSelect: 'none',
                  marginBottom: '0.5rem',
                }}
              >
                {'─'.repeat(32)}
              </div>

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
                  }}
                >
                  {p.metric.caption}
                </span>
              </div>

              <h3
                style={{
                  margin: 0,
                  fontSize: 'var(--step-3)',
                  letterSpacing: '-0.025em',
                  lineHeight: 1.05,
                  fontWeight: 400,
                }}
              >
                {p.title}
              </h3>

              <p
                style={{
                  color: 'var(--ink-1)',
                  fontSize: 'var(--step-0)',
                  lineHeight: 1.6,
                  margin: 0,
                  maxWidth: '52ch',
                }}
              >
                {p.body}
              </p>

              <Metric value={p.metric.value} unit={p.metric.unit} />
            </li>
          ))}
        </ol>
        </div>
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

function Metric({ value, unit }: { value: string; unit: string }) {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'baseline',
        gap: '0.75ch',
        marginTop: '0.5rem',
      }}
    >
      <span
        className="tabular"
        style={{
          fontSize: 'var(--step-3)',
          fontFamily: 'var(--font-text)',
          letterSpacing: '-0.02em',
          color: 'var(--pv-blue)',
          fontWeight: 700,
        }}
      >
        {value}
      </span>
      <span
        className="tabular"
        style={{
          fontSize: 'var(--step--1)',
          color: 'var(--ink-2)',
          letterSpacing: '0.06em',
        }}
      >
        {unit}
      </span>
    </div>
  );
}

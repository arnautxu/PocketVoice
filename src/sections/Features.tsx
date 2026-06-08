import type { ReactNode } from 'react';

/* ══════════════════════════════════════════════════════════════════════════════
 * FEATURES — the six reasons, on the lit surface band (alt-light). Each card: a
 * small brand-blue glyph, an Erode title, one line of copy. The grid is the
 * "Product" anchor the header scrolls to.
 * ════════════════════════════════════════════════════════════════════════════ */

const FEATURES: Array<{ title: string; body: string; icon: ReactNode }> = [
  {
    title: 'Faster than typing',
    body: 'Speak at 150 words a minute; you type at 40. Finished text lands the moment you stop — about 180 ms.',
    icon: <BoltIcon />,
  },
  {
    title: 'You ramble. It edits.',
    body: 'Half-starts, “um”, repeated words, thinking out loud — all removed. What stays is what you meant.',
    icon: <ScissorsIcon />,
  },
  {
    title: 'Sounds like you wrote it',
    body: 'Not a transcript. Punctuation, capitalisation and rhythm composed in your own voice, not a robot’s.',
    icon: <PenIcon />,
  },
  {
    title: 'Vocabulary',
    body: 'Names, jargon, product terms and acronyms spelled the way your world spells them — it learns yours.',
    icon: <BookIcon />,
  },
  {
    title: 'Tone',
    body: 'A Slack quip stays a quip; an email to a client reads like one. The register fits the surface.',
    icon: <ToneIcon />,
  },
  {
    title: 'Language',
    body: 'Speak any of 108 languages — switch mid-sentence, no toggle. It writes in the one you’re using.',
    icon: <GlobeIcon />,
  },
];

export function Features() {
  return (
    <section id="features" className="sec alt-light">
      <div className="rail" style={{ display: 'grid', gap: 'clamp(2rem, 5vh, 3.5rem)' }}>
        <header className="on-sky" style={{ display: 'grid', gap: '1.25rem', maxWidth: '40rem' }}>
          <span className="sec-eyebrow">What it does</span>
          <h2 style={{ margin: 0, fontSize: 'var(--step-4)', lineHeight: 1.02, color: 'var(--ink-0)' }}>
            Not dictation. <span style={{ color: 'var(--blue-deep)', fontStyle: 'italic' }}>Composition.</span>
          </h2>
        </header>

        <div className="features-grid">
          {FEATURES.map((f) => (
            <article key={f.title} className="feature-card reveal">
              <span className="feature-card__icon" aria-hidden>{f.icon}</span>
              <h3>{f.title}</h3>
              <p>{f.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* — line icons, 24px, brand-blue via currentColor — */
function BoltIcon() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" strokeLinecap="round"><path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" /></svg>;
}
function ScissorsIcon() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="6" cy="6" r="2.5" /><circle cx="6" cy="18" r="2.5" /><path d="M8 8l12 8M8 16L20 8" /></svg>;
}
function PenIcon() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" /></svg>;
}
function BookIcon() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M4 5a2 2 0 0 1 2-2h12v18H6a2 2 0 0 1-2-2V5z" /><path d="M18 17H6a2 2 0 0 0-2 2" /></svg>;
}
function ToneIcon() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12h3l2 6 4-14 2 8h5" /></svg>;
}
function GlobeIcon() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.5 2.5 2.5 15 0 18M12 3c-2.5 2.5-2.5 15 0 18" /></svg>;
}

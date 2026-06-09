import { useState } from 'react';
import { useDragScroll, pageByCards } from '../hooks/useDragScroll';

/* ══════════════════════════════════════════════════════════════════════════════
 * MADE FOR EVERYONE — the "For you" anchor. Voices from different professions in a
 * horizontal-scroll wall (anything-style, no heading above it). Each card carries a
 * photo, the person's name, their role and their company (bold). Photos live in
 * /public/brand/people as {slug}.webp — until a file is dropped in, a tasteful
 * initials chip stands in. Placeholder names/quotes — swap freely.
 * ════════════════════════════════════════════════════════════════════════════ */

type Testimonial = { quote: string; name: string; role: string; company: string; slug: string };

const TESTIMONIALS: Testimonial[] = [
  { quote: 'I answer 60 emails between patients now. I talk while I wash my hands and it’s written by the time I look up.', name: 'Dr. Lena Ortiz', role: 'Physician', company: 'Mercy General', slug: 'lena' },
  { quote: 'My ideas come out faster than I can type them. Pocket Voice keeps up and cleans up the mess.', name: 'Marcus Bell', role: 'Founder', company: 'Replico', slug: 'marcus' },
  { quote: 'Field notes used to wait until I got back to the truck. Now I just talk and the report writes itself.', name: 'Sam Whitfield', role: 'Site engineer', company: 'Brandt Civil', slug: 'sam' },
  { quote: 'English isn’t my first language. I speak how I think and it comes out reading perfectly professional.', name: 'Yuki Tanaka', role: 'Product designer', company: 'Kanso', slug: 'yuki' },
  { quote: 'Thirty Slack threads a day. I reply by talking and nobody can tell I didn’t type a word.', name: 'Priya Nair', role: 'Engineering lead', company: 'Vantage', slug: 'priya' },
  { quote: 'I draft entire scenes on my walk. It punctuates dialogue better than I do at the keyboard.', name: 'Tom Reyes', role: 'Screenwriter', company: 'Freelance', slug: 'tom' },
];

export function MadeForEveryone() {
  const trackRef = useDragScroll<HTMLDivElement>();

  return (
    <section id="for-you" className="sec alt-light" aria-label="What people say">
      <div className="rail testi-controls">
        <div className="features-arrows" aria-hidden="true">
          <button type="button" className="features-arrow" aria-label="Previous" onClick={() => pageByCards(trackRef.current, -1)}>
            <Chevron dir="left" />
          </button>
          <button type="button" className="features-arrow" aria-label="Next" onClick={() => pageByCards(trackRef.current, 1)}>
            <Chevron dir="right" />
          </button>
        </div>
      </div>

      <div className="testi-rail">
        <div className="testi-track" ref={trackRef}>
          {TESTIMONIALS.map((t) => (
            <figure key={t.name} className="testi-card">
              <blockquote>&ldquo;{t.quote}&rdquo;</blockquote>
              <figcaption className="testi-who">
                <Avatar t={t} />
                <span style={{ display: 'grid' }}>
                  <span className="testi-name">{t.name}</span>
                  <span className="testi-role">{t.role} · <b>{t.company}</b></span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function Chevron({ dir }: { dir: 'left' | 'right' }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {dir === 'left' ? <path d="M15 6l-6 6 6 6" /> : <path d="M9 6l6 6-6 6" />}
    </svg>
  );
}

/** Photo avatar; falls back to an initials chip until /brand/people/{slug}.webp exists. */
function Avatar({ t }: { t: Testimonial }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return <span className="testi-avatar" aria-hidden>{initials(t.name)}</span>;
  }
  return (
    <img
      className="testi-avatar testi-avatar--photo"
      src={`/brand/people/${t.slug}.webp`}
      alt={t.name}
      width={48}
      height={48}
      loading="lazy"
      decoding="async"
      draggable={false}
      onError={() => setFailed(true)}
    />
  );
}

function initials(name: string): string {
  return name
    .replace(/^Dr\.\s*/, '')
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

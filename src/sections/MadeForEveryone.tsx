/* ══════════════════════════════════════════════════════════════════════════════
 * MADE FOR EVERYONE — the "For you" anchor. Voices from different professions, to
 * show the range. Placeholder names/quotes — swap freely. Avatars are initials on a
 * brand-blue chip (drop in real images later by replacing the initials span).
 * ════════════════════════════════════════════════════════════════════════════ */

const TESTIMONIALS: Array<{ quote: string; name: string; role: string }> = [
  { quote: 'I answer 60 emails between patients now. I talk while I wash my hands and it’s written by the time I look up.', name: 'Dr. Lena Ortiz', role: 'Physician' },
  { quote: 'My ideas come out faster than I can type them. Pocket Voice keeps up — and cleans up the mess.', name: 'Marcus Bell', role: 'Founder' },
  { quote: 'Field notes used to wait until I got back to the truck. Now I just talk and the report writes itself.', name: 'Sam Whitfield', role: 'Site engineer' },
  { quote: 'English isn’t my first language. I speak how I think and it comes out reading perfectly professional.', name: 'Yuki Tanaka', role: 'Product designer' },
  { quote: 'Thirty Slack threads a day. I reply by talking and nobody can tell I didn’t type a word.', name: 'Priya Nair', role: 'Engineering lead' },
  { quote: 'I draft entire scenes on my walk. It punctuates dialogue better than I do at the keyboard.', name: 'Tom Reyes', role: 'Screenwriter' },
];

export function MadeForEveryone() {
  return (
    <section id="for-you" className="sec alt-light">
      <div className="rail" style={{ display: 'grid', gap: 'clamp(2rem, 5vh, 3.5rem)' }}>
        <header className="on-sky" style={{ display: 'grid', gap: '1.25rem', maxWidth: '42rem' }}>
          <span className="sec-eyebrow">Made for everyone</span>
          <h2 style={{ margin: 0, fontSize: 'var(--step-4)', lineHeight: 1.02, color: 'var(--ink-0)' }}>
            However you work, <span style={{ color: 'var(--blue-deep)', fontStyle: 'italic' }}>you already know how to use it.</span>
          </h2>
          <p style={{ margin: 0, maxWidth: '46ch', fontSize: 'var(--step-1)', lineHeight: 1.5, color: 'var(--ink-1)' }}>
            If you can talk, you can write with Pocket Voice. Here&rsquo;s who already does.
          </p>
        </header>

        <div className="testi-grid">
          {TESTIMONIALS.map((t) => (
            <figure key={t.name} className="testi-card reveal">
              <blockquote>&ldquo;{t.quote}&rdquo;</blockquote>
              <figcaption className="testi-who">
                <span className="testi-avatar" aria-hidden>{initials(t.name)}</span>
                <span style={{ display: 'grid' }}>
                  <span className="testi-name">{t.name}</span>
                  <span className="testi-role">{t.role}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
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

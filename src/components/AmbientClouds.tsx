/* ══════════════════════════════════════════════════════════════════════════════
 * AMBIENT CLOUDS — a few soft brand clouds drifting behind the mid/lower sections,
 * so the descent through the sky keeps a little life as you scroll (not just in the
 * hero). Decorative, pointer-events:none, low opacity, transform-only drift. Kept
 * sparse and out of the central reading column so they never fight the content.
 * ════════════════════════════════════════════════════════════════════════════ */

type Cloud = {
  src: string; ar: string; top: string; left?: string; right?: string;
  width: string; op: number; blur: string;
  dx: string; dy: string; dur: string; delay: string;
  hideSmall?: boolean;
};

// Reuse the hero cloud marks (transparent webp shapes that already float cleanly in
// the hero) — soft, sparse, slow, so the descent keeps a little sky as you scroll.
const CLOUDS: Cloud[] = [
  { src: 'faster',     ar: '560 / 440', top: '5%',  right: '-2%', width: 'clamp(150px, 20vw, 320px)', op: 0.16, blur: '1px',   dx: '-14px', dy: '10px',  dur: '26s', delay: '0s' },
  { src: 'ttyl',       ar: '560 / 470', top: '23%', left: '-3%',  width: 'clamp(140px, 18vw, 280px)', op: 0.13, blur: '1.4px', dx: '16px',  dy: '12px',  dur: '30s', delay: '1.2s', hideSmall: true },
  { src: 'dictionary', ar: '560 / 470', top: '49%', right: '1%',  width: 'clamp(120px, 15vw, 230px)', op: 0.12, blur: '1.8px', dx: '-12px', dy: '-10px', dur: '28s', delay: '0.6s', hideSmall: true },
  { src: 'umm',        ar: '560 / 446', top: '71%', left: '-2%',  width: 'clamp(140px, 18vw, 280px)', op: 0.14, blur: '1.2px', dx: '14px',  dy: '-12px', dur: '32s', delay: '1.8s' },
];

export function AmbientClouds() {
  return (
    <div className="ambient-clouds" aria-hidden="true">
      {CLOUDS.map((c, i) => (
        <img
          key={i}
          src={`/brand/hero/${c.src}.webp`}
          alt=""
          aria-hidden="true"
          loading="lazy"
          decoding="async"
          draggable={false}
          className={c.hideSmall ? 'ac-secondary' : undefined}
          style={{
            top: c.top, left: c.left, right: c.right, width: c.width, aspectRatio: c.ar,
            ['--amb-op' as string]: c.op,
            ['--amb-blur' as string]: c.blur,
            ['--amb-dx' as string]: c.dx,
            ['--amb-dy' as string]: c.dy,
            ['--amb-dur' as string]: c.dur,
            ['--amb-delay' as string]: c.delay,
          }}
        />
      ))}
    </div>
  );
}

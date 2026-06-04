/* ══════════════════════════════════════════════════════════════════════════════
 * HERO CLOUDS — the "Expressive · Cloud" brand marks made literal: app logos and
 * filler/feature word-clouds drifting in the sky AROUND the headline. Reserved for
 * this high-impact moment per the manual. Composed in the open right + upper sky,
 * clear of the headline / body / CTAs / stats safe-zone. Depth = scale + opacity +
 * a touch of blur. Marks are whole (never cropped), as-is (no tint/shadow). All
 * decorative → aria-hidden, eager (above the fold).
 * ════════════════════════════════════════════════════════════════════════════ */

interface Cloud {
  name: string;
  ar: string;            // intrinsic aspect-ratio → reserves space, no layout shift
  /** desktop placement */
  top: string;
  right: string;
  width: string;         // clamp(min, vw, max)
  opacity?: number;
  blur?: number;         // px
  rise?: boolean;        // drifts up + dissolves (filler clouds)
  dur?: string;
  delay?: string;
  /** tier: 'mobile' stays on phones; others hide ≤768 (see responsive.css) */
  tier?: 'mobile';
  /** wide: only shown ≥1140px — the centre-ish clouds that would otherwise crowd the
   * headline on narrow desktop where the rail isn't yet centred. */
  wide?: boolean;
}

/* 7 marks: 3 app logos + faster/dictionary feature clouds + umm/actually risers.
 * Foreground = larger, sharp, ~full opacity; background = smaller, blurred, faded. */
/* Positions orbit the right-column phone (which sits ~x55–96% on desktop). All marks
 * stay in the right half (left edge > the text column) and ring the device — most
 * peeking from BEHIND it. Tuned against the bounding-box safe-zone check. */
/* Clouds ring the phone through its CLEAR zones — above, the narrow left gap, the
 * right, and below — so they touch only the device's bezel/edges or sit outside it,
 * never covering the Speak-to-Edit screen. Balanced: 2 above · 2 left-risers · 1
 * right · 2 below. The left risers echo the struck ".umm"/"…actually" on screen. */
const CLOUDS: Cloud[] = [
  // — above the phone —
  { name: 'slack',      ar: '560 / 498', top: '4%',  right: '24%', width: 'clamp(92px, 10.5vw, 150px)', opacity: 1,    blur: 0,   dur: '12s', delay: '0s',   tier: 'mobile' },
  { name: 'gmail',      ar: '560 / 444', top: '3%',  right: '5%',  width: 'clamp(78px, 8.5vw, 120px)',  opacity: 0.94, blur: 0.3, dur: '13s', delay: '0.8s', wide: true },
  // — right of the phone —
  { name: 'whatsapp',   ar: '560 / 497', top: '40%', right: '2%',  width: 'clamp(84px, 9vw, 128px)',    opacity: 0.9,  blur: 0.4, dur: '15s', delay: '2.2s' },
  // — below the phone (grounding it in the cloud bank) —
  { name: 'faster',     ar: '560 / 440', top: '80%', right: '20%', width: 'clamp(116px, 13vw, 186px)',  opacity: 1,    blur: 0,   dur: '14s', delay: '1.5s', tier: 'mobile' },
  { name: 'dictionary', ar: '560 / 499', top: '78%', right: '4%',  width: 'clamp(96px, 10.5vw, 150px)', opacity: 0.58, blur: 1.7, dur: '16s', delay: '1s' },
  // — left-edge risers, echoing the struck ".umm"/"…actually" on the screen —
  { name: 'umm',        ar: '560 / 446', top: '28%', right: '33%', width: 'clamp(72px, 7.5vw, 104px)',  blur: 1,   rise: true, dur: '12s', delay: '0s',   wide: true },
  { name: 'actually',   ar: '560 / 460', top: '52%', right: '32%', width: 'clamp(74px, 8vw, 110px)',    blur: 1.3, rise: true, dur: '14s', delay: '3.2s', wide: true },
];

const RISE_PEAK: Record<string, number> = { umm: 0.5, actually: 0.42 };

export function HeroClouds() {
  return (
    <div className="hero-clouds" aria-hidden="true">
      {CLOUDS.map((c) => (
        <img
          key={c.name}
          className={`hero-cloud hc-${c.name}${c.rise ? ' hc-rise' : ''}${c.tier === 'mobile' ? ' hc-keep' : ''}${c.wide ? ' hc-wide' : ''}`}
          src={`/brand/hero/${c.name}.webp`}
          alt=""
          aria-hidden="true"
          loading="eager"
          decoding="async"
          draggable={false}
          style={{
            top: c.top,
            right: c.right,
            width: c.width,
            aspectRatio: c.ar,
            opacity: c.rise ? undefined : c.opacity,
            filter: c.blur ? `blur(${c.blur}px)` : undefined,
            animationDuration: c.dur,
            animationDelay: c.delay,
            ...(c.rise ? ({ ['--rise-peak' as string]: RISE_PEAK[c.name] }) : {}),
          }}
        />
      ))}
    </div>
  );
}

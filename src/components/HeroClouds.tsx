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
/* Five marks distributed across the whole hero with margin from ALL FOUR frame edges
 * (never clipped by the viewport/section — the brand "no crop" rule). Whole clouds may
 * peek from BEHIND the phone's bezel/edges (emerging-from-cloud look) but never cover
 * the Speak-to-Edit screen. Spread: slack (left of phone, upper) · gmail (upper-right)
 * · whatsapp (mid-right) · faster (lower-LEFT, balances the type) · dictionary (lower-
 * right). slack + faster are the .hc-keep pair shown when stacked. */
const CLOUDS: Cloud[] = [
  { name: 'slack',      ar: '560 / 498', top: '8%',  right: '35%', width: 'clamp(84px, 9.5vw, 132px)', opacity: 1,    blur: 0,   dur: '12s', delay: '0s',   tier: 'mobile' },
  { name: 'gmail',      ar: '560 / 444', top: '7%',  right: '9%',  width: 'clamp(72px, 8vw, 114px)',   opacity: 0.95, blur: 0.3, dur: '13s', delay: '0.8s' },
  { name: 'whatsapp',   ar: '560 / 497', top: '42%', right: '8%',  width: 'clamp(80px, 8.5vw, 120px)', opacity: 0.92, blur: 0.3, dur: '15s', delay: '2.2s' },
  { name: 'faster',     ar: '560 / 440', top: '82%', right: '38%', width: 'clamp(100px, 11vw, 134px)', opacity: 1,  blur: 0,   dur: '14s', delay: '1.5s', tier: 'mobile' },
  { name: 'dictionary', ar: '560 / 499', top: '80%', right: '14%', width: 'clamp(86px, 9.5vw, 132px)',  opacity: 0.6,  blur: 1.4, dur: '16s', delay: '1s' },
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

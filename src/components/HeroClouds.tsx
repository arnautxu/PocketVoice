/* ══════════════════════════════════════════════════════════════════════════════
 * HERO CLOUDS — assets for the camera-forward DOLLY through a cloud field (the push
 * is orchestrated in Hero.tsx: the hero is pinned and one master timeline scrubs a
 * forward fly-through, then unpins into the page).
 *
 * Two groups, all centred on the vanishing point and driven on translateZ inside a
 * perspective stage so they physically rush the camera:
 *   · FLY   — branded marks. Far = tiny, hazy (desaturated, low-contrast, washed
 *             toward sky), blurred; they SNAP into a sharp focal band mid-travel, then
 *             blur + grow huge as they pass the camera and fade. Staggered → 1–2 at a
 *             time. App logos first ("any app"), then the struck-through fillers
 *             rising + dissolving ("what gets removed").
 *   · REST  — calm ambient marks that settle in around the resolved hero (and the set
 *             shown immediately under reduced motion / on the stacked layout).
 *
 * (Atmospheric "volume" between the marks comes from the haze + the travelling sky,
 * not from extra wisp images — the only soft-cloud tiles available are square
 * app-icon assets that read as white squares when blurred.)
 *
 * Depth-of-field + haze come from animating `filter` (blur + saturate/contrast/
 * brightness) in Hero.tsx; the stagger keeps only ~1–2 marks blurred at once (blur is
 * expensive). Decorative → aria-hidden. The .hc-keep marks survive the stacked layout.
 * ════════════════════════════════════════════════════════════════════════════ */

export interface FlyCloud {
  name: string;
  ar: string;                 // intrinsic aspect-ratio → no layout shift
  width: string;              // resting size; perspective scales it across the flight
  dx: number;                 // screen-offset at z=0 (px) — perspective amplifies → radial fly-out
  dy: number;
  z0: number;                 // start translateZ (far, behind the vanishing point)
  focalZ: number;             // the sharp focal plane (snaps into focus here)
  zEnd: number;               // end translateZ (huge, past the camera) — keep < perspective
  peak: number;               // peak opacity at the focal pass
  blurFar: number;            // atmospheric blur while distant (px)
  blurNear: number;           // motion-blur as it rushes past (px)
  win: [number, number];      // scroll window within the master timeline (0..1)
  filler?: boolean;
}

export interface RestCloud {
  name: string;
  ar: string;
  width: string;
  top?: string;
  bottom?: string;
  right?: string;
  opacity: number;
  blur: number;
  fadeAt: number;
  keep?: boolean;
}

/* Approach windows staggered + lightly overlapped → the field arrives in sequence.
 * Directions bias right / up so flights clear the left-column headline; fillers rise. */
export const FLY: FlyCloud[] = [
  { name: 'slack',    ar: '560 / 498', width: 'clamp(96px, 10vw, 142px)',  dx:  230, dy: -150, z0: -2200, focalZ: -150, zEnd: 900, peak: 1.0,  blurFar: 7, blurNear: 9, win: [0.00, 0.21] },
  { name: 'gmail',    ar: '560 / 444', width: 'clamp(84px, 9vw, 126px)',   dx:  320, dy:  -20, z0: -2300, focalZ: -150, zEnd: 880, peak: 0.95, blurFar: 7, blurNear: 7, win: [0.12, 0.33] },
  { name: 'whatsapp', ar: '560 / 497', width: 'clamp(92px, 9.5vw, 134px)', dx:  260, dy:  170, z0: -2200, focalZ: -150, zEnd: 900, peak: 0.95, blurFar: 7, blurNear: 8, win: [0.24, 0.45] },
  { name: 'umm',      ar: '560 / 446', width: 'clamp(80px, 8vw, 114px)',   dx:   60, dy: -220, z0: -2000, focalZ: -140, zEnd: 820, peak: 0.55, blurFar: 6, blurNear: 6, win: [0.36, 0.55], filler: true },
  { name: 'actually', ar: '560 / 460', width: 'clamp(86px, 8.5vw, 122px)', dx: -170, dy: -190, z0: -2000, focalZ: -140, zEnd: 820, peak: 0.6,  blurFar: 6, blurNear: 6, win: [0.45, 0.63], filler: true },
];

export const REST: RestCloud[] = [
  { name: 'faster',     ar: '560 / 440', width: 'clamp(80px, 9vw, 118px)',   top: '12%',     right: '30%', opacity: 0.62, blur: 1.1, fadeAt: 0.74, keep: true },
  { name: 'dictionary', ar: '560 / 499', width: 'clamp(78px, 8.5vw, 114px)', bottom: '14%',  right: '6%',  opacity: 0.55, blur: 1.3, fadeAt: 0.78, keep: true },
  { name: 'ttyl',       ar: '560 / 499', width: 'clamp(68px, 7.5vw, 100px)', top: '46%',     right: '41%', opacity: 0.5,  blur: 1.5, fadeAt: 0.82 },
];

export function HeroClouds() {
  return (
    <div className="hero-clouds" aria-hidden="true">
      {/* FLY — branded marks rushing the camera through the focal band */}
      {FLY.map((c) => (
        <img
          key={c.name}
          data-cloud={c.name}
          className={`hero-cloud hc-fly hc-${c.name}${c.filler ? ' hc-filler' : ''}`}
          src={`/brand/hero/${c.name}.webp`}
          alt=""
          aria-hidden="true"
          loading="eager"
          decoding="async"
          draggable={false}
          style={{ position: 'absolute', left: '50%', top: '50%', width: c.width, aspectRatio: c.ar, opacity: 0 }}
        />
      ))}

      {/* REST — static ambient marks at the resolved hero's edges */}
      {REST.map((c) => (
        <img
          key={c.name}
          data-cloud={c.name}
          className={`hero-cloud hc-rest hc-${c.name}${c.keep ? ' hc-keep' : ''}`}
          src={`/brand/hero/${c.name}.webp`}
          alt=""
          aria-hidden="true"
          loading="eager"
          decoding="async"
          draggable={false}
          style={{
            position: 'absolute',
            top: c.top,
            bottom: c.bottom,
            right: c.right,
            width: c.width,
            aspectRatio: c.ar,
            opacity: 0,
            filter: `blur(${c.blur}px)`,
          }}
        />
      ))}
    </div>
  );
}

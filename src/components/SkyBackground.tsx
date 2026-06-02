import { useEffect, useState } from 'react';
import Cloudscape from './forgeui/cloudscape';

/* ── SkyBackground ────────────────────────────────────────────────────────────
 * The fixed full-page sky behind every panel. Uses ForgeUI's WebGL Cloudscape
 * (animated blue→white cloud gradient), tinted to the brand sky. Falls back to a
 * static CSS gradient when the user prefers reduced motion or WebGL is absent.
 * Sits at z-0; content (.main) scrolls over it.
 * ──────────────────────────────────────────────────────────────────────────── */
export function SkyBackground() {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setAnimate(!reduce);
  }, []);

  return (
    <div className="app-sky" aria-hidden="true">
      {animate && (
        <Cloudscape
          height="100%"
          speed={0.45}
          colorBottom="#1C8AC9"   /* Pocket-Blue sky base */
          colorMid="#CFE8F8"      /* light atmospheric haze */
          colorTop="#FFFFFF"      /* bright cloud crests */
          className="!absolute inset-0 !bg-transparent"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        />
      )}
    </div>
  );
}

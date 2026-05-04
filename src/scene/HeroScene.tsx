import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { DotGrid } from './DotGrid';

/**
 * Hero background: a monospaced character grid in 3D space.
 * Each point is one potential character position — the brand concept
 * of text's invisible grammar, made visible and dimensional.
 * No color, no PBR, no lighting. Pure geometry.
 */
export function HeroScene() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
      }}
    >
      <Canvas
        dpr={[1, Math.min(window.devicePixelRatio, 2)]}
        camera={{ position: [0, 0, 5], fov: 40 }}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          alpha: true,
        }}
        style={{ width: '100%', height: '100%' }}
      >
        <Suspense fallback={null}>
          <DotGrid />
        </Suspense>
      </Canvas>

      {/* Radial vignette — makes content readable, grounds 3D to the page */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 90% 80% at 50% 50%, transparent 45%, var(--surface-0) 82%)',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}

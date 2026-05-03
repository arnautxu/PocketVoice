import { Canvas } from '@react-three/fiber';
import { Suspense, useEffect, useRef } from 'react';
import { VoiceMesh } from './VoiceMesh';

interface HeroSceneProps {
  morph?: number;
}

/**
 * Isolated Client Component for the Three.js scene.
 * Owns its own scroll listener so React tree doesn't re-render on scroll.
 */
export function HeroScene({ morph = 0 }: HeroSceneProps) {
  const scrollVelocityRef = useRef(0);
  const morphRef = useRef(morph);

  useEffect(() => {
    morphRef.current = morph;
  }, [morph]);

  useEffect(() => {
    let lastY = window.scrollY;
    let lastT = performance.now();
    let raf = 0;
    const tick = () => {
      const now = performance.now();
      const y = window.scrollY;
      const dt = Math.max(now - lastT, 1);
      const dy = Math.abs(y - lastY);
      // Map px/ms → 0..1, decay exponentially.
      const v = Math.min(dy / dt / 6, 1);
      scrollVelocityRef.current =
        Math.max(scrollVelocityRef.current * 0.92, v);
      lastY = y;
      lastT = now;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

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
        camera={{ position: [0, 0, 3.4], fov: 38 }}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          alpha: true,
        }}
        style={{ width: '100%', height: '100%' }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[3, 4, 5]} intensity={0.8} />
        <directionalLight position={[-2, -1, -2]} intensity={0.3} />
        <Suspense fallback={null}>
          <VoiceMesh
            scrollVelocityRef={scrollVelocityRef}
            morphRef={morphRef}
          />
        </Suspense>
      </Canvas>
      {/* Vignette to ground the orb against the page */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(circle at 50% 45%, transparent 38%, var(--surface-0) 78%)',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}

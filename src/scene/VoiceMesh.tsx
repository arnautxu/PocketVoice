import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { voiceFragment, voiceVertex } from './voiceShader';

interface VoiceMeshProps {
  scrollVelocityRef: React.MutableRefObject<number>;
  morphRef: React.MutableRefObject<number>;
}

/** The signature object: a slow, breathing liquid-metal mesh. */
export function VoiceMesh({ scrollVelocityRef, morphRef }: VoiceMeshProps) {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const meshRef = useRef<THREE.Mesh>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uActivity: { value: 0 },
      uMorph: { value: 0 },
      // Electric blue accent in linear sRGB-ish space (≈ oklch(0.72 0.18 250))
      uAccent: { value: new THREE.Color(0.27, 0.55, 1.0) },
    }),
    []
  );

  useFrame((_state, delta) => {
    if (!matRef.current || !meshRef.current) return;
    const u = matRef.current.uniforms;

    u.uTime.value += delta;

    const targetActivity = Math.min(scrollVelocityRef.current, 1.0);
    u.uActivity.value += (targetActivity - u.uActivity.value) * 0.06;

    u.uMorph.value += (morphRef.current - u.uMorph.value) * 0.04;

    // Gentle perpetual rotation — slow, deliberate, not spinning.
    meshRef.current.rotation.y += delta * 0.06;
    meshRef.current.rotation.x = Math.sin(u.uTime.value * 0.18) * 0.08;
  });

  return (
    <mesh ref={meshRef}>
      {/* High-resolution sphere → enough verts for displacement, still <80k tris. */}
      <icosahedronGeometry args={[1.35, 96]} />
      <shaderMaterial
        ref={matRef}
        uniforms={uniforms}
        vertexShader={voiceVertex}
        fragmentShader={voiceFragment}
      />
    </mesh>
  );
}

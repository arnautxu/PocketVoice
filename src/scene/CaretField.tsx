import { useFrame } from '@react-three/fiber';
import { useLayoutEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

/* Deterministic field: 23 inactive insertion points + 1 active.
   Spread across viewport at varying z-depths. No random at runtime. */
const INACTIVE: [number, number, number][] = [
  // top row
  [-2.4,  1.6, -1.8],
  [-1.2,  1.7, -0.9],
  [ 0.0,  1.6, -1.4],
  [ 1.2,  1.5, -0.6],
  [ 2.4,  1.7, -1.2],
  // upper mid
  [-2.6,  0.6, -0.5],
  [-1.4,  0.7,  0.3],
  [ 1.3,  0.6, -1.0],
  [ 2.5,  0.5,  0.3],
  // mid (skip center — that's the active caret)
  [-2.3, -0.1, -0.8],
  [-1.1,  0.0,  0.4],
  [ 0.2, -0.1, -1.3],
  [ 1.4,  0.0, -0.2],
  [ 2.4, -0.1, -0.9],
  // lower mid
  [-2.0, -0.8, -1.5],
  [-0.9, -0.7,  0.4],
  [ 0.3, -0.8, -0.5],
  [ 1.5, -0.7, -1.1],
  [ 2.3, -0.8, -0.4],
  // bottom row
  [-1.8, -1.5, -1.3],
  [-0.6, -1.6,  0.2],
  [ 0.8, -1.5, -0.7],
  [ 2.1, -1.4, -1.6],
];

const ACTIVE_POS: [number, number, number] = [0, 0, 0.8];

/* Caret geometry: thin vertical box — a text-insertion cursor shape */
const CARET_W = 0.013;
const CARET_H = 0.21;
const CARET_D = 0.003;

export function CaretField() {
  const groupRef   = useRef<THREE.Group>(null);
  const fieldRef   = useRef<THREE.InstancedMesh>(null);
  const activeRef  = useRef<THREE.Mesh>(null);
  const activeMatRef = useRef<THREE.MeshBasicMaterial>(null);

  const caretGeo = useMemo(() => new THREE.BoxGeometry(CARET_W, CARET_H, CARET_D), []);
  const inactiveMat = useMemo(() => new THREE.MeshBasicMaterial(), []);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  /* Set instance matrices and per-instance colors once on mount */
  useLayoutEffect(() => {
    const mesh = fieldRef.current;
    if (!mesh) return;

    INACTIVE.forEach(([x, y, z], i) => {
      dummy.position.set(x, y, z);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);

      /* Color brightness varies with z-depth: closer = slightly lighter */
      const t = (z + 2) / 3.5; /* z range: ~-2 to 1.5 → 0..1 */
      const v = 0.10 + t * 0.12; /* lightness: 0.10 (far) → 0.22 (near) */
      mesh.setColorAt(i, new THREE.Color(v, v, v));
    });

    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [dummy]);

  useFrame((state) => {
    /* Blink: 1.2s cycle — fade-in 200ms, hold 400ms, fade-out 200ms, hold 400ms */
    const cycle = state.clock.elapsedTime % 1.2;
    let opacity: number;
    if      (cycle < 0.2) opacity = cycle / 0.2;
    else if (cycle < 0.6) opacity = 1;
    else if (cycle < 0.8) opacity = 1 - (cycle - 0.6) / 0.2;
    else                  opacity = 0;

    if (activeMatRef.current) activeMatRef.current.opacity = opacity;

    /* Subtle mouse parallax — group tilts slightly toward cursor */
    if (groupRef.current) {
      const { x, y } = state.mouse;
      groupRef.current.rotation.y +=
        (x * 0.055 - groupRef.current.rotation.y) * 0.022;
      groupRef.current.rotation.x +=
        (-y * 0.035 - groupRef.current.rotation.x) * 0.022;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Inactive insertion points */}
      <instancedMesh
        ref={fieldRef}
        args={[caretGeo, inactiveMat, INACTIVE.length]}
      />

      {/* The active caret — white, blinking */}
      <mesh ref={activeRef} position={ACTIVE_POS}>
        <boxGeometry args={[CARET_W, CARET_H, CARET_D]} />
        <meshBasicMaterial ref={activeMatRef} color="#FFFFFF" transparent />
      </mesh>
    </group>
  );
}

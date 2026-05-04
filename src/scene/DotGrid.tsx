import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

const COLS    = 48;
const ROWS    = 30;
const SPACING = 0.174;
const COUNT   = COLS * ROWS;

/* Base dot color and hover peak — Signal Blue (#1F44FF) per color system */
const BASE  = new THREE.Color('#2E2E2E'); /* color-gray-200 */
const PEAK  = new THREE.Color('#1F44FF'); /* color-signal   */

/* Influence radius in world units */
const RADIUS    = 1.2;
const RADIUS_SQ = RADIUS * RADIUS;

/* Plane at z=0 for mouse→world projection */
const PLANE = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);

function buildPositions() {
  const buf = new Float32Array(COUNT * 3);
  const ox  = ((COLS - 1) * SPACING) / 2;
  const oy  = ((ROWS - 1) * SPACING) / 2;
  let i = 0;
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      buf[i++] = c * SPACING - ox;
      buf[i++] = r * SPACING - oy;
      buf[i++] = 0;
    }
  }
  return buf;
}

function buildColors() {
  const buf = new Float32Array(COUNT * 3);
  for (let i = 0; i < COUNT; i++) {
    buf[i * 3]     = BASE.r;
    buf[i * 3 + 1] = BASE.g;
    buf[i * 3 + 2] = BASE.b;
  }
  return buf;
}

export function DotGrid() {
  const pointsRef  = useRef<THREE.Points>(null);
  const colorAttr  = useRef<THREE.BufferAttribute>(null);
  const { raycaster, camera } = useThree();

  /* Track mouse in NDC from window — bypasses the pointerEvents:none canvas */
  const mouseNDC = useRef({ x: 0, y: 0 });
  useEffect(() => {
    function onMove(e: PointerEvent) {
      mouseNDC.current = {
        x:  (e.clientX / window.innerWidth)  * 2 - 1,
        y: -((e.clientY / window.innerHeight) * 2 - 1),
      };
    }
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  const positions = useMemo(buildPositions, []);
  const colors    = useMemo(buildColors, []);

  /* Reusable scratch objects — no allocations in the hot path */
  const mouseWorld = useMemo(() => new THREE.Vector3(), []);
  const localMouse = useMemo(() => new THREE.Vector3(), []);
  const invMatrix  = useMemo(() => new THREE.Matrix4(), []);
  const col        = useMemo(() => new THREE.Color(), []);

  useFrame(() => {
    const mesh = pointsRef.current;
    const attr = colorAttr.current;
    if (!mesh || !attr) return;

    const mouse = mouseNDC.current;

    /* Mouse parallax */
    mesh.rotation.y += (mouse.x * 0.045 - mesh.rotation.y) * 0.025;
    mesh.rotation.x += (-mouse.y * 0.030 - mesh.rotation.x) * 0.025;

    /* Unproject mouse to world space at z=0 */
    raycaster.setFromCamera(mouse as unknown as THREE.Vector2, camera);
    raycaster.ray.intersectPlane(PLANE, mouseWorld);

    /* Map world point back through the mesh's inverse matrix so the
       proximity check accounts for the current rotation */
    invMatrix.copy(mesh.matrixWorld).invert();
    localMouse.copy(mouseWorld).applyMatrix4(invMatrix);

    const arr = attr.array as Float32Array;
    let dirty = false;

    for (let i = 0; i < COUNT; i++) {
      const px = positions[i * 3];
      const py = positions[i * 3 + 1];
      const dx = localMouse.x - px;
      const dy = localMouse.y - py;
      const distSq = dx * dx + dy * dy;

      const t = distSq < RADIUS_SQ ? 1 - distSq / RADIUS_SQ : 0;
      const smoothT = t * t * (3 - 2 * t); /* smoothstep */

      col.lerpColors(BASE, PEAK, smoothT);

      if (
        arr[i * 3]     !== col.r ||
        arr[i * 3 + 1] !== col.g ||
        arr[i * 3 + 2] !== col.b
      ) {
        arr[i * 3]     = col.r;
        arr[i * 3 + 1] = col.g;
        arr[i * 3 + 2] = col.b;
        dirty = true;
      }
    }

    if (dirty) attr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={COUNT}
          itemSize={3}
        />
        <bufferAttribute
          ref={colorAttr}
          attach="attributes-color"
          array={colors}
          count={COUNT}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        vertexColors
        size={1.5}
        sizeAttenuation={false}
      />
    </points>
  );
}

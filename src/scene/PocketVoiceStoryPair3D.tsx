// PocketVoiceStoryPair3D.tsx
//
// Drop-in React Three Fiber component for the Pocket Voice "Story Pair" launch
// shot — two iPhone frames floating in ink-black space, connected by an
// electric-blue arrow, with a headline above and labels below. Each device
// gently bobs and tilts toward the cursor. The actual UI content is rendered
// as HTML overlays via @react-three/drei <Html> so the screens stay sharp at
// any zoom and easy to edit.

import React, { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html, RoundedBox, Float, Environment } from '@react-three/drei';
import * as THREE from 'three';

// ── Brand tokens ──────────────────────────────────────────────────────────
const INK   = '#0A0A0A';
const PAPER  = '#F5F2ED'; // --color-paper
const BLUE   = '#1F44FF'; // --color-signal
const RED    = '#E0322B';
const MONO   = "'Borna', ui-sans-serif, system-ui, -apple-system, sans-serif";

// ── Shared sub-components ─────────────────────────────────────────────────

interface ScreenSurfaceProps {
  children: React.ReactNode;
  dark?: boolean;
}

function ScreenSurface({ children, dark }: ScreenSurfaceProps) {
  return (
    <div style={{
      width: 390, height: 844,
      paddingTop: 54, paddingBottom: 34,
      background: dark ? INK : PAPER,
      display: 'flex', flexDirection: 'column',
      fontFamily: MONO,
      position: 'relative',
    }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {children}
      </div>
    </div>
  );
}

interface AppBarProps {
  leftText?: string;
  center?: React.ReactNode;
  rightText?: string;
  rightColor?: string;
  dark?: boolean;
}

function AppBar({ leftText, center, rightText, rightColor, dark }: AppBarProps) {
  const border = dark ? '#1A1A1A' : '#DEDBD6';
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '12px 16px', borderBottom: `1px solid ${border}`,
      minHeight: 44, fontFamily: MONO,
    }}>
      <div style={{ minWidth: 64, fontSize: 13, color: dark ? '#9A9A9A' : INK }}>{leftText}</div>
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>{center}</div>
      <div style={{
        minWidth: 64, textAlign: 'right', fontSize: 13,
        color: rightColor ?? (dark ? '#9A9A9A' : INK),
        fontWeight: rightColor ? 600 : 400,
      }}>{rightText}</div>
    </div>
  );
}

// Animated waveform — lives in DOM so it animates cheaply
function Waveform({ active = true }: { active?: boolean }) {
  const [t, setT] = React.useState(0);
  React.useEffect(() => {
    if (!active) return;
    let raf: number;
    const start = performance.now();
    const tick = (now: number) => { setT((now - start) / 1000); raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active]);

  const N = 28;
  const bars = Array.from({ length: N }, (_, i) => {
    const phase = i * 0.6 - t * 6;
    const a = Math.sin(phase) * 0.5 + 0.5;
    const b = Math.sin(phase * 1.7 + 1.2) * 0.5 + 0.5;
    const env = Math.sin((i / N) * Math.PI);
    return 6 + (a * 0.6 + b * 0.4) * 56 * env;
  });

  return (
    <svg viewBox={`0 0 ${N * 10} 72`} width="100%" height="72" style={{ display: 'block' }}>
      {bars.map((h, i) => (
        <rect key={i} x={i * 10 + 2} y={(72 - h) / 2} width="3" height={h} rx="1.5"
          fill={i < N * 0.55 ? '#fff' : '#2E2E2E'} />
      ))}
    </svg>
  );
}

// ── Default screen content ─────────────────────────────────────────────────

function DefaultRecorderScreen() {
  return (
    <ScreenSurface dark>
      <AppBar
        dark
        leftText="Cancel"
        rightText="Done"
        rightColor={BLUE}
        center={
          <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', color: '#fff' }}>
            <span style={{ width: 8, height: 8, borderRadius: 999, background: RED, boxShadow: '0 0 0 4px rgba(224,50,43,0.25)' }} />
            REC · 00:42
          </span>
        }
      />
      <div style={{ padding: '24px 20px 0', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontSize: 10, color: '#6E6E6E', letterSpacing: '0.18em', fontWeight: 600 }}>LIVE TRANSCRIPT</div>
        <div style={{ marginTop: 12, fontSize: 16, lineHeight: 1.6, color: '#fff', fontFamily: MONO }}>
          A pocket you talk into. Out comes a paragraph.{' '}
          <span style={{ color: BLUE, fontWeight: 700 }}>¶</span>{' '}
          <span style={{ color: '#9A9A9A' }}>Saved as a draft so you can come back to it later when you have</span>
          <span style={{ background: BLUE, display: 'inline-block', width: 6, height: 16, verticalAlign: 'middle', marginLeft: 2 }}>&nbsp;</span>
        </div>
      </div>
      <div style={{ padding: '24px 20px 36px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22 }}>
        <Waveform active />
        <div style={{
          width: 96, height: 96, borderRadius: 999, background: RED,
          border: '2px solid #fff', boxShadow: '0 0 0 8px rgba(224,50,43,0.18)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{ width: 22, height: 22, borderRadius: 2, background: '#fff' }} />
        </div>
        <div style={{ display: 'flex', gap: 28, fontSize: 11, color: '#9A9A9A', letterSpacing: '0.14em', fontWeight: 600, fontFamily: MONO }}>
          <span>¶ AUTO</span>
          <span style={{ color: '#fff' }}>· 00:42</span>
          <span>EN-US</span>
        </div>
      </div>
    </ScreenSurface>
  );
}

function DefaultTranscriptScreen() {
  return (
    <ScreenSurface>
      <AppBar
        leftText="← Library"
        rightText="Share"
        center={
          <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', color: '#6E6E6E' }}>TUE · 09:14</span>
        }
      />
      <div style={{ padding: '22px 20px 20px', display: 'flex', flexDirection: 'column', gap: 12, overflow: 'hidden', flex: 1, fontFamily: MONO }}>
        <div style={{ fontSize: 22, fontWeight: 700, lineHeight: 1.2, letterSpacing: '-0.01em', color: INK }}>Tuesday morning notes</div>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', color: '#6E6E6E' }}>3 PARAGRAPHS · 142 WORDS · SAVED</div>
        <div style={{ marginTop: 8, fontSize: 14, lineHeight: 1.65, color: INK }}>
          A pocket you talk into. Out comes a paragraph. The whole point is that you don't have to stop walking, or stop cooking, or stop driving, to write a thought down.{' '}
          <span style={{ color: BLUE, fontWeight: 700 }}>¶</span>
          <br /><br />
          The trick is the punctuation. Anyone can transcribe. The work is in figuring out where the breath goes — where one thought ends and the next begins.{' '}
          <span style={{ color: BLUE, fontWeight: 700 }}>¶</span>
          <br /><br />
          So that's what this thing does. You talk. We paragraph.{' '}
          <span style={{ color: BLUE, fontWeight: 700 }}>¶</span>
        </div>
      </div>
      <div style={{ padding: '10px 14px 14px', borderTop: '1px solid #DEDBD6', background: PAPER, display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 40, height: 40, borderRadius: 999, background: INK, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="#fff"><polygon points="6 4 20 12 6 20 6 4" /></svg>
        </div>
        <div style={{ flex: 1, height: 3, background: '#DEDBD6', position: 'relative' }}>
          <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: '34%', background: INK }} />
        </div>
        <div style={{ fontSize: 11, color: '#6E6E6E', fontFamily: MONO }}>00:24 / 01:08</div>
      </div>
    </ScreenSurface>
  );
}

// ── 3D phone — rounded-box body with HTML screen overlay ───────────────────
const PHONE_W = 1.95;
const PHONE_H = 4.22;
const PHONE_D = 0.18;

interface Phone3DProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  screen: React.ReactNode;
  label?: string;
  accent?: boolean;
  mouse: React.RefObject<{ x: number; y: number }>;
}

function Phone3D({ position, rotation, screen, label, accent = false, mouse }: Phone3DProps) {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.getElapsedTime();
    // gentle bob
    group.current.position.y = (position[1] ?? 0) + Math.sin(t * 0.9 + position[0]) * 0.04;
    // subtle tilt toward mouse
    const mx = mouse?.current?.x ?? 0;
    const my = mouse?.current?.y ?? 0;
    const baseRotX = rotation?.[0] ?? 0;
    const baseRotY = rotation?.[1] ?? 0;
    group.current.rotation.x = baseRotX + my * 0.08 + Math.sin(t * 0.6) * 0.01;
    group.current.rotation.y = baseRotY + mx * 0.12 + Math.cos(t * 0.4) * 0.01;
  });

  return (
    <group ref={group} position={position}>
      {/* phone body — rounded box */}
      <RoundedBox args={[PHONE_W, PHONE_H, PHONE_D]} radius={0.18} smoothness={6} castShadow receiveShadow>
        <meshStandardMaterial color="#0E0E10" metalness={0.85} roughness={0.35} />
      </RoundedBox>
      {/* subtle metallic edge */}
      <RoundedBox args={[PHONE_W + 0.005, PHONE_H + 0.005, PHONE_D - 0.005]} radius={0.185} smoothness={4}>
        <meshStandardMaterial color="#1A1A1C" metalness={1} roughness={0.5} side={THREE.BackSide} />
      </RoundedBox>

      {/* screen — HTML overlay */}
      <Html
        transform
        position={[0, 0, PHONE_D / 2 + 0.001]}
        scale={[PHONE_W / 390, PHONE_H / 844, 1]}
        style={{
          width: 390, height: 844,
          borderRadius: 46,
          overflow: 'hidden',
          background: '#000',
          boxShadow: 'inset 0 0 0 6px #000',
        }}
        zIndexRange={[10, 0]}
      >
        <div style={{ width: 390, height: 844, position: 'relative', borderRadius: 46, overflow: 'hidden', background: '#000' }}>
          {/* dynamic island */}
          <div style={{
            position: 'absolute', top: 11, left: '50%', transform: 'translateX(-50%)',
            width: 126, height: 37, borderRadius: 24, background: '#000', zIndex: 50,
          }} />
          {/* status bar time */}
          <div style={{
            position: 'absolute', top: 18, left: 28, color: '#fff',
            fontFamily: '-apple-system, system-ui',
            fontSize: 16, fontWeight: 600, mixBlendMode: 'difference', zIndex: 60,
          }}>9:41</div>
          {screen}
          {/* home indicator */}
          <div style={{
            position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)',
            width: 139, height: 5, borderRadius: 100,
            background: 'rgba(0,0,0,0.25)', mixBlendMode: 'difference', zIndex: 60,
          }} />
        </div>
      </Html>

      {/* label below phone */}
      {label && (
        <Html position={[0, -PHONE_H / 2 - 0.35, 0]} center distanceFactor={6}>
          <div style={{
            fontFamily: MONO, fontSize: 14, fontWeight: 600,
            letterSpacing: '0.2em', color: accent ? BLUE : '#fff',
            whiteSpace: 'nowrap',
          }}>
            {label}
          </div>
        </Html>
      )}
    </group>
  );
}

// ── Connector arrow between phones ─────────────────────────────────────────
function Connector() {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.getElapsedTime();
    group.current.children.forEach((child, i) => {
      const mesh = child as THREE.Mesh;
      if (mesh.material && (mesh.material as THREE.MeshBasicMaterial).transparent) {
        (mesh.material as THREE.MeshBasicMaterial).opacity = 0.6 + Math.sin(t * 2 + i) * 0.3;
      }
    });
  });

  return (
    <group ref={group} position={[0, 0, 0.2]}>
      {/* center bar */}
      <mesh>
        <boxGeometry args={[1.4, 0.06, 0.02]} />
        <meshBasicMaterial color={BLUE} />
      </mesh>
      {/* arrow head */}
      <mesh position={[0.85, 0, 0]} rotation={[0, 0, -Math.PI / 4]}>
        <boxGeometry args={[0.32, 0.32, 0.02]} />
        <meshBasicMaterial color={BLUE} />
      </mesh>
      {/* trail dots */}
      {[-0.5, -0.2, 0.1].map((x, i) => (
        <mesh key={i} position={[x, 0, -0.05]}>
          <circleGeometry args={[0.04, 16]} />
          <meshBasicMaterial color={BLUE} transparent opacity={0.6} />
        </mesh>
      ))}
    </group>
  );
}

// ── Headline overhead ──────────────────────────────────────────────────────
function HeadlineHTML() {
  return (
    <Html center position={[0, 3.5, 0]} distanceFactor={6}>
      <div style={{
        fontFamily: MONO, color: '#fff',
        textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 14,
        userSelect: 'none',
      }}>
        <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: '0.2em', color: '#9A9A9A' }}>
          BEFORE · AFTER
        </div>
        <div style={{ fontSize: 64, fontWeight: 700, lineHeight: 1.05, letterSpacing: '-0.02em' }}>
          You talk.{' '}
          <span style={{ color: BLUE }}>¶</span>{' '}
          We paragraph.
        </div>
      </div>
    </Html>
  );
}

// ── Scene wordmark ─────────────────────────────────────────────────────────
function SceneWordmark() {
  return (
    <Html position={[5.5, 4.0, 0]} distanceFactor={7}>
      <div style={{
        fontFamily: MONO, fontWeight: 700, fontSize: 18,
        letterSpacing: '-0.01em', color: '#fff', whiteSpace: 'nowrap',
      }}>
        Pocket Voice<span style={{ color: BLUE }}>¶</span>
      </div>
    </Html>
  );
}

// ── Background plane with subtle blue glows ────────────────────────────────
function Backdrop() {
  return (
    <>
      <mesh position={[0, 0, -3]}>
        <planeGeometry args={[40, 25]} />
        <meshBasicMaterial color={INK} />
      </mesh>
      <mesh position={[3, -2, -2]}>
        <circleGeometry args={[3.5, 64]} />
        <meshBasicMaterial color={BLUE} transparent opacity={0.08} />
      </mesh>
      <mesh position={[-3.5, 1.5, -2.5]}>
        <circleGeometry args={[2.5, 64]} />
        <meshBasicMaterial color={BLUE} transparent opacity={0.05} />
      </mesh>
    </>
  );
}

// ── Main export ────────────────────────────────────────────────────────────
interface PocketVoiceStoryPair3DProps {
  leftScreen?: React.ReactNode;
  rightScreen?: React.ReactNode;
  cameraZ?: number;
  /** Hide in-scene headline + wordmark. Useful when embedded inside a hero
   *  that supplies its own copy above the canvas. */
  showUI?: boolean;
}

export default function PocketVoiceStoryPair3D({
  leftScreen = <DefaultRecorderScreen />,
  rightScreen = <DefaultTranscriptScreen />,
  cameraZ = 7,
  showUI = true,
}: PocketVoiceStoryPair3DProps) {
  const mouse = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    mouse.current.x = ((e.clientX - r.left) / r.width) * 2 - 1;
    mouse.current.y = -(((e.clientY - r.top) / r.height) * 2 - 1);
  };

  return (
    <div
      onMouseMove={onMove}
      style={{
        width: '100%', height: '100%', minHeight: 600,
        background: INK, position: 'relative', overflow: 'hidden',
      }}
    >
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [0, 0, cameraZ], fov: 35 }}
        gl={{ antialias: true, alpha: false }}
      >
        <color attach="background" args={[INK]} />
        <fog attach="fog" args={[INK, 8, 18]} />

        <ambientLight intensity={0.35} />
        <directionalLight
          position={[3, 5, 4]}
          intensity={0.9}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <pointLight position={[-4, -2, 3]} intensity={0.6} color={BLUE} />
        <pointLight position={[4, 3, 2]} intensity={0.4} color="#fff" />

        <Suspense fallback={null}>
          <Backdrop />
          {showUI && <HeadlineHTML />}
          {showUI && <SceneWordmark />}

          <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.3}>
            <Phone3D
              position={[-2.2, -0.4, 0]}
              rotation={[0, 0.18, -0.02]}
              screen={leftScreen}
              label="RECORDING"
              mouse={mouse}
            />
          </Float>

          <Connector />

          <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.3}>
            <Phone3D
              position={[2.2, -0.4, 0]}
              rotation={[0, -0.18, 0.02]}
              screen={rightScreen}
              label="PARAGRAPHED"
              accent
              mouse={mouse}
            />
          </Float>

          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
}

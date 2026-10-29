'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  Environment,
  Lightformer,
  MeshReflectorMaterial,
  PerformanceMonitor,
  Grid,
} from '@react-three/drei';
import { EffectComposer, Bloom, Noise, Vignette } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';
import { useTheme } from '@/components/providers/ThemeProvider';
import UnitCenterpiece, { type UnitGeometry } from '@/components/canvas/UnitCenterpieces';

// ─── Shared scroll / pointer state (refs, never React state, so the canvas never re-renders) ───
const input = { scroll: 0, mx: 0, my: 0 };

const CYAN = '#00A6CE';
const SKY = '#38BDF8';
const GOLD = '#E8B866';

// Night: obsidian city lit from within. Day: golden-hour glass city in soft haze.
const PALETTE = {
  night: {
    bg: '#04060c',
    fog: [14, 78] as [number, number],
    envBg: '#020308',
    tower: '#b9c8d8',
    towerGlow: 0.9,
    towerEnv: 2.6,
    building: '#0a1424',
    windows: 1.35,
    spire: '#0c1626',
    floor: '#03050a',
    gridCell: '#071a2c',
    gridSection: '#0b3a56',
    dust: '#bfe9ff',
    dustOpacity: 0.55,
  },
  // Clear blue sky: sun-lit blue glass towers, silver-blue chrome signature tower, sky-blue blueprint grid
  day: {
    bg: '#d6e8f7',
    fog: [32, 150] as [number, number],
    envBg: '#a9cbea',
    tower: '#9db7d2',
    towerGlow: 0.15,
    towerEnv: 1.1,
    building: '#4a6a8c',
    windows: 0,
    spire: '#36577a',
    floor: '#e4eef8',
    gridCell: '#bcd5ec',
    gridSection: '#7fb2e0',
    dust: '#6fb0e3',
    dustOpacity: 0.4,
  },
};
type Palette = (typeof PALETTE)['night'];

// Seeded random so the skyline is identical on every load
function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

// ─── Lit-window facade texture ───────────────────────────────────────────
function makeWindowTexture(seed: number) {
  const rand = rng(seed);
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, 64, 128);

  const cols = 6;
  const rows = 16;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const v = rand();
      if (v > 0.62) continue;
      const lit = v < 0.22;
      ctx.fillStyle = lit
        ? rand() > 0.35 ? `rgba(255, 214, 160, ${0.55 + rand() * 0.45})` : `rgba(140, 220, 255, ${0.5 + rand() * 0.5})`
        : `rgba(60, 90, 130, ${0.08 + rand() * 0.12})`;
      ctx.fillRect(4 + c * 10, 3 + r * 8, 6, 4);
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.anisotropy = 4;
  return tex;
}

// ─── Daylight curtain-wall facade: tinted glass panels framed by pale mullions ───
function makeFacadeTexture(seed: number) {
  const rand = rng(seed);
  const W = 256;
  const H = 512;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d')!;
  // Mullion colour shows through the hairline gaps
  ctx.fillStyle = '#c9dbec';
  ctx.fillRect(0, 0, W, H);

  // Tall, narrow glass panels in a tight tonal range: reads as one continuous curtain wall
  const cols = 8;
  const rows = 14;
  const cw = W / cols;
  const rh = H / rows;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      ctx.fillStyle = `hsl(${204 + rand() * 8}, 42%, ${32 + rand() * 8}%)`;
      ctx.fillRect(c * cw + 1.5, r * rh + 2, cw - 3, rh - 4);
    }
  }
  // Soft vertical sky gradient across the glass: brighter toward the top of each floor band
  const sheen = ctx.createLinearGradient(0, 0, 0, H);
  sheen.addColorStop(0, 'rgba(255, 255, 255, 0.10)');
  sheen.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = sheen;
  ctx.fillRect(0, 0, W, H);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.anisotropy = 4;
  return tex;
}

// ─── Glowing floor-slab bands for the signature tower ────────────────────
function makeSlabTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 4;
  canvas.height = 32;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, 4, 32);
  ctx.fillStyle = 'rgba(120, 220, 255, 0.9)';
  ctx.fillRect(0, 0, 4, 1);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(1, 34);
  return tex;
}

// ─── Horizon glow behind the skyline ─────────────────────────────────────
function makeHorizonTexture(day: boolean) {
  const canvas = document.createElement('canvas');
  canvas.width = 2;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;
  const g = ctx.createLinearGradient(0, 0, 0, 256);
  if (day) {
    g.addColorStop(0, 'rgba(56, 150, 222, 1)');
    g.addColorStop(0.4, 'rgba(110, 182, 236, 1)');
    g.addColorStop(0.75, 'rgba(186, 222, 247, 1)');
    g.addColorStop(0.92, 'rgba(236, 246, 253, 1)');
    g.addColorStop(1, 'rgba(214, 232, 247, 0)');
  } else {
    g.addColorStop(0, 'rgba(4, 6, 12, 0)');
    g.addColorStop(0.55, 'rgba(10, 40, 70, 0.55)');
    g.addColorStop(0.82, 'rgba(0, 120, 160, 0.55)');
    g.addColorStop(0.93, 'rgba(232, 184, 102, 0.35)');
    g.addColorStop(1, 'rgba(4, 6, 12, 0)');
  }
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 2, 256);
  const t = new THREE.CanvasTexture(canvas);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function HorizonGlow({ day }: { day: boolean }) {
  const tex = useMemo(() => makeHorizonTexture(day), [day]);
  return (
    <mesh position={[0, 22, -105]}>
      <planeGeometry args={[320, 60]} />
      <meshBasicMaterial map={tex} transparent depthWrite={false} fog={false} />
    </mesh>
  );
}

// ─── Low golden-hour sun sitting just above the skyline (daylight only) ──
function Sun() {
  const tex = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 256;
    const ctx = canvas.getContext('2d')!;
    const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    g.addColorStop(0, 'rgba(255, 255, 255, 1)');
    g.addColorStop(0.08, 'rgba(255, 252, 238, 1)');
    g.addColorStop(0.22, 'rgba(225, 242, 255, 0.6)');
    g.addColorStop(0.5, 'rgba(190, 225, 252, 0.2)');
    g.addColorStop(1, 'rgba(170, 215, 250, 0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 256, 256);
    const t = new THREE.CanvasTexture(canvas);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, []);

  return (
    <mesh position={[26, 30, -100]}>
      <planeGeometry args={[70, 70]} />
      <meshBasicMaterial map={tex} transparent depthWrite={false} fog={false} toneMapped={false} />
    </mesh>
  );
}

// ─── Glass-and-steel skyline (instanced, three height bands so windows keep their proportion) ───
const BANDS = [
  { min: 3, max: 7, repeat: 1.2, seed: 11 },
  { min: 8, max: 14, repeat: 2.6, seed: 23 },
  { min: 15, max: 26, repeat: 4.4, seed: 37 },
];

type Tower = { x: number; z: number; w: number; d: number; h: number };

function Skyline({ count, palette, day, clearStage }: { count: number; palette: Palette; day: boolean; clearStage?: boolean }) {
  const bands = useMemo(() => {
    const rand = rng(7);
    const perBand: Tower[][] = [[], [], []];

    for (let i = 0; i < count; i++) {
      // Keep a clear corridor down the middle for the camera flight
      const side = rand() > 0.5 ? 1 : -1;
      const z = 6 - rand() * 104;
      // Near the lens, push towers further out so they frame rather than block the shot
      const x = side * ((z > -12 ? 9 : 5.5) + rand() * 30);
      const depthBoost = Math.min(1, Math.max(0, (-z - 10) / 60));
      const band = rand() < 0.45 - depthBoost * 0.25 ? 0 : rand() < 0.65 ? 1 : 2;
      const b = BANDS[band];
      const tower = {
        x,
        z,
        w: 1.4 + rand() * 2.4,
        d: 1.4 + rand() * 2.4,
        h: b.min + rand() * (b.max - b.min),
      };
      // Unit pages: open a plaza around the centrepiece and its sightline to the lens
      // (random values are still drawn above, so the rest of the skyline is unchanged)
      if (clearStage && x > 3 && x < 18 && z > -26 && z < 6) continue;
      perBand[band].push(tower);
    }

    return perBand.map((items, i) => {
      // Night: lit windows as emissive. Day: curtain-wall facade as the colour map.
      const tex = day ? makeFacadeTexture(BANDS[i].seed) : makeWindowTexture(BANDS[i].seed);
      tex.repeat.set(1, BANDS[i].repeat);
      return { items, tex };
    });
  }, [count, day, clearStage]);

  return (
    <>
      {bands.map(({ items, tex }, i) => (
        <SkylineBand key={`${count}-${day}-${clearStage}-${i}`} items={items} tex={tex} palette={palette} day={day} />
      ))}
    </>
  );
}

function SkylineBand({ items, tex, palette, day }: { items: Tower[]; tex: THREE.Texture; palette: Palette; day: boolean }) {
  const ref = useRef<THREE.InstancedMesh>(null);

  useEffect(() => {
    if (!ref.current) return;
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    items.forEach((it, i) => {
      m.compose(new THREE.Vector3(it.x, it.h / 2, it.z), q, new THREE.Vector3(it.w, it.h, it.d));
      ref.current!.setMatrixAt(i, m);
    });
    ref.current.instanceMatrix.needsUpdate = true;
  }, [items]);

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, items.length]} castShadow receiveShadow>
      <boxGeometry args={[1, 1, 1]} />
      {day ? (
        <meshStandardMaterial map={tex} color="#ffffff" metalness={0.72} roughness={0.14} envMapIntensity={1.6} />
      ) : (
        <meshStandardMaterial
          color={palette.building}
          metalness={0.88}
          roughness={0.26}
          emissive="#ffffff"
          emissiveMap={tex}
          emissiveIntensity={palette.windows}
          envMapIntensity={1.1}
        />
      )}
    </instancedMesh>
  );
}

// ─── Hero centrepiece: twisted chrome tower with light rings ─────────────
function SignatureTower({ palette }: { palette: Palette }) {
  const group = useRef<THREE.Group>(null);
  const rings = useRef<THREE.Group>(null);

  const geometry = useMemo(() => {
    const h = 16;
    const geo = new THREE.BoxGeometry(2.2, h, 2.2, 1, 120, 1);
    const pos = geo.attributes.position as THREE.BufferAttribute;
    const v = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i);
      const t = (v.y + h / 2) / h;
      const angle = t * Math.PI * 0.9;
      const taper = 1 - t * 0.42;
      const x = v.x * taper;
      const z = v.z * taper;
      pos.setXYZ(i, x * Math.cos(angle) - z * Math.sin(angle), v.y, x * Math.sin(angle) + z * Math.cos(angle));
    }
    geo.computeVertexNormals();
    return geo;
  }, []);

  const slabs = useMemo(() => makeSlabTexture(), []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (group.current) group.current.rotation.y = t * 0.06;
    if (rings.current) {
      rings.current.children.forEach((ring, i) => {
        ring.position.y = ((t * 0.9 + i * 5.3) % 16) - 0.2;
        ring.scale.setScalar(Math.max(0.45, 1 - ring.position.y / 18));
      });
    }
  });

  return (
    <group position={[7.5, 0, -12]} scale={0.86}>
      <group ref={group}>
        <mesh geometry={geometry} position={[0, 8, 0]} castShadow receiveShadow>
          <meshPhysicalMaterial
            color={palette.tower}
            metalness={1}
            roughness={0.12}
            clearcoat={1}
            clearcoatRoughness={0.06}
            envMapIntensity={palette.towerEnv}
            emissive="#ffffff"
            emissiveMap={slabs}
            emissiveIntensity={palette.towerGlow}
          />
        </mesh>

        {/* Light spine on the crown */}
        <mesh position={[0, 16.6, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 2.6, 8]} />
          <meshBasicMaterial color={SKY} toneMapped={false} />
        </mesh>
        <mesh position={[0, 17.95, 0]}>
          <sphereGeometry args={[0.13, 16, 16]} />
          <meshBasicMaterial color={[3, 6, 8]} toneMapped={false} />
        </mesh>
      </group>

      {/* Ascending scan rings */}
      <group ref={rings}>
        {[0, 1, 2].map((i) => (
          <mesh key={i} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[1.85, 0.012, 8, 96]} />
            <meshBasicMaterial color={[0.3, 2.2, 3]} toneMapped={false} transparent opacity={0.85} />
          </mesh>
        ))}
      </group>

      {/* Base halo */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[2.1, 2.16, 128]} />
        <meshBasicMaterial color={[0.2, 1.6, 2.4]} toneMapped={false} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, 0]}>
        <ringGeometry args={[2.6, 2.62, 128]} />
        <meshBasicMaterial color={CYAN} transparent opacity={0.35} />
      </mesh>
    </group>
  );
}

// ─── Distant landmark spire (skyline silhouette deep in the city) ────────
const SPIRE_TIERS: [number, number, number][] = [
  [1.8, 2.2, 10],
  [1.2, 1.7, 9],
  [0.7, 1.1, 8],
  [0.3, 0.6, 7],
  [0.06, 0.25, 9],
];

function DistantSpire({ palette }: { palette: Palette }) {
  let y = 0;
  const tiers = SPIRE_TIERS.map(([top, bottom, h]) => {
    const cy = y + h / 2;
    y += h;
    return { top, bottom, h, cy };
  });

  return (
    <group position={[-13, 0, -58]}>
      {tiers.map((t, i) => (
        <mesh key={i} position={[0, t.cy, 0]} castShadow>
          <cylinderGeometry args={[t.top, t.bottom, t.h, 6]} />
          <meshStandardMaterial color={palette.spire} metalness={0.95} roughness={0.2} envMapIntensity={1.4} />
        </mesh>
      ))}
      <mesh position={[0, y + 0.2, 0]}>
        <sphereGeometry args={[0.18, 12, 12]} />
        <meshBasicMaterial color={[6, 2.2, 1]} toneMapped={false} />
      </mesh>
    </group>
  );
}

// ─── Atmospheric dust catching the light ─────────────────────────────────
function Dust({ count, palette, day }: { count: number; palette: Palette; day: boolean }) {
  const ref = useRef<THREE.Points>(null);
  const geo = useMemo(() => {
    const rand = rng(99);
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (rand() - 0.5) * 40;
      pos[i * 3 + 1] = rand() * 22;
      pos[i * 3 + 2] = 18 - rand() * 90;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    return g;
  }, [count]);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.position.y = Math.sin(t * 0.1) * 0.6;
    ref.current.rotation.y = Math.sin(t * 0.03) * 0.05;
  });

  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial
        size={day ? 0.04 : 0.05}
        color={palette.dust}
        transparent
        opacity={palette.dustOpacity}
        depthWrite={false}
        blending={day ? THREE.NormalBlending : THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
}

// ─── Searchlight beams sweeping the night haze ───────────────────────────
const BEAMS = [
  { x: -18, z: -40, color: SKY, speed: 0.13, phase: 0 },
  { x: 20, z: -52, color: GOLD, speed: 0.1, phase: 2 },
  { x: -6, z: -75, color: SKY, speed: 0.08, phase: 4 },
];

function Searchlights() {
  const refs = useRef<(THREE.Mesh | null)[]>([]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    refs.current.forEach((m, i) => {
      if (!m) return;
      const b = BEAMS[i];
      m.rotation.z = Math.sin(t * b.speed + b.phase) * 0.35;
      m.rotation.x = Math.cos(t * b.speed * 0.7 + b.phase) * 0.15;
    });
  });

  return (
    <>
      {BEAMS.map((b, i) => (
        <group key={i} position={[b.x, 0, b.z]}>
          <mesh ref={(m) => { refs.current[i] = m; }}>
            <coneGeometry args={[3.2, 46, 32, 1, true]} />
            <meshBasicMaterial
              color={b.color}
              transparent
              opacity={0.045}
              side={THREE.DoubleSide}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        </group>
      ))}
    </>
  );
}

// ─── Camera rig: dolly through the city along a spline driven by scroll ───
function CameraRig({ reducedMotion }: { reducedMotion: boolean }) {
  const { camera, size } = useThree();
  const eased = useRef(0);
  const look = useRef(new THREE.Vector3(2.5, 4, -6));
  // Reused every frame instead of allocating new vectors
  const tmp = useMemo(() => ({ pos: new THREE.Vector3(), ahead: new THREE.Vector3(), hero: new THREE.Vector3(), aim: new THREE.Vector3() }), []);

  const path = useMemo(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(-0.5, 3.4, 21),
        new THREE.Vector3(-1.4, 4, 6),
        new THREE.Vector3(1.6, 5.4, -10),
        new THREE.Vector3(-1.2, 8.5, -26),
        new THREE.Vector3(0.8, 12, -44),
        new THREE.Vector3(0, 16, -64),
      ]),
    []
  );

  useFrame((_, delta) => {
    const target = reducedMotion ? 0 : input.scroll;
    eased.current = THREE.MathUtils.damp(eased.current, target, 2.2, delta);
    const p = eased.current;

    // Pull back a little on narrow screens so the tower stays in frame
    const narrow = size.width < 768 ? 1 : 0;
    const pos = path.getPointAt(Math.min(p, 1), tmp.pos);
    pos.z += narrow * 6;
    pos.x += narrow * 1.5;

    const mx = reducedMotion ? 0 : input.mx;
    const my = reducedMotion ? 0 : input.my;
    camera.position.set(pos.x + mx * 0.6, pos.y - my * 0.35, pos.z);

    // Hero framing aims at the signature tower, then the gaze follows the path
    const ahead = path.getPointAt(Math.min(p + 0.08, 1), tmp.ahead);
    const heroAim = tmp.hero.set(2.4 - narrow * 3, 7.2, -10);
    const pathAim = tmp.aim.set(ahead.x, ahead.y - 2.2, ahead.z - 6);
    const aim = heroAim.lerp(pathAim, THREE.MathUtils.smoothstep(p, 0.02, 0.22));
    look.current.x = THREE.MathUtils.damp(look.current.x, aim.x, 3, delta);
    look.current.y = THREE.MathUtils.damp(look.current.y, aim.y, 3, delta);
    look.current.z = THREE.MathUtils.damp(look.current.z, aim.z, 3, delta);
    camera.lookAt(look.current);
  });

  return null;
}

// ─── Studio light rig for chrome & glass reflections (procedural, no HDR download) ───
function StudioEnvironment({ palette, day }: { palette: Palette; day: boolean }) {
  return (
    <Environment resolution={256} frames={1}>
      <color attach="background" args={[palette.envBg]} />
      {day && (
        <>
          {/* Bright sun card and a blue sky dome: glass and chrome mirror a clear daylight sky */}
          <Lightformer form="circle" intensity={3.5} color="#fff8ea" position={[30, 18, -40]} scale={10} />
          <Lightformer form="rect" intensity={2} color="#7fbcec" position={[0, 30, 0]} rotation-x={Math.PI / 2} scale={[60, 60, 1]} />
          <Lightformer form="rect" intensity={1.2} color="#e3f1fc" position={[0, 2, 30]} scale={[60, 6, 1]} />
        </>
      )}
      <Lightformer form="rect" intensity={3} color="#ffffff" position={[0, 6, -12]} scale={[18, 2, 1]} />
      <Lightformer form="rect" intensity={2.2} color={SKY} position={[-10, 3, 0]} rotation-y={Math.PI / 2} scale={[20, 1.2, 1]} />
      <Lightformer form="rect" intensity={1.8} color={GOLD} position={[10, 2, 4]} rotation-y={-Math.PI / 2} scale={[20, 0.8, 1]} />
      <Lightformer form="ring" intensity={2.5} color={CYAN} position={[0, 12, 0]} rotation-x={Math.PI / 2} scale={6} />
      <Lightformer form="rect" intensity={0.6} color="#9fb6d9" position={[0, -4, 8]} scale={[30, 4, 1]} />
      {/* Vertical studio strips: give the chrome tower long, crisp highlights */}
      {[-6, -2, 3, 7].map((x, i) => (
        <Lightformer
          key={x}
          form="rect"
          intensity={i % 2 ? 2.4 : 1.6}
          color={i === 2 ? GOLD : '#e6f4ff'}
          position={[x, 4, 9]}
          rotation-y={Math.PI}
          scale={[0.5, 16, 1]}
        />
      ))}
    </Environment>
  );
}

type Quality = 'high' | 'mid' | 'low';
const TIERS: Quality[] = ['high', 'mid', 'low'];

// Integrated / mobile GPUs can't afford the planar reflection pass at full city scale
function detectQuality(): Quality {
  if (window.innerWidth < 768) return 'low';
  try {
    const gl = document.createElement('canvas').getContext('webgl2');
    const ext = gl?.getExtension('WEBGL_debug_renderer_info');
    const renderer = ext ? String(gl!.getParameter(ext.UNMASKED_RENDERER_WEBGL)) : '';
    if (/swiftshader|llvmpipe|software/i.test(renderer)) return 'low';
    if (/intel|mali|adreno|powervr/i.test(renderer)) return 'mid';
  } catch {
    return 'mid';
  }
  return 'high';
}

export type UnitVisual = { geometry: UnitGeometry; color: string };

// Tells the splash screen the city has actually drawn (a couple of frames, so shaders are compiled)
function ReadySignal() {
  const frames = useRef(0);
  useFrame(() => {
    frames.current += 1;
    if (frames.current === 3) {
      (window as unknown as { __aasaWorldReady?: boolean }).__aasaWorldReady = true;
      window.dispatchEvent(new Event('aasa:world-ready'));
    }
  });
  return null;
}

function Scene({
  quality,
  reducedMotion,
  day,
  unit,
}: {
  quality: Quality;
  reducedMotion: boolean;
  day: boolean;
  unit?: UnitVisual;
}) {
  const high = quality === 'high';
  const low = quality === 'low';
  const palette = day ? PALETTE.day : PALETTE.night;

  return (
    <>
      <color attach="background" args={[palette.bg]} />
      <fog attach="fog" args={[palette.bg, ...palette.fog]} />

      {day ? (
        <>
          <hemisphereLight args={['#b9dcfb', '#c4d4e4', 0.7]} />
          {/* Sun behind the city: rim-lights every tower and throws long shadows toward the lens */}
          <directionalLight
            position={[40, 30, -75]}
            intensity={3}
            color="#fff6e6"
            castShadow={!low}
            shadow-mapSize={[high ? 2048 : 1024, high ? 2048 : 1024]}
            shadow-bias={-0.0004}
            shadow-normalBias={0.04}
            shadow-camera-left={-60}
            shadow-camera-right={60}
            shadow-camera-top={60}
            shadow-camera-bottom={-60}
            shadow-camera-near={1}
            shadow-camera-far={200}
          />
          <directionalLight position={[-20, 14, 30]} intensity={0.7} color="#cfe6fb" />
        </>
      ) : (
        <>
          <ambientLight intensity={0.15} />
          <directionalLight position={[8, 14, 6]} intensity={0.9} color="#dfe9ff" />
          <pointLight position={[6.2, 3, -4]} intensity={18} distance={14} color={CYAN} />
          <pointLight position={[-8, 6, -20]} intensity={14} distance={24} color={GOLD} />
        </>
      )}

      {/* Remount so the one-frame environment capture is re-baked for the new palette */}
      <StudioEnvironment key={day ? 'day' : 'night'} palette={palette} day={day} />
      <CameraRig reducedMotion={reducedMotion} />

      <HorizonGlow day={day} />
      {day && <Sun />}
      {/* Business-unit pages swap the signature tower for the unit's own centrepiece */}
      {unit ? <UnitCenterpiece geometry={unit.geometry} color={unit.color} day={day} /> : <SignatureTower palette={palette} />}
      <Skyline count={high ? 150 : low ? 80 : 120} palette={palette} day={day} clearStage={!!unit} />
      <DistantSpire palette={palette} />
      {!day && <Searchlights />}
      <Dust count={high ? 1400 : low ? 500 : 900} palette={palette} day={day} />

      {/* Polished ground: obsidian at night, pale stone by day */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -30]} receiveShadow>
        <planeGeometry args={[160, 160]} />
        {high ? (
          <MeshReflectorMaterial
            blur={[400, 120]}
            resolution={512}
            mixBlur={1}
            mixStrength={day ? 1.6 : 3}
            roughness={1}
            depthScale={1}
            minDepthThreshold={0.4}
            maxDepthThreshold={1.4}
            color={palette.floor}
            metalness={day ? 0.1 : 0.2}
            mirror={day ? 0.35 : 0.6}
            envMapIntensity={day ? 0.3 : 0.05}
          />
        ) : (
          <meshStandardMaterial
            color={palette.floor}
            metalness={day ? 0.15 : 0.85}
            roughness={day ? 0.45 : 0.32}
            envMapIntensity={day ? 0.4 : 0.25}
          />
        )}
      </mesh>

      {/* Blueprint grid fading into the haze */}
      <Grid
        position={[0, 0.01, -30]}
        args={[160, 160]}
        cellSize={1}
        cellThickness={0.5}
        cellColor={palette.gridCell}
        sectionSize={6}
        sectionThickness={0.9}
        sectionColor={palette.gridSection}
        fadeDistance={48}
        fadeStrength={2.2}
        infiniteGrid
      />

      {high && (
        <EffectComposer multisampling={0} enableNormalPass={false}>
          <Bloom
            mipmapBlur
            intensity={day ? 0.7 : 0.85}
            luminanceThreshold={day ? 0.92 : 0.55}
            luminanceSmoothing={0.2}
            radius={0.8}
          />
          <Noise premultiply blendFunction={BlendFunction.SOFT_LIGHT} opacity={day ? 0.2 : 0.35} />
          <Vignette offset={0.2} darkness={day ? 0.55 : 0.85} eskil={false} />
        </EffectComposer>
      )}
      {quality === 'mid' && (
        <EffectComposer multisampling={0} enableNormalPass={false} resolutionScale={0.75}>
          <Bloom
            mipmapBlur
            intensity={day ? 0.6 : 0.8}
            luminanceThreshold={day ? 0.92 : 0.6}
            luminanceSmoothing={0.2}
            radius={0.7}
          />
          <Vignette offset={0.2} darkness={day ? 0.55 : 0.85} eskil={false} />
        </EffectComposer>
      )}
    </>
  );
}

// ─── Full-screen fixed cinematic canvas behind the page ──────────────────
export default function CinematicWorld({ unit }: { unit?: UnitVisual } = {}) {
  const { theme } = useTheme();
  const day = theme === 'light';
  const [quality, setQuality] = useState<Quality>('mid');
  const [reducedMotion, setReducedMotion] = useState(false);
  const scrimRef = useRef<HTMLDivElement>(null);
  const leakRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const onMq = () => setReducedMotion(mq.matches);
    mq.addEventListener('change', onMq);

    setQuality(detectQuality());

    const onMove = (e: PointerEvent) => {
      input.mx = (e.clientX / window.innerWidth) * 2 - 1;
      input.my = (e.clientY / window.innerHeight) * 2 - 1;
    };

    // Page height is cached (re-measured on resize / content growth) so scrolling never forces a layout read
    let max = 1;
    const measure = () => {
      max = document.documentElement.scrollHeight - window.innerHeight;
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);

    const onScroll = () => {
      input.scroll = max > 0 ? window.scrollY / max : 0;

      // Veil the world behind content sections so copy stays crisp; hero stays fully cinematic
      if (scrimRef.current) {
        const k = Math.min(1, Math.max(0, (window.scrollY - window.innerHeight * 0.45) / (window.innerHeight * 0.8)));
        // Daylight keeps the city brighter behind content; night needs a deeper veil for white copy
        const light = document.documentElement.classList.contains('light');
        scrimRef.current.style.opacity = String(k * (light ? 0.32 : 0.62));
      }
      if (leakRef.current) leakRef.current.style.opacity = String(1 - Math.min(1, window.scrollY / window.innerHeight));
    };

    onScroll();
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    const onResize = () => {
      measure();
      onScroll();
    };
    window.addEventListener('resize', onResize);
    return () => {
      ro.disconnect();
      mq.removeEventListener('change', onMq);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-page" aria-hidden>
      <Canvas
        shadows="soft"
        camera={{ position: [-0.5, 3.4, 21], fov: 40, near: 0.1, far: 160 }}
        dpr={quality === 'high' ? [1, 1.5] : quality === 'mid' ? [1, 1.25] : 1}
        gl={{ antialias: quality !== 'low', powerPreference: 'high-performance', alpha: false, stencil: false }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.05;
        }}
      >
        <PerformanceMonitor
          onDecline={() => setQuality((q) => TIERS[Math.min(TIERS.indexOf(q) + 1, TIERS.length - 1)])}
        />
        <Scene quality={quality} reducedMotion={reducedMotion} day={day} unit={unit} />
        <ReadySignal />
      </Canvas>

      {/* Content veil: fades in after the hero so sections read cleanly over the city */}
      <div
        ref={scrimRef}
        className="absolute inset-0"
        style={{
          opacity: 0,
          background: 'linear-gradient(180deg, rgb(var(--page) / 0.55) 0%, rgb(var(--page) / 0.35) 40%, rgb(var(--page) / 0.75) 100%)',
        }}
      />

      {/* Daylight only: warm anamorphic light leak from the sun side, fades as the flight begins */}
      {day && (
        <div
          ref={leakRef}
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 55% 45% at 92% 14%, rgba(255, 255, 255, 0.55) 0%, rgba(186, 230, 253, 0) 70%), linear-gradient(100deg, rgba(186, 230, 253, 0) 55%, rgba(125, 211, 252, 0.18) 80%, rgba(186, 230, 253, 0) 100%)',
            mixBlendMode: 'soft-light',
          }}
        />
      )}

      {/* Letterbox falloff top & bottom */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-page via-page/40 to-transparent" style={{ opacity: 'var(--veil)' }} />
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-page via-page/50 to-transparent" style={{ opacity: 'var(--veil)' }} />
    </div>
  );
}

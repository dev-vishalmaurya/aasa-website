'use client';

import React, { useRef, useState, useMemo, Suspense } from 'react';
import { Canvas, useFrame, ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import { Globe2, Radio, MapPin, Zap } from 'lucide-react';

interface CityHub {
  id: string;
  name: string;
  country: string;
  role: string;
  megaprojects: string;
  coords3D: [number, number, number]; // x, y (elevation), z
  stats: string;
}

const CITY_HUBS: CityHub[] = [
  {
    id: 'dubai',
    name: 'Dubai',
    country: 'United Arab Emirates',
    role: 'Global Executive HQ · Aspect Tower, Business Bay',
    megaprojects: '80+ Megaprojects',
    coords3D: [0, 0, 0], // Central anchor
    stats: '29+ Years · Command Core · 25,000+ Deployed Talent',
  },
  {
    id: 'abudhabi',
    name: 'Abu Dhabi',
    country: 'United Arab Emirates',
    role: 'Heavy Civil, Energy & Transit Hub',
    megaprojects: '35+ Megaprojects',
    coords3D: [-0.9, 0, 0.45],
    stats: 'ADNOC Downstream Oil/Gas · EHV Power Substation Corridor',
  },
  {
    id: 'riyadh',
    name: 'Riyadh',
    country: 'Kingdom of Saudi Arabia',
    role: 'KSA Vision 2030 Strategic Delivery Center',
    megaprojects: '20+ Megaprojects',
    coords3D: [-2.1, 0, -0.75],
    stats: 'Gigaproject Industrial Logistics · 400kV Power Interconnect',
  },
  {
    id: 'doha',
    name: 'Doha',
    country: 'State of Qatar',
    role: 'Sovereign Infrastructure & Industrial Terminal',
    megaprojects: '12+ Megaprojects',
    coords3D: [-0.65, 0, -1.05],
    stats: 'Aviation Megastructures · Marine Terminal Access',
  },
  {
    id: 'mumbai',
    name: 'Mumbai',
    country: 'India',
    role: 'Asian Engineering Design & BIM Mobilization Center',
    megaprojects: '8+ Megaprojects',
    coords3D: [2.5, 0, 1.25],
    stats: 'Parametric CAD Center · Executive Talent Pipeline',
  },
];

// ─── 3D Radar Disc, Rings & Scanning Beam ───────────────────────────────
function RadarGridMesh() {
  const sweepRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (sweepRef.current) {
      sweepRef.current.rotation.y = clock.getElapsedTime() * 0.75;
    }
  });

  return (
    <group position={[0, -0.05, 0]}>
      {/* Concentric Distance Rings */}
      {[1.2, 2.0, 2.9, 3.8].map((radius, idx) => (
        <mesh key={idx} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[radius - 0.015, radius, 64]} />
          <meshBasicMaterial
            color={idx === 1 ? '#00F5D4' : '#38BDF8'}
            transparent
            opacity={0.25 - idx * 0.04}
          />
        </mesh>
      ))}

      {/* Crosshair Cardinal Coordinate Axes */}
      <lineSegments
        geometry={
          new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(-3.8, 0, 0),
            new THREE.Vector3(3.8, 0, 0),
            new THREE.Vector3(0, 0, -3.8),
            new THREE.Vector3(0, 0, 3.8),
          ])
        }
      >
        <lineBasicMaterial color="#00A6CE" transparent opacity={0.15} />
      </lineSegments>

      {/* Rotating Radar Sweep Cone/Plane */}
      <mesh ref={sweepRef} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0, 3.8, 32, 1, 0, Math.PI / 3]} />
        <meshBasicMaterial
          color="#00F5D4"
          transparent
          opacity={0.12}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

// ─── 3D Parabolic Arcs with Flying Energy Photons ───────────────────────
function TransnationalArcs({ activeCityId }: { activeCityId: string }) {
  const photonsRef = useRef<THREE.Points>(null);

  const { arcGeometries, samplePoints } = useMemo(() => {
    const geos: { id: string; geo: THREE.BufferGeometry }[] = [];
    const allPts: THREE.Vector3[][] = [];

    const dubai = new THREE.Vector3(...CITY_HUBS[0].coords3D);

    CITY_HUBS.slice(1).forEach((hub) => {
      const target = new THREE.Vector3(...hub.coords3D);
      const dist = dubai.distanceTo(target);
      const mid = new THREE.Vector3().addVectors(dubai, target).multiplyScalar(0.5);
      // Parabolic altitude lift based on distance
      mid.y = 0.6 + dist * 0.35;

      const curve = new THREE.QuadraticBezierCurve3(dubai, mid, target);
      const pts = curve.getPoints(36);
      allPts.push(pts);

      const geo = new THREE.BufferGeometry().setFromPoints(pts);
      geos.push({ id: hub.id, geo });
    });

    return { arcGeometries: geos, samplePoints: allPts };
  }, []);

  // Energy photon geometry
  const photonGeos = useMemo(() => {
    const count = 30;
    const pos = new Float32Array(count * 3);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    return geo;
  }, []);

  useFrame(({ clock }) => {
    if (!photonsRef.current) return;
    const pos = photonsRef.current.geometry.attributes.position.array as Float32Array;
    const t = clock.getElapsedTime() * 0.8;

    let pIdx = 0;
    samplePoints.forEach((curvePts) => {
      for (let k = 0; k < 6; k++) {
        const u = ((t * 0.6 + k / 6) % 1);
        const ptIdx = Math.floor(u * (curvePts.length - 1));
        const pt = curvePts[ptIdx] || curvePts[0];
        pos[pIdx * 3] = pt.x;
        pos[pIdx * 3 + 1] = pt.y;
        pos[pIdx * 3 + 2] = pt.z;
        pIdx++;
      }
    });

    photonsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <group>
      {/* 3D Curved Arcs */}
      {arcGeometries.map(({ id, geo }) => {
        const isHighlight = id === activeCityId || activeCityId === 'dubai';
        return (
          <lineSegments key={id} geometry={geo}>
            <lineBasicMaterial
              color={isHighlight ? '#00F5D4' : '#38BDF8'}
              linewidth={2}
              transparent
              opacity={isHighlight ? 0.9 : 0.4}
            />
          </lineSegments>
        );
      })}

      {/* Flowing Energy Photons */}
      <points ref={photonsRef} geometry={photonGeos}>
        <pointsMaterial
          size={0.09}
          color="#00F5D4"
          transparent
          opacity={0.9}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

// ─── 3D City Beacon Tower with Hover Reticle ────────────────────────────
function CityBeacon({
  hub,
  isActive,
  onSelect,
}: {
  hub: CityHub;
  isActive: boolean;
  onSelect: (id: string) => void;
}) {
  const beaconRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const isHQ = hub.id === 'dubai';
  const beaconH = isHQ ? 1.6 : 1.1;

  useFrame(({ clock }) => {
    if (ringRef.current) {
      const s = 1 + Math.sin(clock.getElapsedTime() * 3) * 0.15;
      ringRef.current.scale.set(s, s, s);
    }
  });

  return (
    <group
      ref={beaconRef}
      position={hub.coords3D}
      onClick={() => onSelect(hub.id)}
      onPointerOver={() => onSelect(hub.id)}
    >
      {/* Vertical Light Column */}
      <mesh position={[0, beaconH / 2, 0]}>
        <cylinderGeometry args={[0.025, 0.025, beaconH, 12]} />
        <meshBasicMaterial
          color={isHQ ? '#00F5D4' : isActive ? '#38BDF8' : '#0284C7'}
          transparent
          opacity={isActive ? 0.95 : 0.6}
        />
      </mesh>

      {/* Floating Beacon Pulsing Core */}
      <mesh position={[0, beaconH, 0]}>
        <sphereGeometry args={[isHQ ? 0.09 : 0.065, 16, 16]} />
        <meshStandardMaterial
          color={isHQ ? '#00F5D4' : '#38BDF8'}
          emissive={isHQ ? '#00F5D4' : '#00A6CE'}
          emissiveIntensity={1.8}
        />
      </mesh>

      {/* Ground Reticle Pulse Ring */}
      <mesh ref={ringRef} position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.15, 0.22, 24]} />
        <meshBasicMaterial
          color={isHQ ? '#00F5D4' : '#38BDF8'}
          transparent
          opacity={isActive ? 0.8 : 0.4}
        />
      </mesh>

      {/* Base Foundation Plate */}
      <mesh position={[0, 0.005, 0]}>
        <cylinderGeometry args={[0.12, 0.15, 0.02, 16]} />
        <meshStandardMaterial color="#0B203E" metalness={0.9} roughness={0.2} />
      </mesh>
    </group>
  );
}

// ─── 3D Scene Controller with Smooth Mouse Orbit ────────────────────────
function RadarSceneContainer({
  activeCityId,
  onSelectCity,
}: {
  activeCityId: string;
  onSelectCity: (id: string) => void;
}) {
  const rootRef = useRef<THREE.Group>(null);
  const isDragging = useRef(false);
  const prevMouse = useRef({ x: 0, y: 0 });
  const rotVel = useRef(0);

  useFrame(() => {
    if (rootRef.current && !isDragging.current) {
      rootRef.current.rotation.y += 0.003 + rotVel.current;
      rotVel.current *= 0.94;
    }
  });

  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    isDragging.current = true;
    prevMouse.current = { x: e.nativeEvent.clientX, y: e.nativeEvent.clientY };
  };

  const handlePointerMove = (e: ThreeEvent<PointerEvent>) => {
    if (!isDragging.current || !rootRef.current) return;
    const dx = (e.nativeEvent.clientX - prevMouse.current.x) * 0.008;
    rootRef.current.rotation.y += dx;
    rotVel.current = dx;
    prevMouse.current = { x: e.nativeEvent.clientX, y: e.nativeEvent.clientY };
  };

  const handlePointerUp = () => {
    isDragging.current = false;
  };

  return (
    <>
      <ambientLight intensity={0.7} color="#E0F2FE" />
      <directionalLight position={[4, 7, 5]} intensity={1.5} color="#FFFFFF" />
      <pointLight position={[0, 3, 0]} intensity={1.8} color="#00F5D4" />

      <group
        ref={rootRef}
        rotation={[0.42, -0.35, 0]} // Cinematic 3D isometric tilt
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        <RadarGridMesh />
        <TransnationalArcs activeCityId={activeCityId} />
        {CITY_HUBS.map((hub) => (
          <CityBeacon
            key={hub.id}
            hub={hub}
            isActive={hub.id === activeCityId}
            onSelect={onSelectCity}
          />
        ))}
      </group>
    </>
  );
}

// ─── Main GCC Spatial Radar Component ───────────────────────────────────
export default function GccSpatialRadar() {
  const [selectedId, setSelectedId] = useState<string>('dubai');
  const activeHub = CITY_HUBS.find((h) => h.id === selectedId) || CITY_HUBS[0];

  return (
    <div className="relative w-full rounded-3xl overflow-hidden bg-gradient-to-b from-[#051020] via-[#07172E] to-[#040C1A] border border-cyan-500/30 p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
      {/* HUD Telemetry Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 relative z-20">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Radio size={14} className="text-cyan-400 animate-pulse" />
            <span className="font-mono text-[10px] sm:text-xs font-bold text-cyan-400 tracking-widest uppercase">
              TRANSNATIONAL GCC & ASIAN RADAR
            </span>
          </div>
          <h3 className="font-display text-xl sm:text-2xl font-bold text-white">
            4 Sovereign Markets · <span className="text-cyan-400 font-medium italic font-serif">1 Unified Matrix</span>
          </h3>
        </div>

        {/* Live Status Pill */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-[11px] font-mono text-cyan-300">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span>GST UTC+4 ACTIVE</span>
        </div>
      </div>

      {/* Main Grid: 3D Radar Viewport on Left, Active Hub Telemetry on Right */}
      <div className="grid lg:grid-cols-[1.4fr,1fr] gap-6 items-center">
        {/* 3D WebGL Radar Canvas */}
        <div className="relative h-[320px] sm:h-[380px] w-full rounded-2xl overflow-hidden bg-slate-950/80 border border-white/10 cursor-grab active:cursor-grabbing">
          {/* HUD Corner Brackets */}
          <div className="absolute top-2.5 left-2.5 w-3.5 h-3.5 border-t border-l border-cyan-400 z-10 pointer-events-none" />
          <div className="absolute top-2.5 right-2.5 w-3.5 h-3.5 border-t border-r border-cyan-400 z-10 pointer-events-none" />
          <div className="absolute bottom-2.5 left-2.5 w-3.5 h-3.5 border-b border-l border-cyan-400 z-10 pointer-events-none" />
          <div className="absolute bottom-2.5 right-2.5 w-3.5 h-3.5 border-b border-r border-cyan-400 z-10 pointer-events-none" />

          <Suspense fallback={<div className="w-full h-full flex items-center justify-center text-cyan-400 font-mono text-xs">SYNCHRONIZING GCC RADAR SATELLITES...</div>}>
            <Canvas
              camera={{ position: [0, 3.8, 4.4], fov: 45, near: 0.1, far: 50 }}
              dpr={[1, 1.5]}
              gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
            >
              <RadarSceneContainer
                activeCityId={selectedId}
                onSelectCity={setSelectedId}
              />
            </Canvas>
          </Suspense>

          {/* Interactive Drag Hint */}
          <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between px-3 py-1 rounded-lg bg-slate-950/80 backdrop-blur-sm border border-cyan-500/20 text-[9px] font-mono text-slate-400 pointer-events-none">
            <span className="text-cyan-400 font-bold flex items-center gap-1">
              <Zap size={10} /> 3D SPATIAL ARCS
            </span>
            <span>[ CLICK OR DRAG TO ROTATE ]</span>
          </div>
        </div>

        {/* Sovereign Hub Specification Panel */}
        <div className="space-y-4">
          {/* Quick Hub Selector Buttons */}
          <div className="flex flex-wrap gap-1.5">
            {CITY_HUBS.map((hub) => {
              const isCur = hub.id === selectedId;
              return (
                <button
                  key={hub.id}
                  onClick={() => setSelectedId(hub.id)}
                  className={`px-3 py-1.5 rounded-lg font-mono text-[11px] font-bold transition-all cursor-pointer ${
                    isCur
                      ? 'bg-cyan-400 text-slate-950 shadow-[0_0_12px_rgba(56,189,248,0.5)]'
                      : 'bg-white/[0.05] text-slate-300 hover:text-white border border-white/10 hover:border-cyan-400/40'
                  }`}
                  data-cursor="HUB"
                >
                  {hub.name.toUpperCase()}
                </button>
              );
            })}
          </div>

          {/* Active Hub Detailed Telemetry Card */}
          <div className="p-5 rounded-2xl bg-white/[0.04] border border-cyan-500/30 backdrop-blur-xl relative">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <div className="font-mono text-[10px] text-cyan-400 font-bold uppercase tracking-wider mb-0.5">
                  SOVEREIGN HUB · {activeHub.country}
                </div>
                <div className="font-display text-2xl font-bold text-white flex items-center gap-2">
                  <MapPin size={18} className="text-cyan-400" />
                  {activeHub.name}
                </div>
              </div>
              <div className="px-2.5 py-1 rounded bg-cyan-500/15 border border-cyan-400/40 font-mono text-[11px] font-bold text-cyan-300">
                {activeHub.megaprojects}
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 font-normal mb-4">
              {activeHub.role}
            </p>

            <div className="pt-3 border-t border-white/10 flex items-center gap-2">
              <Globe2 size={14} className="text-cyan-400 shrink-0" />
              <span className="font-mono text-[10px] text-slate-400 truncate">
                {activeHub.stats}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useRef, useState, useMemo, Suspense } from 'react';
import { Canvas, useFrame, ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import { Rotate3D, Layers, Activity } from 'lucide-react';

// ─── 3D Model 1: High-Voltage 400kV Transmission Lattice Pylon ──────────
function PowerPylonModel({ wireframe }: { wireframe: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const sparkRef = useRef<THREE.Points>(null);

  // Generate lattice frame
  const { lines, insulators } = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    const w0 = 0.9, w1 = 0.25, h = 3.6, y0 = -1.8;
    const levels = [y0, y0 + 1.0, y0 + 2.0, y0 + 2.8, y0 + h];

    const getW = (y: number) => w0 + (w1 - w0) * ((y - y0) / h);

    // 4 Corner legs
    const corners = [[1, 1], [1, -1], [-1, 1], [-1, -1]];
    corners.forEach(([cx, cz]) => {
      pts.push(new THREE.Vector3(cx * w0, y0, cz * w0), new THREE.Vector3(cx * w1, y0 + h, cz * w1));
    });

    // Cross braces and horizontal ties
    for (let i = 0; i < levels.length - 1; i++) {
      const ya = levels[i];
      const yb = levels[i + 1];
      const wa = getW(ya);
      const wb = getW(yb);

      // Horizontal square ties
      pts.push(
        new THREE.Vector3(-wa, ya, -wa), new THREE.Vector3(wa, ya, -wa),
        new THREE.Vector3(wa, ya, -wa), new THREE.Vector3(wa, ya, wa),
        new THREE.Vector3(wa, ya, wa), new THREE.Vector3(-wa, ya, wa),
        new THREE.Vector3(-wa, ya, wa), new THREE.Vector3(-wa, ya, -wa),
        // Cross braces
        new THREE.Vector3(-wa, ya, -wa), new THREE.Vector3(wb, yb, -wb),
        new THREE.Vector3(wa, ya, -wa), new THREE.Vector3(-wb, yb, -wb),
        new THREE.Vector3(-wa, ya, wa), new THREE.Vector3(wb, yb, wb),
        new THREE.Vector3(wa, ya, wa), new THREE.Vector3(-wb, yb, wb)
      );
    }

    // Crossarms (top horizontal conductor supports)
    const armY1 = y0 + 2.4;
    const armY2 = y0 + 3.1;
    pts.push(
      new THREE.Vector3(-1.9, armY1, 0), new THREE.Vector3(1.9, armY1, 0),
      new THREE.Vector3(-1.5, armY2, 0), new THREE.Vector3(1.5, armY2, 0),
      // Braces to mast
      new THREE.Vector3(-1.9, armY1, 0), new THREE.Vector3(0, armY1 + 0.5, 0),
      new THREE.Vector3(1.9, armY1, 0), new THREE.Vector3(0, armY1 + 0.5, 0)
    );

    // Sagging transmission catenaries
    const addCable = (x0: number, y0: number, x1: number, y1: number, sag: number) => {
      const segs = 10;
      for (let s = 0; s < segs; s++) {
        const u0 = s / segs, u1 = (s + 1) / segs;
        const ya0 = y0 + (y1 - y0) * u0 - Math.sin(u0 * Math.PI) * sag;
        const ya1 = y0 + (y1 - y0) * u1 - Math.sin(u1 * Math.PI) * sag;
        pts.push(
          new THREE.Vector3(x0 + (x1 - x0) * u0, ya0, 0),
          new THREE.Vector3(x0 + (x1 - x0) * u1, ya1, 0)
        );
      }
    };
    addCable(1.9, armY1, 3.2, armY1 - 0.4, 0.35);
    addCable(-1.9, armY1, -3.2, armY1 - 0.4, 0.35);

    const lineGeo = new THREE.BufferGeometry().setFromPoints(pts);

    // Insulators positions
    const ins: [number, number, number][] = [
      [1.9, armY1 - 0.15, 0],
      [-1.9, armY1 - 0.15, 0],
      [1.5, armY2 - 0.15, 0],
      [-1.5, armY2 - 0.15, 0],
    ];

    return { lines: lineGeo, insulators: ins };
  }, []);

  // Plasma energy sparks
  const sparkGeo = useMemo(() => {
    const count = 40;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 3.8;
      pos[i * 3 + 1] = 0.6 + (Math.random() - 0.5) * 1.5;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 0.8;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    return geo;
  }, []);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.15;
    }
    if (sparkRef.current) {
      const pos = sparkRef.current.geometry.attributes.position.array as Float32Array;
      const t = clock.getElapsedTime();
      for (let i = 0; i < pos.length / 3; i++) {
        pos[i * 3] += Math.sin(t * 5 + i) * 0.01;
        pos[i * 3 + 1] += Math.cos(t * 3 + i) * 0.008;
      }
      sparkRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Structural Steel Lattice Lines */}
      <lineSegments geometry={lines}>
        <lineBasicMaterial
          color={wireframe ? '#38BDF8' : '#00A6CE'}
          linewidth={2}
          transparent
          opacity={0.85}
        />
      </lineSegments>

      {/* Ceramic Insulator Strings */}
      {insulators.map((pos, idx) => (
        <group key={idx} position={pos}>
          <mesh>
            <cylinderGeometry args={[0.06, 0.06, 0.35, 12]} />
            <meshStandardMaterial color="#38BDF8" emissive="#00A6CE" emissiveIntensity={0.6} metalness={0.9} roughness={0.1} />
          </mesh>
          {/* Corona Discharge Ring */}
          <mesh position={[0, -0.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.12, 0.02, 16, 24]} />
            <meshStandardMaterial color="#00F5D4" emissive="#00F5D4" emissiveIntensity={0.8} />
          </mesh>
        </group>
      ))}

      {/* High-Voltage Corona Sparks */}
      <points ref={sparkRef} geometry={sparkGeo}>
        <pointsMaterial size={0.06} color="#38BDF8" transparent opacity={0.75} blending={THREE.AdditiveBlending} />
      </points>

      {/* Ground Foundation Pads */}
      {[[-0.9, -1.8, -0.9], [0.9, -1.8, -0.9], [0.9, -1.8, 0.9], [-0.9, -1.8, 0.9]].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <boxGeometry args={[0.3, 0.12, 0.3]} />
          <meshStandardMaterial color="#0B203E" metalness={0.8} roughness={0.3} />
        </mesh>
      ))}
    </group>
  );
}

// ─── 3D Model 2: Parametric Diagrid Architectural Megastructure ─────────
function DiagridTowerModel({ wireframe }: { wireframe: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const floors = 9;
  const radius = 1.05;
  const height = 3.6;

  // Generate diagrid lattice
  const diagridLines = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    const segments = 16;
    for (let f = 0; f < floors; f++) {
      const y0 = -height / 2 + (f / floors) * height;
      const y1 = -height / 2 + ((f + 1) / floors) * height;
      const r0 = radius * (1 - 0.25 * Math.sin((f / floors) * Math.PI));
      const r1 = radius * (1 - 0.25 * Math.sin(((f + 1) / floors) * Math.PI));

      for (let s = 0; s < segments; s++) {
        const a0 = (s / segments) * Math.PI * 2;
        const a1 = ((s + 1) / segments) * Math.PI * 2;

        const p00 = new THREE.Vector3(Math.cos(a0) * r0, y0, Math.sin(a0) * r0);
        const p01 = new THREE.Vector3(Math.cos(a1) * r0, y0, Math.sin(a1) * r0);
        const p10 = new THREE.Vector3(Math.cos(a0) * r1, y1, Math.sin(a0) * r1);
        const p11 = new THREE.Vector3(Math.cos(a1) * r1, y1, Math.sin(a1) * r1);

        // Perimeter ring
        pts.push(p00, p01);
        // Diagrid cross members
        pts.push(p00, p11);
        pts.push(p01, p10);
      }
    }
    return new THREE.BufferGeometry().setFromPoints(pts);
  }, []);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.18;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Central Illuminated Concrete Core */}
      <mesh>
        <cylinderGeometry args={[0.35, 0.45, height, 24]} />
        <meshStandardMaterial
          color="#0B203E"
          emissive="#00A6CE"
          emissiveIntensity={0.2}
          metalness={0.7}
          roughness={0.4}
        />
      </mesh>

      {/* Exterior Structural Steel Diagrid Frame */}
      <lineSegments geometry={diagridLines}>
        <lineBasicMaterial color={wireframe ? '#38BDF8' : '#00A6CE'} linewidth={2} transparent opacity={0.85} />
      </lineSegments>

      {/* Glass Floor Plates with Specular Reflectance */}
      {Array.from({ length: floors }).map((_, idx) => {
        const y = -height / 2 + (idx / floors) * height;
        const r = radius * (1 - 0.25 * Math.sin((idx / floors) * Math.PI)) * 0.95;
        return (
          <mesh key={idx} position={[0, y, 0]} rotation={[0, 0, 0]}>
            <cylinderGeometry args={[r, r, 0.04, 24]} />
            <meshStandardMaterial
              color="#07172E"
              emissive="#38BDF8"
              emissiveIntensity={idx % 2 === 0 ? 0.35 : 0.1}
              metalness={0.9}
              roughness={0.15}
              transparent
              opacity={0.7}
            />
          </mesh>
        );
      })}

      {/* Rooftop Cantilever Construction Crane Rig */}
      <group position={[0, height / 2, 0]}>
        <mesh position={[0, 0.3, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.6, 8]} />
          <meshStandardMaterial color="#38BDF8" emissive="#00A6CE" emissiveIntensity={0.5} />
        </mesh>
        <mesh position={[0.45, 0.6, 0]} rotation={[0, 0, Math.PI / 2]}>
          <boxGeometry args={[0.04, 1.1, 0.04]} />
          <meshStandardMaterial color="#00F5D4" emissive="#00F5D4" emissiveIntensity={0.6} />
        </mesh>
        {/* Beacon light on crane tip */}
        <mesh position={[0.95, 0.62, 0]}>
          <sphereGeometry args={[0.05, 12, 12]} />
          <meshStandardMaterial color="#EF4444" emissive="#EF4444" emissiveIntensity={1.5} />
        </mesh>
      </group>
    </group>
  );
}

// ─── 3D Model 3: Heavy Infrastructure Cable-Stayed Cantilever Bridge ────
function InfraBridgeModel({ wireframe }: { wireframe: boolean }) {
  const groupRef = useRef<THREE.Group>(null);

  const { pylonLines, stayCables } = useMemo(() => {
    const ptsPylon: THREE.Vector3[] = [];
    const ptsStays: THREE.Vector3[] = [];

    // Dual H-Frame Pylon Towers
    const pylonH = 3.2;
    const towerX = 0;
    ptsPylon.push(
      new THREE.Vector3(towerX, -1.5, -0.6), new THREE.Vector3(towerX, pylonH - 1.5, -0.2),
      new THREE.Vector3(towerX, -1.5, 0.6), new THREE.Vector3(towerX, pylonH - 1.5, 0.2),
      // Cross strut
      new THREE.Vector3(towerX, 0.5, -0.4), new THREE.Vector3(towerX, 0.5, 0.4),
      new THREE.Vector3(towerX, 1.3, -0.3), new THREE.Vector3(towerX, 1.3, 0.3)
    );

    // Cable Stays radiating from tower top to deck
    const deckLen = 4.0;
    const numCables = 7;
    for (let c = 1; c <= numCables; c++) {
      const dx = (c / (numCables + 1)) * (deckLen / 2);
      const ty = pylonH - 1.5 - (c * 0.16);

      // Positive side
      ptsStays.push(new THREE.Vector3(towerX, ty, 0), new THREE.Vector3(dx, -0.4, 0.45));
      ptsStays.push(new THREE.Vector3(towerX, ty, 0), new THREE.Vector3(dx, -0.4, -0.45));
      // Negative side
      ptsStays.push(new THREE.Vector3(towerX, ty, 0), new THREE.Vector3(-dx, -0.4, 0.45));
      ptsStays.push(new THREE.Vector3(towerX, ty, 0), new THREE.Vector3(-dx, -0.4, -0.45));
    }

    return {
      pylonLines: new THREE.BufferGeometry().setFromPoints(ptsPylon),
      stayCables: new THREE.BufferGeometry().setFromPoints(ptsStays),
    };
  }, []);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.14;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Main Bridge Deck Runway */}
      <mesh position={[0, -0.45, 0]}>
        <boxGeometry args={[4.2, 0.12, 1.1]} />
        <meshStandardMaterial
          color="#0B203E"
          emissive="#00A6CE"
          emissiveIntensity={0.25}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* High-Tech Runway Edge Lights */}
      {[-0.5, 0.5].map((z, idx) => (
        <mesh key={idx} position={[0, -0.38, z]}>
          <boxGeometry args={[4.2, 0.02, 0.04]} />
          <meshStandardMaterial color="#00F5D4" emissive="#00F5D4" emissiveIntensity={0.8} />
        </mesh>
      ))}

      {/* Cable Stay Lines */}
      <lineSegments geometry={stayCables}>
        <lineBasicMaterial color={wireframe ? '#38BDF8' : '#00A6CE'} linewidth={1.5} transparent opacity={0.7} />
      </lineSegments>

      {/* Main Pylon Towers */}
      <lineSegments geometry={pylonLines}>
        <lineBasicMaterial color="#38BDF8" linewidth={2.5} />
      </lineSegments>

      {/* Substructure Concrete Pier */}
      <mesh position={[0, -1.1, 0]}>
        <cylinderGeometry args={[0.35, 0.5, 1.2, 16]} />
        <meshStandardMaterial color="#07172E" metalness={0.9} roughness={0.3} />
      </mesh>
    </group>
  );
}

// ─── 3D Model 4: High-Speed Transit Hyperloop Guideway Module ───────────
function MobilityHyperloopModel({ wireframe }: { wireframe: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const podRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.16;
    }
    if (podRef.current) {
      const t = clock.getElapsedTime() * 2.2;
      podRef.current.position.x = Math.sin(t) * 1.3;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Aerodynamic Hyperloop Pod Capsule */}
      <mesh ref={podRef} position={[0, 0.1, 0]}>
        <capsuleGeometry args={[0.26, 1.2, 16, 32]} />
        <meshStandardMaterial
          color="#F8FAFC"
          emissive="#38BDF8"
          emissiveIntensity={0.4}
          metalness={0.9}
          roughness={0.1}
          wireframe={wireframe}
        />
      </mesh>

      {/* Magnetic Levitation Guide Rails */}
      {[-0.32, 0.32].map((z, idx) => (
        <mesh key={idx} position={[0, -0.22, z]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.04, 0.04, 4.0, 16]} />
          <meshStandardMaterial color="#00F5D4" emissive="#00F5D4" emissiveIntensity={0.8} />
        </mesh>
      ))}

      {/* Elevated Guideway Ring Stations */}
      {[-1.4, -0.7, 0, 0.7, 1.4].map((x, idx) => (
        <group key={idx} position={[x, 0.1, 0]}>
          {/* Circular Tubular Pylon Ring */}
          <mesh rotation={[0, Math.PI / 2, 0]}>
            <torusGeometry args={[0.68, 0.05, 16, 32]} />
            <meshStandardMaterial
              color="#0B203E"
              emissive="#00A6CE"
              emissiveIntensity={0.3}
              metalness={0.8}
            />
          </mesh>
          {/* Ground Support Column */}
          <mesh position={[0, -0.9, 0]}>
            <cylinderGeometry args={[0.08, 0.12, 1.2, 16]} />
            <meshStandardMaterial color="#07172E" metalness={0.9} roughness={0.3} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// ─── 3D Model 5: Cyber Data Tesseract / Telemetry Cube ──────────────────
function TechTesseractModel({ wireframe }: { wireframe: boolean }) {
  const outerRingRef = useRef<THREE.Group>(null);
  const midRingRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (outerRingRef.current) outerRingRef.current.rotation.x = t * 0.4;
    if (midRingRef.current) midRingRef.current.rotation.y = t * 0.55;
    if (coreRef.current) {
      coreRef.current.rotation.z = t * 0.8;
      coreRef.current.rotation.x = t * 0.3;
    }
  });

  return (
    <group>
      {/* Outer Gimbal Ring */}
      <group ref={outerRingRef}>
        <mesh>
          <torusGeometry args={[1.5, 0.04, 16, 64]} />
          <meshStandardMaterial color="#38BDF8" emissive="#00A6CE" emissiveIntensity={0.5} />
        </mesh>
      </group>

      {/* Middle Orthogonal Gimbal Ring */}
      <group ref={midRingRef}>
        <mesh>
          <torusGeometry args={[1.2, 0.035, 16, 64]} />
          <meshStandardMaterial color="#00F5D4" emissive="#00F5D4" emissiveIntensity={0.6} />
        </mesh>
      </group>

      {/* Central Rotating Hypercube Wireframe */}
      <mesh ref={coreRef}>
        <octahedronGeometry args={[0.7, 0]} />
        <meshStandardMaterial
          color="#07172E"
          emissive="#38BDF8"
          emissiveIntensity={0.8}
          wireframe={wireframe}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      {/* Laser Datum Crosshairs */}
      {[[2.2, 0, 0], [-2.2, 0, 0], [0, 2.2, 0], [0, -2.2, 0]].map((pos, idx) => (
        <mesh key={idx} position={pos as [number, number, number]}>
          <sphereGeometry args={[0.04, 12, 12]} />
          <meshStandardMaterial color="#38BDF8" emissive="#38BDF8" emissiveIntensity={1.2} />
        </mesh>
      ))}
    </group>
  );
}

// ─── 3D Model 6: Global Talent Neural Constellation ─────────────────────
function StaffingConstellationModel({ wireframe }: { wireframe: boolean }) {
  const groupRef = useRef<THREE.Group>(null);

  const { nodes, connections } = useMemo(() => {
    const nodePts: [number, number, number][] = [];
    const connPts: THREE.Vector3[] = [];
    const count = 38;

    for (let i = 0; i < count; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 1.35 + Math.random() * 0.35;
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      nodePts.push([x, y, z]);
    }

    // Connect nearby nodes
    for (let i = 0; i < count; i++) {
      for (let j = i + 1; j < count; j++) {
        const dx = nodePts[i][0] - nodePts[j][0];
        const dy = nodePts[i][1] - nodePts[j][1];
        const dz = nodePts[i][2] - nodePts[j][2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (dist < 1.1) {
          connPts.push(
            new THREE.Vector3(...nodePts[i]),
            new THREE.Vector3(...nodePts[j])
          );
        }
      }
    }

    return {
      nodes: nodePts,
      connections: new THREE.BufferGeometry().setFromPoints(connPts),
    };
  }, []);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.2;
      groupRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.1) * 0.15;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Central Sovereign Core */}
      <mesh>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial
          color="#0B203E"
          emissive="#00A6CE"
          emissiveIntensity={0.6}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>

      {/* Synaptic Connection Struts */}
      <lineSegments geometry={connections}>
        <lineBasicMaterial color={wireframe ? '#38BDF8' : '#00A6CE'} linewidth={1.5} transparent opacity={0.65} />
      </lineSegments>

      {/* Talent Nodes */}
      {nodes.map((pos, idx) => (
        <mesh key={idx} position={pos}>
          <sphereGeometry args={[0.045, 12, 12]} />
          <meshStandardMaterial
            color={idx % 4 === 0 ? '#00F5D4' : '#38BDF8'}
            emissive={idx % 4 === 0 ? '#00F5D4' : '#00A6CE'}
            emissiveIntensity={0.8}
          />
        </mesh>
      ))}
    </group>
  );
}

// ─── Camera & Interaction Rig ───────────────────────────────────────────
function SceneContainer({
  sector,
  wireframe,
  autoRotate,
}: {
  sector: string;
  wireframe: boolean;
  autoRotate: boolean;
}) {
  const controlsRef = useRef<THREE.Group>(null);
  const isDragging = useRef(false);
  const prevMouse = useRef({ x: 0, y: 0 });
  const rotVel = useRef({ x: 0, y: 0 });

  useFrame(() => {
    if (controlsRef.current && !isDragging.current && autoRotate) {
      controlsRef.current.rotation.y += 0.005;
    }
    // Damp inertia
    if (controlsRef.current && !isDragging.current) {
      controlsRef.current.rotation.y += rotVel.current.x;
      controlsRef.current.rotation.x += rotVel.current.y;
      rotVel.current.x *= 0.92;
      rotVel.current.y *= 0.92;
    }
  });

  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    isDragging.current = true;
    prevMouse.current = { x: e.nativeEvent.clientX, y: e.nativeEvent.clientY };
  };

  const handlePointerMove = (e: ThreeEvent<PointerEvent>) => {
    if (!isDragging.current || !controlsRef.current) return;
    const dx = (e.nativeEvent.clientX - prevMouse.current.x) * 0.01;
    const dy = (e.nativeEvent.clientY - prevMouse.current.y) * 0.01;
    controlsRef.current.rotation.y += dx;
    controlsRef.current.rotation.x += dy;
    rotVel.current = { x: dx, y: dy };
    prevMouse.current = { x: e.nativeEvent.clientX, y: e.nativeEvent.clientY };
  };

  const handlePointerUp = () => {
    isDragging.current = false;
  };

  return (
    <>
      <ambientLight intensity={0.65} color="#E0F2FE" />
      <directionalLight position={[5, 8, 5]} intensity={1.8} color="#FFFFFF" />
      <pointLight position={[-4, -3, -4]} intensity={1.2} color="#00A6CE" />
      <pointLight position={[0, 4, 0]} intensity={1.5} color="#38BDF8" />

      <group
        ref={controlsRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        {sector === 'power' && <PowerPylonModel wireframe={wireframe} />}
        {sector === 'steel' && <DiagridTowerModel wireframe={wireframe} />}
        {sector === 'infra' && <InfraBridgeModel wireframe={wireframe} />}
        {sector === 'mobility' && <MobilityHyperloopModel wireframe={wireframe} />}
        {sector === 'tech' && <TechTesseractModel wireframe={wireframe} />}
        {sector === 'staffing' && <StaffingConstellationModel wireframe={wireframe} />}
        {/* Fallbacks */}
        {sector === 'fm' && <DiagridTowerModel wireframe={wireframe} />}
        {sector === 'access' && <PowerPylonModel wireframe={wireframe} />}
      </group>
    </>
  );
}

// ─── Main BIM Hologram Stage Component ──────────────────────────────────
export default function BimHologramStage({
  sector = 'power',
  title = '400kV Transmission Matrix',
  code = 'EHV-400',
}: {
  sector: string;
  title: string;
  code: string;
}) {
  const [wireframe, setWireframe] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);

  return (
    <div className="relative w-full h-[380px] sm:h-[440px] rounded-2xl overflow-hidden bg-gradient-to-b from-[#051020] via-[#07172E] to-[#040C1A] border border-cyan-500/30 shadow-[0_15px_45px_rgba(0,0,0,0.8)]">
      {/* HUD Corner Precision Brackets */}
      <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-cyan-400 pointer-events-none z-20" />
      <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-cyan-400 pointer-events-none z-20" />
      <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-cyan-400 pointer-events-none z-20" />
      <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-cyan-400 pointer-events-none z-20" />

      {/* Cyber Background Radar Grid Overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20 z-10"
        style={{
          backgroundImage:
            'radial-gradient(circle at 50% 50%, rgba(56,189,248,0.18) 0%, transparent 65%), linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)',
          backgroundSize: '100% 100%, 36px 36px, 36px 36px',
        }}
      />

      {/* Top HUD Telemetry Bar */}
      <div className="absolute top-4 left-5 right-5 flex items-center justify-between z-20 pointer-events-none">
        <div className="flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="font-mono text-[11px] font-bold text-cyan-300 tracking-wider">
            [ 3D BIM // {code} ]
          </span>
          <span className="hidden sm:inline font-mono text-[10px] text-slate-400">
            · {title.toUpperCase()}
          </span>
        </div>
        <div className="flex items-center gap-1.5 pointer-events-auto">
          {/* Wireframe Toggle */}
          <button
            onClick={() => setWireframe(!wireframe)}
            className={`p-1.5 rounded-lg border text-[10px] font-mono transition-all cursor-pointer ${
              wireframe
                ? 'bg-cyan-400 text-slate-950 border-cyan-300 shadow-[0_0_10px_rgba(56,189,248,0.5)]'
                : 'bg-slate-900/80 text-slate-300 border-white/10 hover:border-cyan-400/50'
            }`}
            title="Toggle Wireframe CAD Mode"
          >
            <Layers size={13} />
          </button>
          {/* Auto-Rotation Toggle */}
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`p-1.5 rounded-lg border text-[10px] font-mono transition-all cursor-pointer ${
              autoRotate
                ? 'bg-cyan-400 text-slate-950 border-cyan-300 shadow-[0_0_10px_rgba(56,189,248,0.5)]'
                : 'bg-slate-900/80 text-slate-300 border-white/10 hover:border-cyan-400/50'
            }`}
            title="Toggle 360 Auto Orbit"
          >
            <Rotate3D size={13} />
          </button>
        </div>
      </div>

      {/* Interactive 3D Canvas */}
      <div className="w-full h-full cursor-grab active:cursor-grabbing">
        <Suspense fallback={<div className="w-full h-full flex items-center justify-center text-cyan-400 font-mono text-xs">INITIALIZING 3D BIM MATRIX...</div>}>
          <Canvas
            camera={{ position: [0, 0.5, 4.8], fov: 42, near: 0.1, far: 50 }}
            dpr={[1, 1.5]}
            gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          >
            <SceneContainer sector={sector} wireframe={wireframe} autoRotate={autoRotate} />
          </Canvas>
        </Suspense>
      </div>

      {/* Bottom Telemetry & Navigation Instructions */}
      <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between px-3.5 py-1.5 rounded-xl bg-slate-950/85 backdrop-blur-md border border-cyan-500/25 z-20 pointer-events-none">
        <div className="flex items-center gap-2 text-[10px] font-mono text-cyan-300">
          <Activity size={12} className="text-cyan-400 animate-pulse" />
          <span>REAL-TIME 3D SPATIAL TELEMETRY</span>
        </div>
        <div className="text-[10px] font-mono text-slate-400 tracking-wider">
          [ CLICK & DRAG 360° TO INSPECT ]
        </div>
      </div>
    </div>
  );
}

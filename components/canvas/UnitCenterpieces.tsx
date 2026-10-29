'use client';

import { useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Hero centrepieces for the eight business-unit pages. Each one replaces the signature tower in the
 * cinematic city and sits at the same spot, so the camera framing and scroll flight stay identical.
 */

export type UnitGeometry =
  | 'constellation'
  | 'torus'
  | 'viaduct'
  | 'capsule'
  | 'truss'
  | 'datacube'
  | 'building'
  | 'scaffold';

type Props = { color: string; day: boolean };

const UP = new THREE.Vector3(0, 1, 0);

// Brighter-than-white copy of a colour so it blooms
function glow(color: string, k = 2.4) {
  return new THREE.Color(color).multiplyScalar(k);
}

function Chrome({ day, color }: { day: boolean; color?: string }) {
  return (
    <meshPhysicalMaterial
      color={color ?? (day ? '#9db7d2' : '#b9c8d8')}
      metalness={1}
      roughness={0.14}
      clearcoat={1}
      clearcoatRoughness={0.06}
      envMapIntensity={day ? 1.2 : 2.2}
    />
  );
}

function Steel({ day }: { day: boolean }) {
  // Night steel stays light enough to read against the dark skyline
  return <meshStandardMaterial color={day ? '#4b5b6d' : '#7d8fa6'} metalness={0.85} roughness={0.3} envMapIntensity={day ? 1.4 : 2} />;
}

// ─── Instanced cylinders between point pairs (lattices, scaffolds, stays) ───
function Struts({
  segments,
  radius,
  children,
}: {
  segments: [THREE.Vector3, THREE.Vector3][];
  radius: number;
  children: React.ReactNode;
}) {
  const ref = useRef<THREE.InstancedMesh>(null);

  useLayoutEffect(() => {
    if (!ref.current) return;
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const s = new THREE.Vector3();
    const mid = new THREE.Vector3();
    const dir = new THREE.Vector3();
    segments.forEach(([a, b], i) => {
      dir.subVectors(b, a);
      const len = dir.length();
      q.setFromUnitVectors(UP, dir.normalize());
      mid.addVectors(a, b).multiplyScalar(0.5);
      s.set(radius, len, radius);
      m.compose(mid, q, s);
      ref.current!.setMatrixAt(i, m);
    });
    ref.current.instanceMatrix.needsUpdate = true;
  }, [segments, radius]);

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, segments.length]} castShadow>
      <cylinderGeometry args={[1, 1, 1, 6]} />
      {children}
    </instancedMesh>
  );
}

const v = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);

// ─── 01 STAFFING: a living helix of talent nodes around a chrome spine ───
function Constellation({ color, day }: Props) {
  const group = useRef<THREE.Group>(null);
  const { nodes, lines } = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    const N = 84;
    for (let i = 0; i < N; i++) {
      const t = i / N;
      const a = t * Math.PI * 7;
      const r = 2.8 - t * 1.2;
      pts.push(v(Math.cos(a) * r, 0.6 + t * 14, Math.sin(a) * r));
    }
    const seg: THREE.Vector3[] = [];
    for (let i = 0; i < N - 1; i++) seg.push(pts[i], pts[i + 1]);
    for (let i = 0; i < N - 12; i += 3) seg.push(pts[i], pts[i + 12]);
    return { nodes: pts, lines: new THREE.BufferGeometry().setFromPoints(seg) };
  }, []);

  useFrame(({ clock }) => {
    if (group.current) group.current.rotation.y = clock.getElapsedTime() * 0.12;
  });

  return (
    <group ref={group}>
      <mesh position={[0, 7.5, 0]} castShadow>
        <cylinderGeometry args={[0.28, 0.5, 15, 24]} />
        <Chrome day={day} />
      </mesh>
      {nodes.map((p, i) => (
        <mesh key={i} position={p} castShadow>
          <sphereGeometry args={[i % 4 === 0 ? 0.24 : 0.15, 20, 20]} />
          {i % 4 === 0 ? <meshBasicMaterial color={glow(color, 2.2)} toneMapped={false} /> : <Chrome day={day} />}
        </mesh>
      ))}
      <lineSegments geometry={lines}>
        <lineBasicMaterial color={color} transparent opacity={day ? 0.7 : 0.55} />
      </lineSegments>
    </group>
  );
}

// ─── 02 POWER: 400kV lattice pylon with live catenary cables and energy pulses ───
function Pylon({ color, day }: Props) {
  const pulses = useRef<THREE.Group>(null);
  const { segs, cables } = useMemo(() => {
    const s: [THREE.Vector3, THREE.Vector3][] = [];
    const w0 = 2.2, w1 = 0.5, h = 15;
    const levels = [0, 3, 6, 8.5, 11, 13, h];
    const w = (y: number) => w0 + (w1 - w0) * (y / h);
    const corners = [[1, 1], [1, -1], [-1, -1], [-1, 1]];
    corners.forEach(([cx, cz]) => s.push([v(cx * w0, 0, cz * w0), v(cx * w1, h, cz * w1)]));
    for (let i = 0; i < levels.length - 1; i++) {
      const ya = levels[i], yb = levels[i + 1], wa = w(ya), wb = w(yb);
      for (let c = 0; c < 4; c++) {
        const [ax, az] = corners[c];
        const [bx, bz] = corners[(c + 1) % 4];
        s.push([v(ax * wa, ya, az * wa), v(bx * wa, ya, bz * wa)]);
        s.push([v(ax * wa, ya, az * wa), v(bx * wb, yb, bz * wb)]);
        s.push([v(bx * wa, ya, bz * wa), v(ax * wb, yb, az * wb)]);
      }
    }
    // Cross-arms
    const arms = [9.2, 12.2];
    arms.forEach((y, k) => {
      const span = k ? 3.6 : 4.8;
      s.push([v(-span, y, 0), v(span, y, 0)]);
      s.push([v(-span, y, 0), v(0, y + 1.2, 0)]);
      s.push([v(span, y, 0), v(0, y + 1.2, 0)]);
    });
    // Catenary cables sweeping out of frame on both sides
    const c: THREE.CatmullRomCurve3[] = [];
    arms.forEach((y, k) => {
      const span = k ? 3.6 : 4.8;
      [-1, 1].forEach((side) => {
        const x0 = side * span;
        c.push(
          new THREE.CatmullRomCurve3([
            v(x0, y - 0.6, 0),
            v(x0 + side * 9, y - 3.2, side * 3),
            v(x0 + side * 24, y - 1.2, side * 10),
          ])
        );
      });
    });
    return { segs: s, cables: c };
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    pulses.current?.children.forEach((m, i) => {
      const curve = cables[i % cables.length];
      const u = (t * 0.22 + i * 0.37) % 1;
      curve.getPointAt(u, m.position);
    });
  });

  return (
    <group>
      <Struts segments={segs} radius={0.07}>
        <Steel day={day} />
      </Struts>
      {cables.map((curve, i) => (
        <mesh key={i}>
          <tubeGeometry args={[curve, 64, 0.035, 6, false]} />
          <meshBasicMaterial color={glow(color, day ? 1.4 : 2)} toneMapped={false} />
        </mesh>
      ))}
      <group ref={pulses}>
        {Array.from({ length: 8 }).map((_, i) => (
          <mesh key={i}>
            <sphereGeometry args={[0.16, 16, 16]} />
            <meshBasicMaterial color={glow('#ffffff', 3)} toneMapped={false} />
          </mesh>
        ))}
      </group>
      {/* Insulator glow on the arm tips */}
      {[[-4.8, 9.2], [4.8, 9.2], [-3.6, 12.2], [3.6, 12.2]].map(([x, y], i) => (
        <mesh key={i} position={[x, y - 0.35, 0]}>
          <cylinderGeometry args={[0.12, 0.12, 0.7, 12]} />
          <meshBasicMaterial color={glow(color, 2.6)} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

// ─── 03 INFRA: cable-stayed bridge spanning the camera's flight path ───
function Bridge({ color, day }: Props) {
  const lights = useRef<THREE.InstancedMesh>(null);
  const { stays, deckLen } = useMemo(() => {
    const s: [THREE.Vector3, THREE.Vector3][] = [];
    const top = v(0, 16, 0);
    for (let i = 1; i <= 9; i++) {
      s.push([top.clone().add(v(0, -i * 0.25, 0.3)), v(i * 2.6, 6.2, 0.3)]);
      s.push([top.clone().add(v(0, -i * 0.25, -0.3)), v(-i * 2.6, 6.2, -0.3)]);
    }
    return { stays: s, deckLen: 52 };
  }, []);

  useLayoutEffect(() => {
    if (!lights.current) return;
    const m = new THREE.Matrix4();
    for (let i = 0; i < 26; i++) {
      m.setPosition(-deckLen / 2 + 1 + i * 2, 6.55, 1.25);
      lights.current.setMatrixAt(i, m);
      m.setPosition(-deckLen / 2 + 1 + i * 2, 6.55, -1.25);
      lights.current.setMatrixAt(26 + i, m);
    }
    lights.current.instanceMatrix.needsUpdate = true;
  }, [deckLen]);

  return (
    // Rotated so the deck crosses the corridor the camera flies down
    <group rotation={[0, Math.PI / 2 - 0.25, 0]} position={[-7, 0, -6]}>
      <mesh position={[0, 6, 0]} castShadow receiveShadow>
        <boxGeometry args={[deckLen, 0.7, 3]} />
        <meshStandardMaterial color={day ? '#dfe7ef' : '#1b2533'} metalness={0.4} roughness={0.35} />
      </mesh>
      {/* A-frame pylon */}
      {[-1, 1].map((side) => (
        <mesh key={side} position={[0, 8, side * 1.3]} rotation={[side * -0.08, 0, 0]} castShadow>
          <boxGeometry args={[0.9, 16.5, 0.9]} />
          <Chrome day={day} />
        </mesh>
      ))}
      <mesh position={[0, 16, 0]}>
        <boxGeometry args={[0.9, 0.9, 2.6]} />
        <Chrome day={day} />
      </mesh>
      {/* Piers */}
      {[-20, -10, 10, 20].map((x) => (
        <mesh key={x} position={[x, 2.9, 0]} castShadow>
          <cylinderGeometry args={[0.45, 0.6, 5.8, 16]} />
          <meshStandardMaterial color={day ? '#c9d3de' : '#16202c'} metalness={0.3} roughness={0.5} />
        </mesh>
      ))}
      <Struts segments={stays} radius={0.03}>
        <meshBasicMaterial color={glow(color, day ? 1.2 : 1.8)} toneMapped={false} />
      </Struts>
      <instancedMesh ref={lights} args={[undefined, undefined, 52]}>
        <boxGeometry args={[0.5, 0.06, 0.06]} />
        <meshBasicMaterial color={glow('#ffffff', 2.4)} toneMapped={false} />
      </instancedMesh>
    </group>
  );
}

// ─── 04 MOBILITY: elevated expressway ribbon with live traffic light trails ───
function Expressway({ color, day }: Props) {
  const trails = useRef<THREE.InstancedMesh>(null);
  const COUNT = 110;

  const { curve, road, piers } = useMemo(() => {
    // Sweeps in low from the right of the lens (deck below eye level so the traffic reads),
    // then climbs and curves away deep into the city
    const c = new THREE.CatmullRomCurve3([
      v(30, 1.2, 16),
      v(16, 1.6, 6),
      v(9, 2.2, -6),
      v(6, 3.4, -20),
      v(-4, 5, -36),
      v(-24, 6.5, -56),
      v(-44, 7, -72),
    ]);
    // Flat ribbon: left/right offsets along the horizontal normal of the curve
    const segs = 220;
    const pos: number[] = [];
    const idx: number[] = [];
    const tan = new THREE.Vector3();
    const side = new THREE.Vector3();
    for (let i = 0; i <= segs; i++) {
      const u = i / segs;
      const p = c.getPointAt(u);
      c.getTangentAt(u, tan);
      side.crossVectors(tan, UP).normalize().multiplyScalar(3);
      pos.push(p.x + side.x, p.y, p.z + side.z, p.x - side.x, p.y, p.z - side.z);
      if (i < segs) {
        const a = i * 2;
        idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.setIndex(idx);
    g.computeVertexNormals();
    const pr: THREE.Vector3[] = [];
    for (let i = 1; i < 12; i++) pr.push(c.getPointAt(i / 12));
    return { curve: c, road: g, piers: pr };
  }, []);

  const offsets = useMemo(() => Array.from({ length: COUNT }, (_, i) => ({ u: i / COUNT, lane: ((i % 4) - 1.5) * 1.3, speed: 0.022 + (i % 5) * 0.004 })), []);

  // Per-frame scratch objects, allocated once (110 cars × 60 fps would otherwise churn the GC)
  const scratch = useMemo(
    () => ({
      m: new THREE.Matrix4(),
      q: new THREE.Quaternion(),
      p: new THREE.Vector3(),
      tan: new THREE.Vector3(),
      side: new THREE.Vector3(),
      lift: v(0, 0.18, 0),
      size: v(2.4, 0.1, 0.16),
      xAxis: v(1, 0, 0),
    }),
    []
  );

  // Headlights / tail-lights never change, so colour the instances once
  useLayoutEffect(() => {
    if (!trails.current) return;
    const head = glow('#ffffff', 2.6);
    const tail = glow('#ff4d5a', 2.4);
    offsets.forEach((o, i) => trails.current!.setColorAt(i, o.lane > 0 ? head : tail));
    if (trails.current.instanceColor) trails.current.instanceColor.needsUpdate = true;
  }, [offsets]);

  useFrame(({ clock }) => {
    if (!trails.current) return;
    const t = clock.getElapsedTime();
    const { m, q, p, tan, side, lift, size, xAxis } = scratch;
    offsets.forEach((o, i) => {
      // Two lanes each way: outbound lanes run forward, inbound run back
      const dirSign = o.lane > 0 ? 1 : -1;
      const u = (((o.u + dirSign * t * o.speed) % 1) + 1) % 1;
      curve.getPointAt(u, p);
      curve.getTangentAt(u, tan);
      side.crossVectors(tan, UP).normalize().multiplyScalar(o.lane);
      q.setFromUnitVectors(xAxis, tan);
      m.compose(p.add(side).add(lift), q, size);
      trails.current!.setMatrixAt(i, m);
    });
    trails.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <group position={[-8.7, 0, 13.9]}>
      <mesh geometry={road} receiveShadow castShadow>
        <meshStandardMaterial color={day ? '#cfd8e2' : '#121a25'} metalness={0.3} roughness={0.55} side={THREE.DoubleSide} />
      </mesh>
      {/* Edge light lines */}
      <mesh>
        <tubeGeometry args={[curve, 220, 0.03, 4, false]} />
        <meshBasicMaterial color={glow(color, 2)} toneMapped={false} />
      </mesh>
      {piers.map((p, i) => (
        <mesh key={i} position={[p.x, p.y / 2 - 0.2, p.z]} castShadow>
          <cylinderGeometry args={[0.45, 0.6, p.y, 14]} />
          <Chrome day={day} />
        </mesh>
      ))}
      <instancedMesh ref={trails} args={[undefined, undefined, COUNT]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>
    </group>
  );
}

// ─── 05 STEEL: rising space-frame tower with a slewing tower crane and weld sparks ───
function SteelFrame({ color, day }: Props) {
  const jib = useRef<THREE.Group>(null);
  const sparks = useRef<THREE.Points>(null);

  const { frame, mast } = useMemo(() => {
    const s: [THREE.Vector3, THREE.Vector3][] = [];
    const W = 2.4, H = 13, step = 1.6;
    const cols = [[-W, -W], [W, -W], [W, W], [-W, W], [0, -W], [0, W], [-W, 0], [W, 0]];
    cols.forEach(([x, z]) => s.push([v(x, 0, z), v(x, H, z)]));
    for (let y = step; y <= H + 0.01; y += step) {
      const ring = [[-W, -W], [W, -W], [W, W], [-W, W]];
      for (let i = 0; i < 4; i++) {
        const [ax, az] = ring[i], [bx, bz] = ring[(i + 1) % 4];
        s.push([v(ax, y, az), v(bx, y, bz)]);
        if (y > step) s.push([v(ax, y - step, az), v(bx, y, bz)]);
      }
      s.push([v(-W, y, 0), v(W, y, 0)]);
      s.push([v(0, y, -W), v(0, y, W)]);
    }
    const m: [THREE.Vector3, THREE.Vector3][] = [];
    const mw = 0.45, mh = 19;
    const mc = [[-mw, -mw], [mw, -mw], [mw, mw], [-mw, mw]];
    mc.forEach(([x, z]) => m.push([v(x, 0, z), v(x, mh, z)]));
    for (let y = 0.9; y < mh; y += 0.9) {
      for (let i = 0; i < 4; i++) {
        const [ax, az] = mc[i], [bx, bz] = mc[(i + 1) % 4];
        m.push([v(ax, y - 0.9, az), v(bx, y, bz)]);
      }
    }
    return { frame: s, mast: m };
  }, []);

  const sparkGeo = useMemo(() => {
    const pos = new Float32Array(160 * 3);
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    return g;
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (jib.current) jib.current.rotation.y = Math.sin(t * 0.18) * 0.9;
    const attr = sparkGeo.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < attr.count; i++) {
      const life = (t * 1.6 + i * 0.137) % 1;
      const a = i * 2.4;
      attr.setXYZ(i, 2.4 + Math.cos(a) * life * 0.9, 11.2 - life * life * 2.4, -2.4 + Math.sin(a) * life * 0.9);
    }
    attr.needsUpdate = true;
    if (sparks.current) (sparks.current.material as THREE.PointsMaterial).opacity = 0.6 + Math.sin(t * 23) * 0.4;
  });

  return (
    <group>
      <Struts segments={frame} radius={0.11}>
        <Steel day={day} />
      </Struts>
      <group position={[-5.5, 0, 1]}>
        <Struts segments={mast} radius={0.05}>
          <meshStandardMaterial color={color} metalness={0.5} roughness={0.4} />
        </Struts>
        <group ref={jib} position={[0, 19, 0]}>
          <mesh position={[6, 0.3, 0]} castShadow>
            <boxGeometry args={[15, 0.5, 0.6]} />
            <meshStandardMaterial color={color} metalness={0.5} roughness={0.4} />
          </mesh>
          <mesh position={[-3.5, 0.3, 0]}>
            <boxGeometry args={[4, 0.5, 0.7]} />
            <meshStandardMaterial color={color} metalness={0.5} roughness={0.4} />
          </mesh>
          <mesh position={[-4.8, -0.5, 0]}>
            <boxGeometry args={[1.4, 1.2, 1.2]} />
            <Steel day={day} />
          </mesh>
          <mesh position={[10, -3.5, 0]}>
            <cylinderGeometry args={[0.015, 0.015, 7.4, 4]} />
            <meshBasicMaterial color={day ? '#334155' : '#94a3b8'} />
          </mesh>
          <mesh position={[10, -7.4, 0]} castShadow>
            <boxGeometry args={[3.2, 0.32, 0.32]} />
            <Steel day={day} />
          </mesh>
        </group>
      </group>
      <points ref={sparks} geometry={sparkGeo}>
        <pointsMaterial size={0.09} color={glow('#ffb347', 3)} transparent toneMapped={false} depthWrite={false} blending={THREE.AdditiveBlending} />
      </points>
    </group>
  );
}

// ─── 06 TECH: glass data monolith with orbiting rings and rising data ───
function DataMonolith({ color, day }: Props) {
  const rings = useRef<THREE.Group>(null);
  const data = useRef<THREE.Points>(null);

  const { lattice, dataGeo } = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    const W = 1.3, H = 13;
    for (let y = 0.8; y < H; y += 0.8) {
      pts.push(v(-W, y, -W), v(W, y, -W), v(W, y, -W), v(W, y, W), v(W, y, W), v(-W, y, W), v(-W, y, W), v(-W, y, -W));
    }
    for (let i = -1; i <= 1; i++) pts.push(v(i * W * 0.66, 0.4, 0), v(i * W * 0.66, H, 0));
    const pos = new Float32Array(500 * 3);
    for (let i = 0; i < 500; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = 2.2 + Math.random() * 2.6;
      pos.set([Math.cos(a) * r, Math.random() * 16, Math.sin(a) * r], i * 3);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    return { lattice: new THREE.BufferGeometry().setFromPoints(pts), dataGeo: g };
  }, []);

  useFrame(({ clock }, delta) => {
    const t = clock.getElapsedTime();
    rings.current?.children.forEach((r, i) => {
      r.rotation.x = Math.PI / 2 + Math.sin(t * 0.4 + i) * 0.25;
      r.rotation.z = t * (0.3 + i * 0.12) * (i % 2 ? -1 : 1);
    });
    const attr = dataGeo.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < attr.count; i++) {
      let y = attr.getY(i) + delta * (0.8 + (i % 7) * 0.15);
      if (y > 16) y = 0;
      attr.setY(i, y);
    }
    attr.needsUpdate = true;
  });

  return (
    <group>
      <mesh position={[0, 6.6, 0]} castShadow>
        <boxGeometry args={[2.9, 13.2, 2.9]} />
        <meshPhysicalMaterial
          color={day ? '#bcd7ef' : '#0b1b30'}
          metalness={0.2}
          roughness={0.04}
          transparent
          opacity={day ? 0.55 : 0.6}
          clearcoat={1}
          envMapIntensity={day ? 1.4 : 2.4}
        />
      </mesh>
      <lineSegments geometry={lattice}>
        <lineBasicMaterial color={glow(color, 1.8)} toneMapped={false} transparent opacity={0.85} />
      </lineSegments>
      <mesh position={[0, 13.4, 0]}>
        <boxGeometry args={[3, 0.12, 3]} />
        <meshBasicMaterial color={glow(color, 2.4)} toneMapped={false} />
      </mesh>
      <group ref={rings} position={[0, 7, 0]}>
        {[3.2, 4, 4.8].map((r, i) => (
          <mesh key={i}>
            <torusGeometry args={[r, 0.025, 8, 160]} />
            <meshBasicMaterial color={glow(i === 1 ? '#ffffff' : color, 2)} toneMapped={false} />
          </mesh>
        ))}
      </group>
      <points ref={data} geometry={dataGeo}>
        <pointsMaterial size={0.07} color={glow(color, 2.2)} toneMapped={false} transparent depthWrite={false} />
      </points>
    </group>
  );
}

// ─── 07 FM: smart building under live diagnostic scan ───
function SmartBuilding({ color, day }: Props) {
  const scans = useRef<THREE.Group>(null);
  const panels = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    scans.current?.children.forEach((s, i) => {
      s.position.y = 0.4 + ((t * 1.4 + i * 4.6) % 14);
    });
    if (panels.current) {
      panels.current.rotation.y = t * 0.2;
      panels.current.children.forEach((p, i) => {
        p.position.y = 3 + i * 1.9 + Math.sin(t + i) * 0.25;
      });
    }
  });

  return (
    <group>
      <mesh position={[0, 7, 0]} castShadow receiveShadow>
        <boxGeometry args={[4.4, 14, 4.4]} />
        <meshPhysicalMaterial
          color={day ? '#6f8fb0' : '#0e1c2e'}
          metalness={0.9}
          roughness={0.1}
          clearcoat={1}
          envMapIntensity={day ? 1.3 : 2}
        />
      </mesh>
      {/* Floor slab edges */}
      {Array.from({ length: 13 }).map((_, i) => (
        <mesh key={i} position={[0, 1 + i * 1.05, 0]}>
          <boxGeometry args={[4.5, 0.05, 4.5]} />
          <meshBasicMaterial color={day ? '#e8f1fa' : '#7dd3fc'} transparent opacity={day ? 0.9 : 0.5} />
        </mesh>
      ))}
      <group ref={scans}>
        {[0, 1, 2].map((i) => (
          <mesh key={i} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[3.1, 3.2, 4, 1, Math.PI / 4]} />
            <meshBasicMaterial color={glow(color, 2.6)} toneMapped={false} side={THREE.DoubleSide} />
          </mesh>
        ))}
      </group>
      <group ref={panels}>
        {Array.from({ length: 6 }).map((_, i) => {
          const a = (i / 6) * Math.PI * 2;
          return (
            <mesh key={i} position={[Math.cos(a) * 4.6, 3 + i * 1.9, Math.sin(a) * 4.6]} rotation={[0, -a + Math.PI / 2, 0]}>
              <circleGeometry args={[0.55, 6]} />
              <meshBasicMaterial color={glow(color, 1.6)} toneMapped={false} transparent opacity={0.75} side={THREE.DoubleSide} />
            </mesh>
          );
        })}
      </group>
    </group>
  );
}

// ─── 08 ACCESS: multi-tier scaffold wrapping a tower, with a working hoist ───
function Scaffold({ color, day }: Props) {
  const hoist = useRef<THREE.Mesh>(null);
  const { tubes, boards } = useMemo(() => {
    const s: [THREE.Vector3, THREE.Vector3][] = [];
    const b: THREE.Vector3[] = [];
    const R = 3.4, H = 14, bay = 1.7, lift = 2;
    const perimeter: [number, number][] = [];
    for (let x = -R; x <= R + 0.01; x += bay) perimeter.push([x, -R], [x, R]);
    for (let z = -R + bay; z < R - 0.01; z += bay) perimeter.push([-R, z], [R, z]);
    perimeter.forEach(([x, z]) => s.push([v(x, 0, z), v(x, H, z)]));
    for (let y = lift; y <= H + 0.01; y += lift) {
      const ring = [[-R, -R], [R, -R], [R, R], [-R, R]];
      for (let i = 0; i < 4; i++) {
        const [ax, az] = ring[i], [bx, bz] = ring[(i + 1) % 4];
        s.push([v(ax, y, az), v(bx, y, bz)]);
        // Diagonal face bracing on alternating lifts
        if ((y / lift) % 2 === 1) s.push([v(ax, y - lift, az), v((ax + bx) / 2, y, (az + bz) / 2)]);
      }
      b.push(v(0, y, -R), v(0, y, R), v(-R, y, 0), v(R, y, 0));
    }
    return { tubes: s, boards: b };
  }, []);

  useFrame(({ clock }) => {
    if (hoist.current) hoist.current.position.y = 1 + (Math.sin(clock.getElapsedTime() * 0.35) * 0.5 + 0.5) * 11.5;
  });

  return (
    <group>
      <mesh position={[0, 7, 0]} castShadow receiveShadow>
        <boxGeometry args={[5, 14, 5]} />
        <meshStandardMaterial color={day ? '#d8e2ec' : '#1a2432'} metalness={0.25} roughness={0.6} />
      </mesh>
      <Struts segments={tubes} radius={0.05}>
        <meshStandardMaterial color={day ? '#9fb0c2' : '#8091a5'} metalness={0.95} roughness={0.28} />
      </Struts>
      {boards.map((p, i) => (
        <mesh key={i} position={p} rotation={[0, i % 4 >= 2 ? Math.PI / 2 : 0, 0]} castShadow>
          <boxGeometry args={[6.8, 0.08, 0.9]} />
          <meshStandardMaterial color={color} metalness={0.2} roughness={0.6} />
        </mesh>
      ))}
      {/* Hoist rail and car */}
      <mesh position={[4.3, 7.5, 0]}>
        <boxGeometry args={[0.2, 15, 0.2]} />
        <Steel day={day} />
      </mesh>
      <mesh ref={hoist} position={[4.9, 1, 0]} castShadow>
        <boxGeometry args={[1, 1.2, 1.2]} />
        <meshBasicMaterial color={glow(color, 1.8)} toneMapped={false} />
      </mesh>
    </group>
  );
}

const MAP: Record<UnitGeometry, (p: Props) => JSX.Element> = {
  constellation: Constellation,
  torus: Pylon,
  viaduct: Bridge,
  capsule: Expressway,
  truss: SteelFrame,
  datacube: DataMonolith,
  building: SmartBuilding,
  scaffold: Scaffold,
};

export default function UnitCenterpiece({ geometry, color, day }: Props & { geometry: UnitGeometry }) {
  const Piece = MAP[geometry];
  // Same anchor as the signature tower so camera framing and the base halo line up
  return (
    <group position={[7.5, 0, -12]} scale={0.86}>
      <Piece color={color} day={day} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[3.6, 3.68, 128]} />
        <meshBasicMaterial color={glow(color, 1.8)} toneMapped={false} />
      </mesh>
    </group>
  );
}

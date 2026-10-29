'use client';

import React, { useRef, useEffect } from 'react';

const NUM_PARTICLES = 3600;

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

// ─── Shape 0: Global Infrastructure & GCC Network ──────────────
function genGlobe(N: number): Float32Array {
  const o = new Float32Array(N * 3);
  const nSphere = Math.floor(N * 0.78);
  for (let k = 0; k < nSphere; k++) {
    const y = 1 - 2 * ((k + 0.5) / nSphere);
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const th = k * 2.399963; // Golden ratio angle
    o[k * 3] = Math.cos(th) * r * 0.95;
    o[k * 3 + 1] = y * 0.95;
    o[k * 3 + 2] = Math.sin(th) * r * 0.95;
  }
  // Orbital satellite rings
  for (let k = nSphere; k < N; k++) {
    const ring = k % 2;
    const a = rand(0, Math.PI * 2);
    const rad = 1.35 + ring * 0.18;
    const tilt = ring ? -0.45 : 0.4;
    o[k * 3] = Math.cos(a) * rad;
    o[k * 3 + 1] = Math.sin(a) * rad * Math.sin(tilt);
    o[k * 3 + 2] = Math.sin(a) * rad * Math.cos(tilt);
  }
  return o;
}

// ─── Helper: Sample points along 3D line segments ───────────────
function fromSegments(N: number, segs: number[][]): Float32Array {
  const lens = segs.map((q) => Math.hypot(q[3] - q[0], q[4] - q[1], q[5] - q[2]));
  const tot = lens.reduce((acc, l) => acc + l, 0);
  const o = new Float32Array(N * 3);
  let k = 0;

  for (let i = 0; i < segs.length; i++) {
    const cnt = Math.round((N * lens[i]) / tot);
    const q = segs[i];
    for (let j = 0; j < cnt && k < N; j++) {
      const t = Math.random();
      o[k * 3] = q[0] + (q[3] - q[0]) * t + rand(-0.012, 0.012);
      o[k * 3 + 1] = q[1] + (q[4] - q[1]) * t + rand(-0.012, 0.012);
      o[k * 3 + 2] = q[2] + (q[5] - q[2]) * t + rand(-0.012, 0.012);
      k++;
    }
  }

  while (k < N) {
    const q = segs[(Math.random() * segs.length) | 0];
    const t = Math.random();
    o[k * 3] = q[0] + (q[3] - q[0]) * t;
    o[k * 3 + 1] = q[1] + (q[4] - q[1]) * t;
    o[k * 3 + 2] = q[2] + (q[5] - q[2]) * t;
    k++;
  }
  return o;
}

// ─── Shape 1: High-Voltage Transmission Pylon & Grid ────────────
function genPylon(N: number): Float32Array {
  const S: number[][] = [];
  const w0 = 0.44;
  const w1 = 0.08;
  const yb = -1.1;
  const yt = 0.5;
  const lv = [-1.1, -0.6, -0.15, 0.2, 0.5];

  const W = (y: number) => w0 + (w1 - w0) * ((y - yb) / (yt - yb));

  // 4 Main corner legs
  const corners = [
    [1, 1],
    [1, -1],
    [-1, 1],
    [-1, -1],
  ];
  corners.forEach((c) => {
    S.push([c[0] * w0, yb, c[1] * w0, c[0] * w1, yt, c[1] * w1]);
  });

  // Horizontal perimeter ties at levels
  lv.forEach((y) => {
    const w = W(y);
    S.push([-w, y, -w, w, y, -w], [w, y, -w, w, y, w], [w, y, w, -w, y, w], [-w, y, w, -w, y, -w]);
  });

  // Cross braces between levels
  for (let i = 0; i < lv.length - 1; i++) {
    const ya = lv[i];
    const yb_ = lv[i + 1];
    const wa = W(ya);
    const wb = W(yb_);
    S.push(
      [-wa, ya, wa, wb, yb_, wb],
      [wa, ya, wa, -wb, yb_, wb],
      [-wa, ya, -wa, wb, yb_, -wb],
      [wa, ya, -wa, -wb, yb_, -wb]
    );
  }

  // Crossarms for high-voltage insulators
  S.push(
    [-1.0, 0.35, 0, 1.0, 0.35, 0],
    [-0.8, 0.05, 0, 0.8, 0.05, 0],
    [-1.0, 0.35, 0, 0, 0.5, 0],
    [1.0, 0.35, 0, 0, 0.5, 0],
    [-1.0, 0.35, 0, -1.0, 0.18, 0],
    [1.0, 0.35, 0, 1.0, 0.18, 0],
    [0, 0.5, 0, 0, 1.05, 0]
  );

  // Sagging transmission power cables
  const cable = (x0: number, y0: number, x1: number, y1: number, sag: number) => {
    for (let k = 0; k < 6; k++) {
      const u0 = k / 6;
      const u1 = (k + 1) / 6;
      S.push([
        lerp(x0, x1, u0),
        lerp(y0, y1, u0) - 4 * sag * u0 * (1 - u0),
        0,
        lerp(x0, x1, u1),
        lerp(y0, y1, u1) - 4 * sag * u1 * (1 - u1),
        0,
      ]);
    }
  };
  cable(1.0, 0.18, 2.2, -0.05, 0.2);
  cable(-1.0, 0.18, -2.2, -0.05, 0.2);
  cable(0.8, -0.15, 2.2, -0.32, 0.18);
  cable(-0.8, -0.15, -2.2, -0.32, 0.18);

  return fromSegments(N, S);
}

// ─── Shape 2: Structural Steel Diagrid Skyscraper ───────────────
function genDiagridTower(N: number): Float32Array {
  const S: number[][] = [];
  const floors = 7;
  const levels: number[] = [];
  for (let i = 0; i <= floors; i++) {
    levels.push(-1.1 + (i / floors) * 2.0);
  }

  const radiusAt = (y: number) => 0.85 - (y + 1.1) * 0.25;

  // Polygonal floor plates (octagonal)
  const sides = 8;
  for (let f = 0; f <= floors; f++) {
    const y = levels[f];
    const rad = radiusAt(y);
    for (let s = 0; s < sides; s++) {
      const a1 = (s / sides) * Math.PI * 2;
      const a2 = ((s + 1) / sides) * Math.PI * 2;
      S.push([Math.cos(a1) * rad, y, Math.sin(a1) * rad, Math.cos(a2) * rad, y, Math.sin(a2) * rad]);
    }
  }

  // Diagonal perimeter diagrid trusses
  for (let f = 0; f < floors; f++) {
    const y1 = levels[f];
    const y2 = levels[f + 1];
    const r1 = radiusAt(y1);
    const r2 = radiusAt(y2);
    for (let s = 0; s < sides; s++) {
      const a1 = (s / sides) * Math.PI * 2;
      const a2 = ((s + 1) / sides) * Math.PI * 2;
      // Zig-zag diagrid
      S.push([Math.cos(a1) * r1, y1, Math.sin(a1) * r1, Math.cos(a2) * r2, y2, Math.sin(a2) * r2]);
      S.push([Math.cos(a2) * r1, y1, Math.sin(a2) * r1, Math.cos(a1) * r2, y2, Math.sin(a1) * r2]);
    }
  }

  // Spire at crown
  const topY = levels[floors];
  S.push([0, topY, 0, 0, topY + 0.6, 0]);

  return fromSegments(N, S);
}

// ─── Shape 3: Strategic Tech Core & Data Tesseract ───────────────
function genTesseract(N: number): Float32Array {
  const S: number[][] = [];
  const c = [
    [-1, -1, -1],
    [1, -1, -1],
    [1, 1, -1],
    [-1, 1, -1],
    [-1, -1, 1],
    [1, -1, 1],
    [1, 1, 1],
    [-1, 1, 1],
  ];
  const E = [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 0],
    [4, 5],
    [5, 6],
    [6, 7],
    [7, 4],
    [0, 4],
    [1, 5],
    [2, 6],
    [3, 7],
  ];

  [0.82, 0.42].forEach((r) => {
    E.forEach((e) => {
      const a = c[e[0]];
      const b = c[e[1]];
      S.push([a[0] * r, a[1] * r, a[2] * r, b[0] * r, b[1] * r, b[2] * r]);
    });
  });

  c.forEach((v) => {
    S.push([v[0] * 0.82, v[1] * 0.82, v[2] * 0.82, v[0] * 0.42, v[1] * 0.42, v[2] * 0.42]);
  });

  return fromSegments(N, S);
}

// ─── Shaders for High-Fidelity Particle Rendering ────────────────
const VS = `
attribute vec3 aPosA;
attribute vec3 aPosB;
attribute vec3 aRandom;
attribute float aDelay;
attribute float aColorTier;

uniform vec2 uResolution;
uniform vec2 uMouse;
uniform float uProgress;
uniform float uTime;
uniform float uDPR;
uniform float uHasMouse;

varying float vAlpha;
varying vec3 vColor;

float easeInOutCubic(float t) {
  return t < 0.5 ? 4.0 * t * t * t : 1.0 - pow(-2.0 * t + 2.0, 3.0) / 2.0;
}

void main() {
  float t = clamp((uProgress - aDelay * 0.3) / 0.7, 0.0, 1.0);
  float e = easeInOutCubic(t);

  // Explosive dispersion wave during morph
  float wave = sin(e * 3.14159265);
  vec3 pos = mix(aPosA, aPosB, e);
  pos += aRandom * (wave * 0.75);

  // Organic rotation in 3D space
  float angle = uTime * 0.25;
  float cosA = cos(angle);
  float sinA = sin(angle);
  vec3 rotPos = vec3(
    pos.x * cosA + pos.z * sinA,
    pos.y,
    -pos.x * sinA + pos.z * cosA
  );

  // Mouse tilt / parallax
  rotPos.x += uMouse.x * 0.25;
  rotPos.y += uMouse.y * 0.2;

  // Perspective camera projection
  float camDist = 2.8;
  float pFactor = camDist / (camDist + rotPos.z);
  vec2 screenPos = vec2(rotPos.x * pFactor, rotPos.y * pFactor);

  // Mouse fluid interaction repulsion
  if (uHasMouse > 0.5) {
    vec2 diff = screenPos - uMouse * 0.8;
    float dist = length(diff);
    float repRadius = 0.55;
    if (dist < repRadius) {
      float repForce = (1.0 - dist / repRadius);
      screenPos += (diff / max(dist, 0.01)) * (repForce * repForce * 0.25);
    }
  }

  // Depth attenuation
  float depth = clamp((rotPos.z + 1.5) / 3.0, 0.0, 1.0);
  vAlpha = (0.95 - 0.55 * depth) * (1.0 - 0.2 * wave);

  // Dark Luxury Palette: Electric Cyan, Signature Cyan, Luminous White
  if (aColorTier < 0.35) {
    vColor = vec3(0.22, 0.74, 0.97); // Electric Cyan #38BDF8
  } else if (aColorTier < 0.70) {
    vColor = vec3(0.0, 0.65, 0.81); // Signature Cyan #00A6CE
  } else {
    vColor = vec3(0.95, 0.98, 1.0); // Luminous High-Contrast White
  }

  gl_PointSize = (2.2 + 2.0 * (1.0 - depth) + wave * 1.5) * uDPR;
  gl_Position = vec4(screenPos.x, screenPos.y, 0.0, 1.0);
}
`;

const FS = `
precision mediump float;
varying float vAlpha;
varying vec3 vColor;

void main() {
  float d = length(gl_PointCoord - vec2(0.5)) * 2.0;
  if (d > 1.0) discard;
  float circleAlpha = smoothstep(1.0, 0.15, d);
  gl_FragColor = vec4(vColor, vAlpha * circleAlpha);
}
`;

export default function Hero3DCanvas({ sectorIndex = 0 }: { sectorIndex: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({
    currentSector: sectorIndex,
    targetSector: sectorIndex,
    progress: 1.0,
    mouse: { x: 0, y: 0, active: 0 },
  });

  useEffect(() => {
    stateRef.current.targetSector = sectorIndex;
    stateRef.current.progress = 0.0;
  }, [sectorIndex]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl', {
      alpha: true,
      antialias: true,
      premultipliedAlpha: true,
    });
    if (!gl) return;

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    // Compile Shader Program
    const createShader = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };

    const program = gl.createProgram()!;
    gl.attachShader(program, createShader(gl.VERTEX_SHADER, VS));
    gl.attachShader(program, createShader(gl.FRAGMENT_SHADER, FS));
    gl.linkProgram(program);
    gl.useProgram(program);

    // Generate Shapes
    const N = NUM_PARTICLES;
    const shapes = [genGlobe(N), genPylon(N), genDiagridTower(N), genTesseract(N)];

    // Random vectors for explosion wave
    const rnd = new Float32Array(N * 3);
    const delay = new Float32Array(N);
    const colorTier = new Float32Array(N);
    for (let i = 0; i < N; i++) {
      rnd[i * 3] = rand(-1, 1);
      rnd[i * 3 + 1] = rand(-1, 1);
      rnd[i * 3 + 2] = rand(-1, 1);
      delay[i] = Math.random();
      colorTier[i] = Math.random();
    }

    // Buffers
    const bufPosA = gl.createBuffer();
    const bufPosB = gl.createBuffer();
    const bufRnd = gl.createBuffer();
    const bufDelay = gl.createBuffer();
    const bufColorTier = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, bufRnd);
    gl.bufferData(gl.ARRAY_BUFFER, rnd, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, bufDelay);
    gl.bufferData(gl.ARRAY_BUFFER, delay, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, bufColorTier);
    gl.bufferData(gl.ARRAY_BUFFER, colorTier, gl.STATIC_DRAW);

    // Uniforms
    const uRes = gl.getUniformLocation(program, 'uResolution');
    const uMouse = gl.getUniformLocation(program, 'uMouse');
    const uProgress = gl.getUniformLocation(program, 'uProgress');
    const uTime = gl.getUniformLocation(program, 'uTime');
    const uDPR = gl.getUniformLocation(program, 'uDPR');
    const uHasMouse = gl.getUniformLocation(program, 'uHasMouse');

    // Attributes
    const aPosA = gl.getAttribLocation(program, 'aPosA');
    const aPosB = gl.getAttribLocation(program, 'aPosB');
    const aRandom = gl.getAttribLocation(program, 'aRandom');
    const aDelay = gl.getAttribLocation(program, 'aDelay');
    const aColorTier = gl.getAttribLocation(program, 'aColorTier');

    gl.enableVertexAttribArray(aRandom);
    gl.bindBuffer(gl.ARRAY_BUFFER, bufRnd);
    gl.vertexAttribPointer(aRandom, 3, gl.FLOAT, false, 0, 0);

    gl.enableVertexAttribArray(aDelay);
    gl.bindBuffer(gl.ARRAY_BUFFER, bufDelay);
    gl.vertexAttribPointer(aDelay, 1, gl.FLOAT, false, 0, 0);

    gl.enableVertexAttribArray(aColorTier);
    gl.bindBuffer(gl.ARRAY_BUFFER, bufColorTier);
    gl.vertexAttribPointer(aColorTier, 1, gl.FLOAT, false, 0, 0);

    let fromShapeIdx = 0;
    let toShapeIdx = 0;

    const updateShapeBuffers = (fromIdx: number, toIdx: number) => {
      gl.bindBuffer(gl.ARRAY_BUFFER, bufPosA);
      gl.bufferData(gl.ARRAY_BUFFER, shapes[fromIdx], gl.DYNAMIC_DRAW);
      gl.enableVertexAttribArray(aPosA);
      gl.vertexAttribPointer(aPosA, 3, gl.FLOAT, false, 0, 0);

      gl.bindBuffer(gl.ARRAY_BUFFER, bufPosB);
      gl.bufferData(gl.ARRAY_BUFFER, shapes[toIdx], gl.DYNAMIC_DRAW);
      gl.enableVertexAttribArray(aPosB);
      gl.vertexAttribPointer(aPosB, 3, gl.FLOAT, false, 0, 0);
    };

    updateShapeBuffers(0, 0);

    // Resize Handler
    let dpr = 1;
    const resize = () => {
      if (!canvas) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        gl.viewport(0, 0, canvas.width, canvas.height);
      }
    };
    resize();
    window.addEventListener('resize', resize);

    // Mouse Tracking
    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      stateRef.current.mouse = { x: nx, y: ny, active: 1 };
    };
    const onMouseLeave = () => {
      stateRef.current.mouse.active = 0;
    };
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseleave', onMouseLeave);

    // Render Loop
    let animId: number;
    const startTime = performance.now();

    const render = (now: number) => {
      resize();

      const time = (now - startTime) * 0.001;
      const state = stateRef.current;

      // Handle Sector Morph Transition
      if (state.currentSector !== state.targetSector) {
        fromShapeIdx = state.currentSector;
        toShapeIdx = state.targetSector;
        updateShapeBuffers(fromShapeIdx, toShapeIdx);
        state.currentSector = state.targetSector;
        state.progress = 0.0;
      }

      if (state.progress < 1.0) {
        state.progress = Math.min(1.0, state.progress + 0.024);
      }

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform2f(uMouse, state.mouse.x, state.mouse.y);
      gl.uniform1f(uProgress, state.progress);
      gl.uniform1f(uTime, time);
      gl.uniform1f(uDPR, dpr);
      gl.uniform1f(uHasMouse, state.mouse.active);

      gl.drawArrays(gl.POINTS, 0, N);

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('mouseleave', onMouseLeave);
    };
  }, []);

  return (
    <div className="relative w-full h-[340px] sm:h-[380px] rounded-2xl overflow-hidden bg-[#040C1A] border border-cyan-500/30 shadow-[0_15px_40px_rgba(0,0,0,0.6)] flex items-center justify-center">
      {/* Subtle Luminous Ambient Radial Glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 65% 65% at 50% 50%, rgba(56, 189, 248, 0.15) 0%, rgba(0, 166, 206, 0.05) 50%, transparent 75%)',
        }}
      />

      {/* WebGL Canvas */}
      <canvas ref={canvasRef} className="w-full h-full block cursor-grab active:cursor-grabbing" />
    </div>
  );
}

'use client';

import { useRef, useEffect } from 'react';

export default function AmbientHeroBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    let mouseX = width / 2;
    let mouseY = height / 2;
    let targetMouseX = mouseX;
    let targetMouseY = mouseY;

    const onResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      targetMouseX = e.clientX - rect.left;
      targetMouseY = e.clientY - rect.top;
    };

    window.addEventListener('resize', onResize);
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    // Grid configuration for elegant architectural kinetic wave
    const cols = 28;
    const rows = 16;
    let time = 0;

    const render = () => {
      time += 0.015;
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      ctx.clearRect(0, 0, width, height);

      const cellW = width / (cols - 1);
      const cellH = height / (rows - 1);

      // Compute grid points with wave elevation
      const points: { x: number; y: number; elevation: number }[][] = [];

      for (let r = 0; r < rows; r++) {
        points[r] = [];
        for (let c = 0; c < cols; c++) {
          const baseX = c * cellW;
          const baseY = r * cellH;

          // Multi-frequency wave calculation
          const wave1 = Math.sin(c * 0.35 + time) * 12;
          const wave2 = Math.cos(r * 0.45 + time * 1.2) * 10;
          const wave3 = Math.sin((c + r) * 0.25 + time * 0.8) * 8;

          // Subtle mouse attraction/repulsion ripple
          const dx = baseX - mouseX;
          const dy = baseY - mouseY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const mouseEffect = Math.max(0, 1 - dist / 350) * 22 * Math.sin(time * 3 - dist * 0.04);

          const elevation = wave1 + wave2 + wave3 + mouseEffect;
          const px = baseX + (dx / (dist + 100)) * (mouseEffect * 0.3);
          const py = baseY + elevation;

          points[r][c] = { x: px, y: py, elevation };
        }
      }

      // Draw subtle horizontal grid lines
      ctx.lineWidth = 1;
      for (let r = 0; r < rows; r++) {
        ctx.beginPath();
        for (let c = 0; c < cols; c++) {
          const pt = points[r][c];
          if (c === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        }
        ctx.strokeStyle = 'rgba(0, 166, 206, 0.07)';
        ctx.stroke();
      }

      // Draw subtle vertical grid lines
      for (let c = 0; c < cols; c += 2) {
        ctx.beginPath();
        for (let r = 0; r < rows; r++) {
          const pt = points[r][c];
          if (r === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        }
        ctx.strokeStyle = 'rgba(15, 23, 42, 0.04)';
        ctx.stroke();
      }

      // Draw illuminated nodal points
      for (let r = 0; r < rows; r += 2) {
        for (let c = 0; c < cols; c += 2) {
          const pt = points[r][c];
          const brightness = Math.max(0.1, (pt.elevation + 20) / 40);

          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 1.8, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(0, 166, 206, ${0.15 + brightness * 0.35})`;
          ctx.fill();

          // Subtle pulse ring on selected nodes
          if ((r + c) % 6 === 0) {
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, 3.5 + Math.sin(time * 2 + r) * 1.5, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(56, 189, 248, ${0.12 * brightness})`;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none w-full h-full z-0 opacity-80"
    />
  );
}

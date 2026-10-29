'use client';

import { useEffect, useRef, useState } from 'react';

interface MousePosition {
  x: number; // -1 to 1
  y: number; // -1 to 1
  rawX: number;
  rawY: number;
}

export function useMouseParallax(intensity: number = 1) {
  const [mouse, setMouse] = useState<MousePosition>({ x: 0, y: 0, rawX: 0, rawY: 0 });
  const smoothMouse = useRef<MousePosition>({ x: 0, y: 0, rawX: 0, rawY: 0 });
  const animRef = useRef<number>();
  const targetRef = useRef<MousePosition>({ x: 0, y: 0, rawX: 0, rawY: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -((e.clientY / window.innerHeight) * 2 - 1);
      targetRef.current = { x: x * intensity, y: y * intensity, rawX: e.clientX, rawY: e.clientY };
    };

    const animate = () => {
      smoothMouse.current.x += (targetRef.current.x - smoothMouse.current.x) * 0.05;
      smoothMouse.current.y += (targetRef.current.y - smoothMouse.current.y) * 0.05;
      smoothMouse.current.rawX += (targetRef.current.rawX - smoothMouse.current.rawX) * 0.05;
      smoothMouse.current.rawY += (targetRef.current.rawY - smoothMouse.current.rawY) * 0.05;

      setMouse({ ...smoothMouse.current });
      animRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    animRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [intensity]);

  return mouse;
}

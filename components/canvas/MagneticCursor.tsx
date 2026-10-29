'use client';

import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export default function MagneticCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: -100, y: -100 });
  const smooth = useRef({ x: -100, y: -100 });
  const [label, setLabel] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
      if (!isVisible) setIsVisible(true);
    };

    const onLeave = () => setIsVisible(false);
    const onEnter = () => setIsVisible(true);

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const cursorTarget = target.closest('[data-cursor]') as HTMLElement | null;
      const linkTarget = target.closest('a, button, select, input, textarea, [role="button"]') as HTMLElement | null;

      if (cursorTarget) {
        setLabel(cursorTarget.dataset.cursor || '');
        setIsActive(true);
      } else if (linkTarget) {
        setLabel('');
        setIsActive(true);
      } else {
        setLabel('');
        setIsActive(false);
      }
    };

    let animId: number;
    const animate = () => {
      // Direct dot
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0) translate(-50%, -50%)`;
      }

      // Spring ring with smooth lerp
      smooth.current.x += (pos.current.x - smooth.current.x) * 0.16;
      smooth.current.y += (pos.current.y - smooth.current.y) * 0.16;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${smooth.current.x}px, ${smooth.current.y}px, 0) translate(-50%, -50%)`;
      }

      animId = requestAnimationFrame(animate);
    };

    document.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseenter', onEnter);
    document.addEventListener('mouseover', onMouseOver, { passive: true });
    animId = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnter);
      document.removeEventListener('mouseover', onMouseOver);
      cancelAnimationFrame(animId);
    };
  }, [isVisible, reducedMotion]);

  if (!isVisible || reducedMotion) return null;

  return (
    <>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className={`cursor-ring ${isActive ? 'active' : ''}`}>
        <div className="cursor-label">{label}</div>
      </div>
    </>
  );
}

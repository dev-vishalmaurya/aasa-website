'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';

interface CounterProps {
  value: string; // e.g. "30+", "150+", "25,000+", "4"
  className?: string;
  duration?: number;
}

export default function Counter({ value, className = '', duration = 1.6 }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  const [displayValue, setDisplayValue] = useState('0');

  useEffect(() => {
    if (!isInView) return;

    // Parse the numeric part and any prefix/suffix
    const match = value.match(/^([^\d]*)([\d,]+)([^\d]*)$/);
    if (!match) {
      setDisplayValue(value);
      return;
    }

    const prefix = match[1] || '';
    const rawNumberStr = match[2].replace(/,/g, '');
    const targetNumber = parseInt(rawNumberStr, 10);
    const suffix = match[3] || '';
    const hasCommas = match[2].includes(',');

    if (isNaN(targetNumber)) {
      setDisplayValue(value);
      return;
    }

    const startTime = performance.now();

    function update(now: number) {
      const elapsed = (now - startTime) / 1000;
      const progress = Math.min(1, elapsed / duration);
      // Ease out expo curve: 1 - 2^(-10 * progress)
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = Math.floor(ease * targetNumber);

      const formatted = hasCommas
        ? current.toLocaleString('en-US')
        : current.toString();

      setDisplayValue(`${prefix}${formatted}${suffix}`);

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        setDisplayValue(value);
      }
    }

    const animId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animId);
  }, [isInView, value, duration]);

  return (
    <span ref={ref} className={className}>
      {displayValue}
    </span>
  );
}

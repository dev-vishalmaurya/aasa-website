'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';
import { useTheme } from '@/components/providers/ThemeProvider';

interface TextScrubProps {
  text: string;
  className?: string;
}

function Word({
  word,
  range,
  progress,
}: {
  word: string;
  range: [number, number];
  progress: MotionValue<number>;
}) {
  const { theme } = useTheme();
  const opacity = useTransform(progress, range, [0.35, 1]);
  // Words light up from slate to full foreground (white at night, ink in daylight)
  const color = useTransform(progress, range, theme === 'light' ? ['#94A3B8', '#0B1426'] : ['#64748B', '#FFFFFF']);

  return (
    <motion.span
      style={{ opacity, color }}
      className="inline-block mr-[0.28em] transition-colors duration-150"
    >
      {word}
    </motion.span>
  );
}

export default function TextScrub({ text, className = '' }: TextScrubProps) {
  const containerRef = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.85', 'end 0.5'],
  });

  const words = text.split(' ');

  return (
    <p ref={containerRef} className={`flex flex-wrap leading-relaxed ${className}`}>
      {words.map((word, i) => {
        const start = i / words.length;
        const end = start + 1 / words.length;
        return (
          <Word
            key={i}
            word={word}
            range={[start, end]}
            progress={scrollYProgress}
          />
        );
      })}
    </p>
  );
}

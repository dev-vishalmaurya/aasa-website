'use client';

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  cursorLabel?: string;
  delay?: number;
  disableScrollAnimation?: boolean;
}

export default function TiltCard({
  children,
  className = '',
  cursorLabel,
  delay = 0,
  disableScrollAnimation = false,
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotX, setRotX] = useState(0);
  const [rotY, setRotY] = useState(0);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rX = ((y - centerY) / centerY) * -8;
    const rY = ((x - centerX) / centerX) * 8;

    setRotX(rX);
    setRotY(rY);
    setGlarePos({ x: (x / rect.width) * 100, y: (y / rect.height) * 100 });
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotX(0);
    setRotY(0);
  };

  const cardContent = (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ transformStyle: 'preserve-3d' }}
      animate={{
        rotateX: rotX,
        rotateY: rotY,
        transformPerspective: 1200,
      }}
      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
      className={`relative overflow-hidden group ${className}`}
      data-cursor={cursorLabel}
    >
      {/* Specular blue glare reflection */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-10"
        style={{
          opacity: isHovered ? 0.35 : 0,
          background: `radial-gradient(400px circle at ${glarePos.x}% ${glarePos.y}%, rgba(56, 189, 248, 0.35), transparent 70%)`,
        }}
      />

      {/* Subtle blue edge light trace */}
      <div
        className="absolute -inset-px rounded-[inherit] pointer-events-none transition-opacity duration-300 z-10"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(250px circle at ${glarePos.x}% ${glarePos.y}%, rgba(56, 189, 248, 0.4), transparent 60%)`,
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
          padding: '1px',
        }}
      />

      {children}
    </motion.div>
  );

  if (disableScrollAnimation) {
    return cardContent;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 45, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.15, margin: '0px 0px -40px 0px' }}
      transition={{
        duration: 0.75,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="h-full w-full"
      style={{ perspective: 1200 }}
    >
      {cardContent}
    </motion.div>
  );
}

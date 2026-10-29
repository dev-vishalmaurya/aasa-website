'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Quote } from 'lucide-react';
import { LEADERSHIP_QUOTE } from '@/lib/constants';
import TiltCard from '@/components/ui/TiltCard';

const PRINCIPLES = [
  { no: '01', title: 'Roots & Humility', desc: 'Staying grounded regardless of scale, honoring every artisan across our value chain.' },
  { no: '02', title: 'People First', desc: 'Protecting and empowering the 25,000+ individuals whose labor builds our regional reputation.' },
  { no: '03', title: 'Execution Discipline', desc: 'Delivering mega-initiatives on time, within tolerances, with zero compromise on safety.' },
  { no: '04', title: 'Enduring Integrity', desc: 'Transparent governance, trustworthy partnerships, and generational business ethics.' },
];

export default function LeadershipSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="leadership" ref={ref} className="relative py-28 lg:py-36 z-10 overflow-hidden bg-transparent text-fg border-t border-cyan-500/20">
      {/* Subtle Ambient Radial Lighting */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 50% 40%, rgba(0, 166, 206, 0.08) 0%, transparent 70%)',
        }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto mb-20"
        >
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-3 mb-6">
            <span className="w-8 h-[1px] bg-accent inline-block" />
            <span className="hud-label text-accent font-bold">EXECUTIVE MANIFESTO</span>
            <span className="w-8 h-[1px] bg-accent inline-block" />
          </div>

          {/* Quote Icon */}
          <div className="w-16 h-16 rounded-full bg-cyan-500/15 border border-cyan-400/40 mx-auto flex items-center justify-center text-accent-soft mb-8 shadow-[0_0_25px_rgba(56,189,248,0.3)]">
            <Quote size={28} />
          </div>

          {/* Large Quote */}
          <blockquote className="font-serif text-2xl sm:text-4xl md:text-5xl text-fg/95 font-normal leading-[1.3] italic tracking-tight mb-8">
            &ldquo;{LEADERSHIP_QUOTE.text}&rdquo;
          </blockquote>

          {/* Attribution */}
          <div className="space-y-1">
            <div className="font-display font-extrabold text-lg text-fg tracking-wide">
              {LEADERSHIP_QUOTE.attribution}
            </div>
            <div className="font-mono text-xs uppercase tracking-widest text-accent-soft font-bold">
              Aspect Tower · Business Bay · Dubai, UAE
            </div>
          </div>
        </motion.div>

        {/* 4 Guiding Principles 3D Tilt Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-12 border-t border-fg/10">
          {PRINCIPLES.map((item, idx) => (
            <TiltCard
              key={item.no}
              delay={idx * 0.12}
              cursorLabel="PRINCIPLE"
              className="glass-panel p-6 sm:p-8 rounded-2xl h-full bg-fg/[0.04] border border-fg/10 hover:border-cyan-400/40 shadow-lg"
            >
              <div className="font-mono text-xs font-bold text-accent tracking-widest mb-3">
                INDEX {item.no}
              </div>
              <h4 className="font-display text-lg font-bold text-fg mb-2">{item.title}</h4>
              <p className="text-xs sm:text-sm text-muted leading-relaxed font-normal">
                {item.desc}
              </p>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
}

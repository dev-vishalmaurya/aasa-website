'use client';

import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Plus } from 'lucide-react';

const INDUSTRIES = [
  {
    no: '01',
    name: 'Oil, Gas & Petrochemical',
    desc: 'Downstream non-fuel facilities, hydrocarbon distribution networks, hazardous area safety engineering, and specialized pipeline maintenance for regional oil majors including ADNOC.',
    tags: ['ADNOC Downstream', 'Hazardous Area Safety', 'High-Pressure Piping', 'Asset Integrity', 'Safety Management'],
  },
  {
    no: '02',
    name: 'Aviation & Aerostructures',
    desc: 'Heavy hangar site infrastructure, engineering facility construction at Dubai World Central (DWC), ground support equipment logistics, and precision airside maintenance platforms.',
    tags: ['Emirates DWC', 'Hangar Facilities', 'Ground Support Logistics', 'Airside Infrastructure', 'Runway Utilities'],
  },
  {
    no: '03',
    name: 'Landmark Megastructures & High-Rise Steel',
    desc: 'Engineering, 3D BIM modeling, fabrication, and erection of high-tonnage structural steel frameworks, mega-trusses, and bespoke architectural canopies defining UAE skylines.',
    tags: ['Structural Steel', 'High-Rise Frameworks', 'Mega-Trusses', '3D BIM Engineering', 'Acoustic Cladding'],
  },
  {
    no: '04',
    name: 'Power Grids & Smart Utilities',
    desc: 'High-voltage 132/400kV substation engineering, regional grid interconnectors, fiber optic smart communication backbones, and industrial energy storage integration.',
    tags: ['400kV Substations', 'Grid Automation', 'Fiber Optic Backbones', 'Renewable Integration', 'Utility Networks'],
  },
  {
    no: '05',
    name: 'Commercial & Integrated Facilities',
    desc: 'Total lifecycle management for commercial towers, industrial complexes, and government headquarters with predictive maintenance, HVAC optimization, and 24/7 technical response.',
    tags: ['Aspect Tower HQ', 'Predictive Maintenance', 'Energy Auditing', 'HVAC Automation', 'Life-Safety Systems'],
  },
];

export default function IndustriesSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="industries" ref={ref} className="relative py-28 lg:py-36 z-10 overflow-hidden bg-transparent text-fg border-t border-cyan-500/20">
      {/* Subtle Ambient Radial Lighting */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 20% 50%, rgba(0, 166, 206, 0.08) 0%, transparent 70%), radial-gradient(ellipse 50% 60% at 85% 60%, rgba(2, 132, 199, 0.06) 0%, transparent 65%)',
        }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        {/* Head */}
        <div className="grid lg:grid-cols-2 gap-8 items-end mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-accent shadow-[0_0_8px_rgba(56,189,248,0.8)]" />
              <span className="hud-label text-accent font-bold">[ 03 — SECTOR MASTERY ]</span>
            </div>
            <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-fg tracking-tight">
              Sectors We{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-soft via-accent to-blue-500">
                Transform.
              </span>
            </h2>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-sm sm:text-base text-muted max-w-md font-normal"
          >
            Deep domain expertise across high-stakes industrial, energy, and civil infrastructure markets across the GCC.
          </motion.p>
        </div>

        {/* Accordion Rows with Staggered Scroll Entrance */}
        <div className="space-y-3">
          {INDUSTRIES.map((ind, idx) => {
            const isOpen = openIndex === idx;
            return (
              <motion.div
                key={ind.no}
                initial={{ opacity: 0, y: 35, scale: 0.96 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => toggle(idx)}
                className={`glass-panel p-6 sm:p-8 rounded-2xl cursor-pointer transition-all duration-300 ${
                  isOpen
                    ? 'border-cyan-400/80 bg-surface-2/85 shadow-[0_10px_35px_rgba(0,166,206,0.25)] ring-1 ring-cyan-400/40'
                    : 'bg-fg/[0.04] border border-fg/10 hover:border-cyan-400/30'
                }`}
                data-cursor={isOpen ? 'COLLAPSE' : 'EXPAND'}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 sm:gap-8">
                    <span className="font-mono text-xs sm:text-sm font-bold text-accent">
                      {ind.no}
                    </span>
                    <h3 className="font-display font-bold text-lg sm:text-2xl text-fg tracking-tight">
                      {ind.name}
                    </h3>
                  </div>

                  <div
                    className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-300 ${
                      isOpen
                        ? 'bg-cta text-on-cta rotate-45 border-cta shadow-[0_0_15px_rgba(56,189,248,0.6)]'
                        : 'border-fg/20 text-fg/70 hover:border-cyan-400'
                    }`}
                  >
                    <Plus size={18} />
                  </div>
                </div>

                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="pt-6 mt-4 border-t border-fg/10"
                  >
                    <p className="text-sm sm:text-base text-muted leading-relaxed font-normal mb-5 max-w-3xl">
                      {ind.desc}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {ind.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1.5 rounded-full bg-fg/[0.06] border border-cyan-500/30 text-xs font-mono font-semibold text-accent-soft"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

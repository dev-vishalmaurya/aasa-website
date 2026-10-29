'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Shield, Leaf, Zap, Award, ArrowUpRight } from 'lucide-react';
import { SUSTAINABILITY } from '@/lib/constants';
import TiltCard from '@/components/ui/TiltCard';

export default function SustainabilitySection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  const icons = [Shield, Leaf, Zap, Award];

  return (
    <section id="sustainability" ref={ref} className="relative py-28 lg:py-36 z-10 overflow-hidden bg-transparent text-fg border-t border-cyan-500/20">
      {/* Subtle Ambient Radial Lighting */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 65% 50% at 25% 45%, rgba(0, 166, 206, 0.08) 0%, transparent 70%), radial-gradient(ellipse 55% 55% at 80% 65%, rgba(2, 132, 199, 0.06) 0%, transparent 65%)',
        }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-[1.2fr,0.8fr] gap-12 lg:gap-16 items-center">
          {/* Left Text & ESG Pillars */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-accent shadow-[0_0_8px_rgba(56,189,248,0.8)]" />
                <span className="hud-label text-accent font-bold">[ 05 — ESG & ENVIRONMENTAL RESPONSIBILITY ]</span>
              </div>
              <h2 className="font-display font-black text-3xl sm:text-5xl text-fg tracking-tight mb-6">
                Sustainable by Design.{' '}
                <em className="font-serif italic font-normal text-accent-soft">
                  Woven Into Our Ethos.
                </em>
              </h2>
              <p className="text-base sm:text-lg text-muted leading-relaxed font-normal mb-10 max-w-xl">
                {SUSTAINABILITY.body}
              </p>
            </motion.div>

            {/* 4 ESG Pillars Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {SUSTAINABILITY.pillars.map((pillar, i) => {
                const IconComponent = icons[i] || Shield;
                return (
                  <TiltCard
                    key={pillar.label}
                    delay={i * 0.1}
                    cursorLabel="ESG"
                    className="glass-panel p-6 rounded-2xl h-full bg-fg/[0.04] border border-fg/10 hover:border-cyan-400/40 shadow-lg"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-9 h-9 rounded-xl bg-cyan-500/15 border border-cyan-400/30 text-accent-soft flex items-center justify-center">
                        <IconComponent size={18} />
                      </div>
                      <div className="text-xl font-display font-extrabold text-fg">
                        {pillar.value}
                      </div>
                    </div>
                    <div className="text-xs font-bold text-fg/90 mb-0.5">{pillar.label}</div>
                    <div className="font-mono text-[10px] text-accent-soft font-semibold uppercase tracking-wider">
                      {pillar.unit}
                    </div>
                  </TiltCard>
                );
              })}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <a
                href={SUSTAINABILITY.href}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost"
                data-cursor="LEARN"
              >
                <span>Read Official ESG Commitments</span>
                <ArrowUpRight size={14} />
              </a>
            </motion.div>
          </div>

          {/* Right Highlight Panel */}
          <div>
            <TiltCard cursorLabel="CERTIFICATION" delay={0.25} className="glass-panel p-8 sm:p-10 rounded-3xl border border-fg/15 bg-surface/90 shadow-[0_25px_60px_rgb(var(--shadow)/0.7)] backdrop-blur-2xl">
              <span className="hud-label text-accent font-bold">INTEGRATED STANDARDS</span>
              <h3 className="text-2xl font-display font-extrabold text-fg tracking-tight mt-2 mb-4">
                Zero Harm Protocol & Environmental Governance
              </h3>
              <p className="text-sm text-muted leading-relaxed font-normal mb-6">
                All AASA business units operate under ISO 9001 (Quality), ISO 14001 (Environmental),
                and ISO 45001 (Health & Safety) certifications with daily telemetry tracking across all active GCC sites.
              </p>
              <div className="space-y-3 pt-4 border-t border-fg/10 font-mono text-xs text-muted">
                <div className="flex items-center justify-between">
                  <span>Carbon Reduction Target:</span>
                  <span className="text-accent-soft font-bold">40% by 2030</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Solar Integration:</span>
                  <span className="text-accent-soft font-bold">100% on new sites</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Zero LTI Mandate:</span>
                  <span className="text-accent font-bold">Active Protocol</span>
                </div>
              </div>
            </TiltCard>
          </div>
        </div>
      </div>
    </section>
  );
}

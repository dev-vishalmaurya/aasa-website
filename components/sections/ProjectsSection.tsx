'use client';

import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Calendar, MapPin, ArrowUpRight, ShieldCheck } from 'lucide-react';
import { PROJECTS } from '@/lib/constants';
import TiltCard from '@/components/ui/TiltCard';

const PROJECT_DETAILS: Record<
  string,
  {
    image: string;
    stat1: string;
    label1: string;
    stat2: string;
    label2: string;
    scope: string;
    status: string;
  }
> = {
  'adnoc-abu-dhabi': {
    image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1200&q=80',
    stat1: 'Zero LTI',
    label1: 'Safety Record',
    stat2: '100%',
    label2: 'Critical Compliance',
    scope: 'High-Pressure Hydrocarbon Infrastructure',
    status: 'COMPLETED & COMMISSIONED',
  },
  'emirates-dwc': {
    image: 'https://images.unsplash.com/photo-1545459720-aac8509eb02c?auto=format&fit=crop&w=1200&q=80',
    stat1: 'DWC Hub',
    label1: 'Aviation Megastructure',
    stat2: '24/7',
    label2: 'Turnkey Mobilization',
    scope: 'Aerospace Engineering & Hangar Logistics',
    status: 'ACTIVE STRATEGIC SITE',
  },
  'uae-steel-landmark': {
    image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80',
    stat1: '45,000+',
    label1: 'Tonnes Fabricated',
    stat2: 'Grade A',
    label2: '3D BIM Execution',
    scope: 'Mega-Truss & High-Rise Space Frames',
    status: 'DEPLOYED TO LANDMARK SITES',
  },
  'gcc-telecom-grid': {
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
    stat1: '400kV',
    label1: 'Interconnect Network',
    stat2: '99.99%',
    label2: 'Mission-Critical Uptime',
    scope: 'Substation Matrices & Fiber Backbones',
    status: 'REGIONAL TRANSMISSION ACTIVE',
  },
};

export default function ProjectsSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', 'Energy & Oil/Gas', 'Aviation & Megastructures', 'Infrastructure'];

  const filteredProjects =
    activeCategory === 'All'
      ? PROJECTS
      : PROJECTS.filter((p) => p.category === activeCategory);

  return (
    <section id="projects" ref={ref} className="relative py-28 lg:py-36 z-10 overflow-hidden bg-transparent text-fg border-t border-cyan-500/20">
      {/* Subtle Ambient Radial Lighting */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 65% 50% at 75% 25%, rgba(0, 166, 206, 0.08) 0%, transparent 70%), radial-gradient(ellipse 55% 55% at 20% 75%, rgba(2, 132, 199, 0.06) 0%, transparent 65%)',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-accent shadow-[0_0_8px_rgba(56,189,248,0.8)]" />
              <span className="hud-label text-accent font-bold">[ 04 — LANDMARK PROJECTS ]</span>
            </div>
            <h2 className="font-display font-black text-3xl sm:text-5xl text-fg tracking-tight">
              Megaproject Delivery.{' '}
              <em className="font-serif italic font-normal text-accent-soft">
                Generational Scale.
              </em>
            </h2>
          </motion.div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-mono font-bold transition-all duration-300 cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-cta text-on-cta shadow-[0_0_15px_rgba(56,189,248,0.5)]'
                    : 'bg-fg/[0.05] text-muted hover:text-fg hover:bg-fg/[0.1] border border-fg/10'
                }`}
                data-cursor="FILTER"
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Studio-Grade 3D Sticky Stacking Project Cards */}
        <div className="space-y-8 lg:space-y-12 relative pb-16">
          {filteredProjects.map((project, idx) => {
            const details = PROJECT_DETAILS[project.id] || PROJECT_DETAILS['adnoc-abu-dhabi'];

            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 50, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
                className="lg:sticky rounded-3xl"
                style={{
                  top: `calc(90px + ${idx * 24}px)`,
                  zIndex: idx + 1,
                }}
              >
                <TiltCard
                  cursorLabel="PROJECT"
                  disableScrollAnimation={true}
                  className="glass-panel p-6 sm:p-10 lg:p-12 rounded-3xl border border-fg/15 bg-surface/90 shadow-[0_25px_60px_rgb(var(--shadow)/0.7)] backdrop-blur-2xl"
                >
                  <div className="grid lg:grid-cols-[1.1fr,1.15fr] gap-8 lg:gap-12 items-center">
                    {/* Left Details */}
                    <div className="flex flex-col justify-between h-full">
                      <div>
                        {/* Top Metadata Badges */}
                        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                          <div className="flex items-center gap-2.5">
                            <span className="px-3 py-1 rounded-full bg-cyan-500/15 text-accent-soft font-mono font-bold text-xs uppercase tracking-wider border border-cyan-500/40">
                              {project.client}
                            </span>
                            <span className="font-mono text-[10px] text-subtle font-semibold uppercase tracking-widest hidden sm:inline">
                              INDEX 0{idx + 1}
                            </span>
                          </div>

                          <span className="text-xs text-subtle font-mono font-semibold flex items-center gap-1.5">
                            <Calendar size={13} className="text-accent" />
                            {project.date}
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="text-2xl sm:text-3xl lg:text-4xl font-display font-extrabold text-fg tracking-tight mb-4 group-hover:text-accent-soft transition-colors">
                          {project.title}
                        </h3>

                        {/* Location */}
                        <div className="flex items-center gap-1.5 text-xs text-subtle font-mono font-medium mb-5">
                          <MapPin size={14} className="text-accent shrink-0" />
                          <span>{project.location}</span>
                        </div>

                        {/* Description */}
                        <p className="text-sm sm:text-base text-muted leading-relaxed font-normal mb-6">
                          {project.description}
                        </p>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-8">
                          {project.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-2.5 py-1 rounded-md bg-fg/[0.06] border border-fg/10 text-[11px] font-mono font-semibold text-soft"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Bottom Metrics Bar */}
                      <div className="pt-6 border-t border-fg/10 flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-6">
                          <div>
                            <div className="text-xl sm:text-2xl font-display font-extrabold text-fg leading-tight">
                              {details.stat1}
                            </div>
                            <div className="font-mono text-[10px] uppercase tracking-wider font-bold text-accent-pale/70">
                              {details.label1}
                            </div>
                          </div>
                          <div className="w-[1px] h-8 bg-fg/15" />
                          <div>
                            <div className="text-xl sm:text-2xl font-display font-extrabold text-fg leading-tight">
                              {details.stat2}
                            </div>
                            <div className="font-mono text-[10px] uppercase tracking-wider font-bold text-accent-pale/70">
                              {details.label2}
                            </div>
                          </div>
                        </div>

                        <a
                          href={project.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-primary !py-2.5 !px-5 !text-xs cursor-pointer inline-flex items-center gap-2 shadow-sm"
                          data-cursor="CASE STUDY"
                        >
                          <span>Explore Official Brief</span>
                          <ArrowUpRight size={14} />
                        </a>
                      </div>
                    </div>

                    {/* Right Project Showcase Photography */}
                    <div className="force-dark relative h-[280px] sm:h-[360px] lg:h-[420px] w-full rounded-2xl overflow-hidden border border-fg/15 group">
                      <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                        style={{ backgroundImage: `url(${details.image})` }}
                      >
                        {/* Subtle Vignette */}
                        <div className="absolute inset-0 bg-gradient-to-t from-page/80 via-transparent to-transparent" />

                        {/* Top Status Pill */}
                        <div className="absolute top-4 left-4 flex items-center gap-2 bg-page/85 backdrop-blur-md px-3 py-1.5 rounded-md border border-fg/15">
                          <span className="w-1.5 h-1.5 rounded-full bg-accent shadow-[0_0_8px_rgba(56,189,248,0.9)]" />
                          <span className="font-mono text-[9px] text-fg font-bold uppercase tracking-wider">
                            {details.status}
                          </span>
                        </div>

                        {/* Bottom Scope Overlay */}
                        <div className="absolute bottom-4 left-4 right-4 p-3.5 rounded-xl bg-page/85 backdrop-blur-md border border-fg/15 flex items-center justify-between">
                          <div>
                            <div className="font-mono text-[8px] text-accent uppercase tracking-wider font-bold">
                              CRITICAL ENGINEERING SCOPE
                            </div>
                            <div className="font-display text-xs sm:text-sm font-bold text-fg truncate">
                              {details.scope}
                            </div>
                          </div>
                          <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center shrink-0 border border-cyan-400/40 text-accent-soft">
                            <ShieldCheck size={16} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TiltCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

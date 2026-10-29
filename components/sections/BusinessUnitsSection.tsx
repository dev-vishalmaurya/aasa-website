'use client';

import Link from 'next/link';
import { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { ArrowUpRight, CheckCircle2, ShieldCheck, Scan } from 'lucide-react';
import { BUSINESS_UNITS } from '@/lib/constants';
import TiltCard from '@/components/ui/TiltCard';

const CATEGORIES = [
  { id: 'all', label: 'All Verticals (8)' },
  { id: 'civil', label: 'Civil & Structural' },
  { id: 'power', label: 'Power & Energy' },
  { id: 'logistics', label: 'Logistics & Fab' },
  { id: 'tech', label: 'Tech & Assets' },
];

const UNIT_CATEGORY_MAP: Record<string, string> = {
  staffing: 'tech',
  power: 'power',
  infra: 'civil',
  mobility: 'logistics',
  steel: 'civil',
  tech: 'tech',
  fm: 'tech',
  access: 'logistics',
};

const UNIT_IMAGES: Record<string, { image: string; tag: string }> = {
  staffing: {
    image: 'https://aasa.ae/wp-content/uploads/2025/08/staffing-solutions.jpg',
    tag: 'CERTIFIED ENGINEERING TALENT MOBILIZATION',
  },
  power: {
    image: 'https://aasa.ae/wp-content/uploads/2025/08/power-distribution.jpg',
    tag: '132/400kV HIGH-VOLTAGE SUBSTATION MATRICES',
  },
  infra: {
    image: 'https://aasa.ae/wp-content/uploads/2025/08/construction.jpg',
    tag: 'HEAVY CIVIL HIGHWAYS & AIRPORT UTILITIES',
  },
  mobility: {
    image: 'https://aasa.ae/wp-content/uploads/2025/08/telecom-infrastructure.jpg',
    tag: 'SPECIALIZED LOGISTICS & HEAVY FLEET',
  },
  steel: {
    image: 'https://aasa.ae/wp-content/uploads/2025/08/steel-fabrication.jpg',
    tag: 'HIGH-TONNAGE MEGA-TRUSS STEEL FABRICATION',
  },
  tech: {
    image: 'https://aasa.ae/wp-content/uploads/2025/08/technology.jpg',
    tag: 'SMART BMS & MISSION-CRITICAL DATA INFRASTRUCTURE',
  },
  fm: {
    image: 'https://aasa.ae/wp-content/uploads/2025/08/Facility-Management.jpg',
    tag: 'PREDICTIVE FACILITY MANAGEMENT & HVAC SYSTEMS',
  },
  access: {
    image: 'https://aasa.ae/wp-content/uploads/2025/08/Rope-Access.jpg',
    tag: 'CERTIFIED MULTI-TIER SUSPENDED ACCESS SYSTEMS',
  },
};

const UNIT_CAPABILITIES: Record<string, string[]> = {
  staffing: [
    'Executive & technical engineering talent recruitment',
    'Rapid mobilization for GCC critical megaprojects',
    'Full visa, on-site logistics & compliance management',
  ],
  power: [
    '132kV / 400kV high-voltage substation engineering',
    'Industrial power distribution & transmission networks',
    'Clean energy integration & smart grid automation',
  ],
  infra: [
    'Highways, bridges & urban civil transport corridors',
    'Deep utility pipelines & drainage infrastructure',
    'Airport airside engineering & heavy civil foundations',
  ],
  mobility: [
    'Specialized heavy equipment fleet logistics',
    'High-capacity transport & oversized cargo haulage',
    'Predictive telematics & zero-downtime maintenance',
  ],
  steel: [
    'High-tonnage mega-trusses & high-rise structural frameworks',
    'Heavy industrial steel fabrication & acoustic cladding',
    '3D BIM modeling, automated CNC plasma cutting & welding',
  ],
  tech: [
    'Smart building IoT & automated BMS architectures',
    'Mission-critical data center network infrastructure',
    'Integrated physical security & access telemetry',
  ],
  fm: [
    'Total integrated facility management & operations',
    'Predictive HVAC algorithms & energy optimization',
    '24/7 rapid emergency engineering response',
  ],
  access: [
    'Certified multi-tier industrial scaffolding systems',
    'Suspended powered access cradles & mast climbers',
    'Aramco & ADNOC certified offshore/onshore scaffolding',
  ],
};

export default function BusinessUnitsSection() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedId, setSelectedId] = useState(BUSINESS_UNITS[0].id);
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const filteredUnits =
    selectedCategory === 'all'
      ? BUSINESS_UNITS
      : BUSINESS_UNITS.filter((u) => UNIT_CATEGORY_MAP[u.id] === selectedCategory);

  const activeUnit =
    BUSINESS_UNITS.find((u) => u.id === selectedId) || BUSINESS_UNITS[0];

  const unitVisual = UNIT_IMAGES[activeUnit.id] || UNIT_IMAGES.staffing;
  const capabilities = UNIT_CAPABILITIES[activeUnit.id] || [];

  const handleSelectUnit = (id: string) => {
    setSelectedId(id);
  };

  return (
    <section id="divisions" ref={ref} className="relative py-28 lg:py-36 z-10 overflow-hidden bg-transparent text-fg border-t border-cyan-500/20">
      {/* Subtle Ambient Radial Lighting */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 65% 50% at 75% 30%, rgba(0, 166, 206, 0.08) 0%, transparent 70%), radial-gradient(ellipse 50% 60% at 15% 70%, rgba(2, 132, 199, 0.06) 0%, transparent 65%)',
        }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-14"
        >
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-accent shadow-[0_0_8px_rgba(56,189,248,0.8)]" />
            <span className="hud-label text-accent font-bold">[ 02 — OPERATING DIVISIONS ]</span>
          </div>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-fg tracking-tight leading-[1.1]">
                Eight Pillars of{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-soft via-accent to-blue-500">
                  Industrial Scale.
                </span>
              </h2>
              <p className="mt-4 text-base sm:text-lg text-muted max-w-2xl font-normal">
                Integrated delivery spanning high-voltage power transmission, precision structural steel fabrication,
                heavy transit civil works, and certified engineering mobilization.
              </p>
            </div>
            <div className="text-xs font-mono text-accent-soft font-semibold shrink-0">
              [ 8 SOVEREIGN OPERATING ENTITIES · ASPECT TOWER DUBAI ]
            </div>
          </div>
        </motion.div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`relative px-4 py-2 rounded-full text-xs font-mono tracking-wider transition-all duration-200 cursor-pointer ${
                selectedCategory === cat.id
                  ? 'text-on-cta font-bold bg-cta border border-cyan-300 shadow-[0_0_15px_rgba(56,189,248,0.5)]'
                  : 'text-muted bg-fg/[0.05] hover:text-fg hover:bg-fg/[0.1] border border-fg/10'
              }`}
              data-cursor="FILTER"
            >
              <span className="relative z-10">{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Interactive Divisions Horizontal Tabs Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 mb-10">
          {filteredUnits.map((unit, idx) => {
            const isSelected = unit.id === selectedId;
            return (
              <motion.button
                key={unit.id}
                initial={{ opacity: 0, y: 30, scale: 0.92 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: idx * 0.05, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => handleSelectUnit(unit.id)}
                className={`relative p-3.5 rounded-2xl text-left transition-all duration-300 flex flex-col justify-between cursor-pointer group ${
                  isSelected
                    ? 'bg-surface-2 border-2 border-cyan-400 shadow-[0_0_20px_rgba(56,189,248,0.35)] ring-1 ring-cyan-300'
                    : 'glass-panel bg-fg/[0.04] border border-fg/10 hover:border-cyan-400/30'
                }`}
                data-cursor="SELECT"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-[10px] font-bold text-accent">
                    {unit.index}
                  </span>
                  <div
                    className="w-2 h-2 rounded-full transition-transform group-hover:scale-150"
                    style={{ backgroundColor: unit.color }}
                  />
                </div>
                <div className="font-display font-bold text-xs text-fg truncate">
                  {unit.name.replace('aasa ', '')}
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Selected Division Cinema-Grade Command Console */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeUnit.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
          >
            <TiltCard cursorLabel="DIVISION" delay={0.15} className="glass-panel rounded-3xl p-6 sm:p-10 border border-fg/15 shadow-[0_25px_60px_rgb(var(--shadow)/0.7)] bg-surface/90 backdrop-blur-2xl">
              <div className="grid lg:grid-cols-[1.1fr,1.3fr] gap-8 lg:gap-12 items-center">
                {/* Left Column: Authentic Infrastructure Visual with Operational HUD Tag */}
                <div>
                  <div className="flex items-center justify-between mb-3 px-1">
                    <div className="flex items-center gap-2">
                      <Scan size={14} className="text-accent" />
                      <span className="hud-label text-[10px] text-accent font-bold">
                        SECTOR CAPABILITY — {activeUnit.sector.toUpperCase()}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-accent-soft font-bold bg-accent/10 border border-cyan-500/30 px-2 py-0.5 rounded">
                      [ DIVISION {activeUnit.index} ]
                    </span>
                  </div>

                  {/* High-Resolution Infrastructure Visual */}
                  <div className="force-dark h-[340px] sm:h-[400px] w-full rounded-2xl overflow-hidden relative border border-fg/15 shadow-[0_15px_40px_rgb(var(--shadow)/0.6)]">
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
                      style={{ backgroundImage: `url(${unitVisual.image})` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-page/90 via-page/20 to-transparent" />

                      {/* Overlay Tag */}
                      <div className="absolute bottom-4 left-4 right-4 p-3.5 rounded-xl bg-page/85 backdrop-blur-md border border-fg/15">
                        <div className="hud-label text-[8px] text-accent font-bold">OPERATIONAL CAPABILITY</div>
                        <div className="font-display text-xs font-bold text-fg truncate">{unitVisual.tag}</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-3 text-[10px] font-mono text-subtle px-1 font-semibold">
                    <span>HEADQUARTERS: ASPECT TOWER DUBAI</span>
                    <span className="text-accent">STATUS: ACTIVE 24/7</span>
                  </div>
                </div>

                {/* Right Column: Technical Specification Sheet */}
                <div>
                  {/* Header Badge & Title */}
                  <div className="flex items-center justify-between border-b border-fg/10 pb-4 mb-6">
                    <div>
                      <div className="hud-label text-accent font-bold mb-1">
                        DIVISION {activeUnit.index} — SPECIFICATION SHEET
                      </div>
                      <h3 className="text-2xl sm:text-4xl font-display font-black text-fg tracking-tight">
                        {activeUnit.name}
                      </h3>
                    </div>

                    <div
                      className="px-3.5 py-1.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider"
                      style={{
                        backgroundColor: `${activeUnit.color}25`,
                        color: activeUnit.color,
                        border: `1px solid ${activeUnit.color}70`,
                      }}
                    >
                      {activeUnit.sector}
                    </div>
                  </div>

                  {/* Tagline & Narrative */}
                  <div className="space-y-3 mb-6">
                    <div className="text-sm font-bold text-accent-soft font-mono">
                      — {activeUnit.tagline}
                    </div>
                    <p className="text-sm sm:text-base text-muted leading-relaxed font-normal">
                      {activeUnit.description}
                    </p>
                  </div>

                  {/* Key Capabilities */}
                  <div className="p-5 rounded-2xl bg-fg/[0.04] border border-fg/10 mb-8 space-y-3">
                    <div className="hud-label text-accent-soft font-bold mb-2">
                      CORE OPERATIONAL DELIVERABLES
                    </div>
                    {capabilities.map((cap, i) => (
                      <div key={i} className="flex items-start gap-3 text-xs sm:text-sm text-soft font-medium">
                        <CheckCircle2 size={16} className="text-accent mt-0.5 shrink-0" />
                        <span>{cap}</span>
                      </div>
                    ))}
                  </div>

                  {/* Bottom Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                    <div className="flex items-center gap-2 text-xs font-mono text-subtle font-semibold">
                      <ShieldCheck size={14} className="text-accent" />
                      <span>ISO 9001 · ISO 14001 · ISO 45001</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
                        className="btn-ghost !py-2.5 !px-5 !text-xs cursor-pointer"
                        data-cursor="PROPOSAL"
                      >
                        Request Division RFQ
                      </button>

                      <Link
                        href={`/business-units/${activeUnit.slug}`}
                        className="btn-primary !py-2.5 !px-5 !text-xs cursor-pointer"
                        data-cursor="OPEN"
                      >
                        <span>Explore {activeUnit.name}</span>
                        <ArrowUpRight size={14} />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </TiltCard>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

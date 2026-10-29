/* eslint-disable @next/next/no-img-element */
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, ChevronLeft, ChevronRight, Play, Pause, Award, Building2, Users } from 'lucide-react';

export interface HeroSlide {
  id: string;
  badge: string;
  titlePrefix: string;
  titleItalic: string;
  titleSuffix: string;
  description: string;
  image: string;
  fallbackImage: string;
  category: string;
  stats: {
    icon: typeof Award;
    label: string;
    val: string;
  }[];
  ctaPrimary: {
    label: string;
    href: string;
  };
  ctaSecondary: {
    label: string;
    href: string;
  };
}

export const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'future',
    badge: 'AASA CP HOLDING · GLOBAL HEADQUARTERS DUBAI',
    titlePrefix: 'BUILDING THE',
    titleItalic: 'FUTURE',
    titleSuffix: 'OF INFRASTRUCTURE',
    description:
      'A multinational engineering powerhouse headquartered in Dubai, with a proud legacy of excellence spanning more than three decades across UAE, KSA, Qatar, and India.',
    image: 'https://aasa.ae/wp-content/uploads/2025/12/banner08high.jpg',
    fallbackImage: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1800&q=80',
    category: 'Engineering Excellence',
    stats: [
      { icon: Award, label: 'GCC Legacy', val: '30+ Years' },
      { icon: Building2, label: 'Completed Projects', val: '2,900+' },
      { icon: Users, label: 'Headquarters', val: 'Business Bay, Dubai' },
    ],
    ctaPrimary: { label: 'Explore 8 Divisions', href: '#divisions' },
    ctaSecondary: { label: 'Who We Are', href: '#about' },
  },
  {
    id: 'infrastructure',
    badge: 'HIGH-VOLTAGE POWER & CIVIL INFRASTRUCTURE',
    titlePrefix: 'A TRUSTED',
    titleItalic: 'PARTNER',
    titleSuffix: 'IN INFRASTRUCTURE',
    description:
      'Providing innovative, high-quality engineering services while prioritizing safety, sustainability, and regional communities across the Arabian Gulf.',
    image: 'https://aasa.ae/wp-content/uploads/2025/08/futuristic-dubai-landscape.jpg',
    fallbackImage: 'https://images.unsplash.com/photo-1545459720-aac8509eb02c?auto=format&fit=crop&w=1800&q=80',
    category: 'Regional Infrastructure',
    stats: [
      { icon: Award, label: 'High-Voltage Grid', val: '400kV' },
      { icon: Building2, label: 'Active Sites', val: '240+' },
      { icon: Users, label: 'Safety Standard', val: 'Zero Harm' },
    ],
    ctaPrimary: { label: 'Energy & Power Division', href: '#divisions' },
    ctaSecondary: { label: 'Sustainability Ethos', href: '#sustainability' },
  },
  {
    id: 'steel',
    badge: 'STRUCTURAL STEEL & HIGH-RISE MEGASTRUCTURES',
    titlePrefix: 'THE VERY',
    titleItalic: 'BACKBONE',
    titleSuffix: 'OF REGIONAL DEVELOPMENT',
    description:
      'Together, our divisions form the “nervous system” that keeps communities, businesses, and critical infrastructure networks moving forward.',
    image: 'https://aasa.ae/wp-content/uploads/2025/12/banner09high.jpg',
    fallbackImage: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1800&q=80',
    category: 'Structural Fabrication',
    stats: [
      { icon: Award, label: 'Steel Fabricated', val: '45,000+ T' },
      { icon: Building2, label: 'Engineering Protocol', val: '3D BIM' },
      { icon: Users, label: 'Iconic Skylines', val: 'Dubai & Abu Dhabi' },
    ],
    ctaPrimary: { label: 'Steel Fabrication', href: '#divisions' },
    ctaSecondary: { label: 'Landmark Projects', href: '#projects' },
  },
  {
    id: 'workforce',
    badge: 'HUMAN CAPITAL & DIGITAL SMART BMS',
    titlePrefix: 'SYNCHRONIZING',
    titleItalic: '25,000+',
    titleSuffix: 'CERTIFIED TALENT',
    description:
      'Over 7,000 direct employees and 25,000+ certified workforce deployed across the GCC, powered by smart IoT telemetry and integrated facilities management.',
    image: 'https://aasa.ae/wp-content/uploads/2025/09/aasa-website-FAZ08814.jpg',
    fallbackImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1800&q=80',
    category: 'Turnkey Workforce',
    stats: [
      { icon: Users, label: 'Workforce Strength', val: '25,000+' },
      { icon: Award, label: 'Direct Employees', val: '7,000+' },
      { icon: Building2, label: 'Sovereign Markets', val: '4 Nations' },
    ],
    ctaPrimary: { label: 'Staffing Solutions', href: '#divisions' },
    ctaSecondary: { label: 'Request Proposal', href: '#contact' },
  },
];

const SLIDE_DURATION = 6500; // 6.5s per slide

export default function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [imgErrors, setImgErrors] = useState<Record<number, boolean>>({});
  const startTimeRef = useRef<number>(Date.now());

  const currentSlide = HERO_SLIDES[current];

  const goToSlide = useCallback((index: number, dir?: number) => {
    setDirection(dir !== undefined ? dir : index > current ? 1 : -1);
    setCurrent(index);
    setProgress(0);
    startTimeRef.current = Date.now();
  }, [current]);

  const nextSlide = useCallback(() => {
    goToSlide((current + 1) % HERO_SLIDES.length, 1);
  }, [current, goToSlide]);

  const prevSlide = useCallback(() => {
    goToSlide((current - 1 + HERO_SLIDES.length) % HERO_SLIDES.length, -1);
  }, [current, goToSlide]);

  // Smooth progress bar counter
  useEffect(() => {
    if (!isPlaying) return;

    startTimeRef.current = Date.now();
    const interval = 50;

    const tick = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const pct = Math.min(100, (elapsed / SLIDE_DURATION) * 100);
      setProgress(pct);

      if (elapsed >= SLIDE_DURATION) {
        nextSlide();
      }
    }, interval);

    return () => clearInterval(tick);
  }, [current, isPlaying, nextSlide]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  const scrollTo = (href: string) => {
    if (href.startsWith('#')) {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.open(href, '_blank');
    }
  };

  return (
    <section
      id="hero"
      className="relative w-full min-h-[100svh] bg-transparent text-fg overflow-hidden flex flex-col justify-between select-none pt-20 sm:pt-24 lg:pt-28"
      onMouseEnter={() => setIsPlaying(false)}
      onMouseLeave={() => setIsPlaying(true)}
    >

      {/* Full-Bleed Edge-to-Edge Slide Viewport with Architectural Curtain Wipe */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={current}
            custom={direction}
            initial={{
              clipPath: direction > 0 ? 'inset(0 0 0 100%)' : 'inset(0 100% 0 0)',
              zIndex: 2,
            }}
            animate={{
              clipPath: 'inset(0 0 0 0%)',
              zIndex: 2,
            }}
            exit={{
              clipPath: direction > 0 ? 'inset(0 100% 0 0)' : 'inset(0 0 0 100%)',
              zIndex: 1,
            }}
            transition={{
              duration: 1.1,
              ease: [0.77, 0, 0.18, 1], // Luxury cubic-bezier curtain wipe
            }}
            className="absolute inset-0 w-full h-full"
          >
            {/* Background Image with Slow Parallax Scale */}
            <motion.div
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 7, ease: 'easeOut' }}
              className="hero-photo absolute inset-0 w-full h-full opacity-[0.32] mix-blend-luminosity"
              style={{
                maskImage: 'linear-gradient(90deg, #000 0%, #000 38%, rgba(0,0,0,0.35) 70%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(90deg, #000 0%, #000 38%, rgba(0,0,0,0.35) 70%, transparent 100%)',
              }}
            >
              <img
                src={imgErrors[current] ? currentSlide.fallbackImage : currentSlide.image}
                alt={currentSlide.titlePrefix}
                onError={() => setImgErrors((prev) => ({ ...prev, [current]: true }))}
                className="w-full h-full object-cover object-center"
              />
            </motion.div>

            {/* Cinematic Studio Multi-Angle Shade for 100% Crisp Typography Legibility */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'linear-gradient(90deg, rgb(var(--page) / calc(0.92 * var(--veil))) 0%, rgb(var(--page) / calc(0.7 * var(--veil))) 38%, rgb(var(--page) / calc(0.12 * var(--veil))) 68%, rgb(var(--page) / calc(0 * var(--veil))) 100%), linear-gradient(0deg, rgb(var(--page) / calc(0.9 * var(--veil))) 0%, rgb(var(--page) / calc(0 * var(--veil))) 30%)',
              }}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Main Hero Content Area (Centered in available viewport) */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 w-full relative z-20 flex-1 flex items-center py-4 sm:py-6 lg:py-8">
        <div className="grid lg:grid-cols-[1.25fr,0.75fr] gap-8 lg:gap-12 items-center w-full">
          {/* Left: Massive Typography, Concise Story & CTAs */}
          <div>
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={current}
                initial={{ opacity: 0, y: direction > 0 ? 25 : -25 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: direction > 0 ? -15 : 15 }}
                transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* Eyebrow Label with Architectural Line */}
                <div className="inline-flex items-center gap-3 mb-4 sm:mb-5">
                  <span className="w-8 h-[2px] bg-accent inline-block shadow-[0_0_8px_rgba(56,189,248,0.8)]" />
                  <span className="font-mono text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] text-accent-soft">
                    {currentSlide.badge}
                  </span>
                </div>

                {/* Massive Architectural Headline */}
                <h1 className="font-display font-extrabold text-3xl sm:text-5xl md:text-6xl lg:text-[4.4rem] xl:text-[5.2rem] tracking-tight leading-[1.03] text-fg mb-4 sm:mb-5">
                  {currentSlide.titlePrefix}{' '}
                  <em className="font-serif italic font-normal text-accent-soft">
                    {currentSlide.titleItalic}
                  </em>{' '}
                  <br className="hidden sm:inline" />
                  <span className="text-fg/95">
                    {currentSlide.titleSuffix}
                  </span>
                </h1>

                {/* Concise Authentic Narrative */}
                <p className="text-sm sm:text-base lg:text-lg text-fg/80 leading-relaxed font-normal max-w-xl mb-6 sm:mb-8">
                  {currentSlide.description}
                </p>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <button
                    onClick={() => scrollTo(currentSlide.ctaPrimary.href)}
                    className="inline-flex items-center gap-3 px-7 sm:px-8 py-3.5 sm:py-4 rounded-full bg-cta hover:bg-fg text-on-cta hover:text-page font-bold text-xs sm:text-sm tracking-wide transition-all duration-300 shadow-[0_10px_30px_rgba(0,166,206,0.35)] hover:shadow-[0_15px_35px_rgba(255,255,255,0.4)] hover:-translate-y-0.5 cursor-pointer group"
                    data-cursor="EXPLORE"
                  >
                    <span>{currentSlide.ctaPrimary.label}</span>
                    <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-page/15 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                      <ArrowUpRight size={13} />
                    </span>
                  </button>

                  <button
                    onClick={() => scrollTo(currentSlide.ctaSecondary.href)}
                    className="inline-flex items-center gap-2 px-7 sm:px-8 py-3.5 sm:py-4 rounded-full border border-fg/35 hover:border-fg text-fg hover:text-page hover:bg-fg font-bold text-xs sm:text-sm tracking-wide transition-all duration-300 cursor-pointer"
                    data-cursor="ABOUT"
                  >
                    <span>{currentSlide.ctaSecondary.label}</span>
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right: Floating Frosted Glass Stat Badges (Desktop) */}
          <div className="hidden lg:flex flex-col gap-3 relative justify-center items-end">
            {currentSlide.stats.map((st, i) => {
              const Icon = st.icon;
              return (
                <motion.div
                  key={st.label + current}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.15 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  className="w-72 p-4 rounded-xl bg-fg/[0.08] backdrop-blur-xl border border-fg/20 shadow-[0_15px_40px_rgb(var(--shadow)/0.3)] hover:bg-fg/[0.12] transition-colors"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-lg bg-accent/20 border border-cyan-400/40 text-accent-soft flex items-center justify-center shrink-0">
                      <Icon size={18} />
                    </div>
                    <div>
                      <div className="font-display text-xl font-black text-fg tracking-tight leading-snug">
                        {st.val}
                      </div>
                      <div className="font-mono text-[9px] uppercase tracking-wider text-accent-pale/80 font-bold">
                        {st.label}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Architectural Bottom Ticker Bar (Edge-to-Edge, Always Visible) */}
      <div className="relative z-30 w-full shrink-0 border-t border-fg/15 bg-page/85 backdrop-blur-xl py-3 sm:py-4">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* 4 Interactive Slide Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6 w-full md:w-auto flex-1 max-w-4xl">
            {HERO_SLIDES.map((slide, idx) => {
              const isActive = current === idx;
              return (
                <button
                  key={slide.id}
                  onClick={() => goToSlide(idx)}
                  className={`text-left transition-opacity duration-300 cursor-pointer group ${
                    isActive ? 'opacity-100' : 'opacity-50 hover:opacity-85'
                  }`}
                  data-cursor="SELECT"
                >
                  <div className="font-mono text-[10px] font-bold text-accent tracking-wider uppercase mb-1">
                    0{idx + 1} — {slide.category.toUpperCase()}
                  </div>
                  <div className="font-display text-xs sm:text-sm font-bold text-fg truncate mb-2">
                    {slide.titleItalic} {slide.titleSuffix}
                  </div>
                  {/* Progress Line */}
                  <div className="w-full h-[2px] bg-fg/20 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-accent transition-all duration-100 ${
                        isActive ? '' : 'w-0'
                      }`}
                      style={{
                        width: isActive ? `${progress}%` : '0%',
                      }}
                    />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Slide Navigation Controls & Counter */}
          <div className="flex items-center gap-3 shrink-0">
            <span className="font-mono text-xs font-bold text-fg/80 pr-2">
              0{current + 1} <span className="text-fg/40">/ 0{HERO_SLIDES.length}</span>
            </span>

            <button
              onClick={prevSlide}
              className="w-10 h-10 rounded-full border border-fg/25 hover:border-fg hover:bg-fg hover:text-page text-fg flex items-center justify-center transition-all duration-200 cursor-pointer"
              aria-label="Previous slide"
              data-cursor="PREV"
            >
              <ChevronLeft size={18} />
            </button>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-9 h-9 rounded-full border border-fg/20 hover:border-fg text-fg/70 hover:text-fg flex items-center justify-center transition-colors cursor-pointer"
              aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
            >
              {isPlaying ? <Pause size={13} /> : <Play size={13} className="ml-0.5" />}
            </button>

            <button
              onClick={nextSlide}
              className="w-10 h-10 rounded-full border border-fg/25 hover:border-fg hover:bg-fg hover:text-page text-fg flex items-center justify-center transition-all duration-200 cursor-pointer"
              aria-label="Next slide"
              data-cursor="NEXT"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

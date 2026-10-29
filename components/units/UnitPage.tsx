/* eslint-disable @next/next/no-img-element */
'use client';

import { useRef } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowUpRight, ArrowRight, CheckCircle2, Phone, Mail, MapPin, Layers, Building2 } from 'lucide-react';
import SmoothScrollProvider from '@/components/providers/SmoothScrollProvider';
import CinematicScroll from '@/components/providers/CinematicScroll';
import ScrollProgress from '@/components/ui/ScrollProgress';
import Navbar, { unitHref } from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import TiltCard from '@/components/ui/TiltCard';
import TextScrub from '@/components/ui/TextScrub';
import Counter from '@/components/ui/Counter';
import type { UnitGeometry } from '@/components/canvas/UnitCenterpieces';
import { BUSINESS_UNITS, COMPANY } from '@/lib/constants';
import { UNIT_CONTENT } from '@/lib/units';

const CinematicWorld = dynamic(() => import('@/components/canvas/CinematicWorld'), { ssr: false });
const MagneticCursor = dynamic(() => import('@/components/canvas/MagneticCursor'), { ssr: false });

const EASE = [0.16, 1, 0.3, 1] as const;

// Serif-italic accent on the closing words of a headline (styling only, the words are unchanged)
function Headline({ text }: { text: string }) {
  const words = text.split(' ');
  const cut = Math.max(1, words.length - 2);
  return (
    <>
      {words.slice(0, cut).join(' ')}{' '}
      <em className="font-serif italic font-normal text-accent-soft">{words.slice(cut).join(' ')}</em>
    </>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <span className="w-2 h-2 rounded-full bg-accent shadow-[0_0_8px_rgba(56,189,248,0.8)]" />
      <span className="hud-label font-bold">{children}</span>
    </div>
  );
}

function ParallaxImage({ src, alt, caption }: { src: string; alt: string; caption: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['-12%', '12%']);

  return (
    <div ref={ref} className="force-dark relative h-[300px] sm:h-[420px] rounded-3xl overflow-hidden border border-fg/15 group">
      <motion.img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        style={{ y }}
        className="absolute inset-0 w-full h-[124%] -top-[12%] object-cover transition-transform duration-[1.2s] group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-page/85 via-page/10 to-transparent" />
      <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between">
        <span className="hud-label text-accent">{caption}</span>
        <span className="w-9 h-9 rounded-full border border-fg/25 flex items-center justify-center text-fg">
          <ArrowUpRight size={15} />
        </span>
      </div>
    </div>
  );
}

export default function UnitPage({ slug }: { slug: string }) {
  const index = BUSINESS_UNITS.findIndex((u) => u.slug === slug);
  const unit = BUSINESS_UNITS[index];
  const c = UNIT_CONTENT[slug];
  const next = BUSINESS_UNITS[(index + 1) % BUSINESS_UNITS.length];
  const [headWord, tailWord] = c.servicesHeading.split(' ');

  // Hero side cards: the unit's own figures, else facts that are true for every unit page
  const heroCards = c.stats.length
    ? c.stats
    : [
        { value: String(c.services.length), label: c.servicesHeading },
        { value: COMPANY.heritage, label: 'Years of AASA Group Legacy' },
        { value: unit.index, label: `of ${BUSINESS_UNITS.length} Business Units` },
      ];

  const scrollTo = (href: string) => document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <SmoothScrollProvider>
      <ScrollProgress />
      <MagneticCursor />
      <CinematicWorld unit={{ geometry: unit.geometry as UnitGeometry, color: unit.color }} />
      <Navbar />

      <main className="relative z-10">
        {/* ─── HERO ─── */}
        <section id="hero" className="relative w-full min-h-[100svh] overflow-hidden flex flex-col justify-between pt-24 sm:pt-28">
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              initial={{ scale: 1.12, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 2.4, ease: 'easeOut' }}
              className="hero-photo absolute inset-0 opacity-[0.32] mix-blend-luminosity"
              style={{
                maskImage: 'linear-gradient(90deg, #000 0%, #000 38%, rgba(0,0,0,0.35) 70%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(90deg, #000 0%, #000 38%, rgba(0,0,0,0.35) 70%, transparent 100%)',
              }}
            >
              <img src={c.banner} alt="" fetchPriority="high" decoding="async" className="w-full h-full object-cover object-center" />
            </motion.div>
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'linear-gradient(90deg, rgb(var(--page) / calc(0.92 * var(--veil))) 0%, rgb(var(--page) / calc(0.7 * var(--veil))) 38%, rgb(var(--page) / calc(0.12 * var(--veil))) 68%, rgb(var(--page) / 0) 100%), linear-gradient(0deg, rgb(var(--page) / calc(0.9 * var(--veil))) 0%, rgb(var(--page) / 0) 30%)',
              }}
            />
          </div>

          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 w-full relative z-20 flex-1 flex items-center py-6">
            <div className="grid lg:grid-cols-[1.25fr,0.75fr] gap-10 lg:gap-14 items-center w-full">
              <div>
                <motion.div
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
                  className="inline-flex items-center gap-3 mb-6"
                >
                  <span className="w-8 h-[2px] bg-accent inline-block shadow-[0_0_8px_rgba(56,189,248,0.8)]" />
                  <span className="font-mono text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] text-accent-soft">
                    Business Unit {unit.index} / 0{BUSINESS_UNITS.length} · {unit.sector}
                  </span>
                </motion.div>

                {/* Official unit wordmark */}
                {/* Blur animates on the wrapper so the img keeps its theme colour filter */}
                <motion.div
                  initial={{ opacity: 0, y: 30, filter: 'blur(12px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{ duration: 1.1, delay: 0.3, ease: EASE }}
                  className="mb-6"
                >
                  <img src={c.logo} alt={unit.name} className="unit-logo h-9 sm:h-12 lg:h-14 w-auto" />
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 40, clipPath: 'inset(0 0 100% 0)' }}
                  animate={{ opacity: 1, y: 0, clipPath: 'inset(0 0 -20% 0)' }}
                  transition={{ duration: 1.3, delay: 0.45, ease: EASE }}
                  className="font-display font-extrabold text-3xl sm:text-5xl lg:text-[3.6rem] xl:text-[4.1rem] tracking-tight leading-[1.05] text-fg mb-6 max-w-3xl"
                >
                  <Headline text={c.tagline} />
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.9, delay: 0.65, ease: EASE }}
                  className="text-sm sm:text-base lg:text-lg text-fg/80 leading-relaxed max-w-2xl mb-8"
                >
                  {c.heroText}
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.8, ease: EASE }}
                  className="flex flex-wrap items-center gap-3 sm:gap-4"
                >
                  <button onClick={() => scrollTo('#services')} className="btn-primary" data-cursor="EXPLORE">
                    <span>Explore {c.servicesHeading}</span>
                    <ArrowRight size={15} />
                  </button>
                  <button onClick={() => scrollTo('#contact')} className="btn-ghost" data-cursor="PROPOSAL">
                    <span>Request Proposal</span>
                  </button>
                </motion.div>
              </div>

              {/* Floating glass figures */}
              <div className="hidden lg:flex flex-col gap-3 items-end">
                {heroCards.map((s, i) => (
                  <motion.div
                    key={s.label}
                    initial={{ opacity: 0, x: 40, rotateY: -18 }}
                    animate={{ opacity: 1, x: 0, rotateY: 0 }}
                    transition={{ duration: 0.9, delay: 0.5 + i * 0.1, ease: EASE }}
                    style={{ transformPerspective: 1000 }}
                    className="glass-panel w-72 p-4 rounded-xl"
                  >
                    <div className="font-display text-2xl font-black text-fg tracking-tight">
                      <Counter value={s.value} />
                    </div>
                    <div className="font-mono text-[9px] uppercase tracking-wider text-accent-pale/80 font-bold mt-0.5">
                      {s.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* 8-unit switcher bar */}
          <div className="relative z-30 w-full shrink-0 border-t border-fg/15 bg-page/85 backdrop-blur-xl">
            <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 grid grid-cols-4 lg:grid-cols-8">
              {BUSINESS_UNITS.map((u) => {
                const active = u.slug === slug;
                return (
                  <Link
                    key={u.id}
                    href={unitHref(u.slug)}
                    className={`group relative py-3 sm:py-4 px-2 text-left transition-opacity ${active ? 'opacity-100' : 'opacity-55 hover:opacity-100'}`}
                    data-cursor="OPEN"
                  >
                    <div className="font-mono text-[9px] sm:text-[10px] font-bold text-accent tracking-wider">{u.index}</div>
                    <div className="font-display text-[11px] sm:text-sm font-bold text-fg truncate">{u.name.replace('aasa ', '')}</div>
                    <span
                      className={`absolute left-2 right-2 bottom-0 h-[2px] rounded-full transition-transform origin-left ${active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}
                      style={{ backgroundColor: u.color, boxShadow: `0 0 10px ${u.color}` }}
                    />
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* ─── OVERVIEW ─── */}
        <section id="about" className="relative py-28 lg:py-36 overflow-hidden text-fg">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
            <div className="grid lg:grid-cols-[1fr,1.3fr] gap-10 lg:gap-16 items-start mb-16">
              <div>
                <Eyebrow>[ 01 — Overview ]</Eyebrow>
                <h2 className="font-display font-black text-3xl sm:text-5xl tracking-tight leading-[1.1]">
                  About <em className="font-serif italic font-normal text-accent-soft">{unit.name}</em>
                </h2>
                <div className="mt-6 flex items-center gap-3 text-xs font-mono text-subtle">
                  <Building2 size={15} className="text-accent" />
                  A division of {COMPANY.name}
                </div>
              </div>
              <div className="space-y-6">
                <TextScrub text={c.intro[0]} className="text-base sm:text-lg text-muted font-medium" />
                {c.intro.slice(1).map((p) => (
                  <p key={p.slice(0, 24)} className="text-sm sm:text-base text-muted leading-relaxed">
                    {p}
                  </p>
                ))}
              </div>
            </div>

            {c.stats.length > 0 && (
              <div className={`grid grid-cols-2 ${c.stats.length > 2 ? 'lg:grid-cols-4' : 'lg:grid-cols-2'} gap-5 mb-16`}>
                {c.stats.map((s, i) => (
                  <TiltCard key={s.label} delay={i * 0.1} cursorLabel="STAT" className="glass-panel p-7 rounded-2xl h-full">
                    <div className="font-mono text-[10px] font-bold text-accent tracking-widest uppercase mb-4">Index 0{i + 1}</div>
                    <div className="text-3xl sm:text-5xl font-display font-extrabold tracking-tight">
                      <Counter value={s.value} />
                    </div>
                    <div className="text-sm font-bold text-fg/90 mt-2">{s.label}</div>
                  </TiltCard>
                ))}
              </div>
            )}

            {/* Unit commitment statement */}
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.97 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.9, ease: EASE }}
              className="glass-panel rounded-3xl p-8 sm:p-12 relative overflow-hidden"
            >
              <span className="absolute left-0 top-8 bottom-8 w-[3px] rounded-full" style={{ backgroundColor: unit.color, boxShadow: `0 0 18px ${unit.color}` }} />
              <div className="hud-label mb-3">{c.closing.title || 'Our Commitment'}</div>
              <p className="font-display text-lg sm:text-2xl font-semibold leading-snug text-fg/90 max-w-4xl">{c.closing.text}</p>
            </motion.div>
          </div>
        </section>

        {/* ─── SERVICES ─── */}
        <section id="services" className="relative py-28 lg:py-36 overflow-hidden text-fg border-t border-cyan-500/20">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
            <div className="grid lg:grid-cols-2 gap-8 items-end mb-14">
              <div>
                <Eyebrow>[ 02 — {c.servicesHeading} ]</Eyebrow>
                <h2 className="font-display font-black text-3xl sm:text-5xl tracking-tight">
                  {headWord} <em className="font-serif italic font-normal text-accent-soft">{tailWord}</em>.
                </h2>
              </div>
              <div className="flex items-center gap-3 lg:justify-end text-xs font-mono text-subtle">
                <Layers size={15} className="text-accent" />
                {c.services.length} capabilities · {unit.sector}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 items-start">
              {c.services.map((s, i) => (
                <TiltCard key={s.title} delay={(i % 3) * 0.1} cursorLabel="SERVICE" className="glass-panel p-7 sm:p-8 rounded-2xl h-full">
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-mono text-xs font-bold text-accent tracking-widest">0{i + 1}</span>
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: unit.color, boxShadow: `0 0 10px ${unit.color}` }} />
                  </div>
                  <h3 className="font-display text-xl sm:text-2xl font-bold tracking-tight mb-3">{s.title}</h3>
                  <p className="text-sm text-muted leading-relaxed">{s.description}</p>
                  {s.points && (
                    <ul className="mt-5 space-y-2.5">
                      {s.points.map((p) => (
                        <li key={p} className="flex items-start gap-2.5 text-sm text-fg/85">
                          <CheckCircle2 size={15} className="text-accent shrink-0 mt-0.5" />
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </TiltCard>
              ))}
            </div>
          </div>
        </section>

        {/* ─── GALLERY ─── */}
        <section id="gallery" className="relative py-20 lg:py-28 overflow-hidden text-fg">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
            <div className={`grid gap-5 ${c.gallery.length > 1 ? 'lg:grid-cols-[1.2fr,1fr,1fr]' : 'lg:grid-cols-[1.4fr,1fr]'}`}>
              {[c.banner, ...c.gallery].map((src, i) => (
                <ParallaxImage key={src} src={src} alt={`${unit.name} — ${i + 1}`} caption={`${unit.name} · ${unit.sector}`} />
              ))}
            </div>
          </div>
        </section>

        {/* ─── SECTORS & CLIENTS ─── */}
        {(c.sectors.length > 0 || c.clients.length > 0) && (
          <section id="sectors" className="relative py-28 lg:py-32 overflow-hidden text-fg border-t border-cyan-500/20">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
              {c.sectors.length > 0 && (
                <div className="mb-20">
                  <Eyebrow>[ 03 — Industry Reach ]</Eyebrow>
                  <h2 className="font-display font-black text-3xl sm:text-5xl tracking-tight mb-4">
                    Sectors we <em className="font-serif italic font-normal text-accent-soft">serve</em>.
                  </h2>
                  {c.sectorsIntro && <p className="text-sm sm:text-base text-muted max-w-2xl mb-10">{c.sectorsIntro}</p>}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
                    {c.sectors.map((s, i) => (
                      <motion.div
                        key={s.name}
                        initial={{ opacity: 0, y: 30, rotateX: 18 }}
                        whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.7, delay: (i % 4) * 0.08, ease: EASE }}
                        style={{ transformPerspective: 900 }}
                        className="glass-panel rounded-2xl p-6"
                      >
                        <div className="font-mono text-[10px] font-bold text-accent tracking-widest mb-3">0{i + 1}</div>
                        <div className="font-display text-lg font-bold">{s.name}</div>
                        {s.detail && <div className="text-xs text-subtle mt-2 leading-relaxed">{s.detail}</div>}
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {c.clients.length > 0 && (
                <div>
                  <Eyebrow>[ {c.sectors.length ? '04' : '03'} — Clients ]</Eyebrow>
                  <h2 className="font-display font-black text-3xl sm:text-5xl tracking-tight mb-10">
                    Trusted by the <em className="font-serif italic font-normal text-accent-soft">region’s leaders</em>.
                  </h2>
                  <div className="relative overflow-hidden py-6 [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]">
                    <div className="flex w-max animate-marquee gap-4">
                      {[...c.clients, ...c.clients].map((name, i) => (
                        <span
                          key={`${name}-${i}`}
                          className="glass-panel rounded-full px-6 py-3 font-display text-base sm:text-lg font-bold whitespace-nowrap text-fg/85"
                        >
                          {name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* ─── THE GROUP: all eight units ─── */}
        <section id="divisions" className="relative py-28 lg:py-36 overflow-hidden text-fg border-t border-cyan-500/20">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
            <Eyebrow>[ The AASA Group ]</Eyebrow>
            <h2 className="font-display font-black text-3xl sm:text-5xl tracking-tight mb-12">
              Explore all <em className="font-serif italic font-normal text-accent-soft">8 Business Units</em>.
            </h2>

            {/* Next unit: cinematic hand-off */}
            <Link href={unitHref(next.slug)} className="block mb-6 group" data-cursor="NEXT">
              <TiltCard cursorLabel="NEXT" className="glass-panel rounded-3xl p-8 sm:p-12 overflow-hidden relative">
                <div
                  className="absolute -right-24 -top-24 w-80 h-80 rounded-full blur-3xl opacity-30 group-hover:opacity-50 transition-opacity"
                  style={{ backgroundColor: next.color }}
                />
                <div className="relative flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                  <div>
                    <div className="hud-label mb-3">Next · Business Unit {next.index}</div>
                    <div className="font-display text-4xl sm:text-6xl font-black tracking-tight">{next.name}</div>
                    <div className="text-sm sm:text-base text-muted mt-2">{next.tagline}</div>
                  </div>
                  <span className="w-14 h-14 rounded-full bg-cta text-on-cta flex items-center justify-center group-hover:translate-x-2 transition-transform shrink-0">
                    <ArrowRight size={22} />
                  </span>
                </div>
              </TiltCard>
            </Link>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {BUSINESS_UNITS.map((u, i) => {
                const active = u.slug === slug;
                return (
                  <motion.div
                    key={u.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.6, delay: (i % 4) * 0.07, ease: EASE }}
                  >
                    <Link
                      href={unitHref(u.slug)}
                      className={`glass-panel block rounded-2xl p-5 h-full ${active ? 'glass-panel-active' : ''}`}
                      data-cursor={active ? 'HERE' : 'OPEN'}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <span className="font-mono text-[10px] font-bold text-accent">{u.index}</span>
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: u.color, boxShadow: `0 0 10px ${u.color}` }} />
                      </div>
                      <div className="font-display font-bold text-base sm:text-lg">{u.name}</div>
                      <div className="text-[11px] text-subtle mt-1 line-clamp-2">{active ? 'You are here' : u.tagline}</div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ─── CONTACT ─── */}
        <section id="contact" className="relative py-28 lg:py-36 overflow-hidden text-fg border-t border-cyan-500/20">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
            <div className="glass-panel rounded-3xl p-8 sm:p-14 grid lg:grid-cols-[1.3fr,1fr] gap-10 items-center">
              <div>
                <Eyebrow>[ Get in Touch ]</Eyebrow>
                <h2 className="font-display font-black text-3xl sm:text-5xl tracking-tight mb-5">
                  Start a project with <em className="font-serif italic font-normal text-accent-soft">{unit.name}</em>.
                </h2>
                <p className="text-sm sm:text-base text-muted max-w-xl">
                  Connect with the AASA CP Holding team in Business Bay, Dubai for proposals, tenders and partnerships.
                </p>
                <div className="flex flex-wrap gap-3 mt-8">
                  <a
                    href={`${COMPANY.contact.emailHref}?subject=${encodeURIComponent(`${unit.name} enquiry`)}`}
                    className="btn-primary"
                    data-cursor="EMAIL"
                  >
                    <Mail size={15} />
                    <span>Email {unit.name}</span>
                  </a>
                  <a href={COMPANY.contact.telHref} className="btn-ghost" data-cursor="CALL">
                    <Phone size={15} />
                    <span>{COMPANY.contact.tel}</span>
                  </a>
                </div>
              </div>
              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <MapPin size={17} className="text-accent shrink-0 mt-0.5" />
                  <span className="text-fg/85">{COMPANY.hq.full}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone size={17} className="text-accent shrink-0" />
                  <a href={COMPANY.contact.telHref} className="text-fg/85 hover:text-accent">{COMPANY.contact.tel}</a>
                </div>
                <div className="flex items-center gap-3">
                  <Mail size={17} className="text-accent shrink-0" />
                  <a href={COMPANY.contact.emailHref} className="text-fg/85 hover:text-accent">{COMPANY.contact.email}</a>
                </div>
                <a
                  href={unit.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 pt-3 font-mono text-xs text-accent hover:underline"
                >
                  {unit.name} on aasa.ae <ArrowUpRight size={13} />
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <CinematicScroll />
      <div className="cinematic-grain" aria-hidden />
    </SmoothScrollProvider>
  );
}

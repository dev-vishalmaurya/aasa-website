/* eslint-disable @next/next/no-img-element */
'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { COMPANY, BUSINESS_UNITS } from '@/lib/constants';
import { AASA_LOGO_SRC } from '@/components/ui/AasaLogo';

export const WORLD_READY_EVENT = 'aasa:world-ready';
const SEEN_KEY = 'aasa-intro-seen';
const MIN_MS = 1900;
const MAX_MS = 7000;
const EASE = [0.16, 1, 0.3, 1] as const;
const CURTAIN = [0.77, 0, 0.175, 1] as const;

type Phase = 'loading' | 'reveal' | 'done';

function markSeen() {
  try {
    sessionStorage.setItem(SEEN_KEY, '1');
  } catch {
    // Storage blocked: intro shows again next visit
  }
}

/**
 * Splash screen tied to real readiness: fonts, window load and the 3D world's first rendered frame.
 * Shown once per browser session (any entry page); `?skipIntro` bypasses it.
 */
export default function Preloader() {
  const [phase, setPhase] = useState<Phase>('loading');
  const [progress, setProgress] = useState(0);
  const [unitIdx, setUnitIdx] = useState(0);
  const target = useRef(0.08);
  const skipped = useRef(false);

  const skip = () => {
    skipped.current = true;
    markSeen();
    setProgress(1);
    setPhase('reveal');
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    let seen = false;
    try {
      seen = sessionStorage.getItem(SEEN_KEY) === '1';
    } catch {
      // Storage blocked: show the intro
    }
    if (params.has('skipIntro') || seen) {
      setPhase('done');
      return;
    }

    const root = document.documentElement;
    root.style.overflow = 'hidden';
    const start = performance.now();
    const done = { fonts: false, load: false, world: false };
    const recompute = () => {
      target.current = 0.08 + (done.fonts ? 0.22 : 0) + (done.load ? 0.3 : 0) + (done.world ? 0.4 : 0);
    };

    document.fonts?.ready.then(() => {
      done.fonts = true;
      recompute();
    });
    // DOM ready rather than window "load": remote photography can be slow and keeps loading behind the scene
    const onLoad = () => {
      done.load = true;
      recompute();
    };
    if (document.readyState !== 'loading') onLoad();
    else document.addEventListener('DOMContentLoaded', onLoad, { once: true });

    const onWorld = () => {
      done.world = true;
      recompute();
    };
    if ((window as unknown as { __aasaWorldReady?: boolean }).__aasaWorldReady) onWorld();
    window.addEventListener(WORLD_READY_EVENT, onWorld, { once: true });

    // Ease the visible percentage toward real progress; finish when everything is ready (or on timeout)
    let raf = 0;
    let shown = 0;
    const tick = (now: number) => {
      if (skipped.current) return;
      const elapsed = now - start;
      const allReady = done.fonts && done.load && done.world;
      const goal = allReady && elapsed > MIN_MS ? 1 : elapsed > MAX_MS ? 1 : Math.min(target.current, 0.96);
      shown += (goal - shown) * 0.06;
      if (goal === 1 && shown > 0.995) shown = 1;
      setProgress(shown);
      if (shown >= 1) {
        markSeen();
        setTimeout(() => setPhase('reveal'), 250);
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const cycle = setInterval(() => setUnitIdx((i) => (i + 1) % BUSINESS_UNITS.length), 520);

    return () => {
      cancelAnimationFrame(raf);
      clearInterval(cycle);
      document.removeEventListener('DOMContentLoaded', onLoad);
      window.removeEventListener(WORLD_READY_EVENT, onWorld);
      root.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    if (phase !== 'reveal') return;
    document.documentElement.style.overflow = '';
    const t = setTimeout(() => setPhase('done'), 1400);
    return () => clearTimeout(t);
  }, [phase]);

  if (phase === 'done') return null;

  const pct = Math.round(progress * 100);
  const revealing = phase === 'reveal';
  const unit = BUSINESS_UNITS[unitIdx];

  return (
    <div data-preloader className="fixed inset-0 z-[9999] select-none pointer-events-auto" aria-busy={!revealing} aria-label="Loading AASA CP Holding">
      {/* Curtain halves split apart on reveal */}
      <motion.div
        className="absolute inset-x-0 top-0 h-1/2 bg-page"
        animate={revealing ? { y: '-100%' } : { y: 0 }}
        transition={{ duration: 1.15, ease: CURTAIN, delay: 0.15 }}
      />
      <motion.div
        className="absolute inset-x-0 bottom-0 h-1/2 bg-page"
        animate={revealing ? { y: '100%' } : { y: 0 }}
        transition={{ duration: 1.15, ease: CURTAIN, delay: 0.15 }}
      />
      {/* Light seam where the curtains meet */}
      <motion.div
        className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-accent to-transparent"
        initial={{ scaleX: 0, opacity: 0 }}
        animate={revealing ? { scaleX: 1.4, opacity: 0 } : { scaleX: progress, opacity: 0.9 }}
        transition={revealing ? { duration: 0.6 } : { duration: 0.2 }}
        style={{ boxShadow: '0 0 24px rgb(var(--accent) / 0.9)' }}
      />

      <motion.div
        className="absolute inset-0 overflow-hidden"
        animate={revealing ? { opacity: 0, scale: 1.08, filter: 'blur(14px)' } : { opacity: 1, scale: 1, filter: 'blur(0px)' }}
        transition={{ duration: 0.7, ease: EASE }}
      >
        {/* Atmosphere: radial glow + perspective blueprint floor */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_55%_45%_at_50%_42%,rgb(var(--accent)/0.16),transparent_70%)]" />
        <div className="absolute inset-x-[-50%] bottom-[-10%] h-[60%] [perspective:600px]">
          <motion.div
            className="absolute inset-0 origin-bottom [transform:rotateX(68deg)]"
            style={{
              backgroundImage:
                'linear-gradient(rgb(var(--accent) / 0.22) 1px, transparent 1px), linear-gradient(90deg, rgb(var(--accent) / 0.22) 1px, transparent 1px)',
              backgroundSize: '64px 64px',
              maskImage: 'linear-gradient(to top, #000 10%, transparent 85%)',
              WebkitMaskImage: 'linear-gradient(to top, #000 10%, transparent 85%)',
            }}
            animate={{ backgroundPositionY: ['0px', '64px'] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'linear' }}
          />
        </div>

        <div className="absolute inset-0 flex flex-col">
        {/* Top meta */}
        <div className="shrink-0 p-5 sm:p-10 flex items-center justify-between">
          <motion.span
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: EASE }}
            className="hud-label"
          >
            {COMPANY.name}
          </motion.span>
          <motion.span
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: EASE }}
            className="hud-label !text-subtle hidden sm:block"
          >
            {COMPANY.hq.area} · {COMPANY.hq.city}
          </motion.span>
        </div>

        {/* Logo lockup: sized by viewport height too, so it fits landscape phones */}
        <div className="flex-1 min-h-0 flex flex-col items-center justify-center px-6 [perspective:900px]">
          <div className="relative w-[min(13rem,26vh)] aspect-[300/237]">
            {/* Glow behind the mark */}
            <motion.div
              className="absolute left-1/2 top-[22%] -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full bg-accent/30 blur-3xl"
              animate={{ opacity: [0.35, 0.75, 0.35], scale: [0.9, 1.08, 0.9] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
            />
            {/* Cyan link mark spins in */}
            <motion.img
              src={AASA_LOGO_SRC}
              alt=""
              initial={{ rotateY: 100, opacity: 0, scale: 0.6 }}
              animate={{ rotateY: 0, opacity: 1, scale: 1 }}
              transition={{ duration: 1.4, ease: EASE, delay: 0.15 }}
              className="absolute inset-0 w-full h-full object-contain [clip-path:inset(0_0_53.6%_0)]"
            />
            {/* Wordmark rises out of a mask */}
            <div className="absolute inset-0 [clip-path:inset(46.4%_0_0_0)]">
              <motion.img
                src={AASA_LOGO_SRC}
                alt=""
                initial={{ y: '60%', opacity: 0 }}
                animate={{ y: '0%', opacity: 1 }}
                transition={{ duration: 1.1, ease: EASE, delay: 0.55 }}
                className="aasa-wordmark absolute inset-0 w-full h-full object-contain"
              />
            </div>
          </div>

          <motion.p
            initial={{ opacity: 0, letterSpacing: '0.7em' }}
            animate={{ opacity: 1, letterSpacing: '0.32em' }}
            transition={{ duration: 1.6, ease: EASE, delay: 0.9 }}
            className="mt-[min(2rem,3vh)] font-mono text-[10px] sm:text-xs uppercase text-subtle text-center"
          >
            {COMPANY.tagline}
          </motion.p>

          {/* Progress */}
          <div className="mt-[min(2.5rem,4vh)] w-56 sm:w-72">
            <div className="relative h-px w-full bg-fg/10 overflow-hidden rounded-full">
              <div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-accent-soft via-accent to-sky-300"
                style={{ width: `${pct}%`, boxShadow: '0 0 12px rgb(var(--accent) / 0.8)' }}
              />
            </div>
            <div className="mt-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-subtle">
              <span className="h-4 overflow-hidden relative w-40">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={unit.id}
                    initial={{ y: 12, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -12, opacity: 0 }}
                    transition={{ duration: 0.28 }}
                    className="absolute left-0 flex items-center gap-2 whitespace-nowrap"
                  >
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: unit.color, boxShadow: `0 0 8px ${unit.color}` }} />
                    {unit.name}
                  </motion.span>
                </AnimatePresence>
              </span>
              <span className="tabular-nums text-fg font-bold">{String(pct).padStart(3, '0')}</span>
            </div>
          </div>
        </div>

        {/* Bottom meta */}
        <div className="shrink-0 p-5 sm:p-10 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.22em] text-subtle">
          <span>{COMPANY.regions.join(' · ')}</span>
          <button onClick={skip} className="hover:text-accent transition-colors cursor-pointer">
            Skip →
          </button>
        </div>
        </div>
      </motion.div>
    </div>
  );
}

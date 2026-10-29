'use client';

import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Sections whose layout relies on position: sticky must not get a 3D transform on their content
const NO_TILT = ['hero', 'projects'];

/**
 * Scroll choreography layered on top of the existing sections without touching their markup or copy:
 * each section's content rises out of depth with a 3D tilt, headings unmask like film titles,
 * eyebrow labels track in, and sections recede into the haze as they leave.
 */
export default function CinematicScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      const sections = gsap.utils.toArray<HTMLElement>('main > section');

      sections.forEach((section) => {
        if (section.id === 'hero') return;
        const content = section.querySelector<HTMLElement>(':scope > div.max-w-7xl');

        // Entrance: content tilts up out of depth
        if (content && !NO_TILT.includes(section.id)) {
          gsap.fromTo(
            content,
            { rotateX: 12, y: 120, scale: 0.94, opacity: 0, transformPerspective: 1600, transformOrigin: '50% 0%' },
            {
              rotateX: 0,
              y: 0,
              scale: 1,
              opacity: 1,
              ease: 'none',
              scrollTrigger: { trigger: section, start: 'top 95%', end: 'top 35%', scrub: 0.8 },
            }
          );
        }

        // Exit: section recedes into the haze
        gsap.to(section, {
          opacity: 0.3,
          scale: 0.97,
          ease: 'none',
          scrollTrigger: { trigger: section, start: 'bottom 45%', end: 'bottom top', scrub: 0.8 },
        });
      });

      // Film-title reveal for section headings
      gsap.utils.toArray<HTMLElement>('main section:not(#hero) h2').forEach((h2) => {
        gsap.fromTo(
          h2,
          { clipPath: 'inset(0 0 100% 0)', y: 50, filter: 'blur(10px)' },
          {
            clipPath: 'inset(0 0 -20% 0)',
            y: 0,
            filter: 'blur(0px)',
            duration: 1.4,
            ease: 'expo.out',
            scrollTrigger: { trigger: h2, start: 'top 88%', once: true },
          }
        );
      });

      // Eyebrow labels track in from wide letter-spacing
      gsap.utils.toArray<HTMLElement>('main section:not(#hero) .hud-label').forEach((label) => {
        gsap.fromTo(
          label,
          { letterSpacing: '0.6em', opacity: 0 },
          {
            letterSpacing: '0.22em',
            opacity: 1,
            duration: 1.6,
            ease: 'expo.out',
            scrollTrigger: { trigger: label, start: 'top 90%', once: true },
          }
        );
      });

      // Hero content drifts back as the camera starts its flight
      gsap.to('#hero > div.max-w-7xl', {
        y: -120,
        opacity: 0,
        scale: 0.96,
        ease: 'none',
        scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom 20%', scrub: 0.6 },
      });
    });

    // Images, fonts and accordions change the page height after mount; re-measure trigger positions
    let t: ReturnType<typeof setTimeout>;
    const refresh = () => {
      clearTimeout(t);
      t = setTimeout(() => ScrollTrigger.refresh(), 200);
    };
    const ro = new ResizeObserver(refresh);
    ro.observe(document.body);
    window.addEventListener('load', refresh);

    return () => {
      ctx.revert();
      ro.disconnect();
      window.removeEventListener('load', refresh);
      clearTimeout(t);
    };
  }, []);

  return null;
}

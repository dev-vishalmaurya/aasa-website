'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, ChevronDown, Phone, Mail, MapPin } from 'lucide-react';
import { COMPANY, BUSINESS_UNITS } from '@/lib/constants';
import ThemeToggle from '@/components/ui/ThemeToggle';
import AasaLogo from '@/components/ui/AasaLogo';

const NAV_ITEMS = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '#about' },
  { label: 'Business Units', href: '#divisions', units: true },
  { label: 'Sectors', href: '#industries' },
  { label: 'Projects', href: '#projects' },
  { label: 'Leadership', href: '#leadership' },
  { label: 'Sustainability', href: '#sustainability' },
  { label: 'Contact', href: '#contact' },
];

export const unitHref = (slug: string) => `/business-units/${slug}`;

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [unitsOpen, setUnitsOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setUnitsOpen(false);
  }, [pathname]);

  // Section anchors scroll on the current page when the section exists, otherwise go to that home section
  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    setUnitsOpen(false);
    // Home: back to the top on the home page, otherwise navigate there
    if (href === '/') {
      if (pathname === '/') window.scrollTo({ top: 0, behavior: 'smooth' });
      else router.push('/');
      return;
    }
    if (href.startsWith('#')) {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      else router.push(`/${href}`);
    } else {
      window.open(href, '_blank');
    }
  };

  const openUnits = () => {
    clearTimeout(closeTimer.current);
    setUnitsOpen(true);
  };
  const closeUnitsSoon = () => {
    closeTimer.current = setTimeout(() => setUnitsOpen(false), 160);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-page/90 backdrop-blur-2xl border-b border-fg/10 shadow-[0_10px_35px_rgb(var(--shadow)/0.6)] py-2 sm:py-2.5 text-fg'
            : 'bg-page/40 backdrop-blur-md border-b border-fg/10 py-3 sm:py-3.5 text-fg'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between w-full">
          {/* Brand Identity */}
          <Link href="/" className="flex items-center shrink-0 mr-6" data-cursor="HOME" aria-label="AASA CP Holding — Home">
            <AasaLogo className={`transition-all duration-300 ${scrolled ? 'h-10' : 'h-12'}`} />
          </Link>

          {/* Center Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-8 whitespace-nowrap">
            {NAV_ITEMS.map((item) =>
              item.units ? (
                <div key={item.label} className="relative" onMouseEnter={openUnits} onMouseLeave={closeUnitsSoon}>
                  <button
                    onClick={() => setUnitsOpen((o) => !o)}
                    className="relative text-[13px] font-semibold tracking-wide transition-colors duration-200 cursor-pointer py-1 group text-fg/80 hover:text-accent-soft flex items-center gap-1"
                    aria-expanded={unitsOpen}
                    data-cursor="UNITS"
                  >
                    <span>{item.label}</span>
                    <ChevronDown size={14} className={`transition-transform duration-300 ${unitsOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {unitsOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 14, rotateX: -12, filter: 'blur(6px)' }}
                        animate={{ opacity: 1, y: 0, rotateX: 0, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, y: 10, rotateX: -8, filter: 'blur(4px)' }}
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        style={{ transformPerspective: 1200, transformOrigin: '50% 0%' }}
                        className="absolute left-1/2 -translate-x-1/2 top-full pt-4 w-[640px]"
                      >
                        <div className="glass-panel rounded-2xl p-3 grid grid-cols-2 gap-1.5">
                          <div className="col-span-2 flex items-center justify-between px-3 pt-1 pb-2">
                            <span className="hud-label">8 Business Units</span>
                            <Link href="/#divisions" className="text-[11px] font-mono text-fg/60 hover:text-accent">
                              View all →
                            </Link>
                          </div>
                          {BUSINESS_UNITS.map((u, i) => {
                            const active = pathname === unitHref(u.slug);
                            return (
                              <motion.div
                                key={u.id}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.03 * i, duration: 0.3 }}
                              >
                                <Link
                                  href={unitHref(u.slug)}
                                  className={`group flex items-start gap-3 rounded-xl px-3 py-2.5 transition-colors ${
                                    active ? 'bg-fg/[0.08]' : 'hover:bg-fg/[0.06]'
                                  }`}
                                  data-cursor="OPEN"
                                >
                                  <span
                                    className="mt-1 w-2 h-2 rounded-full shrink-0 transition-transform group-hover:scale-150"
                                    style={{ backgroundColor: u.color, boxShadow: `0 0 10px ${u.color}` }}
                                  />
                                  <span className="min-w-0">
                                    <span className="block text-[13px] font-bold text-fg">{u.name}</span>
                                    <span className="block text-[11px] text-subtle truncate">{u.tagline}</span>
                                  </span>
                                  <ArrowUpRight
                                    size={14}
                                    className="ml-auto mt-0.5 text-accent opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all"
                                  />
                                </Link>
                              </motion.div>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <button
                  key={item.label}
                  onClick={() => handleNavClick(item.href)}
                  className="relative text-[13px] font-semibold tracking-wide transition-colors duration-200 cursor-pointer py-1 group text-fg/80 hover:text-accent-soft"
                  data-cursor="VIEW"
                >
                  <span>{item.label}</span>
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left rounded-full shadow-[0_0_8px_rgba(56,189,248,0.8)]" />
                </button>
              )
            )}
          </nav>

          {/* Right Corporate Actions */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Direct Phone Link */}
            <a
              href={COMPANY.contact.telHref}
              className="hidden xl:flex items-center gap-2 text-xs font-mono font-semibold transition-colors text-fg/85 hover:text-accent-soft"
              data-cursor="CALL"
            >
              <Phone size={13} className="text-accent" />
              <span>{COMPANY.contact.tel}</span>
            </a>

            <ThemeToggle />

            {/* Request Proposal Primary CTA */}
            <button
              onClick={() => handleNavClick('#contact')}
              className="btn-primary !py-2.5 !px-5 !text-xs font-bold rounded-lg !hidden sm:!inline-flex items-center gap-2 cursor-pointer shadow-md transition-all whitespace-nowrap"
              data-cursor="PROPOSAL"
            >
              <span>Request Proposal</span>
              <ArrowUpRight size={14} />
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden w-10 h-10 rounded-lg border flex flex-col items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0 bg-fg/10 border-fg/20 hover:border-cyan-400"
              aria-label="Toggle menu"
            >
              <span
                className={`w-5 h-[2px] transition-all duration-300 ${
                  mobileOpen ? 'rotate-45 translate-y-[5px] bg-accent' : 'bg-fg'
                }`}
              />
              <span
                className={`w-5 h-[2px] transition-all duration-300 ${
                  mobileOpen ? '-rotate-45 -translate-y-[5px] bg-accent' : 'bg-fg'
                }`}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-40 bg-page/98 backdrop-blur-3xl text-fg flex flex-col justify-between p-6 sm:p-10 pt-24 overflow-y-auto"
          >
            <div>
              <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-accent font-bold mb-6">
                CORPORATE NAVIGATION
              </div>
              <ul className="space-y-3">
                {NAV_ITEMS.filter((i) => !i.units).map((item, i) => (
                  <motion.li
                    key={item.label}
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.04 * i }}
                  >
                    <button
                      onClick={() => handleNavClick(item.href)}
                      className="text-2xl font-display font-black text-fg hover:text-accent transition-colors flex items-center justify-between w-full text-left py-1"
                    >
                      <span>{item.label}</span>
                      <ArrowUpRight size={20} className="text-accent opacity-60" />
                    </button>
                  </motion.li>
                ))}
              </ul>

              {/* Business Units */}
              <div className="mt-8 pt-6 border-t border-fg/10">
                <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-fg/50 font-bold mb-3">
                  8 BUSINESS UNITS
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {BUSINESS_UNITS.map((u) => (
                    <Link
                      key={u.id}
                      href={unitHref(u.slug)}
                      className="text-sm text-fg/80 hover:text-accent-soft flex items-center gap-2 py-1.5 font-semibold"
                    >
                      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: u.color }} />
                      <span className="truncate">{u.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Mobile Footer Info */}
            <div className="pt-6 border-t border-fg/10 mt-8 space-y-2.5 text-xs text-fg/70">
              <div className="flex items-center gap-2 text-fg font-medium">
                <MapPin size={14} className="text-accent shrink-0" />
                <span>Aspect Tower, 20th Floor, Business Bay, Dubai</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-accent shrink-0" />
                <a href={COMPANY.contact.telHref} className="hover:text-accent-soft">
                  {COMPANY.contact.tel}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-accent shrink-0" />
                <a href={COMPANY.contact.emailHref} className="hover:text-accent-soft">
                  {COMPANY.contact.email}
                </a>
              </div>

              <div className="pt-3">
                <button
                  onClick={() => handleNavClick('#contact')}
                  className="btn-primary w-full !py-3 !text-xs font-bold rounded-lg flex items-center justify-center gap-2"
                >
                  <span>Request Proposal</span>
                  <ArrowUpRight size={14} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

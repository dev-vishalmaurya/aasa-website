'use client';

import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, ExternalLink, ArrowUpRight, ArrowUp, ShieldCheck } from 'lucide-react';
import { COMPANY, BUSINESS_UNITS } from '@/lib/constants';
import AasaLogo from '@/components/ui/AasaLogo';

export default function Footer() {
  const scrollTo = (href: string) => {
    if (href.startsWith('#')) {
      // Sections that only exist on the home page fall back to navigating there
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      else window.location.href = `/${href}`;
    } else {
      window.open(href, '_blank');
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-page/85 backdrop-blur-md text-fg border-t border-cyan-500/20 overflow-hidden pt-20 pb-12 z-10">
      {/* Top Separator Line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-80" />

      {/* Massive Typographic Architectural Watermark in Background */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 pointer-events-none select-none overflow-hidden opacity-[0.03] whitespace-nowrap font-display text-[14vw] font-black tracking-tighter text-fg">
        AASA CP HOLDING
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        {/* Pre-Footer Action Banner */}
        <motion.div
          initial={{ opacity: 0, y: 45, scale: 0.96 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          className="force-dark rounded-2xl p-8 sm:p-12 mb-16 bg-gradient-to-r from-[#0F2752] to-[#18396D] border border-cyan-500/25 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 shadow-2xl"
        >
          <div>
            <div className="hud-label text-accent mb-2 font-bold">
              GLOBAL HEADQUARTERS · BUSINESS BAY, DUBAI
            </div>
            <h3 className="font-display text-2xl sm:text-4xl font-extrabold text-fg tracking-tight">
              Ready to Mobilize Your Next Megaproject?
            </h3>
            <p className="mt-2 text-sm sm:text-base text-muted max-w-xl font-normal">
              Connect directly with our regional executive engineering teams for project proposals, tenders, or joint ventures across the GCC and India.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 shrink-0">
            <button
              onClick={() => scrollTo('#contact')}
              className="btn-primary !py-3 !px-6 !text-xs cursor-pointer shadow-md"
              data-cursor="PROPOSAL"
            >
              <span>Request Proposal</span>
              <ArrowUpRight size={15} />
            </button>

            <a
              href={COMPANY.contact.telHref}
              className="btn-ghost !bg-fg/10 !border-fg/20 !text-fg hover:!bg-fg/20 !py-3 !px-6 !text-xs cursor-pointer"
              data-cursor="CALL"
            >
              <Phone size={14} className="text-accent" />
              <span>{COMPANY.contact.tel}</span>
            </a>
          </div>
        </motion.div>

        {/* 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-16 border-b border-fg/20/60">
          {/* Column 1: Brand Info */}
          <div className="space-y-5">
            <AasaLogo className="h-16" />

            <p className="text-xs text-muted leading-relaxed font-normal">
              A trusted partner in regional infrastructure. Multinational group headquartered in Dubai with three decades of engineering excellence across the UAE, KSA, Qatar, and India.
            </p>

            {/* Verified Contact Details */}
            <div className="space-y-2.5 pt-2 text-xs">
              <div className="flex items-start gap-2.5 text-muted">
                <MapPin size={14} className="text-accent shrink-0 mt-0.5" />
                <span>{COMPANY.hq.full}</span>
              </div>
              <a
                href={COMPANY.contact.telHref}
                className="flex items-center gap-2.5 text-muted hover:text-accent transition-colors font-medium"
                data-cursor="CALL"
              >
                <Phone size={14} className="text-accent shrink-0" />
                <span>{COMPANY.contact.tel}</span>
              </a>
              <a
                href={COMPANY.contact.emailHref}
                className="flex items-center gap-2.5 text-muted hover:text-accent transition-colors font-medium"
                data-cursor="EMAIL"
              >
                <Mail size={14} className="text-accent shrink-0" />
                <span>{COMPANY.contact.email}</span>
              </a>
            </div>

            {/* Quality & Safety Badges */}
            <div className="pt-2 flex items-center gap-2 text-[10px] font-mono text-accent-soft font-semibold">
              <ShieldCheck size={14} className="text-accent shrink-0" />
              <span>ISO 9001 · ISO 14001 · ISO 45001</span>
            </div>
          </div>

          {/* Column 2: 8 Business Divisions */}
          <div>
            <div className="hud-label text-fg mb-5 font-bold">
              8 OPERATING DIVISIONS
            </div>
            <ul className="text-xs space-y-2.5">
              {BUSINESS_UNITS.map((u) => (
                <li key={u.id}>
                  <a
                    href={`/business-units/${u.slug}`}
                    className="flex items-center gap-2.5 text-muted hover:text-fg transition-colors group font-medium"
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full shrink-0 group-hover:scale-150 transition-transform"
                      style={{ backgroundColor: u.color }}
                    />
                    <span className="truncate group-hover:text-accent-soft transition-colors">
                      {u.name}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Navigation */}
          <div>
            <div className="hud-label text-fg mb-5 font-bold">
              NAVIGATION MATRIX
            </div>
            <ul className="text-xs space-y-2.5">
              {[
                { label: 'Home Overview', href: '#hero' },
                { label: 'Corporate Heritage', href: '#about' },
                { label: 'Business Divisions', href: '#divisions' },
                { label: 'Key Sectors & Markets', href: '#industries' },
                { label: 'Landmark Megaprojects', href: '#projects' },
                { label: 'Leadership Philosophy', href: '#leadership' },
                { label: 'Sustainability & ESG', href: '#sustainability' },
                { label: 'Proposals & RFQ Form', href: '#contact' },
              ].map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => scrollTo(link.href)}
                    className="text-muted hover:text-fg transition-colors cursor-pointer text-left hover:translate-x-1 duration-200 inline-block font-medium"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
              <li>
                <a
                  href="https://aasa.ae/careers/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted hover:text-accent transition-colors inline-flex items-center gap-1.5 mt-1 font-medium"
                >
                  <span>Careers at AASA</span>
                  <ExternalLink size={11} />
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Governance & GCC Network */}
          <div>
            <div className="hud-label text-fg mb-5 font-bold">
              GOVERNANCE & RESOURCES
            </div>
            <ul className="text-xs space-y-2.5 mb-6">
              {[
                { label: 'Corporate Insights', href: 'https://aasa.ae/insights/' },
                { label: 'Frequently Asked Questions', href: 'https://aasa.ae/faq/' },
                { label: 'CSR & Community', href: 'https://aasa.ae/csr/' },
                { label: 'Terms of Use', href: 'https://aasa.ae/terms-of-use/' },
                { label: 'Privacy Policy', href: 'https://aasa.ae/privacy-policy/' },
              ].map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted hover:text-fg transition-colors inline-flex items-center gap-1.5 font-medium"
                  >
                    <span>{item.label}</span>
                    <ExternalLink size={10} className="opacity-50" />
                  </a>
                </li>
              ))}
            </ul>

            <div className="pt-4 border-t border-fg/20/60 text-xs">
              <div className="hud-label text-subtle mb-2">
                GCC SOVEREIGN PRESENCE
              </div>
              <p className="text-[11px] text-subtle leading-relaxed font-mono">
                United Arab Emirates · Kingdom of Saudi Arabia · State of Qatar · Republic of India
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-subtle font-mono">
          <div>{COMPANY.copyright}</div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 text-[10px] uppercase tracking-wider text-subtle">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                Dubai
              </span>
              <span>·</span>
              <span>Abu Dhabi</span>
              <span>·</span>
              <span>Riyadh</span>
              <span>·</span>
              <span>Doha</span>
              <span>·</span>
              <span>Mumbai</span>
            </div>

            {/* Back to Top */}
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1 text-muted hover:text-accent transition-colors cursor-pointer"
              data-cursor="TOP"
              title="Back to top"
            >
              <span>TOP</span>
              <ArrowUp size={12} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

'use client';

import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Phone, Mail, MapPin, Send, ChevronDown, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { COMPANY, BUSINESS_UNITS } from '@/lib/constants';

type FormState = {
  name: string;
  email: string;
  company: string;
  phone: string;
  service: string;
  message: string;
};

const initForm: FormState = {
  name: '',
  email: '',
  company: '',
  phone: '',
  service: '',
  message: '',
};

export default function ContactSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const [form, setForm] = useState<FormState>(initForm);
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [ticketNo, setTicketNo] = useState('');
  const [shakeKey, setShakeKey] = useState(0);

  const validate = () => {
    const e: Partial<FormState> = {};
    if (!form.name.trim()) {
      e.name = 'Please provide your full name.';
    }
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      e.email = 'Please provide a valid work email address.';
    }
    if (!form.service) {
      e.service = 'Please select a business division for your project.';
    }
    if (!form.message.trim() || form.message.length < 20) {
      e.message = 'Please provide at least 20 characters describing your project requirements.';
    }
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      setShakeKey((prev) => prev + 1);
      return;
    }

    setStatus('sending');
    await new Promise((r) => setTimeout(r, 1400));
    setTicketNo(`AASA-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`);
    setStatus('sent');
    setForm(initForm);
    setErrors({});
  };

  const onChange =
    (field: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setForm((f) => ({ ...f, [field]: e.target.value }));
      if (errors[field]) {
        setErrors((err) => {
          const n = { ...err };
          delete n[field];
          return n;
        });
      }
    };

  return (
    <section id="contact" ref={ref} className="relative py-28 lg:py-36 overflow-hidden bg-transparent text-fg border-t border-cyan-500/20">
      {/* Subtle Ambient Radial Lighting */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 20% 40%, rgba(0, 166, 206, 0.08) 0%, transparent 70%), radial-gradient(ellipse 50% 60% at 85% 60%, rgba(2, 132, 199, 0.06) 0%, transparent 65%)',
        }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="max-w-2xl mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-accent shadow-[0_0_8px_rgba(56,189,248,0.8)]" />
              <span className="hud-label text-accent font-bold">[ 06 — PROPOSAL & INQUIRY ]</span>
            </div>
            <h2 className="font-display font-black text-3xl sm:text-5xl text-fg tracking-tight">
              Start Your <em className="font-serif italic font-normal text-accent-soft">Next Megaproject</em> With AASA
            </h2>
            <p className="mt-4 text-sm sm:text-base text-muted leading-relaxed font-normal">
              Submit your project scope or proposal directly to our executive headquarters at Business Bay, Dubai.
            </p>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-[1fr,1.3fr] gap-12 lg:gap-16 items-start">
          {/* Left Column: HQ & Contact Cards */}
          <motion.div
            initial={{ opacity: 0, y: 45, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6"
          >
            {/* Headquarters Card */}
            <div className="p-8 rounded-[28px] bg-surface-2/80 backdrop-blur-xl border border-fg/15 shadow-2xl">
              <div className="text-xs uppercase tracking-widest font-bold text-accent mb-4 font-mono">
                Global Headquarters
              </div>
              <div className="space-y-5 text-sm">
                <div className="flex items-start gap-3.5">
                  <MapPin size={18} className="text-accent mt-1 shrink-0" />
                  <div>
                    <div className="text-fg font-bold leading-relaxed">
                      {COMPANY.hq.full}
                    </div>
                    <div className="text-xs text-subtle font-medium font-mono mt-1">
                      GPS: {COMPANY.hq.lat}° N, {COMPANY.hq.lng}° E
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3.5">
                  <Phone size={18} className="text-accent shrink-0" />
                  <div>
                    <div className="text-[11px] uppercase font-bold text-subtle font-mono">Telephone</div>
                    <a
                      href={COMPANY.contact.telHref}
                      className="text-fg font-bold hover:text-accent-soft transition-colors"
                      data-cursor="CALL"
                    >
                      {COMPANY.contact.tel}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3.5">
                  <Mail size={18} className="text-accent shrink-0" />
                  <div>
                    <div className="text-[11px] uppercase font-bold text-subtle font-mono">Official Email</div>
                    <a
                      href={COMPANY.contact.emailHref}
                      className="text-fg font-bold hover:text-accent-soft transition-colors"
                      data-cursor="EMAIL"
                    >
                      {COMPANY.contact.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3.5 pt-3 border-t border-fg/10">
                  <Clock size={18} className="text-accent shrink-0" />
                  <div className="text-xs text-muted">
                    <span className="font-bold text-fg">Office Hours:</span> Mon–Fri: 08:00 – 18:00 (GST)
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Divisions Grid */}
            <div className="p-6 rounded-[24px] bg-surface-2/80 backdrop-blur-xl border border-fg/15 shadow-2xl">
              <div className="text-xs uppercase tracking-widest font-bold text-subtle mb-3 font-mono">
                All 8 Divisions Available
              </div>
              <div className="grid grid-cols-2 gap-2">
                {BUSINESS_UNITS.map((u) => (
                  <div key={u.id} className="flex items-center gap-2 text-xs text-soft font-medium">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: u.color }} />
                    <span className="truncate">{u.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Column: User-Friendly Form with Head-Shake Animation on Error */}
          <motion.div
            initial={{ opacity: 0, y: 45, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.75, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            {status === 'sent' ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-10 rounded-[28px] bg-surface-2 border border-cyan-400 shadow-2xl text-center py-16"
              >
                <div className="w-16 h-16 rounded-full bg-cyan-500/20 border-2 border-cyan-400 text-accent-soft flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 size={36} />
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-fg tracking-tight mb-2">
                  Proposal Transmitted Successfully
                </h3>
                <div className="text-xs uppercase tracking-widest font-bold text-accent-soft mb-4 font-mono">
                  Reference: {ticketNo}
                </div>
                <p className="text-sm text-muted max-w-md mx-auto leading-relaxed font-normal mb-8">
                  Thank you for reaching out to AASA CP Holding. Our executive engineering team at Aspect Tower, Business Bay will review your request and contact you within 24 business hours.
                </p>
                <button
                  onClick={() => setStatus('idle')}
                  className="btn-primary !py-3 !px-8 text-xs"
                >
                  <span>Submit Another Request</span>
                </button>
              </motion.div>
            ) : (
              <motion.form
                key={shakeKey}
                animate={
                  shakeKey > 0
                    ? {
                        x: [-12, 12, -8, 8, -4, 4, 0],
                        transition: { duration: 0.5, ease: 'easeInOut' },
                      }
                    : {}
                }
                onSubmit={handleSubmit}
                className="p-8 sm:p-10 rounded-[30px] bg-surface-2/90 backdrop-blur-2xl border border-fg/15 shadow-2xl space-y-5"
                noValidate
              >
                <div className="flex items-center justify-between border-b border-fg/10 pb-4 mb-6">
                  <div className="text-xs uppercase tracking-widest font-bold text-subtle font-mono">
                    Request For Proposal (RFP)
                  </div>
                  <div className="text-[11px] text-accent-soft font-semibold flex items-center gap-1.5 font-mono">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Priority Queue Active</span>
                  </div>
                </div>

                {/* Name & Email */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-soft uppercase tracking-wider mb-2 font-mono">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Tariq Al-Mansoor"
                      value={form.name}
                      onChange={onChange('name')}
                      className={`w-full px-4 py-3 rounded-xl bg-fg/[0.04] border text-sm text-fg placeholder-subtle focus:bg-fg/[0.08] focus:outline-none transition-all ${
                        errors.name
                          ? 'border-red-400 ring-2 ring-red-400/20'
                          : form.name.trim()
                          ? 'border-emerald-500 focus:border-cyan-400'
                          : 'border-fg/15 focus:border-cyan-400'
                      }`}
                    />
                    {errors.name && (
                      <p className="flex items-center gap-1 text-xs text-red-400 mt-1.5 font-medium">
                        <AlertCircle size={12} />
                        <span>{errors.name}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-soft uppercase tracking-wider mb-2 font-mono">
                      Work Email *
                    </label>
                    <input
                      type="email"
                      placeholder="e.g. tariq@company.ae"
                      value={form.email}
                      onChange={onChange('email')}
                      className={`w-full px-4 py-3 rounded-xl bg-fg/[0.04] border text-sm text-fg placeholder-subtle focus:bg-fg/[0.08] focus:outline-none transition-all ${
                        errors.email
                          ? 'border-red-400 ring-2 ring-red-400/20'
                          : form.email.includes('@')
                          ? 'border-emerald-500 focus:border-cyan-400'
                          : 'border-fg/15 focus:border-cyan-400'
                      }`}
                    />
                    {errors.email && (
                      <p className="flex items-center gap-1 text-xs text-red-400 mt-1.5 font-medium">
                        <AlertCircle size={12} />
                        <span>{errors.email}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Company & Phone */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-soft uppercase tracking-wider mb-2 font-mono">
                      Organization / Entity
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Emirates Group / ADNOC"
                      value={form.company}
                      onChange={onChange('company')}
                      className="w-full px-4 py-3 rounded-xl bg-fg/[0.04] border border-fg/15 text-sm text-fg placeholder-subtle focus:bg-fg/[0.08] focus:outline-none focus:border-cyan-400 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-soft uppercase tracking-wider mb-2 font-mono">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      placeholder="+971 50 123 4567"
                      value={form.phone}
                      onChange={onChange('phone')}
                      className="w-full px-4 py-3 rounded-xl bg-fg/[0.04] border border-fg/15 text-sm text-fg placeholder-subtle focus:bg-fg/[0.08] focus:outline-none focus:border-cyan-400 transition-all"
                    />
                  </div>
                </div>

                {/* Division Selector */}
                <div>
                  <label className="block text-xs font-bold text-soft uppercase tracking-wider mb-2 font-mono">
                    Relevant Business Division *
                  </label>
                  <div className="relative">
                    <select
                      value={form.service}
                      onChange={onChange('service')}
                      className={`w-full px-4 py-3 rounded-xl bg-fg/[0.04] border text-sm text-fg appearance-none focus:bg-page focus:outline-none transition-all pr-10 ${
                        errors.service
                          ? 'border-red-400 ring-2 ring-red-400/20'
                          : form.service
                          ? 'border-emerald-500 focus:border-cyan-400'
                          : 'border-fg/15 focus:border-cyan-400'
                      }`}
                    >
                      <option value="" disabled className="bg-page text-subtle">
                        Select Division for this initiative...
                      </option>
                      {BUSINESS_UNITS.map((u) => (
                        <option key={u.id} value={u.name} className="bg-page text-fg">
                          {u.name} — {u.tagline}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={16}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-subtle pointer-events-none"
                    />
                  </div>
                  {errors.service && (
                    <p className="flex items-center gap-1 text-xs text-red-400 mt-1.5 font-medium">
                      <AlertCircle size={12} />
                      <span>{errors.service}</span>
                    </p>
                  )}
                </div>

                {/* Message / Scope */}
                <div>
                  <label className="block text-xs font-bold text-soft uppercase tracking-wider mb-2 font-mono">
                    Project Scope & Specifications (min 20 characters) *
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Provide overview of scope, location, timeline, and key requirements..."
                    value={form.message}
                    onChange={onChange('message')}
                    className={`w-full px-4 py-3 rounded-xl bg-fg/[0.04] border text-sm text-fg placeholder-subtle focus:bg-fg/[0.08] focus:outline-none transition-all ${
                      errors.message
                        ? 'border-red-400 ring-2 ring-red-400/20'
                        : form.message.length >= 20
                        ? 'border-emerald-500 focus:border-cyan-400'
                        : 'border-fg/15 focus:border-cyan-400'
                    }`}
                  />
                  <div className="flex items-center justify-between mt-1.5">
                    {errors.message ? (
                      <p className="flex items-center gap-1 text-xs text-red-400 font-medium">
                        <AlertCircle size={12} />
                        <span>{errors.message}</span>
                      </p>
                    ) : (
                      <span className="text-[11px] text-subtle font-mono">
                        {form.message.length}/20 min characters
                      </span>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="btn-primary w-full justify-center !py-4 text-sm font-bold disabled:opacity-50"
                  data-cursor="SUBMIT"
                >
                  {status === 'sending' ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-on-cta border-t-transparent rounded-full animate-spin" />
                      <span>Transmitting Proposal to Aspect Tower...</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Send size={15} />
                      <span>Transmit Official Proposal</span>
                    </span>
                  )}
                </button>

                <p className="text-[11px] text-subtle text-center font-medium font-mono">
                  Direct Line: {COMPANY.contact.tel} · Email: {COMPANY.contact.email}
                </p>
              </motion.form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

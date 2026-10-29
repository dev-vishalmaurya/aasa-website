import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: '#F8FAFC',
        paper: '#FFFFFF',
        ink: '#0F172A',
        'navy-brand': '#1D295B',
        void: '#020817',
        abyss: '#071530',
        navy: '#0B1E3D',
        'navy-deep': '#050E22',
        // Theme-aware tokens (see app/globals.css): flip between night and daylight palettes
        fg: 'rgb(var(--fg) / <alpha-value>)',
        soft: 'rgb(var(--soft) / <alpha-value>)',
        muted: 'rgb(var(--muted) / <alpha-value>)',
        subtle: 'rgb(var(--subtle) / <alpha-value>)',
        page: 'rgb(var(--page) / <alpha-value>)',
        surface: 'rgb(var(--surface) / <alpha-value>)',
        'surface-2': 'rgb(var(--surface-2) / <alpha-value>)',
        accent: 'rgb(var(--accent) / <alpha-value>)',
        'accent-soft': 'rgb(var(--accent-soft) / <alpha-value>)',
        'accent-pale': 'rgb(var(--accent-pale) / <alpha-value>)',
        // Solid call-to-action: electric cyan at night, navy ink by day
        cta: 'rgb(var(--cta) / <alpha-value>)',
        'on-cta': 'rgb(var(--on-cta) / <alpha-value>)',
        'accent-2': '#38BDF8',
        cyan: {
          glow: '#38BDF8',
          electric: '#00A6CE',
          soft: '#7DD3FC',
        },
        blue: {
          glow: '#38BDF8',
          electric: '#00A6CE',
          royal: '#0284C7',
          deep: '#1D4ED8',
        },
        violet: {
          neon: '#A855F7',
          deep: '#7C3AED',
        },
        gold: {
          glow: '#F59E0B',
          soft: '#FCD34D',
        },
        steel: {
          100: '#F1F5F9',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          800: '#1E293B',
          900: '#0F172A',
        },
      },
      fontFamily: {
        display: ['var(--font-manrope)', 'var(--font-plus-jakarta)', 'Manrope', 'sans-serif'],
        body: ['var(--font-manrope)', 'var(--font-plus-jakarta)', 'Manrope', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'JetBrains Mono', 'monospace'],
        serif: ['var(--font-instrument-serif)', 'Instrument Serif', 'Georgia', 'serif'],
      },
      animation: {
        'marquee': 'marquee 35s linear infinite',
        'pulse-glow': 'pulseGlow 4s ease-in-out infinite',
        'float-slow': 'floatSlow 8s ease-in-out infinite',
        'spin-slow': 'spin 24s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.08)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-14px) rotate(1.5deg)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;

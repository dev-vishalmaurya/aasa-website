'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/components/providers/ThemeProvider';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const day = theme === 'light';

  return (
    <button
      onClick={toggleTheme}
      className="relative w-10 h-10 rounded-lg border border-fg/20 bg-fg/10 hover:border-cyan-400 text-fg flex items-center justify-center overflow-hidden cursor-pointer shrink-0 transition-colors"
      aria-label={day ? 'Switch to dark mode' : 'Switch to light mode'}
      title={day ? 'Night mode' : 'Daylight mode'}
      data-cursor={day ? 'NIGHT' : 'DAY'}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          initial={{ y: 18, rotate: -90, opacity: 0 }}
          animate={{ y: 0, rotate: 0, opacity: 1 }}
          exit={{ y: -18, rotate: 90, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="flex"
        >
          {day ? <Moon size={16} /> : <Sun size={16} className="text-amber-300" />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}

'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';

export type Theme = 'dark' | 'light';

export const THEME_STORAGE_KEY = 'aasa-theme';

/**
 * Runs inline in <head> before first paint so the stored / system theme is applied without a flash.
 * Night is the default look; daylight is used when the visitor chose it or their OS prefers light.
 * It also hides the splash for visitors who already saw it this session, so it never flashes.
 */
export const themeInitScript = `(function(){try{var t=localStorage.getItem('${THEME_STORAGE_KEY}');if(!t){t=window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark'}if(t==='light'){document.documentElement.classList.add('light')}}catch(e){}try{if(sessionStorage.getItem('aasa-intro-seen')==='1'||location.search.indexOf('skipIntro')>-1){document.documentElement.classList.add('intro-seen')}}catch(e){}})();`;

type ThemeContextValue = { theme: Theme; setTheme: (t: Theme) => void; toggleTheme: () => void };

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'dark',
  setTheme: () => {},
  toggleTheme: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('dark');

  // Pick up whatever the init script applied
  useEffect(() => {
    setThemeState(document.documentElement.classList.contains('light') ? 'light' : 'dark');
  }, []);

  const setTheme = useCallback((next: Theme) => {
    const root = document.documentElement;
    root.classList.add('theme-transition');
    root.classList.toggle('light', next === 'light');
    window.setTimeout(() => root.classList.remove('theme-transition'), 600);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Private mode: theme still applies for this visit
    }
    setThemeState(next);
  }, []);

  const toggleTheme = useCallback(() => setTheme(theme === 'light' ? 'dark' : 'light'), [theme, setTheme]);

  return <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>{children}</ThemeContext.Provider>;
}

'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

export default function AudioFeedback() {
  const [enabled, setEnabled] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const initAudio = () => {
    if (!audioCtxRef.current) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioCtxRef.current = new AudioCtx();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  };

  const playClick = useCallback(() => {
    if (!enabled || !audioCtxRef.current) return;
    try {
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.06);

      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.06);
    } catch {
      // Audio context not ready
    }
  }, [enabled]);

  const playHover = useCallback(() => {
    if (!enabled || !audioCtxRef.current) return;
    try {
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1200, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1600, ctx.currentTime + 0.025);

      gain.gain.setValueAtTime(0.012, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0005, ctx.currentTime + 0.025);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.025);
    } catch {}
  }, [enabled]);

  const toggleSound = () => {
    initAudio();
    setEnabled((prev) => !prev);
  };

  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('button, a, select, input, textarea')) {
        playClick();
      }
    };

    const handleDocumentMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('button, a, [data-cursor]')) {
        playHover();
      }
    };

    document.addEventListener('click', handleDocumentClick);
    document.addEventListener('mouseover', handleDocumentMouseOver, { passive: true });
    return () => {
      document.removeEventListener('click', handleDocumentClick);
      document.removeEventListener('mouseover', handleDocumentMouseOver);
    };
  }, [playClick, playHover]);

  return (
    <button
      onClick={toggleSound}
      className={`fixed bottom-6 right-6 z-50 p-3 rounded-full border backdrop-blur-md transition-all duration-300 flex items-center gap-2 ${
        enabled
          ? 'bg-cyan-glow/20 border-cyan-glow text-accent shadow-[0_0_20px_rgba(56,189,248,0.45)]'
          : 'bg-fg/5 border-fg/10 text-fg/50 hover:text-fg hover:border-fg/30'
      }`}
      aria-label="Toggle atmospheric audio"
      data-cursor="SOUND"
    >
      {enabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
      <span className="font-mono text-[10px] uppercase tracking-widest hidden sm:inline font-bold">
        {enabled ? 'Audio: Active' : 'Sound: Muted'}
      </span>
    </button>
  );
}

/* eslint-disable @next/next/no-img-element */

export const AASA_LOGO_SRC = 'https://aasa.ae/wp-content/uploads/2025/08/AASA-Logo-300.png';

/**
 * Official AASA CP Holding logo (300×237: cyan link mark above the navy "aasa" wordmark).
 * The image is drawn twice and clipped at the gap between mark and wordmark (row ~110 of 237),
 * so at night the wordmark can be turned white while the cyan mark keeps its brand colour.
 */
export default function AasaLogo({ className = 'h-11' }: { className?: string }) {
  return (
    <span className={`relative inline-block aspect-[300/237] shrink-0 ${className}`} role="img" aria-label="AASA CP Holding Company">
      <img
        src={AASA_LOGO_SRC}
        alt=""
        draggable={false}
        className="absolute inset-0 h-full w-full object-contain [clip-path:inset(0_0_53.6%_0)]"
      />
      <img
        src={AASA_LOGO_SRC}
        alt=""
        draggable={false}
        className="aasa-wordmark absolute inset-0 h-full w-full object-contain [clip-path:inset(46.4%_0_0_0)]"
      />
    </span>
  );
}

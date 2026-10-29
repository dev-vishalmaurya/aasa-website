'use client';

export default function MarqueeTicker() {
  const items = [
    '30+ YEARS ENGINEERING EXCELLENCE',
    'DUBAI WORLD CENTRAL',
    'ADNOC MEGASTRUCTURES',
    'HIGH-VOLTAGE POWER GRIDS',
    'PRECISION STEEL FABRICATION',
    '25,000+ DEDICATED WORKFORCE',
    'SMART INFRASTRUCTURE & IOT',
    'ISO 9001 / 14001 / 45001 CERTIFIED',
  ];

  return (
    <div className="relative py-4 bg-page/75 backdrop-blur-md border-y border-cyan-500/25 text-fg overflow-hidden whitespace-nowrap z-20 shadow-[0_10px_30px_rgb(var(--shadow)/0.5)]">
      <div className="flex w-max animate-marquee">
        {/* Double array for seamless infinite loop */}
        {[...items, ...items].map((text, idx) => (
          <div key={idx} className="flex items-center gap-8 mx-6">
            <span
              className={`font-display text-base sm:text-xl font-black tracking-wider uppercase ${
                idx % 2 === 1
                  ? 'text-transparent'
                  : 'text-fg'
              }`}
              style={
                idx % 2 === 1
                  ? { WebkitTextStroke: '1px #38BDF8' }
                  : undefined
              }
            >
              {text}
            </span>
            <span className="w-2 h-2 rounded-full bg-accent inline-block shadow-[0_0_8px_rgba(56,189,248,0.9)]" />
          </div>
        ))}
      </div>
    </div>
  );
}

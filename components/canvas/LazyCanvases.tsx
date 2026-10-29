'use client';

import dynamic from 'next/dynamic';

// Imported from a client boundary so three.js / drei / postprocessing ship as a lazy chunk.
// (next/dynamic inside a Server Component page still lists the chunk in the page's first-load JS.)
export const CinematicWorld = dynamic(() => import('@/components/canvas/CinematicWorld'), { ssr: false });
export const MagneticCursor = dynamic(() => import('@/components/canvas/MagneticCursor'), { ssr: false });

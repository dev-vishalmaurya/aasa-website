import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import UnitPage from '@/components/units/UnitPage';
import { BUSINESS_UNITS } from '@/lib/constants';
import { UNIT_CONTENT } from '@/lib/units';

export function generateStaticParams() {
  return BUSINESS_UNITS.map((u) => ({ slug: u.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const unit = BUSINESS_UNITS.find((u) => u.slug === params.slug);
  const content = UNIT_CONTENT[params.slug];
  if (!unit || !content) return {};
  return {
    title: `${unit.name} — ${content.tagline} | AASA CP Holding`,
    description: content.heroText,
    openGraph: { title: unit.name, description: content.tagline, images: [content.banner] },
  };
}

export default function BusinessUnitPage({ params }: { params: { slug: string } }) {
  if (!BUSINESS_UNITS.some((u) => u.slug === params.slug) || !UNIT_CONTENT[params.slug]) notFound();
  // Keyed so moving between units remounts the scene, scroll choreography and counters
  return <UnitPage key={params.slug} slug={params.slug} />;
}

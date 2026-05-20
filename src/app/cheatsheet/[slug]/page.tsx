import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getCityBySlug, getAllCitySlugs } from '@/lib/cities';
import CityCheatsheet from '@/components/cheatsheet/CityCheatsheet';

export async function generateStaticParams() {
  return getAllCitySlugs().map((slug) => ({ slug }));
}

export async function generateMetadata(
  props: PageProps<'/cheatsheet/[slug]'>
): Promise<Metadata> {
  const { slug } = await props.params;
  const city = getCityBySlug(slug);
  if (!city) return { title: 'Not Found' };
  return {
    title: `${city.name} Travel Cheatsheet — TripGenius`,
    description: `Your ultimate ${city.name} travel cheatsheet. Save and share this guide.`,
  };
}

export default async function CheatsheetPage(props: PageProps<'/cheatsheet/[slug]'>) {
  const { slug } = await props.params;
  const city = getCityBySlug(slug);
  if (!city) notFound();

  return <CityCheatsheet city={city} />;
}

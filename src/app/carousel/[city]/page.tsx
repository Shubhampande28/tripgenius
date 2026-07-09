import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getCityBySlug, getAllCitySlugs } from '@/lib/cities';
import CarouselViewer from './CarouselViewer';

export function generateStaticParams() {
  return getAllCitySlugs().map((slug) => ({ city: slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ city: string }> }): Promise<Metadata> {
  const { city: slug } = await params;
  const city = getCityBySlug(slug);
  if (!city) return {};
  // `absolute` skips the root "%s | TripGenius" template (the string already brands itself).
  return { title: { absolute: `${city.name} Instagram Carousel — TripGenius` }, robots: { index: false, follow: false } };
}

export default async function CarouselPage({ params }: { params: Promise<{ city: string }> }) {
  const { city: slug } = await params;
  const city = getCityBySlug(slug);
  if (!city) notFound();
  return <CarouselViewer city={city} />;
}

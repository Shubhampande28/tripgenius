import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CityHero from '@/components/city/CityHero';
import AtAGlance from '@/components/city/AtAGlance';
import Neighbourhoods from '@/components/city/Neighbourhoods';
import BudgetBreakdown from '@/components/city/BudgetBreakdown';
import ThingsToDo from '@/components/city/ThingsToDo';
import OffbeatPlaces from '@/components/city/OffbeatPlaces';
import WhereToStay from '@/components/city/WhereToStay';
import WhereToEat from '@/components/city/WhereToEat';
import GettingAround from '@/components/city/GettingAround';
import ProTips from '@/components/city/ProTips';
import CitySidebar from '@/components/city/CitySidebar';
import { getCityBySlug, getAllCitySlugs } from '@/lib/cities';

export async function generateStaticParams() {
  return getAllCitySlugs().map((slug) => ({ slug }));
}

export async function generateMetadata(
  props: PageProps<'/cities/[slug]'>
): Promise<Metadata> {
  const { slug } = await props.params;
  const city = getCityBySlug(slug);
  if (!city) return { title: 'City Not Found' };
  return {
    title: `${city.name} Travel Guide — ${city.country}`,
    description: city.description,
  };
}

export default async function CityPage(props: PageProps<'/cities/[slug]'>) {
  const { slug } = await props.params;
  const city = getCityBySlug(slug);

  if (!city) notFound();

  return (
    <>
      <Navbar />
      <main className="bg-dark">
        <CityHero city={city} />
        <AtAGlance city={city} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12">
            {/* Main content */}
            <div>
              <Neighbourhoods city={city} />
              <BudgetBreakdown city={city} />
              <ThingsToDo city={city} />
              <OffbeatPlaces city={city} />
              <WhereToStay city={city} />
              <WhereToEat city={city} />
              <GettingAround city={city} />
              <ProTips city={city} />
            </div>

            {/* Sidebar */}
            <div className="lg:sticky lg:top-24 lg:self-start">
              <CitySidebar city={city} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

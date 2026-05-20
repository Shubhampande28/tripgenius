import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CityHero from '@/components/city/CityHero';
import AtAGlance from '@/components/city/AtAGlance';
import MonthByMonth from '@/components/city/MonthByMonth';
import ExploreByArea from '@/components/city/ExploreByArea';
import Neighbourhoods from '@/components/city/Neighbourhoods';
import ThingsToDo from '@/components/city/ThingsToDo';
import OffbeatPlaces from '@/components/city/OffbeatPlaces';
import BudgetBreakdown from '@/components/city/BudgetBreakdown';
import WhereToStay from '@/components/city/WhereToStay';
import WhereToEat from '@/components/city/WhereToEat';
import GettingThere from '@/components/city/GettingThere';
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
        {/* 1. Hero */}
        <CityHero city={city} />

        {/* 2. Quick stats */}
        <AtAGlance city={city} />

        {/* 3. Best time to visit */}
        <MonthByMonth city={city} />

        {/* 4. Explore by area — full width */}
        <ExploreByArea city={city} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12">
            <div>
              {/* 5. By neighbourhood */}
              <Neighbourhoods city={city} />

              {/* 6. Places to see */}
              <ThingsToDo city={city} />
              <OffbeatPlaces city={city} />

              {/* 7. Cost */}
              <BudgetBreakdown city={city} />

              {/* 8. Where to stay & eat */}
              <WhereToStay city={city} />
              <WhereToEat city={city} />

              {/* 9. Getting there & around */}
              <GettingThere city={city} />
              <GettingAround city={city} />
              <ProTips city={city} />
            </div>

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

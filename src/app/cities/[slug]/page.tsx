import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CityHero from '@/components/city/CityHero';
import AtAGlance from '@/components/city/AtAGlance';
import MonthByMonth from '@/components/city/MonthByMonth';
import NeighbourhoodsAreas from '@/components/city/NeighbourhoodsAreas';
import ExploreByArea from '@/components/city/ExploreByArea';
import BudgetBreakdown from '@/components/city/BudgetBreakdown';
import ThingsToDo from '@/components/city/ThingsToDo';
import OffbeatPlaces from '@/components/city/OffbeatPlaces';
import WhereToStay from '@/components/city/WhereToStay';
import WhereToEat from '@/components/city/WhereToEat';
import GettingAround from '@/components/city/GettingAround';
import ProTips from '@/components/city/ProTips';
import CityFAQ from '@/components/city/CityFAQ';
import BookingPanel from '@/components/city/BookingPanel';
import CitySidebar from '@/components/city/CitySidebar';
import CityTOC from '@/components/city/CityTOC';
import CityQuickNav from '@/components/city/CityQuickNav';
import RelatedCities from '@/components/city/RelatedCities';
import MobileCTA from '@/components/city/MobileCTA';
import { getCityBySlug, getAllCitySlugs } from '@/lib/cities';
import { getCityFaqs } from '@/lib/cityFaqs';
import AdUnit from '@/components/AdUnit';
import { AD_SLOTS } from '@/lib/adsense';

export async function generateStaticParams() {
  return getAllCitySlugs().map((slug) => ({ slug }));
}

export async function generateMetadata(
  props: PageProps<'/cities/[slug]'>
): Promise<Metadata> {
  const { slug } = await props.params;
  const city = getCityBySlug(slug);
  if (!city) return { title: 'City Not Found' };

  const year = new Date().getFullYear();
  const title = `${city.name} Travel Guide ${year} — Things To Do, Best Time & Budget`;
  const desc  = `Plan your ${city.name} trip: best time to visit (${city.stats.bestTime}), daily budget (${city.stats.budget}), top things to do, where to stay, and local insider tips. Free ${city.country} travel guide.`;

  return {
    title,
    description: desc,
    keywords: [
      `${city.name} travel guide`, `things to do in ${city.name}`,
      `best time to visit ${city.name}`, `${city.name} travel tips`,
      `${city.name} itinerary`, `${city.name} budget`,
      `${city.country} travel`, `visit ${city.name} ${year}`,
      `${city.name} tourist guide`, `${city.name} trip`,
    ],
    alternates: { canonical: `https://www.tripgenius.in/cities/${slug}` },
    // Stub cities have auto-generated content — keep them out of Google's index
    ...(city.stub && {
      robots: { index: false, follow: false },
    }),
    openGraph: {
      title, description: desc,
      url:  `https://www.tripgenius.in/cities/${slug}`,
      type: 'article',
      images: [{ url: `/cities/${slug}/opengraph-image`, width: 1200, height: 630, alt: `${city.name} travel guide — TripGenius` }],
    },
    twitter: {
      card: 'summary_large_image', title, description: desc,
      images: [`/cities/${slug}/opengraph-image`],
    },
  };
}


function CityJsonLd({ city, slug }: { city: ReturnType<typeof getCityBySlug> & object; slug: string }) {
  const base = 'https://www.tripgenius.in';
  const url  = `${base}/cities/${slug}`;

  // 1. TouristDestination
  const destination = {
    '@context': 'https://schema.org',
    '@type': 'TouristDestination',
    name: city.name,
    description: city.description,
    url,
    image: city.heroImage || city.image,
    touristType: city.vibes,
    containedInPlace: { '@type': 'Country', name: city.country },
    isAccessibleForFree: true,
    publisher: { '@type': 'Organization', name: 'TripGenius', url: base },
  };

  // 2. BreadcrumbList — helps Google show "TripGenius > Cities > Bali" in results
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: base },
      { '@type': 'ListItem', position: 2, name: 'Cities', item: `${base}/cities` },
      { '@type': 'ListItem', position: 3, name: city.name, item: url },
    ],
  };

  // 3. FAQPage — use real per-city FAQs when available, fall back to generated
  const realFaqs = getCityFaqs(slug);
  const faqs = realFaqs.length ? realFaqs : [
    {
      q: `What is the best time to visit ${city.name}?`,
      a: city.monthByMonth
        ? `The best time to visit ${city.name} is ${city.monthByMonth.bestMonths.join(', ')}. ${city.monthByMonth.summary}`
        : `The best time to visit ${city.name} is ${city.stats.bestTime}.`,
    },
    {
      q: `How much does a trip to ${city.name} cost per day?`,
      a: `A trip to ${city.name} typically costs ${city.stats.budget} per person per day. Budget travellers can explore on the lower end, while luxury travellers will spend more.`,
    },
    {
      q: `What are the top things to do in ${city.name}?`,
      a: city.thingsToDo?.length
        ? `Top things to do in ${city.name} include: ${city.thingsToDo.slice(0, 5).map((t) => t.name).join(', ')}.`
        : `${city.name} offers world-class cultural, culinary, and natural experiences.`,
    },
    {
      q: `What language do they speak in ${city.name}?`,
      a: `The main language spoken in ${city.name} is ${city.stats.language}. English is widely understood in tourist areas.`,
    },
    {
      q: `What is the currency in ${city.name}?`,
      a: `The currency used in ${city.name} is ${city.stats.currency}. It's advisable to carry some local cash for markets, temples, and street food vendors.`,
    },
  ];

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(destination) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    </>
  );
}

export default async function CityPage(props: PageProps<'/cities/[slug]'>) {
  const { slug } = await props.params;
  const city = getCityBySlug(slug);
  if (!city) notFound();

  return (
    <>
      <CityJsonLd city={city} slug={slug} />
      <Navbar />
      <main>
        <CityHero city={city} />
        <AtAGlance city={city} />
        <CityQuickNav city={city} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12">
            <div>
              <MonthByMonth city={city} />
              <ThingsToDo city={city} />

              {/* Neighbourhoods if available, otherwise area explorer */}
              {city.neighbourhoods?.length
                ? <NeighbourhoodsAreas city={city} />
                : <ExploreByArea city={city} />
              }

              <OffbeatPlaces city={city} />
              <BudgetBreakdown city={city} />
              <AdUnit slot={AD_SLOTS.cityMidContent} format="rectangle" className="py-4" />
              <WhereToStay city={city} />
              <WhereToEat city={city} />
              <GettingAround city={city} />
              <ProTips city={city} />
              <BookingPanel city={city} />
              <CityFAQ city={city} />
            </div>
            <div className="hidden lg:block lg:sticky lg:top-24 lg:self-start space-y-4">
              <CityTOC city={city} />
              <CitySidebar city={city} />
              <AdUnit slot={AD_SLOTS.citySidebar} format="rectangle" />
            </div>
          </div>
        </div>

        <RelatedCities city={city} />
      </main>
      <MobileCTA city={city} />
      <Footer />
    </>
  );
}

import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CityMapWrapper from '@/components/city/CityMapWrapper';
import CityHero from '@/components/city/CityHero';
import AtAGlance from '@/components/city/AtAGlance';
import MonthByMonth from '@/components/city/MonthByMonth';
import NeighbourhoodsAreas from '@/components/city/NeighbourhoodsAreas';
import ExploreByArea from '@/components/city/ExploreByArea';
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
import SimilarDestinations from '@/components/city/SimilarDestinations';
import MobileCTA from '@/components/city/MobileCTA';
import { getCityBySlug, getAllCitySlugs } from '@/lib/cities';
import { getCountrySlugForCity } from '@/lib/getCountrySlug';
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
  const n = city.thingsToDo?.length ?? 0;

  // Primary keyword targets: "things to do in X", "X travel guide", "visit X"
  const title = n > 0
    ? `${n} Best Things to Do in ${city.name} (${year} Travel Guide)`
    : `${city.name} Travel Guide ${year} — Best Time, Places & Tips`;

  const desc = `Plan your ${city.name} trip with our free ${year} guide. ` +
    `Best time to visit: ${city.stats.bestTime}. Budget: ${city.stats.budget}/day. ` +
    `Top attractions, where to stay, local food and hidden gems in ${city.name}, ${city.country}.`;

  return {
    title,
    description: desc,
    keywords: [
      `things to do in ${city.name}`,
      `${city.name} travel guide`,
      `visit ${city.name}`,
      `best places in ${city.name}`,
      `${city.name} trip planner`,
      `${city.name} tourist attractions`,
      `${city.name} travel tips ${year}`,
      `${city.name} itinerary`,
      `${city.name} travel guide ${year}`,
      `${city.country} travel`,
      `${city.name} holidays`,
      `${city.name} tourism`,
    ],
    alternates: { canonical: `https://www.tripgenius.in/cities/${slug}` },
    ...(city.stub && { robots: { index: false, follow: false } }),
    openGraph: {
      title, description: desc,
      url:   `https://www.tripgenius.in/cities/${slug}`,
      type:  'article',
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

  // 2. BreadcrumbList — Home > Countries > [Country] > [City]
  const countrySlugForSchema = getCountrySlugForCity(slug);
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home',      item: base },
      { '@type': 'ListItem', position: 2, name: 'Countries', item: `${base}/countries` },
      ...(countrySlugForSchema ? [
        { '@type': 'ListItem', position: 3, name: city.country, item: `${base}/countries/${countrySlugForSchema}` },
        { '@type': 'ListItem', position: 4, name: city.name,   item: url },
      ] : [
        { '@type': 'ListItem', position: 3, name: city.name,   item: url },
      ]),
    ],
  };

  // 3. FAQPage — use real per-city FAQs when available, fall back to generated
  const realFaqs = getCityFaqs(slug);
  const faqs = realFaqs.length ? realFaqs : [
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

  // 4. ItemList — "Top things to do in X" → powers Google featured snippets
  const itemListSchema = city.thingsToDo?.length ? {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Top ${city.thingsToDo.length} Things to Do in ${city.name}`,
    description: `The best experiences in ${city.name} ranked by traveller popularity.`,
    numberOfItems: city.thingsToDo.length,
    itemListElement: city.thingsToDo.map((t, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'TouristAttraction',
        name: t.name,
        description: t.description,
        address: {
          '@type': 'PostalAddress',
          addressLocality: city.name,
          addressCountry: city.country,
        },
      },
    })),
  } : null;

  // 5. LodgingBusiness — ranks for "[city] hotels", "[city] where to stay"
  const hotelSchemas = (city.hotels ?? []).map(h => ({
    '@context': 'https://schema.org',
    '@type': 'LodgingBusiness',
    name: h.name,
    description: h.description,
    priceRange: h.priceRange,
    address: {
      '@type': 'PostalAddress',
      addressLocality: city.name,
      addressCountry: city.country,
    },
    url,
  }));

  // 6. Restaurant — ranks for "[city] restaurants", "[city] food guide"
  const restaurantSchemas = (city.restaurants ?? []).map(r => ({
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: r.name,
    description: r.description,
    servesCuisine: r.cuisine,
    priceRange: r.priceRange,
    address: {
      '@type': 'PostalAddress',
      addressLocality: city.name,
      addressCountry: city.country,
    },
    url,
  }));

  // 7. WebPage — helps Google understand page type and author
  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'TravelAction',
    name: `Plan a trip to ${city.name}`,
    description: `Free travel guide for ${city.name} — best time, budget, things to do, where to stay.`,
    target: { '@type': 'EntryPoint', urlTemplate: url },
    object: { '@type': 'Place', name: city.name },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(destination) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      {itemListSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />}
      {hotelSchemas.length > 0 && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(hotelSchemas) }} />}
      {restaurantSchemas.length > 0 && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(restaurantSchemas) }} />}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
    </>
  );
}

export default async function CityPage(props: PageProps<'/cities/[slug]'>) {
  const { slug } = await props.params;
  const city = getCityBySlug(slug);
  if (!city) notFound();

  const countrySlug = getCountrySlugForCity(slug) ?? undefined;

  return (
    <>
      <CityJsonLd city={city} slug={slug} />
      <Navbar />
      <main>
        <CityHero city={city} countrySlug={countrySlug} />
        <AtAGlance city={city} />
        <CityQuickNav city={city} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12">
            <div>
              <MonthByMonth city={city} />
              <ThingsToDo city={city} />

              {/* Map — server-renders the section shell; Leaflet loads client-side only */}
              <section id="city-map" className="py-8 border-t border-border">
                <div className="mb-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-accent mb-1">Interactive Map</p>
                  <h2 className="font-heading text-2xl font-semibold text-primary-text">
                    Explore {city.name} on the Map
                  </h2>
                </div>
                <CityMapWrapper city={city} />
              </section>

              {/* Neighbourhoods if available, otherwise area explorer */}
              {city.neighbourhoods?.length
                ? <NeighbourhoodsAreas city={city} />
                : <ExploreByArea city={city} />
              }

              <OffbeatPlaces city={city} />
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

        <SimilarDestinations city={city} />
      </main>
      <MobileCTA city={city} />
      <Footer />
    </>
  );
}

import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CityMapWrapper from '@/components/city/CityMapWrapper';
import CityHero from '@/components/city/CityHero';
import AtAGlance from '@/components/city/AtAGlance';
import MonthByMonth from '@/components/city/MonthByMonth';
import BudgetBreakdown from '@/components/city/BudgetBreakdown';
import NeighbourhoodsAreas from '@/components/city/NeighbourhoodsAreas';
import ExploreByArea from '@/components/city/ExploreByArea';
import ThingsToDo from '@/components/city/ThingsToDo';
import OffbeatPlaces from '@/components/city/OffbeatPlaces';
import WhereToStay from '@/components/city/WhereToStay';
import WhereToEat from '@/components/city/WhereToEat';
import GettingThereAround from '@/components/city/GettingThereAround';
import ProTips from '@/components/city/ProTips';
import CityFAQ from '@/components/city/CityFAQ';
import BookingPanel from '@/components/city/BookingPanel';
import CitySidebar from '@/components/city/CitySidebar';
import CityTOC from '@/components/city/CityTOC';
import CityQuickNav from '@/components/city/CityQuickNav';
import SimilarDestinations from '@/components/city/SimilarDestinations';
import CityGuides from '@/components/city/CityGuides';
import MoreInCountry from '@/components/city/MoreInCountry';
import MobileCTA from '@/components/city/MobileCTA';
import { getCityBySlug, getAllCitySlugs, isIndexableCity } from '@/lib/cities';
import { getCountrySlugForCity } from '@/lib/getCountrySlug';
import { getAuthoredCityFaqs } from '@/lib/cityFaqs';
import AdUnit from '@/components/AdUnit';
import Schema from '@/components/Schema';
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
    alternates: { canonical: `https://www.tripgenius.in/cities/${slug}` },
    // Index only substantial, authored guides. Cities without hand-authored
    // month data are template-generated (fabricated weather/hotels/restaurants)
    // and must stay out of the index to satisfy AdSense low-value-content rules.
    ...(!isIndexableCity(city) && { robots: { index: false, follow: true } }),
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
    ...(city.coordinates && {
      geo: {
        '@type': 'GeoCoordinates',
        latitude: city.coordinates.lat,
        longitude: city.coordinates.lng,
      },
    }),
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

  // 3. FAQPage — only emit for hand-authored FAQs. The old templated fallback
  // produced near-identical Q&A schema across every city, a low-value signal;
  // pages without real FAQs simply omit FAQ markup (the visible CityFAQ section
  // already self-hides in that case).
  const realFaqs = getAuthoredCityFaqs(slug);
  const faqSchema = realFaqs.length ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: realFaqs.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  } : null;

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

  // 5. LodgingBusiness — ranks for "[city] hotels", "[city] where to stay".
  // Only emit for hand-authored hotels. enrichCity fabricates placeholder stays
  // ("Central X Boutique Stay") for cities without real data; marking those as
  // real businesses in structured data is a low-value / misleading signal.
  const hotelSchemas = (city.hotelsSynthetic ? [] : city.hotels ?? []).map(h => ({
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

  // 6. Restaurant — ranks for "[city] restaurants", "[city] food guide".
  // Same rule as hotels: never emit structured data for fabricated eateries.
  const restaurantSchemas = (city.restaurantsSynthetic ? [] : city.restaurants ?? []).map(r => ({
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

  // 7. TravelAction — powers "plan a trip to X" intent
  const travelActionSchema = {
    '@context': 'https://schema.org',
    '@type': 'TravelAction',
    name: `Plan a trip to ${city.name}`,
    description: `Free travel guide for ${city.name} — best time, budget, things to do, where to stay.`,
    target: { '@type': 'EntryPoint', urlTemplate: url },
    object: { '@type': 'Place', name: city.name },
  };

  // 8. WebPage — E-E-A-T authority: who reviewed this, when, and editorial standards.
  // Connects the guide to the published methodology so Google & AI engines can
  // attribute the content to a credible, transparent source.
  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: `${city.name} Travel Guide`,
    url,
    description: city.description,
    inLanguage: 'en',
    isPartOf: { '@type': 'WebSite', name: 'TripGenius', url: base },
    about: { '@type': 'Place', name: `${city.name}, ${city.country}` },
    lastReviewed: '2026-05-01',
    reviewedBy: { '@type': 'Organization', name: 'TripGenius Editorial Team', url: `${base}/about` },
    publisher: { '@type': 'Organization', name: 'TripGenius', url: base, logo: { '@type': 'ImageObject', url: `${base}/logo.png` } },
    publishingPrinciples: `${base}/about`,
  };

  return (
    <>
      <Schema data={destination} />
      <Schema data={breadcrumb} />
      <Schema data={faqSchema} />
      <Schema data={itemListSchema} />
      <Schema data={hotelSchemas} />
      <Schema data={restaurantSchemas} />
      <Schema data={travelActionSchema} />
      <Schema data={webPageSchema} />
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

        {/* Discovery comes first on every destination: users see the top
            experiences before the broader area-planning module. */}
        <ThingsToDo city={city} />

        <section id="city-map" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-t border-border">
          <div className="mb-4">
            <p className="text-xs font-bold uppercase tracking-widest text-accent mb-1">Interactive Map</p>
            <h2 className="font-heading text-2xl font-semibold text-primary-text">
              Explore {city.name} on the Map
            </h2>
          </div>
          <CityMapWrapper city={city} />
        </section>

        <MonthByMonth city={city} />
        {city.neighbourhoods?.length
          ? <NeighbourhoodsAreas city={city} />
          : <ExploreByArea city={city} />
        }

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12">
            <div>
              <OffbeatPlaces city={city} />
              <BudgetBreakdown city={city} />
              <WhereToStay city={city} />
              <WhereToEat city={city} />
              <ProTips city={city} />
              <BookingPanel city={city} />
              <CityFAQ city={city} />
              <CityGuides city={city} />
              <MoreInCountry city={city} countrySlug={countrySlug} />
            </div>
            <div className="hidden lg:block lg:sticky lg:top-24 lg:self-start space-y-4">
              <CityTOC city={city} />
              <CitySidebar city={city} />
              {/* Only monetise substantial, indexed guides — AdSense policy
                  disallows ad code on pages with little/no content. */}
              {isIndexableCity(city) && <AdUnit slot={AD_SLOTS.citySidebar} format="rectangle" />}
            </div>
          </div>
        </div>

        <GettingThereAround city={city} />

        <SimilarDestinations city={city} />
      </main>
      <MobileCTA city={city} />
      <Footer />
    </>
  );
}

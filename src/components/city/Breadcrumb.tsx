import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbProps {
  cityName: string;
  country: string;
  countrySlug?: string;
}

// Visual breadcrumb only — the machine-readable BreadcrumbList is emitted as
// JSON-LD by the page (CityJsonLd). Keeping microdata here too would give
// Google two BreadcrumbList entities for the same page.
export default function Breadcrumb({ cityName, country, countrySlug }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="absolute top-20 left-0 right-0 z-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <ol className="flex items-center gap-1.5 text-xs text-white/60 flex-wrap">
        <li>
          <Link href="/" className="hover:text-white/90 transition-colors">Home</Link>
        </li>
        <li aria-hidden><ChevronRight size={12} /></li>
        {countrySlug ? (
          <>
            <li>
              <Link href="/countries" className="hover:text-white/90 transition-colors">Countries</Link>
            </li>
            <li aria-hidden><ChevronRight size={12} /></li>
            <li>
              <Link href={`/countries/${countrySlug}`} className="hover:text-white/90 transition-colors">{country}</Link>
            </li>
          </>
        ) : (
          <li>
            <Link href="/cities" className="hover:text-white/90 transition-colors">Cities</Link>
          </li>
        )}
        <li aria-hidden><ChevronRight size={12} /></li>
        <li>
          <span className="text-white/90 font-medium">{cityName}</span>
        </li>
      </ol>
    </nav>
  );
}

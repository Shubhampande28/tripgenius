import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbProps {
  cityName: string;
  country: string;
}

export default function Breadcrumb({ cityName, country }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="absolute top-20 left-0 right-0 z-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <ol className="flex items-center gap-1.5 text-xs text-white/60" itemScope itemType="https://schema.org/BreadcrumbList">
        <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
          <Link href="/" itemProp="item" className="hover:text-white/90 transition-colors">
            <span itemProp="name">Home</span>
          </Link>
          <meta itemProp="position" content="1" />
        </li>
        <li aria-hidden><ChevronRight size={12} /></li>
        <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
          <Link href="/cities" itemProp="item" className="hover:text-white/90 transition-colors">
            <span itemProp="name">Cities</span>
          </Link>
          <meta itemProp="position" content="2" />
        </li>
        <li aria-hidden><ChevronRight size={12} /></li>
        <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
          <span itemProp="name" className="text-white/90 font-medium">{cityName}</span>
          <meta itemProp="position" content="3" />
        </li>
      </ol>
    </nav>
  );
}

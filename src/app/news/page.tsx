import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Schema from '@/components/Schema';
import NewsPageClient from '@/components/news/NewsPageClient';
import { getAllNews } from '@/lib/news';

const BASE = 'https://www.tripgenius.in';

export default function NewsPage() {
  const articles = getAllNews();

  const listSchema = articles.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: articles.map((a, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${BASE}/news/${a.slug}`,
      name: a.title,
    })),
  } : null;

  return (
    <>
      <Schema data={listSchema} />
      <Navbar />
      <main className="min-h-screen">
        <NewsPageClient articles={articles} />
      </main>
      <Footer />
    </>
  );
}

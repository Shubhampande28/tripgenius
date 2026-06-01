import { verifyInstagramRequest } from '@/lib/instagramAuth';
import { publishInstagramImagePost } from '@/lib/instagramPublisher';
import { getCityBySlug } from '@/lib/cities';

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.tripgenius.in';

function buildCaption(city: ReturnType<typeof getCityBySlug>) {
  if (!city) return '';

  const top5 = (city.thingsToDo ?? []).slice(0, 5).map((t, i) => `${i + 1}. ${t.icon} ${t.name}`).join('\n');

  return `${city.flag} Top Places to Visit in ${city.name} (2025)

${top5}

Save this post — you'll need it when planning your trip! 🌍

Free complete guide → Link in bio

Best time to visit: ${city.stats.bestTime}
Daily budget: ${city.stats.budget}

———
Which one would you visit first? Drop a comment 👇

#${city.name.replace(/\s/g, '')} #${city.country.replace(/\s/g, '')}Travel #TravelGuide #TravelTips #PlacesToVisit #Wanderlust #TravelAsia #BucketList #TravelPhotography #ExploreTheWorld #TripGenius #FreeGuide #TravelInspiration #TravelBlogger`;
}

export async function POST(request: Request) {
  const auth = verifyInstagramRequest(request);
  if (!auth.ok) return Response.json({ error: auth.error }, { status: auth.status });

  const body = (await request.json()) as { citySlug?: string };
  if (!body.citySlug) return Response.json({ error: 'citySlug is required' }, { status: 400 });

  const city = getCityBySlug(body.citySlug);
  if (!city) return Response.json({ error: 'City not found' }, { status: 404 });

  // Image is served from our own OG route — publicly accessible
  const imageUrl = `${SITE}/api/og/places/${body.citySlug}`;
  const caption  = buildCaption(city);

  try {
    const result = await publishInstagramImagePost({ imageUrl, caption });
    return Response.json({ success: true, city: city.name, imageUrl, postId: result.id });
  } catch (err) {
    console.error('[/api/instagram/places-post]', err);
    return Response.json({ error: err instanceof Error ? err.message : 'Failed to post' }, { status: 500 });
  }
}

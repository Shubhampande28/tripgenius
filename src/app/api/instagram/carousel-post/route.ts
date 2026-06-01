import { verifyInstagramRequest } from '@/lib/instagramAuth';
import { getCityBySlug } from '@/lib/cities';

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.tripgenius.in';
const TOTAL_SLIDES = 8;

function cfg() {
  const accessToken       = process.env.INSTAGRAM_ACCESS_TOKEN;
  const businessAccountId = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID;
  const graphVersion      = process.env.INSTAGRAM_GRAPH_VERSION ?? 'v24.0';
  if (!accessToken || !businessAccountId) throw new Error('Instagram credentials are not configured');
  return { accessToken, businessAccountId, base: `https://graph.facebook.com/${graphVersion}` };
}

async function post<T>(url: string, params: URLSearchParams): Promise<T> {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params,
  });
  const data = await res.json() as T & { error?: { message?: string } };
  if (!res.ok || (data as any).error) throw new Error((data as any).error?.message ?? `Graph API ${res.status}`);
  return data;
}

async function get<T>(url: string): Promise<T> {
  const res = await fetch(url);
  const data = await res.json() as T & { error?: { message?: string } };
  if (!res.ok || (data as any).error) throw new Error((data as any).error?.message ?? `Graph API ${res.status}`);
  return data;
}

async function waitReady(id: string, token: string, base: string) {
  for (let i = 0; i < 12; i++) {
    const s = await get<{ status_code: string }>(`${base}/${id}?fields=status_code&access_token=${token}`);
    if (s.status_code === 'FINISHED') return;
    if (s.status_code === 'ERROR' || s.status_code === 'EXPIRED') throw new Error(`Container ${s.status_code}`);
    await new Promise(r => setTimeout(r, 3000));
  }
  throw new Error('Container timed out');
}

function buildCaption(city: ReturnType<typeof getCityBySlug>) {
  if (!city) return '';
  const top5 = (city.thingsToDo ?? []).slice(0, 5).map((t, i) => `${i + 1}. ${t.icon} ${t.name}`).join('\n');
  return `${city.flag} Your Complete ${city.name} Travel Guide (2025)

Swipe through all 9 slides for:
✅ Best time to visit
💰 Daily budget breakdown
🗺️ Top 5 must-see places
🏨 Where to stay by area
🍜 What to eat
💎 Hidden gems most tourists miss
📋 Cheatsheet to screenshot

${top5}

Save this for your trip! 🌍
Free full guide → Link in bio

Best time: ${city.stats.bestTime} · Budget: ${city.stats.budget}

———
Which area would you stay in? 👇

#${city.name.replace(/\s/g,'')} #${city.country.replace(/\s/g,'')}Travel #TravelGuide #TravelTips #Wanderlust #TravelAsia #BucketList #TravelPhotography #ExploreTheWorld #TripGenius #FreeGuide #TravelInspiration #HiddenGems #TravelBlogger #${city.name.replace(/\s/g,'')}Travel`;
}

export async function POST(request: Request) {
  const auth = verifyInstagramRequest(request);
  if (!auth.ok) return Response.json({ error: auth.error }, { status: auth.status });

  const body = (await request.json()) as { citySlug?: string };
  if (!body.citySlug) return Response.json({ error: 'citySlug is required' }, { status: 400 });

  const city = getCityBySlug(body.citySlug);
  if (!city) return Response.json({ error: 'City not found' }, { status: 404 });

  const { accessToken, businessAccountId, base } = cfg();

  try {
    // 1. Create a media container for each slide
    const childIds: string[] = [];
    for (let s = 1; s <= TOTAL_SLIDES; s++) {
      const imageUrl = `${SITE}/api/og/carousel/${body.citySlug}/${s}`;
      const container = await post<{ id: string }>(
        `${base}/${businessAccountId}/media`,
        new URLSearchParams({ image_url: imageUrl, is_carousel_item: 'true', access_token: accessToken })
      );
      await waitReady(container.id, accessToken, base);
      childIds.push(container.id);
    }

    // 2. Create carousel container
    const carousel = await post<{ id: string }>(
      `${base}/${businessAccountId}/media`,
      new URLSearchParams({
        media_type: 'CAROUSEL',
        children: childIds.join(','),
        caption: buildCaption(city),
        access_token: accessToken,
      })
    );
    await waitReady(carousel.id, accessToken, base);

    // 3. Publish
    const published = await post<{ id: string }>(
      `${base}/${businessAccountId}/media_publish`,
      new URLSearchParams({ creation_id: carousel.id, access_token: accessToken })
    );

    return Response.json({ success: true, city: city.name, postId: published.id, slides: TOTAL_SLIDES });
  } catch (err) {
    console.error('[carousel-post]', err);
    return Response.json({ error: err instanceof Error ? err.message : 'Failed' }, { status: 500 });
  }
}

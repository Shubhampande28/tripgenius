import { verifyInstagramRequest } from '@/lib/instagramAuth';
import { getCityBySlug } from '@/lib/cities';

const SITE  = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.tripgenius.in';
const TOTAL = 10; // 1 cover + 1 marketing + 7 places + 1 CTA

function cfg() {
  const accessToken       = process.env.INSTAGRAM_ACCESS_TOKEN;
  const businessAccountId = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID;
  const graphVersion      = process.env.INSTAGRAM_GRAPH_VERSION ?? 'v24.0';
  if (!accessToken || !businessAccountId) throw new Error('Instagram credentials not configured');
  return { accessToken, businessAccountId, base:`https://graph.facebook.com/${graphVersion}` };
}

async function post<T>(url:string, params:URLSearchParams): Promise<T> {
  const res  = await fetch(url, { method:'POST', headers:{'Content-Type':'application/x-www-form-urlencoded'}, body:params });
  const data = await res.json() as T & { error?:{message?:string} };
  if (!res.ok || (data as any).error) throw new Error((data as any).error?.message ?? `Graph API ${res.status}`);
  return data;
}

async function get<T>(url:string): Promise<T> {
  const res  = await fetch(url);
  const data = await res.json() as T & { error?:{message?:string} };
  if (!res.ok || (data as any).error) throw new Error((data as any).error?.message ?? `Graph API ${res.status}`);
  return data;
}

async function waitReady(id:string, token:string, base:string) {
  for (let i = 0; i < 12; i++) {
    const s = await get<{status_code:string}>(`${base}/${id}?fields=status_code&access_token=${token}`);
    if (s.status_code === 'FINISHED') return;
    if (s.status_code === 'ERROR' || s.status_code === 'EXPIRED') throw new Error(`Container ${s.status_code}`);
    await new Promise(r => setTimeout(r, 3000));
  }
  throw new Error('Container timed out');
}

const BALI_CAPTION = `🌴 Places to See in Bali — Saved for later 📌

01 · Tanah Lot Temple
02 · Tegallalang Rice Terraces
03 · Mount Batur Sunrise Trek
04 · Uluwatu Temple
05 · Kelingking Beach, Nusa Penida
06 · Seminyak Beach
07 · Ubud Jungle & Temples

Save this post before your trip 🙌

Free complete Bali guide → Link in bio

———
Which one is on your bucket list? 👇

#Bali #BaliTravel #VisitBali #BaliGuide #TravelIndonesia #BaliLife #NusaPenida #Ubud #TanahLot #TravelAsia #Wanderlust #TripGenius #PlacesToVisit #BucketList #TravelPhotography`;

export async function POST(request: Request) {
  const auth = verifyInstagramRequest(request);
  if (!auth.ok) return Response.json({ error: auth.error }, { status: auth.status });

  const body = (await request.json()) as { citySlug?: string };
  if (!body.citySlug) return Response.json({ error: 'citySlug required' }, { status: 400 });

  const city = getCityBySlug(body.citySlug);
  if (!city) return Response.json({ error: 'City not found' }, { status: 404 });

  const { accessToken, businessAccountId, base } = cfg();

  const childIds: string[] = [];
  for (let s = 1; s <= TOTAL; s++) {
    const imageUrl = `${SITE}/api/og/places-carousel/${body.citySlug}/${s}`;
    const container = await post<{id:string}>(
      `${base}/${businessAccountId}/media`,
      new URLSearchParams({ image_url:imageUrl, is_carousel_item:'true', access_token:accessToken })
    );
    await waitReady(container.id, accessToken, base);
    childIds.push(container.id);
  }

  const carousel = await post<{id:string}>(
    `${base}/${businessAccountId}/media`,
    new URLSearchParams({
      media_type: 'CAROUSEL',
      children: childIds.join(','),
      caption: BALI_CAPTION,
      access_token: accessToken,
    })
  );
  await waitReady(carousel.id, accessToken, base);

  const published = await post<{id:string}>(
    `${base}/${businessAccountId}/media_publish`,
    new URLSearchParams({ creation_id: carousel.id, access_token: accessToken })
  );

  return Response.json({ success:true, city:city.name, postId:published.id, slides:TOTAL });
}

import { verifyInstagramRequest } from '@/lib/instagramAuth';

const SITE  = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.tripgenius.in';
const TOTAL = 6;

const CAPTION = `✨ THINGS NO ONE TELLS YOU ABOUT BALI...

You've seen the swings, sunsets, and smoothie bowls.
But here's what no one's telling you about Bali 👇

🛵 Traffic is REAL — Canggu is chaos. Try Sidemen or Amed for peace.
💧 Bali Belly is no joke — bottled water only, even for brushing teeth.
🐒 Monkeys WILL rob you — hold your phone at Ubud Monkey Forest.
🛕 Temple dress code is strict — bring a sarong or get turned away.

Save this before your trip! 📍✈️

Which tip shocked you most? Drop it below 👇

Free full Bali guide → Link in bio

#Bali #BaliTips #BaliTravelGuide #ThingsToKnowAboutBali #BaliTravel
#HiddenBali #TravelTips #TravelWarnings #Ubud #Canggu #BaliLife
#TripGenius #TravelSmart #IndonesiaTravel #Wanderlust #TravelHacks`;

function cfg() {
  const accessToken       = process.env.INSTAGRAM_ACCESS_TOKEN;
  const businessAccountId = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID;
  const graphVersion      = process.env.INSTAGRAM_GRAPH_VERSION ?? 'v24.0';
  if (!accessToken || !businessAccountId) throw new Error('Instagram credentials not configured');
  return { accessToken, businessAccountId, base: `https://graph.facebook.com/${graphVersion}` };
}

async function post<T>(url: string, params: URLSearchParams): Promise<T> {
  const res  = await fetch(url, { method:'POST', headers:{'Content-Type':'application/x-www-form-urlencoded'}, body:params });
  const data = await res.json() as T & { error?: { message?: string } };
  if (!res.ok || (data as any).error) throw new Error((data as any).error?.message ?? `Graph API ${res.status}`);
  return data;
}

async function waitReady(id: string, token: string, base: string) {
  for (let i = 0; i < 12; i++) {
    const s = await fetch(`${base}/${id}?fields=status_code&access_token=${token}`).then(r => r.json()) as { status_code: string };
    if (s.status_code === 'FINISHED') return;
    if (s.status_code === 'ERROR' || s.status_code === 'EXPIRED') throw new Error(`Container ${s.status_code}`);
    await new Promise(r => setTimeout(r, 3000));
  }
  throw new Error('Container timed out');
}

export async function POST(request: Request) {
  const auth = verifyInstagramRequest(request);
  if (!auth.ok) return Response.json({ error: auth.error }, { status: auth.status });

  const { accessToken, businessAccountId, base } = cfg();

  const childIds: string[] = [];
  for (let s = 1; s <= TOTAL; s++) {
    const imageUrl = `${SITE}/api/og/tips-carousel/bali/${s}`;
    const container = await post<{ id: string }>(
      `${base}/${businessAccountId}/media`,
      new URLSearchParams({ image_url: imageUrl, is_carousel_item: 'true', access_token: accessToken })
    );
    await waitReady(container.id, accessToken, base);
    childIds.push(container.id);
  }

  const carousel = await post<{ id: string }>(
    `${base}/${businessAccountId}/media`,
    new URLSearchParams({ media_type:'CAROUSEL', children:childIds.join(','), caption:CAPTION, access_token:accessToken })
  );
  await waitReady(carousel.id, accessToken, base);

  const published = await post<{ id: string }>(
    `${base}/${businessAccountId}/media_publish`,
    new URLSearchParams({ creation_id: carousel.id, access_token: accessToken })
  );

  return Response.json({ success:true, postId:published.id, slides:TOTAL });
}

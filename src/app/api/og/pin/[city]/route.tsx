import { ImageResponse } from 'next/og';
import { getCityBySlug } from '@/lib/cities';
import { getCityImageUrl } from '@/lib/cityImages';

// Pinterest pin generator — 1000x1500 (2:3), the size Pinterest promotes most.
// Reuses each city's real hero photo + data so every guide gets a unique,
// on-brand pin automatically. Text is rendered here (Satori), never by an AI
// image model, so it stays crisp and correct. Typography matches the site:
// Cormorant Garamond for the destination name, Plus Jakarta Sans for UI text.
//
//   /api/og/pin/bali                → "Bali — Travel Guide"
//   /api/og/pin/bali?month=december → "Bali in December" (+ weather hook)
//
// Download one: curl -s "https://www.tripgenius.in/api/og/pin/bali?month=december" -o bali-dec.png

export const runtime = 'edge';

const BASE = 'https://www.tripgenius.in';
const MONTHS = ['january','february','march','april','may','june','july','august','september','october','november','december'];
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

// Satori needs raw TTF data. Google's css API returns TTF URLs for legacy
// user agents; fetch the CSS, pull the font URL, fetch the font. Results are
// cached per edge isolate so repeat pins don't refetch.
const fontCache = new Map<string, Promise<ArrayBuffer>>();
function loadGoogleFont(family: string, weight: number): Promise<ArrayBuffer> {
  const key = `${family}:${weight}`;
  const cached = fontCache.get(key);
  if (cached) return cached;
  const p: Promise<ArrayBuffer> = (async () => {
    const cssUrl = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:wght@${weight}`;
    const css = await fetch(cssUrl, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 6.1)' } }).then(r => r.text());
    const url = css.match(/src: url\((.+?)\) format\('(?:truetype|opentype)'\)/)?.[1];
    if (!url) throw new Error(`no ttf url for ${key}`);
    return fetch(url).then(r => r.arrayBuffer());
  })();
  fontCache.set(key, p);
  return p;
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ city: string }> },
) {
  const { city: slug } = await params;
  const city = getCityBySlug(slug);
  if (!city) return new Response('City not found', { status: 404 });

  const url = new URL(req.url);
  const monthParam = (url.searchParams.get('month') || '').toLowerCase();
  const monthIdx = MONTHS.indexOf(monthParam);
  const hasMonth = monthIdx >= 0;
  const year = new Date().getFullYear();

  // Absolute image URL (Satori fetches remote images; local paths need the host).
  let hero = getCityImageUrl(slug, 'hero') ?? city.heroImage ?? city.image ?? '';
  if (hero.startsWith('/')) hero = BASE + hero;

  const accent = city.accentColor || '#FF7A00';
  const m = hasMonth ? city.monthByMonth?.months?.[monthIdx] : undefined;

  const kicker = hasMonth ? `${cap(monthParam)} ${year} Guide` : `Travel Guide ${year}`;
  const subLine = hasMonth ? `in ${cap(monthParam)}` : city.tagline;

  // Up to three quick-fact chips. Strip a trailing "/day" from the budget so
  // the label doesn't repeat it.
  const chips: { label: string; value: string }[] = hasMonth && m
    ? [
        { label: 'Weather', value: m.weather },
        { label: 'Temp', value: m.temp },
        { label: 'Crowds', value: m.crowds },
      ]
    : [
        { label: 'Best time', value: city.stats.bestTime },
        { label: 'Daily budget', value: city.stats.budget.replace(/\s*\/\s*day\s*$/i, '') },
      ];

  const [heading, sans, sansSemi] = await Promise.all([
    loadGoogleFont('Cormorant Garamond', 700),
    loadGoogleFont('Plus Jakarta Sans', 800),
    loadGoogleFont('Plus Jakarta Sans', 600),
  ]);

  return new ImageResponse(
    (
      <div style={{ width: 1000, height: 1500, display: 'flex', flexDirection: 'column', position: 'relative', fontFamily: 'Jakarta', overflow: 'hidden', background: '#0D1117' }}>
        {/* Background photo */}
        {hero ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={hero} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', background: `linear-gradient(160deg, ${accent}, #0D1117)` }} />
        )}

        {/* Legibility scrims — light at top for brand, heavy at bottom for text */}
        <div style={{ position: 'absolute', inset: 0, display: 'flex', background: 'linear-gradient(180deg, rgba(6,10,18,0.62) 0%, rgba(6,10,18,0.05) 26%, rgba(6,10,18,0.00) 46%, rgba(6,10,18,0.62) 66%, rgba(6,10,18,0.96) 88%)' }} />

        {/* Top accent stripe */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 10, display: 'flex', background: `linear-gradient(90deg, ${accent}, #00C9A7, #FFD166)` }} />

        {/* Content */}
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', height: '100%', padding: '66px 64px 56px' }}>
          {/* Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 52, height: 52, borderRadius: 14, background: '#FF6B35', fontSize: 26 }}>✈</div>
            <span style={{ fontSize: 30, fontWeight: 800, color: '#fff', letterSpacing: 0.5 }}>TripGenius</span>
            <div style={{ display: 'flex', flex: 1 }} />
            <span style={{ display: 'flex', fontSize: 22, fontWeight: 800, color: '#fff', letterSpacing: 2, background: 'rgba(8,12,20,0.6)', border: '1px solid rgba(255,255,255,0.18)', borderRadius: 999, padding: '10px 20px' }}>{city.flag} {city.country.toUpperCase()}</span>
          </div>

          {/* Spacer */}
          <div style={{ display: 'flex', flex: 1 }} />

          {/* Kicker */}
          <div style={{ display: 'flex', alignSelf: 'flex-start', background: accent, color: '#fff', fontWeight: 800, fontSize: 27, letterSpacing: 4, textTransform: 'uppercase', padding: '14px 26px', borderRadius: 12, marginBottom: 30, boxShadow: '0 6px 30px rgba(0,0,0,0.45)' }}>
            {kicker}
          </div>

          {/* Destination name — brand serif */}
          <div style={{ display: 'flex', color: '#fff', fontSize: 168, fontWeight: 700, lineHeight: 0.9, letterSpacing: '-2px', fontFamily: 'Cormorant', textShadow: '0 6px 32px rgba(0,0,0,0.65)' }}>
            {city.name}
          </div>

          {/* Subtitle */}
          <div style={{ display: 'flex', color: 'rgba(255,255,255,0.96)', fontSize: 52, fontWeight: 600, marginTop: 14, textShadow: '0 3px 18px rgba(0,0,0,0.7)' }}>
            {subLine}
          </div>

          {/* Fact chips — solid dark so they read on any photo */}
          <div style={{ display: 'flex', gap: 16, marginTop: 38, flexWrap: 'wrap' }}>
            {chips.map((c) => (
              <div key={c.label} style={{ display: 'flex', flexDirection: 'column', gap: 6, background: 'rgba(8,12,20,0.72)', border: `2px solid ${accent}55`, borderRadius: 16, padding: '16px 24px' }}>
                <span style={{ display: 'flex', color: accent, fontSize: 20, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 2 }}>{c.label}</span>
                <span style={{ display: 'flex', color: '#fff', fontSize: 31, fontWeight: 800 }}>{c.value}</span>
              </div>
            ))}
          </div>

          {/* Footer CTA bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 44, background: 'rgba(8,12,20,0.7)', border: '1px solid rgba(255,255,255,0.14)', borderRadius: 18, padding: '20px 28px' }}>
            <span style={{ display: 'flex', color: '#fff', fontSize: 30, fontWeight: 800 }}>tripgenius.in</span>
            <div style={{ display: 'flex', alignItems: 'center', background: accent, color: '#fff', fontSize: 27, fontWeight: 800, padding: '14px 26px', borderRadius: 12 }}>
              Read the free guide →
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1000,
      height: 1500,
      fonts: [
        { name: 'Cormorant', data: heading, weight: 700, style: 'normal' },
        { name: 'Jakarta', data: sans, weight: 800, style: 'normal' },
        { name: 'Jakarta', data: sansSemi, weight: 600, style: 'normal' },
      ],
    },
  );
}

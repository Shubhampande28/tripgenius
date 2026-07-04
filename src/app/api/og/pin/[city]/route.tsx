import { ImageResponse } from 'next/og';
import { getCityBySlug } from '@/lib/cities';
import { getCityImageUrl } from '@/lib/cityImages';

// Pinterest pin generator — 1000x1500 (2:3), the size Pinterest promotes most.
// Reuses each city's real hero photo + data so every guide gets a unique,
// on-brand pin automatically. Text is rendered here (Satori), never by an AI
// image model, so it stays crisp and correct.
//
//   /api/og/pin/bali                → "Bali — Travel Guide"
//   /api/og/pin/bali?month=december → "Bali in December" (+ weather hook)
//
// Download one: curl -s "https://www.tripgenius.in/api/og/pin/bali?month=december" -o bali-dec.png

export const runtime = 'edge';

const BASE = 'https://www.tripgenius.in';
const MONTHS = ['january','february','march','april','may','june','july','august','september','october','november','december'];
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

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

  const kicker = hasMonth ? `${cap(monthParam)} ${year}` : `Travel Guide ${year}`;
  const bigLine = hasMonth ? city.name : city.name;
  const subLine = hasMonth ? `in ${cap(monthParam)}` : city.tagline;

  // Up to three quick-fact chips.
  const chips: { label: string; value: string }[] = hasMonth && m
    ? [
        { label: 'Weather', value: m.weather },
        { label: 'Temp', value: m.temp },
        { label: 'Crowds', value: m.crowds },
      ]
    : [
        { label: 'Best time', value: city.stats.bestTime },
        { label: 'Budget/day', value: city.stats.budget },
      ];

  return new ImageResponse(
    (
      <div style={{ width: 1000, height: 1500, display: 'flex', flexDirection: 'column', position: 'relative', fontFamily: 'Georgia, serif', overflow: 'hidden', background: '#0D1117' }}>
        {/* Background photo */}
        {hero ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={hero} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', background: `linear-gradient(160deg, ${accent}, #0D1117)` }} />
        )}

        {/* Legibility gradient (darker at top and bottom for text) */}
        <div style={{ position: 'absolute', inset: 0, display: 'flex', background: 'linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.15) 38%, rgba(0,0,0,0.45) 66%, rgba(0,0,0,0.90) 100%)' }} />

        {/* Top accent stripe */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 8, display: 'flex', background: `linear-gradient(90deg, ${accent}, #00C9A7, #FFD166)` }} />

        {/* Content */}
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', height: '100%', padding: '64px 64px 72px' }}>
          {/* Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 44, height: 44, borderRadius: 12, background: '#FF6B35', fontSize: 22 }}>✈</div>
            <span style={{ fontSize: 24, fontWeight: 700, color: '#fff', fontFamily: 'system-ui', letterSpacing: 1 }}>TripGenius</span>
          </div>

          {/* Spacer */}
          <div style={{ display: 'flex', flex: 1 }} />

          {/* Kicker */}
          <div style={{ display: 'flex', alignSelf: 'flex-start', background: accent, color: '#fff', fontFamily: 'system-ui', fontWeight: 700, fontSize: 26, letterSpacing: 3, textTransform: 'uppercase', padding: '10px 20px', borderRadius: 10, marginBottom: 24 }}>
            {kicker}
          </div>

          {/* City name (huge) */}
          <div style={{ display: 'flex', color: '#fff', fontSize: 132, fontWeight: 800, lineHeight: 0.98, letterSpacing: '-3px', textShadow: '0 4px 24px rgba(0,0,0,0.5)' }}>
            {bigLine}
          </div>

          {/* Subtitle */}
          <div style={{ display: 'flex', color: '#fff', fontSize: 56, fontWeight: 700, marginTop: 6, textShadow: '0 3px 18px rgba(0,0,0,0.6)' }}>
            {subLine}
          </div>

          {/* Fact chips */}
          <div style={{ display: 'flex', gap: 16, marginTop: 32, flexWrap: 'wrap' }}>
            {chips.map((c) => (
              <div key={c.label} style={{ display: 'flex', flexDirection: 'column', gap: 4, background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.18)', borderRadius: 14, padding: '14px 22px' }}>
                <span style={{ display: 'flex', color: 'rgba(255,255,255,0.7)', fontSize: 20, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1.5, fontFamily: 'system-ui' }}>{c.label}</span>
                <span style={{ display: 'flex', color: '#fff', fontSize: 30, fontWeight: 700, fontFamily: 'system-ui' }}>{c.value}</span>
              </div>
            ))}
          </div>

          {/* Footer CTA */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 40 }}>
            <span style={{ display: 'flex', color: '#fff', fontSize: 30, fontWeight: 700, fontFamily: 'system-ui' }}>tripgenius.in</span>
            <span style={{ display: 'flex', color: accent, fontSize: 28, fontWeight: 700, fontFamily: 'system-ui' }}>Free guide →</span>
          </div>
        </div>
      </div>
    ),
    { width: 1000, height: 1500 },
  );
}

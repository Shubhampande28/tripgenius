import { ImageResponse } from 'next/og';
import { getCityBySlug } from '@/lib/cities';
import { getCityImageUrl } from '@/lib/cityImages';

// Pinterest pin generator — 1000x1500 (2:3), the size Pinterest promotes most.
//
// Layout: full-bleed photo on top, solid WHITE brand panel below. Titles are
// dark-ink-on-white so they are always readable regardless of the photo (white
// text over bright skies/water was invisible). All accents use the site brand
// red (#DC2626) with the gold gradient stripe, and the panel carries the real
// /logo.png lockup. Typography matches the site: Cormorant Garamond for the
// destination name, Plus Jakarta Sans for UI text.
//
//   /api/og/pin/bali                → "Bali — Travel Guide"
//   /api/og/pin/bali?month=december → "Bali in December" (+ weather hook)
//
// Download one: curl -s "https://www.tripgenius.in/api/og/pin/bali?month=december" -o bali-dec.png

export const runtime = 'edge';

const BASE = 'https://www.tripgenius.in';
const MONTHS = ['january','february','march','april','may','june','july','august','september','october','november','december'];
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

// Site theme tokens (globals.css)
const RED = '#DC2626';
const GOLD = '#FFD166';
const INK = '#0D1117';
const SLATE = '#334155';
const SURFACE = '#F1F5F9';
const BORDER = '#E2E8F0';

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

  const m = hasMonth ? city.monthByMonth?.months?.[monthIdx] : undefined;
  const kicker = hasMonth ? `${cap(monthParam)} ${year} Guide` : `Travel Guide ${year}`;
  // For month pins prefer the authored one-line highlight; the title already
  // names the month, so repeating it adds nothing.
  const rawSub = hasMonth
    ? (m?.highlight || 'Weather, crowds & what to do')
    : city.tagline;
  const subLine = rawSub.length > 64 ? rawSub.slice(0, 61).trimEnd() + '…' : rawSub;

  // Scale the serif title down for long names so it never wraps awkwardly.
  const titleText = hasMonth ? `${city.name} in ${cap(monthParam)}` : city.name;
  const titleSize = titleText.length <= 10 ? 148 : titleText.length <= 16 ? 116 : titleText.length <= 22 ? 92 : 72;

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
      <div style={{ width: 1000, height: 1500, display: 'flex', flexDirection: 'column', fontFamily: 'Jakarta', background: '#FFFFFF' }}>

        {/* ── Photo (top ~57%) ─────────────────────────────────────────── */}
        <div style={{ display: 'flex', position: 'relative', width: 1000, height: 850, overflow: 'hidden' }}>
          {hero ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={hero} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', background: `linear-gradient(160deg, ${RED}, ${INK})` }} />
          )}

          {/* Brand stripe (site .gradient-text-accent: red → gold) */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 12, display: 'flex', background: `linear-gradient(90deg, ${RED}, ${GOLD})` }} />

          {/* Country pill */}
          <div style={{ position: 'absolute', top: 40, right: 40, display: 'flex', alignItems: 'center', gap: 8, background: '#FFFFFF', borderRadius: 999, padding: '12px 22px', fontSize: 22, fontWeight: 800, color: INK, boxShadow: '0 4px 20px rgba(0,0,0,0.25)' }}>
            {city.flag} {city.country.toUpperCase()}
          </div>

          {/* Kicker pill overlapping the panel edge */}
          <div style={{ position: 'absolute', bottom: 0, left: 56, display: 'flex', background: RED, color: '#fff', fontWeight: 800, fontSize: 26, letterSpacing: 4, textTransform: 'uppercase', padding: '16px 28px', borderRadius: '14px 14px 0 0' }}>
            {kicker}
          </div>
        </div>

        {/* ── White brand panel (bottom) ──────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, padding: '44px 56px 40px', background: '#FFFFFF' }}>

          {/* Destination name — dark ink on white: always readable */}
          <div style={{ display: 'flex', color: INK, fontSize: titleSize, fontWeight: 700, lineHeight: 0.95, letterSpacing: '-1px', fontFamily: 'Cormorant' }}>
            {titleText}
          </div>

          {/* Subtitle */}
          <div style={{ display: 'flex', color: SLATE, fontSize: 34, fontWeight: 600, marginTop: 14 }}>
            {subLine}
          </div>

          {/* Fact chips — light surface, red labels (site card style) */}
          <div style={{ display: 'flex', gap: 14, marginTop: 30, flexWrap: 'wrap' }}>
            {chips.map((c) => (
              <div key={c.label} style={{ display: 'flex', flexDirection: 'column', gap: 5, background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 14, padding: '14px 22px' }}>
                <span style={{ display: 'flex', color: RED, fontSize: 18, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 2 }}>{c.label}</span>
                <span style={{ display: 'flex', color: INK, fontSize: 27, fontWeight: 800 }}>{c.value}</span>
              </div>
            ))}
          </div>

          {/* Spacer */}
          <div style={{ display: 'flex', flex: 1 }} />

          {/* Footer: real logo lockup + CTA */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: `1px solid ${BORDER}`, paddingTop: 26 }}>
            {/* logo.png is a 2000x2000 canvas with the lockup in the middle
                band — crop to that band with a fixed window + negative offset */}
            <div style={{ display: 'flex', width: 340, height: 120, overflow: 'hidden', alignItems: 'center' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`${BASE}/logo.png`} alt="TripGenius" style={{ width: 340, height: 340, marginTop: 0, objectFit: 'cover', objectPosition: 'center' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', background: RED, color: '#fff', fontSize: 26, fontWeight: 800, padding: '16px 28px', borderRadius: 12 }}>
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

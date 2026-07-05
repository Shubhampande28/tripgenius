/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from 'next/og';
import { getCityBySlug } from '@/lib/cities';
import { getCityImageUrl } from '@/lib/cityImages';
import { getPlaceImageUrl } from '@/lib/placeImages';

// Pinterest pin generator — 1000x1500 (2:3), three approved designs that
// auto-match the pin type (override with ?style=season|things|cover):
//
//   /api/og/pin/bali                  → Season Card (12-month strip + chips)
//   /api/og/pin/bali?style=things     → Top-5 Checklist ("5 Things You Can't Miss…")
//   /api/og/pin/bali?month=december   → Magazine Cover (red 2x2 stats panel)
//
// All variants share the red/white brand (#DC2626, red→gold stripe), the real
// /logo.png lockup, and dark-ink-on-white titles so text never washes out on a
// bright photo. Fonts match the site: Cormorant Garamond + Plus Jakarta Sans.

// Node runtime: these routes bundle the full city dataset (~1.2 MB), which
// exceeds the 1 MB Edge Function limit on the current Vercel plan.
export const runtime = 'nodejs';

const BASE = 'https://www.tripgenius.in';
const MONTHS = ['january','february','march','april','may','june','july','august','september','october','november','december'];
const MONTH_LETTERS = ['J','F','M','A','M','J','J','A','S','O','N','D'];
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const trunc = (s: string, n: number) => (s.length > n ? s.slice(0, n - 1).trimEnd() + '…' : s);

// Satori can't decode AVIF, which Unsplash serves under auto=format — force
// JPEG so every image has a determinable size.
const jpegUrl = (u: string) =>
  u.includes('images.unsplash.com') ? u.replace('auto=format', 'fm=jpg') : u;

// Site theme tokens (globals.css)
const RED = '#DC2626';
const GOLD = '#FFD166';
const TEAL = '#00C9A7';
const BLUE = '#60A5FA';
const INK = '#0D1117';
const SLATE = '#334155';
const SURFACE = '#F1F5F9';
const BORDER = '#E2E8F0';

const RATING_COLOR: Record<string, string> = {
  excellent: TEAL, good: BLUE, average: GOLD, avoid: RED,
};

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

// Shared pieces ──────────────────────────────────────────────────────────────

function Stripe() {
  return <div style={{ display: 'flex', height: 12, width: '100%', background: `linear-gradient(90deg, ${RED}, ${GOLD})`, flexShrink: 0 }} />;
}

function CountryPill({ flag, country }: { flag: string; country: string }) {
  return (
    <div style={{ position: 'absolute', top: 36, right: 36, display: 'flex', alignItems: 'center', gap: 8, background: '#FFFFFF', borderRadius: 999, padding: '12px 22px', fontSize: 22, fontWeight: 800, color: INK, boxShadow: '0 4px 20px rgba(0,0,0,0.25)' }}>
      {flag} {country.toUpperCase()}
    </div>
  );
}

function Logo() {
  // logo.png is a 2000x2000 canvas with the lockup in the middle band — show
  // it through a fixed window so the whitespace padding is cropped away.
  return (
    <div style={{ display: 'flex', width: 320, height: 112, overflow: 'hidden', alignItems: 'center' }}>
      <img src={`${BASE}/logo.png`} alt="TripGenius" style={{ width: 320, height: 320, objectFit: 'cover', objectPosition: 'center' }} />
    </div>
  );
}

function Footer({ cta }: { cta: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: `1px solid ${BORDER}`, paddingTop: 22 }}>
      <Logo />
      <div style={{ display: 'flex', alignItems: 'center', background: RED, color: '#fff', fontSize: 26, fontWeight: 800, padding: '16px 28px', borderRadius: 12 }}>
        {cta}
      </div>
    </div>
  );
}

function Chip({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5, background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 14, padding: '14px 22px' }}>
      <span style={{ display: 'flex', color: RED, fontSize: 18, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 2 }}>{label}</span>
      <span style={{ display: 'flex', color: INK, fontSize: 27, fontWeight: 800 }}>{value}</span>
    </div>
  );
}

function Photo({ hero, height, children }: { hero: string; height?: number; children?: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', position: 'relative', width: 1000, ...(height ? { height } : { flex: 1 }), overflow: 'hidden' }}>
      {hero ? (
        <img src={hero} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
      ) : (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', background: `linear-gradient(160deg, ${RED}, ${INK})` }} />
      )}
      {children}
    </div>
  );
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
  const styleParam = (url.searchParams.get('style') || '').toLowerCase();
  const style: 'season' | 'things' | 'cover' | 'collage' =
    styleParam === 'things' ? 'things'
    : styleParam === 'collage' ? 'collage'
    : styleParam === 'cover' || hasMonth ? 'cover'
    : 'season';

  // ?size=ig renders the SAME design at 1000x1250 (4:5) — Instagram's API
  // rejects 2:3 portraits, so IG posts reuse these layouts at its max ratio.
  const isIG = (url.searchParams.get('size') || '').toLowerCase() === 'ig';
  const H = isIG ? 1250 : 1500;

  const year = new Date().getFullYear();

  let hero = getCityImageUrl(slug, 'hero') ?? city.heroImage ?? city.image ?? '';
  if (hero.startsWith('/')) hero = BASE + hero;
  hero = jpegUrl(hero);

  const [heading, sans, sansSemi] = await Promise.all([
    loadGoogleFont('Cormorant Garamond', 700),
    loadGoogleFont('Plus Jakarta Sans', 800),
    loadGoogleFont('Plus Jakarta Sans', 600),
  ]);

  const opts = {
    width: 1000,
    height: H,
    fonts: [
      { name: 'Cormorant', data: heading, weight: 700 as const, style: 'normal' as const },
      { name: 'Jakarta', data: sans, weight: 800 as const, style: 'normal' as const },
      { name: 'Jakarta', data: sansSemi, weight: 600 as const, style: 'normal' as const },
    ],
  };

  // ── Design 2: Top-5 Checklist ────────────────────────────────────────────
  if (style === 'things') {
    const things = (city.thingsToDo ?? []).slice(0, 5);
    const total = (city.thingsToDo ?? []).length;
    const listTitle = `5 Things You Can't Miss in ${city.name}`;
    const titleSize = listTitle.length <= 34 ? 64 : 54;

    return new ImageResponse(
      (
        <div style={{ width: 1000, height: H, display: 'flex', flexDirection: 'column', fontFamily: 'Jakarta', background: '#FFFFFF' }}>
          <Stripe />
          {/* Red header band */}
          <div style={{ display: 'flex', flexDirection: 'column', background: RED, color: '#fff', padding: '40px 56px 36px', flexShrink: 0 }}>
            <div style={{ display: 'flex', fontSize: 25, fontWeight: 800, letterSpacing: 5, opacity: 0.9 }}>
              {city.name.toUpperCase()} · TRAVEL GUIDE {year}
            </div>
            <div style={{ display: 'flex', fontFamily: 'Cormorant', fontSize: titleSize, fontWeight: 700, lineHeight: 1.02, marginTop: 12 }}>
              {listTitle}
            </div>
          </div>
          <Photo hero={hero} height={isIG ? 300 : 520}>
            <CountryPill flag={city.flag} country={city.country} />
          </Photo>
          {/* Checklist */}
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, padding: '34px 56px 36px', gap: 18 }}>
            {things.map((t, i) => (
              <div key={i} style={{ display: 'flex', gap: 22, alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 52, height: 52, borderRadius: 999, background: RED, color: '#fff', fontSize: 27, fontWeight: 800, flexShrink: 0 }}>
                  {i + 1}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <span style={{ display: 'flex', color: INK, fontSize: 33, fontWeight: 800 }}>{trunc(t.name, 38)}</span>
                  {t.description && <span style={{ display: 'flex', color: '#64748B', fontSize: 24, fontWeight: 600, lineHeight: 1.3 }}>{trunc(t.description, 64)}</span>}
                </div>
              </div>
            ))}
            <div style={{ display: 'flex', flex: 1 }} />
            <Footer cta={total > 5 ? `All ${total} things to do →` : 'Read the free guide →'} />
          </div>
        </div>
      ),
      opts,
    );
  }

  // ── Design 3: Magazine Cover (month pins) ────────────────────────────────
  if (style === 'cover') {
    const idx = hasMonth ? monthIdx : 0;
    const m = city.monthByMonth?.months?.[idx];
    const M = cap(MONTHS[idx]);
    const coverTitle = hasMonth ? `${city.name} in ${M}` : city.name;
    const titleSize = coverTitle.length <= 14 ? 110 : coverTitle.length <= 20 ? 92 : coverTitle.length <= 26 ? 76 : 62;

    const stats: { label: string; value: string }[] = m
      ? [
          { label: 'Weather', value: trunc(m.weather.split(/[+—–,]/)[0].trim(), 24) },
          { label: 'Temp', value: m.temp },
          { label: 'Crowds', value: trunc(m.crowds, 24) },
          { label: 'Prices', value: trunc(m.price, 24) },
        ]
      : [
          { label: 'Best time', value: city.stats.bestTime },
          { label: 'Daily budget', value: city.stats.budget.replace(/\s*\/\s*day\s*$/i, '') },
          { label: 'Language', value: trunc(city.stats.language, 26) },
          { label: 'Currency', value: trunc(city.stats.currency, 26) },
        ];

    return new ImageResponse(
      (
        <div style={{ width: 1000, height: H, display: 'flex', flexDirection: 'column', fontFamily: 'Jakarta', background: '#FFFFFF' }}>
          <Stripe />
          {/* Photo stays fully visible — nothing overlays it */}
          <Photo hero={hero} height={isIG ? 480 : 760}>
            <CountryPill flag={city.flag} country={city.country} />
          </Photo>
          {/* White panel: title + red stat boxes (site colors) */}
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, padding: '40px 56px 40px' }}>
            <div style={{ display: 'flex', color: RED, fontSize: 25, fontWeight: 800, letterSpacing: 6 }}>
              {hasMonth ? `${M.toUpperCase()} ${year} · MONTH GUIDE` : `TRAVEL GUIDE ${year}`}
            </div>
            <div style={{ display: 'flex', fontFamily: 'Cormorant', color: INK, fontSize: titleSize, fontWeight: 700, lineHeight: 0.98, letterSpacing: '-1px', marginTop: 10 }}>
              {coverTitle}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 18, marginTop: 30 }}>
              {stats.map((s) => (
                <div key={s.label} style={{ display: 'flex', flexDirection: 'column', gap: 6, background: RED, borderRadius: 14, padding: '18px 26px', width: 425 }}>
                  <span style={{ display: 'flex', color: GOLD, fontSize: 20, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 2.5 }}>{s.label}</span>
                  <span style={{ display: 'flex', color: '#fff', fontSize: 30, fontWeight: 800 }}>{s.value}</span>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', flex: 1 }} />
            <Footer cta="Read the guide →" />
          </div>
        </div>
      ),
      opts,
    );
  }

  // ── Design 4: Photo Collage ──────────────────────────────────────────────
  if (style === 'collage') {
    // Hero on top + a row of distinct place photos from the city's things-to-do.
    // No category arg: only accept photos of the actual place — the generic
    // category fallbacks can be factually wrong (e.g. safari elephant for Bali).
    const seen = new Set<string>([hero]);
    const candidates: string[] = [];
    for (const t of city.thingsToDo ?? []) {
      const u0 = getPlaceImageUrl(slug, t.name);
      const u = u0 ? jpegUrl(u0) : undefined;
      if (u && !seen.has(u)) { seen.add(u); candidates.push(u); }
      if (candidates.length >= 6) break;
    }
    // Some catalogued images are dead (404 HTML) and crash Satori — verify in
    // parallel and keep only real images.
    const checks = await Promise.all(candidates.map(async (u) => {
      try {
        const r = await fetch(u, { method: 'HEAD' });
        return r.ok && (r.headers.get('content-type') ?? '').startsWith('image/') ? u : null;
      } catch { return null; }
    }));
    const placeImgs = checks.filter((u): u is string => !!u).slice(0, 3);
    while (placeImgs.length < 3) placeImgs.push(hero); // graceful fallback

    const titleSize = city.name.length <= 10 ? 120 : city.name.length <= 16 ? 96 : 74;

    return new ImageResponse(
      (
        <div style={{ width: 1000, height: H, display: 'flex', flexDirection: 'column', fontFamily: 'Jakarta', background: '#FFFFFF' }}>
          <Stripe />
          <Photo hero={hero} height={isIG ? 400 : 620}>
            <CountryPill flag={city.flag} country={city.country} />
          </Photo>
          {/* Collage row — 3 place photos with thin white gutters */}
          <div style={{ display: 'flex', gap: 8, marginTop: 8, flexShrink: 0 }}>
            {placeImgs.map((u, i) => (
              <div key={i} style={{ display: 'flex', position: 'relative', width: 328, height: isIG ? 240 : 300, overflow: 'hidden' }}>
                <img src={u} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            ))}
          </div>
          {/* White info panel */}
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, padding: '38px 56px 40px' }}>
            <div style={{ display: 'flex', color: RED, fontSize: 25, fontWeight: 800, letterSpacing: 6 }}>
              TRAVEL GUIDE {year}
            </div>
            <div style={{ display: 'flex', fontFamily: 'Cormorant', color: INK, fontSize: titleSize, fontWeight: 700, lineHeight: 0.96, letterSpacing: '-1px', marginTop: 8 }}>
              {city.name}
            </div>
            <div style={{ display: 'flex', color: SLATE, fontSize: 31, fontWeight: 600, marginTop: 10 }}>
              {trunc(city.tagline, 54)}
            </div>
            <div style={{ display: 'flex', flex: 1 }} />
            <Footer cta="Read the free guide →" />
          </div>
        </div>
      ),
      opts,
    );
  }

  // ── Design 1: Season Card (default, city guides) ─────────────────────────
  const titleSize = city.name.length <= 10 ? 140 : city.name.length <= 16 ? 110 : 84;
  const months = city.monthByMonth?.months ?? [];
  const showStrip = months.length === 12 && !city.monthByMonthSynthetic;

  // Visa strings carry long clauses ("Visa on Arrival — 35 USD…"); keep only
  // the headline part before any dash/parenthesis.
  const visaShort = city.visa?.split(/[—(–]/)[0].trim();
  const chips: { label: string; value: string }[] = [
    { label: 'Best time', value: city.stats.bestTime },
    { label: 'Daily budget', value: city.stats.budget.replace(/\s*\/\s*day\s*$/i, '') },
    ...(visaShort ? [{ label: 'Visa', value: trunc(visaShort, 18) }] : []),
  ];

  return new ImageResponse(
    (
      <div style={{ width: 1000, height: H, display: 'flex', flexDirection: 'column', fontFamily: 'Jakarta', background: '#FFFFFF' }}>
        <Stripe />
        <Photo hero={hero} height={isIG ? 480 : 690}>
          <CountryPill flag={city.flag} country={city.country} />
          <div style={{ position: 'absolute', bottom: 0, left: 56, display: 'flex', background: RED, color: '#fff', fontWeight: 800, fontSize: 26, letterSpacing: 4, textTransform: 'uppercase', padding: '16px 28px', borderRadius: '14px 14px 0 0' }}>
            Travel Guide {year}
          </div>
        </Photo>

        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, padding: '40px 56px 40px' }}>
          <div style={{ display: 'flex', color: INK, fontSize: titleSize, fontWeight: 700, lineHeight: 0.95, letterSpacing: '-1px', fontFamily: 'Cormorant' }}>
            {city.name}
          </div>
          <div style={{ display: 'flex', color: SLATE, fontSize: 33, fontWeight: 600, marginTop: 12 }}>
            {trunc(city.tagline, 52)}
          </div>

          {/* 12-month season strip — data no other pin has */}
          {showStrip && (
            <div style={{ display: 'flex', flexDirection: 'column', marginTop: 30 }}>
              <div style={{ display: 'flex', gap: 12 }}>
                {months.map((mo, i) => (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                    <div style={{ display: 'flex', width: 50, height: 50, borderRadius: 12, background: RATING_COLOR[mo.rating] ?? GOLD }} />
                    <span style={{ display: 'flex', fontSize: 19, fontWeight: 800, color: '#64748B' }}>{MONTH_LETTERS[i]}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 28, marginTop: 14 }}>
                {[{ c: TEAL, t: 'Best' }, { c: BLUE, t: 'Good' }, { c: GOLD, t: 'Okay' }, { c: RED, t: 'Avoid' }].map((l) => (
                  <div key={l.t} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ display: 'flex', width: 20, height: 20, borderRadius: 6, background: l.c }} />
                    <span style={{ display: 'flex', fontSize: 21, fontWeight: 600, color: SLATE }}>{l.t}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: 14, marginTop: 30, flexWrap: 'wrap' }}>
            {chips.map((c) => <Chip key={c.label} label={c.label} value={c.value} />)}
          </div>

          <div style={{ display: 'flex', flex: 1 }} />
          <Footer cta="Read the free guide →" />
        </div>
      </div>
    ),
    opts,
  );
}

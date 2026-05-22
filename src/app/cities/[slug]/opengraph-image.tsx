import { ImageResponse } from 'next/og';
import { getCityBySlug } from '@/lib/cities';

export const alt = 'TripGenius City Travel Guide';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function CityOGImage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const city = getCityBySlug(slug);
  if (!city) return new Response('Not found', { status: 404 });

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%', height: '100%',
          display: 'flex', flexDirection: 'column',
          background: '#0D1117',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Gradient accent */}
        <div style={{
          position: 'absolute', inset: 0,
          background: `radial-gradient(ellipse 70% 60% at 20% 50%, ${city.accentColor}25, transparent)`,
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 50% 40% at 80% 80%, rgba(0,201,167,0.12), transparent)',
        }} />

        {/* Left content */}
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          justifyContent: 'center', padding: '64px 72px',
          gap: 0,
        }}>
          {/* Brand */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            marginBottom: 40,
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: '#FF6B35',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18,
            }}>✈</div>
            <span style={{ color: '#E6EDF3', fontSize: 20, fontWeight: 700, letterSpacing: '-0.5px' }}>
              TripGenius
            </span>
          </div>

          {/* Flag + country */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <span style={{ fontSize: 40 }}>{city.flag}</span>
            <span style={{ color: '#8B949E', fontSize: 20, fontWeight: 500 }}>{city.country}</span>
          </div>

          {/* City name */}
          <div style={{
            color: '#E6EDF3', fontSize: 76, fontWeight: 800,
            lineHeight: 1, letterSpacing: '-2px', marginBottom: 16,
          }}>
            {city.name}
          </div>

          {/* Tagline */}
          <div style={{
            color: city.accentColor, fontSize: 22, fontWeight: 600,
            marginBottom: 28,
          }}>
            {city.tagline}
          </div>

          {/* Stats row */}
          <div style={{ display: 'flex', gap: 24 }}>
            <div style={{
              background: 'rgba(255,255,255,0.06)', borderRadius: 10,
              padding: '10px 18px', display: 'flex', flexDirection: 'column', gap: 2,
            }}>
              <span style={{ color: '#8B949E', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Best Time</span>
              <span style={{ color: '#E6EDF3', fontSize: 16, fontWeight: 700 }}>{city.stats.bestTime}</span>
            </div>
            <div style={{
              background: 'rgba(255,255,255,0.06)', borderRadius: 10,
              padding: '10px 18px', display: 'flex', flexDirection: 'column', gap: 2,
            }}>
              <span style={{ color: '#8B949E', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Budget</span>
              <span style={{ color: '#E6EDF3', fontSize: 16, fontWeight: 700 }}>{city.stats.budget}</span>
            </div>
            {city.vibes.slice(0, 2).map((v) => (
              <div key={v} style={{
                background: `${city.accentColor}18`, borderRadius: 10,
                padding: '10px 18px', display: 'flex', alignItems: 'center',
              }}>
                <span style={{ color: city.accentColor, fontSize: 16, fontWeight: 700 }}>{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          height: 5, width: '100%',
          background: `linear-gradient(90deg, ${city.accentColor}, #00C9A7, #FFD166)`,
        }} />
      </div>
    ),
    { ...size }
  );
}

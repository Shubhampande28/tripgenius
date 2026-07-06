import { ImageResponse } from 'next/og';
import { getCityBySlug } from '@/lib/cities';

// Node runtime: these routes bundle the full city dataset (~1.2 MB), which
// exceeds the 1 MB Edge Function limit on the current Vercel plan.
export const runtime = 'nodejs';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ city: string }> }
) {
  const { city: slug } = await params;
  const city = getCityBySlug(slug);
  if (!city) return new Response('City not found', { status: 404 });

  const places = (city.thingsToDo ?? []).slice(0, 8);
  const heroImg = city.heroImage || city.image;

  const ORANGE  = '#FF7A00';
  const ORANGE2 = '#FFB347';

  return new ImageResponse(
    (
      <div
        style={{
          width: 1080,
          height: 1080,
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          fontFamily: 'Georgia, serif',
          overflow: 'hidden',
        }}
      >
        {/* Background photo */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={heroImg}
          alt=""
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />

        {/* Dark gradient overlay */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(165deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.88) 100%)', display: 'flex' }} />

        {/* Orange accent stripe top */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 5, background: `linear-gradient(to right, ${ORANGE}, ${ORANGE2})`, display: 'flex' }} />

        {/* Content */}
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', padding: '52px 60px', height: '100%' }}>

          {/* Header */}
          <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 36 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, borderRadius: 8, background: ORANGE }}>
                <span style={{ fontSize: 14 }}>✈️</span>
              </div>
              <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', letterSpacing: 3, fontFamily: 'system-ui' }}>TRIPGENIUS · TRAVEL GUIDE</span>
            </div>

            <div style={{ fontSize: 15, color: ORANGE, fontWeight: 700, letterSpacing: 3, marginBottom: 8, fontFamily: 'system-ui' }}>
              TOP PLACES TO VISIT
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: 16 }}>
              <span style={{ fontSize: 68, fontWeight: 800, color: '#ffffff', lineHeight: 1.05 }}>
                {city.name}
              </span>
              <span style={{ fontSize: 44 }}>{city.flag}</span>
            </div>
            <div style={{ fontSize: 17, color: ORANGE2, fontStyle: 'italic', fontFamily: 'Georgia, serif' }}>
              {city.tagline}
            </div>
          </div>

          {/* Places list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 11, flex: 1 }}>
            {places.map((place, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: 14,
                  padding: '14px 18px',
                }}
              >
                {/* Number */}
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: i === 0 ? ORANGE : 'rgba(255,122,0,0.25)',
                  border: `1px solid ${ORANGE}55`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <span style={{ fontSize: 15, fontWeight: 800, color: i === 0 ? '#fff' : ORANGE2, fontFamily: 'system-ui' }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>

                {/* Emoji */}
                <span style={{ fontSize: 26, flexShrink: 0 }}>{place.icon}</span>

                {/* Text */}
                <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <span style={{ fontSize: 22, fontWeight: 700, color: '#ffffff', fontFamily: 'system-ui', lineHeight: 1.2 }}>
                    {place.name}
                  </span>
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', fontFamily: 'system-ui', marginTop: 2 }}>
                    {place.category} · {place.duration}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: 18, marginTop: 18,
          }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: 15, color: 'rgba(255,255,255,0.5)', fontFamily: 'system-ui' }}>Free guide at</span>
              <span style={{ fontSize: 20, fontWeight: 700, color: ORANGE, fontFamily: 'system-ui' }}>tripgenius.in</span>
            </div>
            <div style={{
              background: ORANGE, borderRadius: 24, padding: '10px 22px',
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#fff', fontFamily: 'system-ui' }}>💾 Save for your trip</span>
            </div>
          </div>
        </div>
      </div>
    ),
    { width: 1080, height: 1080 }
  );
}

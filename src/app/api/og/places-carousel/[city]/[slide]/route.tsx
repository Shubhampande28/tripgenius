import { ImageResponse } from 'next/og';
import { getCityBySlug } from '@/lib/cities';

export const runtime = 'edge';

const W = 1080, H = 1350;
const OR = '#FF7A00';
const AM = '#FFB347';
const WH = '#FFFFFF';

// ── Bali places with verified Pexels photos ────────────────────────
const BALI_PLACES = [
  null, // unused index 0
  // Slide 1: Cover
  {
    type: 'cover',
    photo: 'https://images.pexels.com/photos/3067621/pexels-photo-3067621.jpeg?auto=compress&cs=tinysrgb&w=1080&h=1350&dpr=1',
  },
  // Slide 2: Tanah Lot
  {
    type: 'place',
    name: 'Tanah Lot Temple',
    tag: 'Cultural · Sunset',
    number: '01',
    photo: 'https://images.pexels.com/photos/33626260/pexels-photo-33626260.jpeg?auto=compress&cs=tinysrgb&w=1080&h=1350&dpr=1',
  },
  // Slide 3: Rice Terraces
  {
    type: 'place',
    name: 'Tegallalang\nRice Terraces',
    tag: 'Nature · UNESCO',
    number: '02',
    photo: 'https://images.pexels.com/photos/36810327/pexels-photo-36810327.jpeg?auto=compress&cs=tinysrgb&w=1080&h=1350&dpr=1',
  },
  // Slide 4: Mount Batur
  {
    type: 'place',
    name: 'Mount Batur\nSunrise Trek',
    tag: 'Adventure · Volcano',
    number: '03',
    photo: 'https://images.pexels.com/photos/3254728/pexels-photo-3254728.jpeg?auto=compress&cs=tinysrgb&w=1080&h=1350&dpr=1',
  },
  // Slide 5: Uluwatu
  {
    type: 'place',
    name: 'Uluwatu Temple',
    tag: 'Cultural · Cliffs',
    number: '04',
    photo: 'https://images.pexels.com/photos/6015320/pexels-photo-6015320.jpeg?auto=compress&cs=tinysrgb&w=1080&h=1350&dpr=1',
  },
  // Slide 6: Kelingking
  {
    type: 'place',
    name: 'Kelingking Beach\nNusa Penida',
    tag: 'Adventure · Hidden',
    number: '05',
    photo: 'https://images.pexels.com/photos/5990051/pexels-photo-5990051.jpeg?auto=compress&cs=tinysrgb&w=1080&h=1350&dpr=1',
  },
  // Slide 7: Seminyak
  {
    type: 'place',
    name: 'Seminyak Beach',
    tag: 'Beach · Sunset',
    number: '06',
    photo: 'https://images.pexels.com/photos/12818213/pexels-photo-12818213.jpeg?auto=compress&cs=tinysrgb&w=1080&h=1350&dpr=1',
  },
  // Slide 8: Ubud
  {
    type: 'place',
    name: 'Ubud Temple\n& Jungle',
    tag: 'Culture · Spiritual',
    number: '07',
    photo: 'https://images.pexels.com/photos/18772367/pexels-photo-18772367.jpeg?auto=compress&cs=tinysrgb&w=1080&h=1350&dpr=1',
  },
  // Slide 9: CTA
  {
    type: 'cta',
    photo: 'https://images.pexels.com/photos/2077323/pexels-photo-2077323.jpeg?auto=compress&cs=tinysrgb&w=1080&h=1350&dpr=1',
  },
];

const TOTAL = BALI_PLACES.length - 1; // 9

function Logo() {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center',
        width:30, height:30, borderRadius:8, background:OR }}>
        <span style={{ fontSize:15 }}>✈️</span>
      </div>
      <span style={{ fontSize:13, fontWeight:800, color:WH, letterSpacing:2 }}>TRIPGENIUS</span>
    </div>
  );
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{city:string; slide:string}> }
) {
  const { city: slug, slide: slideStr } = await params;
  const city = getCityBySlug(slug);
  if (!city) return new Response('Not found', { status:404 });

  const n = parseInt(slideStr, 10);
  if (isNaN(n) || n < 1 || n > TOTAL) return new Response(`Slide 1–${TOTAL}`, { status:400 });

  const slide = BALI_PLACES[n] as any;
  if (!slide) return new Response('No data', { status:404 });

  // ── COVER SLIDE ────────────────────────────────────────────────
  if (slide.type === 'cover') {
    return new ImageResponse(
      <div style={{ width:W, height:H, display:'flex', flexDirection:'column',
        position:'relative', overflow:'hidden' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={slide.photo} alt="" style={{ position:'absolute', inset:0,
          width:'100%', height:'100%', objectFit:'cover' }} />

        {/* Dark overlay */}
        <div style={{ display:'flex', position:'absolute', inset:0,
          background:'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.15) 40%, rgba(0,0,0,0.85) 75%, rgba(0,0,0,0.97) 100%)' }} />

        {/* Orange top line */}
        <div style={{ display:'flex', position:'absolute', top:0, left:0, right:0, height:5,
          background:`linear-gradient(to right, transparent, ${OR}, ${AM}, transparent)` }} />

        <div style={{ display:'flex', flexDirection:'column', position:'relative',
          height:'100%', padding:'32px 48px' }}>

          {/* Top bar */}
          <div style={{ display:'flex', justifyContent:'space-between',
            alignItems:'center', marginBottom:'auto' }}>
            <Logo />
            <div style={{ display:'flex', alignItems:'center', justifyContent:'center',
              background:'rgba(255,122,0,0.2)', border:`1px solid ${OR}60`,
              borderRadius:20, padding:'7px 16px' }}>
              <span style={{ fontSize:11, color:AM, fontWeight:700, letterSpacing:2 }}>
                🌴 BALI 2025
              </span>
            </div>
          </div>

          {/* Bottom content */}
          <div style={{ display:'flex', flexDirection:'column' }}>
            <span style={{ fontSize:15, color:OR, fontWeight:800,
              letterSpacing:4, marginBottom:16 }}>
              {city.flag} {city.country.toUpperCase()}
            </span>

            <span style={{ fontSize:34, fontWeight:700, color:'rgba(255,255,255,0.7)',
              marginBottom:8 }}>
              Places to See in
            </span>
            <span style={{ fontSize:96, fontWeight:900, color:WH, lineHeight:0.9,
              marginBottom:24 }}>
              Bali
            </span>

            {/* Place count chips */}
            <div style={{ display:'flex', gap:12, marginBottom:32 }}>
              {['7 Places', 'Free Guide', 'Swipe →'].map(v => (
                <div key={v} style={{ display:'flex', alignItems:'center',
                  justifyContent:'center', background:'rgba(255,255,255,0.12)',
                  border:'1px solid rgba(255,255,255,0.2)',
                  borderRadius:24, padding:'10px 20px' }}>
                  <span style={{ fontSize:14, color:WH, fontWeight:600 }}>{v}</span>
                </div>
              ))}
            </div>

            {/* Bottom bar */}
            <div style={{ display:'flex', justifyContent:'space-between',
              alignItems:'center', borderTop:'1px solid rgba(255,255,255,0.12)',
              paddingTop:20 }}>
              <span style={{ fontSize:13, color:'rgba(255,255,255,0.4)' }}>
                tripgenius.in
              </span>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'center',
                background:OR, borderRadius:28, padding:'12px 28px' }}>
                <span style={{ fontSize:14, fontWeight:800, color:WH }}>
                  Swipe to explore →
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>,
      { width:W, height:H }
    );
  }

  // ── CTA SLIDE ──────────────────────────────────────────────────
  if (slide.type === 'cta') {
    return new ImageResponse(
      <div style={{ width:W, height:H, display:'flex', flexDirection:'column',
        position:'relative', overflow:'hidden' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={slide.photo} alt="" style={{ position:'absolute', inset:0,
          width:'100%', height:'100%', objectFit:'cover' }} />
        <div style={{ display:'flex', position:'absolute', inset:0, background:'rgba(8,5,2,0.88)' }} />
        <div style={{ display:'flex', position:'absolute', top:0, left:0, right:0, height:5,
          background:`linear-gradient(to right, transparent, ${OR}, ${AM}, transparent)` }} />

        <div style={{ display:'flex', flexDirection:'column', alignItems:'center',
          justifyContent:'center', position:'relative', height:'100%', padding:'60px' }}>
          <span style={{ fontSize:64, marginBottom:20 }}>🌴</span>
          <span style={{ fontSize:14, color:OR, fontWeight:800, letterSpacing:4, marginBottom:14 }}>
            FREE TRAVEL GUIDE
          </span>
          <span style={{ fontSize:52, fontWeight:900, color:WH, lineHeight:1.08,
            marginBottom:14, textAlign:'center' as const }}>
            Plan your{'\n'}Bali trip free.
          </span>
          <span style={{ fontSize:16, color:'rgba(255,255,255,0.5)', marginBottom:36,
            textAlign:'center' as const, lineHeight:1.8 }}>
            Things to do · Where to stay{'\n'}Budget tips · Hidden gems
          </span>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'center',
            background:OR, borderRadius:36, padding:'18px 44px', marginBottom:24 }}>
            <span style={{ fontSize:18, fontWeight:800, color:WH }}>
              tripgenius.in/cities/bali
            </span>
          </div>
          <Logo />
          <span style={{ fontSize:12, color:'rgba(255,255,255,0.35)', marginTop:12,
            textAlign:'center' as const }}>
            💾 Save · 🔔 Follow @tripgenius.in
          </span>
        </div>
      </div>,
      { width:W, height:H }
    );
  }

  // ── PLACE SLIDE ────────────────────────────────────────────────
  return new ImageResponse(
    <div style={{ width:W, height:H, display:'flex', flexDirection:'column',
      position:'relative', overflow:'hidden' }}>

      {/* Full-bleed place photo */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={slide.photo} alt="" style={{ position:'absolute', inset:0,
        width:'100%', height:'100%', objectFit:'cover' }} />

      {/* Top gradient — nav readable */}
      <div style={{ display:'flex', position:'absolute', top:0, left:0, right:0, height:160,
        background:'linear-gradient(to bottom, rgba(0,0,0,0.75), transparent)' }} />

      {/* Bottom gradient — text readable */}
      <div style={{ display:'flex', position:'absolute', bottom:0, left:0, right:0, height:480,
        background:'linear-gradient(to top, rgba(0,0,0,0.97) 0%, rgba(0,0,0,0.9) 40%, rgba(0,0,0,0.5) 70%, transparent 100%)' }} />

      {/* Orange top line */}
      <div style={{ display:'flex', position:'absolute', top:0, left:0, right:0, height:5,
        background:`linear-gradient(to right, transparent, ${OR}, ${AM}, transparent)` }} />

      <div style={{ display:'flex', flexDirection:'column', position:'relative',
        height:'100%', padding:'32px 48px' }}>

        {/* Top nav */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <Logo />
          {/* Progress dots */}
          <div style={{ display:'flex', alignItems:'center', gap:6 }}>
            {Array.from({ length: TOTAL }).map((_, i) => (
              <div key={i} style={{ display:'flex',
                width: i === n-1 ? 26 : 6, height:6, borderRadius:3,
                background: i === n-1 ? OR : 'rgba(255,255,255,0.4)' }} />
            ))}
          </div>
        </div>

        {/* Spacer — photo fills this */}
        <div style={{ display:'flex', flex:1 }} />

        {/* Bottom text block */}
        <div style={{ display:'flex', flexDirection:'column' }}>

          {/* Number + tag row */}
          <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:18 }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'center',
              width:56, height:56, borderRadius:16,
              background:OR, flexShrink:0 }}>
              <span style={{ fontSize:22, fontWeight:900, color:WH }}>{slide.number}</span>
            </div>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'center',
              background:'rgba(255,255,255,0.15)',
              border:'1px solid rgba(255,255,255,0.25)',
              borderRadius:24, padding:'8px 20px' }}>
              <span style={{ fontSize:14, color:WH, fontWeight:600 }}>{slide.tag}</span>
            </div>
          </div>

          {/* Place name — BIG */}
          <span style={{ fontSize:72, fontWeight:900, color:WH, lineHeight:0.97,
            marginBottom:28, whiteSpace:'pre-line' as const }}>
            {slide.name}
          </span>

          {/* Bottom CTA */}
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center',
            borderTop:'1px solid rgba(255,255,255,0.15)', paddingTop:20 }}>
            <span style={{ fontSize:13, color:'rgba(255,255,255,0.45)' }}>
              tripgenius.in
            </span>
            {n < TOTAL
              ? <span style={{ fontSize:14, color:OR, fontWeight:800 }}>Next place →</span>
              : <span style={{ fontSize:14, color:OR, fontWeight:800 }}>See full guide →</span>
            }
          </div>
        </div>
      </div>
    </div>,
    { width:W, height:H }
  );
}

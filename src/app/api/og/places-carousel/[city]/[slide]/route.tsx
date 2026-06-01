import { ImageResponse } from 'next/og';
import { getCityBySlug } from '@/lib/cities';

export const runtime = 'edge';

const W = 1080, H = 1350;
const OR = '#FF7A00';
const AM = '#FFB347';
const CR = '#FFF8EE'; // warm cream
const DK = '#1A0804'; // near-black

// ── Pexels photos per place ────────────────────────────────────────
const BALI_PLACES = [
  null,
  // 1: Cover
  {
    type: 'cover',
    photo: 'https://images.pexels.com/photos/3067621/pexels-photo-3067621.jpeg?auto=compress&cs=tinysrgb&w=1080&h=750&dpr=1',
  },
  // 2: Tanah Lot
  {
    type: 'place', num: '01', name: 'Tanah Lot\nTemple', tag: 'Cultural · Sunset',
    photo: 'https://images.pexels.com/photos/33626260/pexels-photo-33626260.jpeg?auto=compress&cs=tinysrgb&w=1080&h=750&dpr=1',
  },
  // 3: Rice Terraces
  {
    type: 'place', num: '02', name: 'Tegallalang\nRice Terraces', tag: 'Nature · UNESCO',
    photo: 'https://images.pexels.com/photos/36810327/pexels-photo-36810327.jpeg?auto=compress&cs=tinysrgb&w=1080&h=750&dpr=1',
  },
  // 4: Mount Batur
  {
    type: 'place', num: '03', name: 'Mount Batur\nSunrise Trek', tag: 'Adventure · Volcano',
    photo: 'https://images.pexels.com/photos/3254728/pexels-photo-3254728.jpeg?auto=compress&cs=tinysrgb&w=1080&h=750&dpr=1',
  },
  // 5: Uluwatu
  {
    type: 'place', num: '04', name: 'Uluwatu\nTemple', tag: 'Cultural · Cliff',
    photo: 'https://images.pexels.com/photos/6015320/pexels-photo-6015320.jpeg?auto=compress&cs=tinysrgb&w=1080&h=750&dpr=1',
  },
  // 6: Nusa Penida
  {
    type: 'place', num: '05', name: 'Kelingking Beach\nNusa Penida', tag: 'Adventure · Hidden Gem',
    photo: 'https://images.pexels.com/photos/5990051/pexels-photo-5990051.jpeg?auto=compress&cs=tinysrgb&w=1080&h=750&dpr=1',
  },
  // 7: Seminyak
  {
    type: 'place', num: '06', name: 'Seminyak\nBeach', tag: 'Beach · Sunset',
    photo: 'https://images.pexels.com/photos/12818213/pexels-photo-12818213.jpeg?auto=compress&cs=tinysrgb&w=1080&h=750&dpr=1',
  },
  // 8: Ubud
  {
    type: 'place', num: '07', name: 'Ubud Temple\n& Jungle', tag: 'Culture · Spiritual',
    photo: 'https://images.pexels.com/photos/18772367/pexels-photo-18772367.jpeg?auto=compress&cs=tinysrgb&w=1080&h=750&dpr=1',
  },
  // 9: CTA
  {
    type: 'cta',
    photo: 'https://images.pexels.com/photos/2077323/pexels-photo-2077323.jpeg?auto=compress&cs=tinysrgb&w=1080&h=750&dpr=1',
  },
];

const TOTAL = BALI_PLACES.length - 1;

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

  // ── COVER SLIDE ────────────────────────────────────────────────
  if (slide.type === 'cover') {
    return new ImageResponse(
      <div style={{ width:W, height:H, display:'flex', flexDirection:'column', background:CR }}>

        {/* Top: cream section with text */}
        <div style={{ display:'flex', flexDirection:'column', padding:'48px 56px 0 56px', flex:'0 0 600px' }}>

          {/* Logo + dots */}
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:48 }}>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'center',
                width:36, height:36, borderRadius:10, background:OR }}>
                <span style={{ fontSize:18 }}>✈️</span>
              </div>
              <span style={{ fontSize:14, fontWeight:800, color:DK, letterSpacing:2 }}>TRIPGENIUS</span>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:6 }}>
              {Array.from({length:TOTAL}).map((_,i) => (
                <div key={i} style={{ display:'flex',
                  width:i===n-1?26:6, height:6, borderRadius:3,
                  background:i===n-1?OR:'rgba(26,8,4,0.2)' }} />
              ))}
            </div>
          </div>

          {/* Headline */}
          <span style={{ fontSize:30, fontWeight:700, color:'rgba(26,8,4,0.5)', marginBottom:8 }}>
            {city.flag} {city.country}
          </span>
          <span style={{ fontSize:44, fontWeight:700, color:'rgba(26,8,4,0.6)', marginBottom:4 }}>
            Places to see in
          </span>
          <span style={{ fontSize:110, fontWeight:900, color:DK, lineHeight:0.92, marginBottom:28 }}>
            Bali
          </span>

          {/* Count chips */}
          <div style={{ display:'flex', gap:12 }}>
            {['7 Places', 'Free Guide', 'Swipe →'].map(v => (
              <div key={v} style={{ display:'flex', alignItems:'center', justifyContent:'center',
                background: v==='Swipe →' ? OR : 'transparent',
                border: v==='Swipe →' ? 'none' : `2px solid ${OR}`,
                borderRadius:28, padding:'10px 22px' }}>
                <span style={{ fontSize:15, color: v==='Swipe →' ? '#fff' : OR, fontWeight:700 }}>{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Gradient fade from cream to photo */}
        <div style={{ display:'flex', position:'relative', flex:1 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={slide.photo} alt="" style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'center center' }} />
          {/* Fade from cream at top */}
          <div style={{ display:'flex', position:'absolute', top:0, left:0, right:0, height:160,
            background:`linear-gradient(to bottom, ${CR}, transparent)` }} />
          {/* Orange bottom line */}
          <div style={{ display:'flex', position:'absolute', bottom:0, left:0, right:0, height:5,
            background:`linear-gradient(to right, transparent, ${OR}, ${AM}, transparent)` }} />
          {/* TripGenius watermark bottom */}
          <div style={{ display:'flex', position:'absolute', bottom:18, left:0, right:0,
            justifyContent:'center', alignItems:'center' }}>
            <span style={{ fontSize:13, color:'rgba(255,255,255,0.6)', fontWeight:600, letterSpacing:1 }}>
              tripgenius.in
            </span>
          </div>
        </div>

      </div>,
      { width:W, height:H }
    );
  }

  // ── CTA SLIDE ──────────────────────────────────────────────────
  if (slide.type === 'cta') {
    return new ImageResponse(
      <div style={{ width:W, height:H, display:'flex', flexDirection:'column', background:CR }}>

        {/* Top cream text section */}
        <div style={{ display:'flex', flexDirection:'column', padding:'48px 56px 0 56px', flex:'0 0 620px' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:48 }}>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'center',
                width:36, height:36, borderRadius:10, background:OR }}>
                <span style={{ fontSize:18 }}>✈️</span>
              </div>
              <span style={{ fontSize:14, fontWeight:800, color:DK, letterSpacing:2 }}>TRIPGENIUS</span>
            </div>
            <span style={{ fontSize:13, color:OR, fontWeight:700 }}>FREE GUIDE</span>
          </div>

          <span style={{ fontSize:68, fontWeight:900, color:DK, lineHeight:1.0, marginBottom:20 }}>
            Plan your{'\n'}Bali trip{'\n'}for free. 🌴
          </span>

          <span style={{ fontSize:20, color:'rgba(26,8,4,0.55)', lineHeight:1.7, marginBottom:32 }}>
            Itineraries · Budget tips{'\n'}Hidden gems · Best time to visit
          </span>

          <div style={{ display:'flex', alignItems:'center', justifyContent:'center',
            background:OR, borderRadius:36, padding:'18px 0' }}>
            <span style={{ fontSize:20, fontWeight:800, color:'#fff' }}>
              tripgenius.in/cities/bali
            </span>
          </div>
        </div>

        {/* Photo bottom */}
        <div style={{ display:'flex', position:'relative', flex:1 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={slide.photo} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
          <div style={{ display:'flex', position:'absolute', top:0, left:0, right:0, height:160,
            background:`linear-gradient(to bottom, ${CR}, transparent)` }} />
          <div style={{ display:'flex', position:'absolute', bottom:0, left:0, right:0, height:5,
            background:`linear-gradient(to right, transparent, ${OR}, ${AM}, transparent)` }} />
        </div>

      </div>,
      { width:W, height:H }
    );
  }

  // ── PLACE SLIDE ────────────────────────────────────────────────
  const TOP_H = 580;
  const BOT_H = H - TOP_H;

  return new ImageResponse(
    <div style={{ width:W, height:H, display:'flex', flexDirection:'column', background:CR }}>

      {/* TOP: cream section — all text here, perfect readability */}
      <div style={{ display:'flex', flexDirection:'column', height:TOP_H,
        padding:'44px 56px 28px 56px' }}>

        {/* Logo + progress */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:36 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'center',
              width:34, height:34, borderRadius:9, background:OR }}>
              <span style={{ fontSize:16 }}>✈️</span>
            </div>
            <span style={{ fontSize:13, fontWeight:800, color:DK, letterSpacing:2 }}>TRIPGENIUS</span>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:6 }}>
            {Array.from({length:TOTAL}).map((_,i) => (
              <div key={i} style={{ display:'flex',
                width:i===n-1?26:6, height:6, borderRadius:3,
                background:i===n-1?OR:'rgba(26,8,4,0.2)' }} />
            ))}
          </div>
        </div>

        {/* Big number */}
        <span style={{ fontSize:80, fontWeight:900, color:OR, lineHeight:1.0, marginBottom:4 }}>
          {slide.num}
        </span>

        {/* Place name — the hero */}
        <span style={{ fontSize:82, fontWeight:900, color:DK, lineHeight:0.95,
          marginBottom:24, whiteSpace:'pre-line' as const }}>
          {slide.name}
        </span>

        {/* Category tag */}
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'center',
            border:`2px solid ${OR}`, borderRadius:28, padding:'8px 22px' }}>
            <span style={{ fontSize:15, color:OR, fontWeight:700 }}>{slide.tag}</span>
          </div>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'center',
            background:OR, borderRadius:28, padding:'8px 22px' }}>
            <span style={{ fontSize:15, color:'#fff', fontWeight:700 }}>Bali 🌴</span>
          </div>
        </div>

      </div>

      {/* BOTTOM: photo — fills remaining height */}
      <div style={{ display:'flex', position:'relative', height:BOT_H }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={slide.photo} alt="" style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'center 30%' }} />

        {/* Soft fade from cream into photo at the top */}
        <div style={{ display:'flex', position:'absolute', top:0, left:0, right:0, height:200,
          background:`linear-gradient(to bottom, ${CR} 0%, rgba(255,248,238,0.8) 30%, transparent 100%)` }} />

        {/* Dark bottom strip for "next" text */}
        <div style={{ display:'flex', position:'absolute', bottom:0, left:0, right:0, height:80,
          background:'linear-gradient(to top, rgba(0,0,0,0.6), transparent)',
          justifyContent:'space-between', alignItems:'flex-end',
          padding:'0 48px 20px 48px' }}>
          <span style={{ fontSize:12, color:'rgba(255,255,255,0.55)' }}>tripgenius.in</span>
          {n < TOTAL
            ? <span style={{ fontSize:14, color:'#fff', fontWeight:700 }}>Next → </span>
            : <span style={{ fontSize:14, color:'#fff', fontWeight:700 }}>See full guide →</span>
          }
        </div>

        {/* Orange bottom line */}
        <div style={{ display:'flex', position:'absolute', bottom:0, left:0, right:0, height:4,
          background:`linear-gradient(to right, transparent, ${OR}, ${AM}, transparent)` }} />
      </div>

    </div>,
    { width:W, height:H }
  );
}

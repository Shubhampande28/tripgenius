import { ImageResponse } from 'next/og';
import { getCityBySlug } from '@/lib/cities';

// Node runtime: these routes bundle the full city dataset (~1.2 MB), which
// exceeds the 1 MB Edge Function limit on the current Vercel plan.
export const runtime = 'nodejs';

const W = 1080, H = 1350;
const OR  = '#FF7A00';
const GRN = '#2D4A1E'; // olive green for headings (like VTouring)
const YEL = '#FFF5C0'; // warm yellow bg top

const PX = (id: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=1080&h=900&fit=crop`;

// ── 10 slides: Cover → Marketing → 7 Places → CTA ─────────────────
const SLIDES = [
  null,
  // 1 Cover — water temple (iconic Bali)
  { type:'cover', photo: PX(3067621) },
  // 2 Marketing
  { type:'marketing', photo: PX(36810327) },
  // 3-9 Places
  { type:'place', num:'01', name:'Tanah Lot',   sub:'Temple',          emoji:'🛕', photo: PX(33626260) },
  { type:'place', num:'02', name:'Tegallalang', sub:'Rice Terraces',   emoji:'🌾', photo: PX(36810327) },
  { type:'place', num:'03', name:'Mount Batur', sub:'Sunrise Trek',    emoji:'🌋', photo: PX(3254728)  },
  { type:'place', num:'04', name:'Uluwatu',     sub:'Temple & Cliffs', emoji:'🌅', photo: PX(6015320)  },
  { type:'place', num:'05', name:'Kelingking',  sub:'Nusa Penida',     emoji:'🦅', photo: PX(5990051)  },
  { type:'place', num:'06', name:'Seminyak',    sub:'Beach & Sunset',  emoji:'🌊', photo: PX(12818213) },
  { type:'place', num:'07', name:'Ubud',        sub:'Jungle & Temple', emoji:'🌿', photo: PX(18772367) },
  // 10 CTA
  { type:'cta', photo: PX(2077323) },
];

const TOTAL = SLIDES.length - 1;

// Warm yellow gradient — same vibe as VTouring
const GRAD = `linear-gradient(to bottom, ${YEL} 0%, #FFE97A 45%, #FFD55A 100%)`;

function TGLogo({ n }: { n: number }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center',
          width:42, height:42, borderRadius:12, background:OR }}>
          <span style={{ fontSize:22 }}>✈️</span>
        </div>
        <span style={{ fontSize:18, fontWeight:900, color:GRN, letterSpacing:1.5 }}>TRIPGENIUS</span>
      </div>
      <span style={{ fontSize:10, color:'rgba(45,74,30,0.55)', letterSpacing:2 }}>FREE TRAVEL GUIDES</span>
    </div>
  );
}

function Dots({ n }: { n: number }) {
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:7 }}>
      {Array.from({length:TOTAL}).map((_,i) => (
        <div key={i} style={{ display:'flex', borderRadius:'50%',
          width:i===n-1?12:8, height:i===n-1?12:8,
          background:i===n-1?OR:'rgba(45,74,30,0.25)' }} />
      ))}
    </div>
  );
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{city:string;slide:string}> }
) {
  const { city:slug, slide:slideStr } = await params;
  const city = getCityBySlug(slug);
  if (!city) return new Response('Not found', {status:404});

  const n = parseInt(slideStr, 10);
  if (isNaN(n) || n < 1 || n > TOTAL) return new Response(`1–${TOTAL}`, {status:400});

  const s = SLIDES[n] as any;
  const opts = { width:W, height:H };

  // ── COVER ──────────────────────────────────────────────────────
  if (s.type === 'cover') {
    return new ImageResponse(
      <div style={{ width:W, height:H, display:'flex', flexDirection:'column', background:GRAD }}>

        {/* Top: logo + title text */}
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center',
          padding:'44px 52px 0 52px', flex:'0 0 520px' }}>

          <TGLogo n={n} />

          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', marginTop:40 }}>
            {/* Script-style italic (like "7 days in") */}
            <span style={{ fontSize:68, fontWeight:400, color:GRN, fontStyle:'italic',
              lineHeight:1.1, marginBottom:4 }}>
              7 places in
            </span>
            {/* GIANT city name in olive green (like VTouring "BALI") */}
            <span style={{ fontSize:148, fontWeight:900, color:GRN, lineHeight:0.88,
              letterSpacing:-4 }}>
              BALI
            </span>
          </div>

          {/* Decorative emojis like their leaf/sun */}
          <div style={{ display:'flex', justifyContent:'space-between', width:'100%',
            position:'absolute', top:44 }}>
            <span style={{ fontSize:48, opacity:0.6 }}>🍃</span>
            <span style={{ fontSize:48, opacity:0.6 }}>🌞</span>
          </div>
        </div>

        {/* Bottom: Bali temple photo */}
        <div style={{ display:'flex', flex:1, position:'relative' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={s.photo} alt="" style={{ width:'100%', height:'100%',
            objectFit:'cover', objectPosition:'center 30%' }} />
          {/* Yellow fade at top so photo blends with gradient */}
          <div style={{ display:'flex', position:'absolute', top:0, left:0, right:0, height:200,
            background:`linear-gradient(to bottom, #FFD55A, transparent)` }} />
          {/* Progress dots */}
          <div style={{ display:'flex', position:'absolute', bottom:20, left:0, right:0,
            justifyContent:'center' }}>
            <Dots n={n} />
          </div>
        </div>

      </div>,
      opts
    );
  }

  // ── MARKETING ──────────────────────────────────────────────────
  if (s.type === 'marketing') {
    return new ImageResponse(
      <div style={{ width:W, height:H, display:'flex', flexDirection:'column', background:GRAD }}>

        <div style={{ display:'flex', flexDirection:'column', alignItems:'center',
          padding:'44px 52px 0 52px', flex:'0 0 540px' }}>

          <TGLogo n={n} />

          {/* White card */}
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center',
            background:'rgba(255,255,255,0.90)', borderRadius:28,
            padding:'36px 44px', marginTop:32, width:'100%' }}>
            <span style={{ fontSize:18, color:OR, fontWeight:700, letterSpacing:3, marginBottom:12 }}>
              FREE TRAVEL GUIDE
            </span>
            <span style={{ fontSize:58, fontWeight:900, color:GRN, lineHeight:1.0,
              textAlign:'center' as const, marginBottom:24 }}>
              Plan your{'\n'}Bali trip free
            </span>
            <div style={{ display:'flex', flexDirection:'column', gap:12, width:'100%' }}>
              {['🌍  70+ city guides — all free', '✅  No paid reviews or sponsors', '📅  Updated for 2026'].map(t => (
                <div key={t} style={{ display:'flex', alignItems:'center',
                  background:'rgba(255,122,0,0.08)', borderRadius:12, padding:'12px 18px' }}>
                  <span style={{ fontSize:17, color:GRN, fontWeight:600 }}>{t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display:'flex', flex:1, position:'relative' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={s.photo} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
          <div style={{ display:'flex', position:'absolute', top:0, left:0, right:0, height:160,
            background:`linear-gradient(to bottom, #FFD55A, transparent)` }} />
          <div style={{ display:'flex', position:'absolute', bottom:0, left:0, right:0, height:80,
            background:'linear-gradient(to top, rgba(0,0,0,0.6), transparent)',
            alignItems:'flex-end', justifyContent:'center', padding:'0 0 16px 0' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'center',
              background:OR, borderRadius:30, padding:'12px 36px' }}>
              <span style={{ fontSize:18, fontWeight:800, color:'#fff' }}>tripgenius.in/cities/bali</span>
            </div>
          </div>
          <div style={{ display:'flex', position:'absolute', bottom:20, left:0, right:0,
            justifyContent:'center' }}>
          </div>
        </div>

      </div>,
      opts
    );
  }

  // ── CTA ────────────────────────────────────────────────────────
  if (s.type === 'cta') {
    return new ImageResponse(
      <div style={{ width:W, height:H, display:'flex', flexDirection:'column', background:GRAD }}>

        <div style={{ display:'flex', flexDirection:'column', alignItems:'center',
          padding:'48px 52px 0 52px', flex:'0 0 580px' }}>

          <TGLogo n={n} />

          <div style={{ display:'flex', flexDirection:'column', alignItems:'center',
            background:'rgba(255,255,255,0.90)', borderRadius:28,
            padding:'40px 44px', marginTop:32, width:'100%' }}>
            <span style={{ fontSize:52, marginBottom:16 }}>🌴</span>
            <span style={{ fontSize:58, fontWeight:900, color:GRN, lineHeight:1.0,
              textAlign:'center' as const, marginBottom:12 }}>
              Your free Bali{'\n'}guide awaits.
            </span>
            <span style={{ fontSize:16, color:'rgba(45,74,30,0.6)', textAlign:'center' as const,
              lineHeight:1.7, marginBottom:28 }}>
              Things to do · Where to stay{'\n'}Budget tips · Hidden gems
            </span>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'center',
              background:OR, borderRadius:30, padding:'16px 0', width:'100%' }}>
              <span style={{ fontSize:20, fontWeight:900, color:'#fff' }}>tripgenius.in/cities/bali</span>
            </div>
          </div>
        </div>

        <div style={{ display:'flex', flex:1, position:'relative' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={s.photo} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
          <div style={{ display:'flex', position:'absolute', top:0, left:0, right:0, height:160,
            background:`linear-gradient(to bottom, #FFD55A, transparent)` }} />
          <div style={{ display:'flex', position:'absolute', bottom:20, left:0, right:0, justifyContent:'center' }}>
            <Dots n={n} />
          </div>
        </div>

      </div>,
      opts
    );
  }

  // ── PLACE SLIDE ─────────────────────────────────────────────────
  // Layout: Yellow gradient top → white card (PLACE + name) → photo bottom
  return new ImageResponse(
    <div style={{ width:W, height:H, display:'flex', flexDirection:'column', background:GRAD }}>

      {/* TOP: logo + white card */}
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center',
        padding:'36px 52px 0 52px', flex:'0 0 600px' }}>

        <TGLogo n={n} />

        {/* Decorative emoji top corners */}
        <div style={{ display:'flex', justifyContent:'space-between', width:'100%',
          position:'absolute', top:36, padding:'0 40px' }}>
          <span style={{ fontSize:40, opacity:0.5 }}>🌺</span>
          <span style={{ fontSize:40, opacity:0.5 }}>🍃</span>
        </div>

        {/* White card — like VTouring DAY card */}
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center',
          background:'rgba(255,255,255,0.92)', borderRadius:28,
          padding:'36px 44px', marginTop:28, width:'100%',
          boxShadow:'0 8px 32px rgba(0,0,0,0.08)' }}>

          {/* Place number — big, bold, like "DAY 1" */}
          <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:6 }}>
            <span style={{ fontSize:26 }}>{s.emoji}</span>
            <span style={{ fontSize:72, fontWeight:900, color:GRN, lineHeight:1,
              letterSpacing:-2 }}>
              PLACE {s.num}
            </span>
          </div>

          {/* Place name — like "Arrive in Ubud" */}
          <span style={{ fontSize:44, fontWeight:700, color:OR, lineHeight:1.1,
            textAlign:'center' as const, marginBottom:16 }}>
            {s.name}
          </span>

          {/* Sub */}
          <span style={{ fontSize:22, color:'rgba(45,74,30,0.65)', fontWeight:600,
            textAlign:'center' as const }}>
            {s.sub}
          </span>
        </div>
      </div>

      {/* BOTTOM: place photo */}
      <div style={{ display:'flex', flex:1, position:'relative' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={s.photo} alt="" style={{ width:'100%', height:'100%',
          objectFit:'cover', objectPosition:'center 30%' }} />
        {/* Yellow blend at top */}
        <div style={{ display:'flex', position:'absolute', top:0, left:0, right:0, height:140,
          background:`linear-gradient(to bottom, #FFD55A, transparent)` }} />
        {/* Progress dots */}
        <div style={{ display:'flex', position:'absolute', bottom:20, left:0, right:0,
          justifyContent:'center' }}>
          <Dots n={n} />
        </div>
      </div>

    </div>,
    opts
  );
}

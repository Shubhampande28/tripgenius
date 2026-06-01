import { ImageResponse } from 'next/og';
import { getCityBySlug } from '@/lib/cities';

export const runtime = 'edge';

const W = 1080, H = 1350;
const OR = '#FF7A00';
const AM = '#FFB347';

const PX = (id: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=1080&h=1350&fit=crop`;

// ── AIDA Structure: Hook → Market → Value → Convert ───────────────
const PLACES = [
  null,

  // ── SLIDE 1: HOOK — stop the scroll ──────────────────────────
  { type:'cover', photo: PX(35428411) },

  // ── SLIDE 2: MARKETING — sell TripGenius ─────────────────────
  { type:'marketing', photo: PX(3067621) },

  // ── SLIDES 3-9: DELIVER VALUE — places with photos ───────────
  { type:'place', num:'01', name:'Tanah Lot',   sub:'Temple',           tag:'Sunset · Cultural',      photo: PX(33626260) },
  { type:'place', num:'02', name:'Tegallalang', sub:'Rice Terraces',    tag:'Nature · UNESCO',        photo: PX(36810327) },
  { type:'place', num:'03', name:'Mount Batur', sub:'Sunrise Trek',     tag:'Adventure · Volcano',    photo: PX(3254728)  },
  { type:'place', num:'04', name:'Uluwatu',     sub:'Temple & Cliffs',  tag:'Cultural · Sunset',      photo: PX(6015320)  },
  { type:'place', num:'05', name:'Kelingking',  sub:'Nusa Penida',      tag:'Hidden Gem · Adventure', photo: PX(5990051)  },
  { type:'place', num:'06', name:'Seminyak',    sub:'Beach & Sunset',   tag:'Beach · Lifestyle',      photo: PX(12818213) },
  { type:'place', num:'07', name:'Ubud',        sub:'Jungle & Temple',  tag:'Spiritual · Culture',    photo: PX(18772367) },

  // ── SLIDE 10: CONVERT — CTA ───────────────────────────────────
  { type:'cta', photo: PX(2077323) },
];

const TOTAL = PLACES.length - 1; // 10

export async function GET(
  _req: Request,
  { params }: { params: Promise<{city:string;slide:string}> }
) {
  const { city:slug, slide:slideStr } = await params;
  const city = getCityBySlug(slug);
  if (!city) return new Response('Not found',{status:404});

  const n = parseInt(slideStr, 10);
  if (isNaN(n) || n < 1 || n > TOTAL) return new Response(`1–${TOTAL}`,{status:400});

  const s = PLACES[n] as any;

  const imgOpts = { width:W, height:H };

  // ── COVER — cream top + photo bottom (reference style) ────────
  if (s.type === 'cover') {
    const CREAM = '#FFF8EE';
    const DARK  = '#1A0804';
    return new ImageResponse(
      <div style={{ width:W, height:H, display:'flex', flexDirection:'column', background:CREAM }}>

        {/* TOP: cream background — 100% readable text */}
        <div style={{ display:'flex', flexDirection:'column', padding:'48px 56px 32px 56px',
          flex:'0 0 660px', background:CREAM }}>

          {/* Logo + progress row */}
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:40 }}>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'center',
                width:38, height:38, borderRadius:10, background:OR }}>
                <span style={{ fontSize:18 }}>✈️</span>
              </div>
              <span style={{ fontSize:15, fontWeight:800, color:DARK, letterSpacing:2 }}>TRIPGENIUS</span>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:6 }}>
              {Array.from({length:TOTAL}).map((_,i) => (
                <div key={i} style={{ display:'flex',
                  width:i===0?28:6, height:6, borderRadius:3,
                  background:i===0?OR:'rgba(26,8,4,0.15)' }} />
              ))}
            </div>
          </div>

          {/* Country badge */}
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:20 }}>
            <span style={{ fontSize:22 }}>{city.flag}</span>
            <span style={{ fontSize:15, color:OR, fontWeight:700, letterSpacing:3 }}>
              BALI, INDONESIA
            </span>
          </div>

          {/* Headline — dark on cream = perfect contrast */}
          <span style={{ fontSize:36, fontWeight:700, color:'rgba(26,8,4,0.5)', lineHeight:1, marginBottom:4 }}>
            Places to see in
          </span>
          <span style={{ fontSize:118, fontWeight:900, color:DARK, lineHeight:0.88, marginBottom:32 }}>
            Bali
          </span>

          {/* Pills */}
          <div style={{ display:'flex', gap:12 }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'center',
              background:OR, borderRadius:30, padding:'12px 28px' }}>
              <span style={{ fontSize:16, color:'#fff', fontWeight:700 }}>7 Spots 🌴</span>
            </div>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'center',
              background:'transparent', border:`2px solid ${OR}`,
              borderRadius:30, padding:'12px 28px' }}>
              <span style={{ fontSize:16, color:OR, fontWeight:700 }}>Free Guide</span>
            </div>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'center',
              background:'transparent', border:`2px solid rgba(26,8,4,0.2)`,
              borderRadius:30, padding:'12px 22px' }}>
              <span style={{ fontSize:16, color:'rgba(26,8,4,0.5)', fontWeight:700 }}>Swipe →</span>
            </div>
          </div>
        </div>

        {/* BOTTOM: photo */}
        <div style={{ display:'flex', position:'relative', flex:1 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={s.photo} alt="" style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'center top' }} />
          {/* Fade from cream into photo */}
          <div style={{ display:'flex', position:'absolute', top:0, left:0, right:0, height:180,
            background:`linear-gradient(to bottom, ${CREAM}, rgba(255,248,238,0))` }} />
          {/* Orange bottom bar */}
          <div style={{ display:'flex', position:'absolute', bottom:0, left:0, right:0, height:6,
            background:`linear-gradient(to right, ${OR}, ${AM}, ${OR})` }} />
          <div style={{ display:'flex', position:'absolute', bottom:14, left:0, right:0,
            justifyContent:'center' }}>
            <span style={{ fontSize:13, color:'rgba(255,255,255,0.6)', fontWeight:600, letterSpacing:1 }}>
              tripgenius.in
            </span>
          </div>
        </div>

      </div>,
      imgOpts
    );
  }

  // ── MARKETING SLIDE — cream bg, trust signals, website promo ──
  if (s.type === 'marketing') {
    const CREAM = '#FFF8EE';
    const DARK  = '#1A0804';
    return new ImageResponse(
      <div style={{ width:W, height:H, display:'flex', flexDirection:'column', background:CREAM }}>

        {/* TOP CREAM SECTION */}
        <div style={{ display:'flex', flexDirection:'column', padding:'48px 56px 0 56px',
          flex:'0 0 680px', background:CREAM }}>

          {/* Logo + dots */}
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:44 }}>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'center',
                width:38, height:38, borderRadius:10, background:OR }}>
                <span style={{ fontSize:18 }}>✈️</span>
              </div>
              <span style={{ fontSize:15, fontWeight:800, color:DARK, letterSpacing:2 }}>TRIPGENIUS</span>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:6 }}>
              {Array.from({length:TOTAL}).map((_,i) => (
                <div key={i} style={{ display:'flex',
                  width:i===n-1?28:6, height:6, borderRadius:3,
                  background:i===n-1?OR:'rgba(26,8,4,0.15)' }} />
              ))}
            </div>
          </div>

          {/* Pre-headline */}
          <span style={{ fontSize:16, color:OR, fontWeight:700, letterSpacing:3, marginBottom:12 }}>
            BEFORE YOU START PLANNING →
          </span>

          {/* Main headline */}
          <span style={{ fontSize:66, fontWeight:900, color:DARK, lineHeight:1.0, marginBottom:32 }}>
            Get the free{'\n'}Bali guide{'\n'}that travellers{'\n'}actually use.
          </span>

          {/* Trust signals — 4 points */}
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            {[
              { icon:'🌍', text:'160+ destination guides — all free' },
              { icon:'✅', text:'No paid reviews. No sponsored picks.' },
              { icon:'📅', text:'Updated for 2025 — includes new places' },
              { icon:'💡', text:'Budget tips, best time, hidden gems' },
            ].map(item => (
              <div key={item.text} style={{ display:'flex', alignItems:'center', gap:14 }}>
                <span style={{ fontSize:20, flexShrink:0 }}>{item.icon}</span>
                <span style={{ fontSize:18, color:DARK, fontWeight:600, lineHeight:1.3 }}>
                  {item.text}
                </span>
              </div>
            ))}
          </div>

        </div>

        {/* BOTTOM: Bali photo with website URL overlay */}
        <div style={{ display:'flex', position:'relative', flex:1 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={s.photo} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
          {/* Cream fade at top */}
          <div style={{ display:'flex', position:'absolute', top:0, left:0, right:0, height:160,
            background:`linear-gradient(to bottom, ${CREAM}, transparent)` }} />
          {/* Dark overlay for URL text at bottom */}
          <div style={{ display:'flex', position:'absolute', bottom:0, left:0, right:0, height:140,
            background:'linear-gradient(to top, rgba(0,0,0,0.85), transparent)',
            alignItems:'flex-end', justifyContent:'center', padding:'0 0 24px 0' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'center',
              background:OR, borderRadius:32, padding:'14px 40px' }}>
              <span style={{ fontSize:20, fontWeight:900, color:'#fff' }}>
                tripgenius.in/cities/bali
              </span>
            </div>
          </div>
          {/* Orange bottom line */}
          <div style={{ display:'flex', position:'absolute', bottom:0, left:0, right:0, height:5,
            background:`linear-gradient(to right, ${OR}, ${AM}, ${OR})` }} />
        </div>

      </div>,
      imgOpts
    );
  }

  // ── CTA ────────────────────────────────────────────────────────
  if (s.type === 'cta') {
    return new ImageResponse(
      <div style={{ width:W, height:H, display:'flex', flexDirection:'column', position:'relative', overflow:'hidden' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={s.photo} alt="" style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover' }} />
        <div style={{ display:'flex', position:'absolute', inset:0, background:'rgba(5,3,1,0.88)' }} />
        <div style={{ display:'flex', position:'absolute', top:0, left:0, right:0, height:6,
          background:`linear-gradient(to right, ${OR}, ${AM}, ${OR})` }} />

        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
          position:'relative', height:'100%', padding:'64px' }}>

          {/* Decorative rings */}
          <div style={{ display:'flex', position:'absolute', width:360, height:360,
            borderRadius:'50%', border:`1px solid rgba(255,122,0,0.25)`,
            top:'50%', left:'50%', transform:'translate(-180px,-200px)' }} />
          <div style={{ display:'flex', position:'absolute', width:540, height:540,
            borderRadius:'50%', border:`1px solid rgba(255,122,0,0.12)`,
            top:'50%', left:'50%', transform:'translate(-270px,-290px)' }} />

          <span style={{ fontSize:68, marginBottom:20 }}>🌴</span>
          <span style={{ fontSize:15, color:OR, fontWeight:700, letterSpacing:5, marginBottom:18 }}>
            FREE TRAVEL GUIDE
          </span>
          <span style={{ fontSize:58, fontWeight:900, color:'#fff', lineHeight:1.05,
            marginBottom:16, textAlign:'center' as const }}>
            Plan your{'\n'}perfect Bali trip.
          </span>
          <span style={{ fontSize:17, color:'rgba(255,255,255,0.45)', marginBottom:40,
            textAlign:'center' as const, lineHeight:1.9 }}>
            Itineraries · Budget · Hidden gems{'\n'}Best time · Where to stay
          </span>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'center',
            background:OR, borderRadius:40, padding:'20px 52px', marginBottom:30 }}>
            <span style={{ fontSize:20, fontWeight:900, color:'#fff' }}>
              tripgenius.in/cities/bali
            </span>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'center',
              width:32, height:32, borderRadius:8, background:OR }}>
              <span style={{ fontSize:16 }}>✈️</span>
            </div>
            <span style={{ fontSize:14, fontWeight:800, color:'rgba(255,255,255,0.7)', letterSpacing:2 }}>TRIPGENIUS</span>
          </div>
          <span style={{ fontSize:13, color:'rgba(255,255,255,0.3)', marginTop:14,
            textAlign:'center' as const }}>
            💾 Save · 🔔 Follow @tripgenius.in
          </span>
        </div>
      </div>,
      imgOpts
    );
  }

  // ── PLACE SLIDE ────────────────────────────────────────────────
  return new ImageResponse(
    <div style={{ width:W, height:H, display:'flex', flexDirection:'column', position:'relative', overflow:'hidden' }}>

      {/* FULL-BLEED photo — crisp, fills entire slide */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={s.photo} alt="" style={{ position:'absolute', inset:0,
        width:'100%', height:'100%', objectFit:'cover', objectPosition:'center 35%' }} />

      {/* TOP gradient — light, so photo shows clearly in middle */}
      <div style={{ display:'flex', position:'absolute', top:0, left:0, right:0, height:180,
        background:'linear-gradient(to bottom, rgba(0,0,0,0.65), transparent)' }} />

      {/* BOTTOM gradient — heavy dark for text zone */}
      <div style={{ display:'flex', position:'absolute', bottom:0, left:0, right:0, height:520,
        background:'linear-gradient(to top, rgba(0,0,0,0.98) 0%, rgba(0,0,0,0.95) 30%, rgba(0,0,0,0.8) 55%, rgba(0,0,0,0.3) 80%, transparent 100%)' }} />

      {/* Orange side accent line */}
      <div style={{ display:'flex', position:'absolute', left:0, top:0, bottom:0, width:6, background:OR }} />

      {/* Orange top line */}
      <div style={{ display:'flex', position:'absolute', top:0, left:0, right:0, height:5,
        background:`linear-gradient(to right, ${OR}, ${AM}, ${OR})` }} />

      <div style={{ display:'flex', flexDirection:'column', position:'relative', height:'100%', padding:'34px 52px 36px 58px' }}>

        {/* TOP NAV */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'center',
              width:34, height:34, borderRadius:9, background:OR }}>
              <span style={{ fontSize:16 }}>✈️</span>
            </div>
            <span style={{ fontSize:14, fontWeight:900, color:'#fff', letterSpacing:2 }}>TRIPGENIUS</span>
          </div>
          {/* Progress dots */}
          <div style={{ display:'flex', alignItems:'center', gap:6 }}>
            {Array.from({length:TOTAL}).map((_,i) => (
              <div key={i} style={{ display:'flex',
                width:i===n-1?28:6, height:6, borderRadius:3,
                background:i===n-1?OR:'rgba(255,255,255,0.35)' }} />
            ))}
          </div>
        </div>

        {/* SPACER — photo shows here */}
        <div style={{ display:'flex', flex:1 }} />

        {/* BOTTOM TEXT ZONE — all on dark gradient */}
        <div style={{ display:'flex', flexDirection:'column' }}>

          {/* Number + tag row */}
          <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:16 }}>
            {/* Big orange number */}
            <div style={{ display:'flex', alignItems:'center', justifyContent:'center',
              background:OR, borderRadius:14, padding:'8px 20px', flexShrink:0 }}>
              <span style={{ fontSize:22, fontWeight:900, color:'#fff', letterSpacing:1 }}>
                {s.num}
              </span>
            </div>
            {/* Category tag */}
            <div style={{ display:'flex', alignItems:'center', justifyContent:'center',
              background:'rgba(255,255,255,0.12)',
              border:'1px solid rgba(255,255,255,0.25)',
              borderRadius:24, padding:'8px 20px' }}>
              <span style={{ fontSize:14, color:'rgba(255,255,255,0.85)', fontWeight:600 }}>
                {s.tag}
              </span>
            </div>
          </div>

          {/* Place name — the hero type */}
          <span style={{ fontSize:96, fontWeight:900, color:'#fff', lineHeight:0.9, marginBottom:10 }}>
            {s.name}
          </span>
          <span style={{ fontSize:40, fontWeight:700, color:AM, lineHeight:1.0, marginBottom:28 }}>
            {s.sub}
          </span>

          {/* Bottom bar */}
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center',
            borderTop:'1px solid rgba(255,255,255,0.12)', paddingTop:18 }}>
            <span style={{ fontSize:13, color:'rgba(255,255,255,0.4)' }}>tripgenius.in</span>
            {n < TOTAL
              ? <span style={{ fontSize:14, color:OR, fontWeight:800 }}>Next place →</span>
              : <span style={{ fontSize:14, color:OR, fontWeight:800 }}>Full guide →</span>
            }
          </div>
        </div>
      </div>
    </div>,
    imgOpts
  );
}

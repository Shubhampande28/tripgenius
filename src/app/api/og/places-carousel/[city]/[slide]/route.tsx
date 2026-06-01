import { ImageResponse } from 'next/og';
import { getCityBySlug } from '@/lib/cities';

export const runtime = 'edge';

const W = 1080, H = 1350;
const OR = '#FF7A00';
const AM = '#FFB347';

// ── High-res Pexels photos — 1080×1350 aspect for crisp rendering ──
const PLACES = [
  null,
  // 1 Cover
  {
    type:'cover',
    photo:'https://images.pexels.com/photos/3067621/pexels-photo-3067621.jpeg?auto=compress&cs=tinysrgb&w=1080&h=1350&fit=crop',
  },
  // 2
  { type:'place', num:'01', name:'Tanah Lot', sub:'Temple', tag:'Sunset · Cultural',
    photo:'https://images.pexels.com/photos/33626260/pexels-photo-33626260.jpeg?auto=compress&cs=tinysrgb&w=1080&h=1350&fit=crop' },
  // 3
  { type:'place', num:'02', name:'Tegallalang', sub:'Rice Terraces', tag:'Nature · UNESCO',
    photo:'https://images.pexels.com/photos/36810327/pexels-photo-36810327.jpeg?auto=compress&cs=tinysrgb&w=1080&h=1350&fit=crop' },
  // 4
  { type:'place', num:'03', name:'Mount Batur', sub:'Sunrise Trek', tag:'Adventure · Volcano',
    photo:'https://images.pexels.com/photos/3254728/pexels-photo-3254728.jpeg?auto=compress&cs=tinysrgb&w=1080&h=1350&fit=crop' },
  // 5
  { type:'place', num:'04', name:'Uluwatu', sub:'Temple & Cliffs', tag:'Cultural · Sunset',
    photo:'https://images.pexels.com/photos/6015320/pexels-photo-6015320.jpeg?auto=compress&cs=tinysrgb&w=1080&h=1350&fit=crop' },
  // 6
  { type:'place', num:'05', name:'Kelingking', sub:'Beach · Nusa Penida', tag:'Hidden Gem · Adventure',
    photo:'https://images.pexels.com/photos/5990051/pexels-photo-5990051.jpeg?auto=compress&cs=tinysrgb&w=1080&h=1350&fit=crop' },
  // 7
  { type:'place', num:'06', name:'Seminyak', sub:'Beach & Sunset', tag:'Beach · Lifestyle',
    photo:'https://images.pexels.com/photos/12818213/pexels-photo-12818213.jpeg?auto=compress&cs=tinysrgb&w=1080&h=1350&fit=crop' },
  // 8
  { type:'place', num:'07', name:'Ubud', sub:'Jungle & Temple', tag:'Spiritual · Culture',
    photo:'https://images.pexels.com/photos/18772367/pexels-photo-18772367.jpeg?auto=compress&cs=tinysrgb&w=1080&h=1350&fit=crop' },
  // 9 CTA
  { type:'cta',
    photo:'https://images.pexels.com/photos/2077323/pexels-photo-2077323.jpeg?auto=compress&cs=tinysrgb&w=1080&h=1350&fit=crop' },
];

const TOTAL = PLACES.length - 1;

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

  // ── COVER ──────────────────────────────────────────────────────
  if (s.type === 'cover') {
    return new ImageResponse(
      <div style={{ width:W, height:H, display:'flex', flexDirection:'column', position:'relative', overflow:'hidden' }}>
        {/* Full-bleed photo */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={s.photo} alt="" style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', objectPosition:'center' }} />

        {/* Cinematic dark gradient — heavy at bottom */}
        <div style={{ display:'flex', position:'absolute', inset:0,
          background:'linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.1) 25%, rgba(0,0,0,0.15) 45%, rgba(0,0,0,0.7) 70%, rgba(0,0,0,0.97) 100%)' }} />

        {/* Orange top accent */}
        <div style={{ display:'flex', position:'absolute', top:0, left:0, right:0, height:6,
          background:`linear-gradient(to right, ${OR}, ${AM}, ${OR})` }} />

        <div style={{ display:'flex', flexDirection:'column', position:'relative', height:'100%', padding:'36px 52px' }}>

          {/* Logo top left */}
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:'auto' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'center',
              width:38, height:38, borderRadius:10, background:OR }}>
              <span style={{ fontSize:19 }}>✈️</span>
            </div>
            <span style={{ fontSize:16, fontWeight:900, color:'#fff', letterSpacing:2.5 }}>TRIPGENIUS</span>
          </div>

          {/* Bottom content */}
          <div style={{ display:'flex', flexDirection:'column' }}>
            <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:20 }}>
              <span style={{ fontSize:16, color:OR, fontWeight:700, letterSpacing:4 }}>
                {city.flag} BALI, INDONESIA
              </span>
            </div>

            {/* Giant headline */}
            <span style={{ fontSize:42, fontWeight:900, color:'rgba(255,255,255,0.65)', lineHeight:1, marginBottom:6 }}>
              Places to see in
            </span>
            <span style={{ fontSize:120, fontWeight:900, color:'#fff', lineHeight:0.88, marginBottom:28 }}>
              Bali
            </span>

            {/* Pills row */}
            <div style={{ display:'flex', gap:12, marginBottom:32 }}>
              {[
                { label:'7 Spots', bg:OR, color:'#fff' },
                { label:'Free Guide', bg:'transparent', color:'rgba(255,255,255,0.75)', border:'1px solid rgba(255,255,255,0.35)' },
                { label:'Swipe →', bg:'transparent', color:AM, border:`1px solid ${AM}` },
              ].map(p => (
                <div key={p.label} style={{ display:'flex', alignItems:'center', justifyContent:'center',
                  background:p.bg, border:p.border ?? 'none',
                  borderRadius:30, padding:'11px 24px' }}>
                  <span style={{ fontSize:15, color:p.color, fontWeight:700 }}>{p.label}</span>
                </div>
              ))}
            </div>

            {/* Progress */}
            <div style={{ display:'flex', gap:7 }}>
              {Array.from({length:TOTAL}).map((_,i) => (
                <div key={i} style={{ display:'flex',
                  width:i===0?32:7, height:7, borderRadius:4,
                  background:i===0?OR:'rgba(255,255,255,0.3)' }} />
              ))}
            </div>
          </div>
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

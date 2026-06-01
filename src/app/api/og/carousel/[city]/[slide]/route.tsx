import { ImageResponse } from 'next/og';
import { getCityBySlug } from '@/lib/cities';

export const runtime = 'edge';

// Satori: every div with >1 child needs display:'flex'
const W = 1080, H = 1350;
const OR = '#FF7A00';   // orange
const AM = '#FFB347';   // amber
const WH = '#FFFFFF';   // white
const DK = '#0A0603';   // near-black

// ── Pexels photos per slide ────────────────────────────────────────
const BALI_PHOTOS: Record<number, string> = {
  1: 'https://images.pexels.com/photos/3067621/pexels-photo-3067621.jpeg?auto=compress&cs=tinysrgb&w=1080&h=1350&dpr=1',
  2: 'https://images.pexels.com/photos/27306497/pexels-photo-27306497.jpeg?auto=compress&cs=tinysrgb&w=1080&h=1350&dpr=1',
  3: 'https://images.pexels.com/photos/36810327/pexels-photo-36810327.jpeg?auto=compress&cs=tinysrgb&w=1080&h=1350&dpr=1',
  4: 'https://images.pexels.com/photos/16395470/pexels-photo-16395470.jpeg?auto=compress&cs=tinysrgb&w=1080&h=1350&dpr=1',
  5: 'https://images.pexels.com/photos/5990051/pexels-photo-5990051.jpeg?auto=compress&cs=tinysrgb&w=1080&h=1350&dpr=1',
  6: 'https://images.pexels.com/photos/37204728/pexels-photo-37204728.jpeg?auto=compress&cs=tinysrgb&w=1080&h=1350&dpr=1',
  7: 'https://images.pexels.com/photos/6407829/pexels-photo-6407829.jpeg?auto=compress&cs=tinysrgb&w=1080&h=1350&dpr=1',
  8: 'https://images.pexels.com/photos/2077323/pexels-photo-2077323.jpeg?auto=compress&cs=tinysrgb&w=1080&h=1350&dpr=1',
};

// ── Slide content ──────────────────────────────────────────────────
const BALI_SLIDES = [
  null,
  { headline: 'They showed you\nthe wrong Bali.', sub: '8 things nobody posts about.' },
  { headline: 'Kuta is not\nBali.', sub: "It's where Bali goes to apologise." },
  { headline: 'You went to the\ntourist terraces.', sub: 'The real ones have no Instagram queue.' },
  { headline: 'Bali has\ntwo Balis.', sub: 'Most tourists arrive in the wrong one.' },
  { headline: "There's an island\nnext to Bali.", sub: 'What Bali was 20 years ago.' },
  { headline: 'The $3 breakfast\nthat beats every resort.', sub: 'Locals eat here every morning.' },
  { headline: 'The Bali\ncheatsheet.', sub: 'Screenshot this before you go.' },
  { headline: 'Your Bali trip\nstarts here.', sub: 'Free guide. No fluff. Just what works.' },
];

function Logo() {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center',
        width:32, height:32, borderRadius:9, background:OR }}>
        <span style={{ fontSize:16 }}>✈️</span>
      </div>
      <span style={{ fontSize:14, fontWeight:800, color:WH, letterSpacing:2 }}>TRIPGENIUS</span>
    </div>
  );
}

function Dots({ n, total }: { n:number; total:number }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:6 }}>
      {Array.from({length:total}).map((_,i) => (
        <div key={i} style={{ display:'flex',
          width: i===n-1 ? 28 : 6, height:6, borderRadius:3,
          background: i===n-1 ? OR : 'rgba(255,255,255,0.3)' }} />
      ))}
    </div>
  );
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{city:string; slide:string}> }
) {
  const { city:slug, slide:slideStr } = await params;
  const city = getCityBySlug(slug);
  if (!city) return new Response('Not found', {status:404});

  const n = parseInt(slideStr, 10);
  if (isNaN(n) || n < 1 || n > 8) return new Response('1–8 only', {status:400});

  const isBali = slug === 'bali';
  const photo  = isBali ? BALI_PHOTOS[n] : (city.heroImage || city.image);
  const sd     = isBali ? BALI_SLIDES[n] as any : null;
  const TOTAL  = 8;

  // ──────────────────────────────────────────────────────────────────
  // LAYOUT: photo fills top 42%, hard dark area bottom 58%
  // This guarantees ALL text is on dark bg — no readability issues ever
  // ──────────────────────────────────────────────────────────────────

  function SlideBase({ children }: { children: React.ReactNode }) {
    return (
      <div style={{ width:W, height:H, display:'flex', flexDirection:'column', overflow:'hidden' }}>

        {/* TOP: Photo zone — 42% of height = 567px */}
        <div style={{ display:'flex', position:'relative', height:567, overflow:'hidden', flexShrink:0 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photo ?? ''} alt="" style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'center top' }} />
          {/* Bottom fade from photo → dark */}
          <div style={{ display:'flex', position:'absolute', bottom:0, left:0, right:0, height:200,
            background:'linear-gradient(to bottom,transparent,rgba(10,6,3,0.7),rgba(10,6,3,1))' }} />
          {/* Top bar overlay */}
          <div style={{ display:'flex', position:'absolute', top:0, left:0, right:0, height:90,
            background:'linear-gradient(to bottom,rgba(0,0,0,0.65),transparent)',
            padding:'28px 40px', justifyContent:'space-between', alignItems:'center' }}>
            <Logo />
            <Dots n={n} total={TOTAL} />
          </div>
          {/* Orange top line */}
          <div style={{ display:'flex', position:'absolute', top:0, left:0, right:0, height:4,
            background:`linear-gradient(to right,transparent,${OR},${AM},transparent)` }} />
        </div>

        {/* BOTTOM: Pure dark content zone */}
        <div style={{ display:'flex', flexDirection:'column', flex:1, background:DK,
          padding:'32px 44px 24px 44px' }}>
          {children}
        </div>

      </div>
    );
  }

  // ── SLIDE 1: Full-bleed hero (special layout) ──────────────────
  if (n === 1) {
    return new ImageResponse(
      <div style={{ width:W, height:H, display:'flex', flexDirection:'column', position:'relative', overflow:'hidden' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={photo ?? ''} alt="" style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover' }} />

        {/* Gradient: transparent top → very dark bottom */}
        <div style={{ display:'flex', position:'absolute', inset:0,
          background:'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.25) 35%, rgba(10,6,3,0.85) 65%, rgba(10,6,3,1) 100%)' }} />

        {/* Orange top line */}
        <div style={{ display:'flex', position:'absolute', top:0, left:0, right:0, height:5,
          background:`linear-gradient(to right, transparent, ${OR}, ${AM}, transparent)` }} />

        <div style={{ display:'flex', flexDirection:'column', position:'relative', height:'100%', padding:'28px 44px' }}>
          {/* Top nav */}
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'auto' }}>
            <Logo />
            <div style={{ display:'flex', alignItems:'center', justifyContent:'center',
              background:'rgba(255,122,0,0.2)', border:`1px solid ${OR}60`,
              borderRadius:20, padding:'7px 16px' }}>
              <span style={{ fontSize:11, color:AM, fontWeight:700, letterSpacing:2 }}>2025 GUIDE</span>
            </div>
          </div>

          {/* Headline block in bottom dark area */}
          <div style={{ display:'flex', flexDirection:'column', marginBottom:32 }}>
            {/* Country */}
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:20 }}>
              <span style={{ fontSize:28 }}>{city.flag}</span>
              <span style={{ fontSize:14, color:OR, fontWeight:800, letterSpacing:4 }}>
                {city.country.toUpperCase()}
              </span>
            </div>

            {/* Big headline */}
            <span style={{ fontSize:82, fontWeight:900, color:WH, lineHeight:0.95,
              marginBottom:20, whiteSpace:'pre-line' as const }}>
              {sd?.headline ?? city.name}
            </span>

            {/* Sub */}
            <span style={{ fontSize:28, color:AM, fontWeight:700, lineHeight:1.3, marginBottom:24 }}>
              {sd?.sub ?? city.tagline}
            </span>

            {/* Quick stats */}
            <div style={{ display:'flex', gap:12 }}>
              {[city.stats.bestTime, city.stats.budget].map(v => (
                <div key={v} style={{ display:'flex', alignItems:'center', justifyContent:'center',
                  background:'rgba(255,255,255,0.12)', border:'1px solid rgba(255,255,255,0.2)',
                  borderRadius:26, padding:'10px 20px' }}>
                  <span style={{ fontSize:15, color:WH, fontWeight:600 }}>{v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center',
            borderTop:'1px solid rgba(255,255,255,0.12)', paddingTop:22 }}>
            <span style={{ fontSize:16, color:'rgba(255,255,255,0.55)', fontWeight:500 }}>
              Swipe to see what they don&apos;t tell you
            </span>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'center',
              background:OR, borderRadius:32, padding:'14px 30px' }}>
              <span style={{ fontSize:15, fontWeight:800, color:WH }}>1 of 8 →</span>
            </div>
          </div>
        </div>
      </div>,
      { width:W, height:H }
    );
  }

  // ── SLIDE 2: Kuta vs Real Bali ─────────────────────────────────
  if (n === 2) {
    return new ImageResponse(
      <SlideBase>
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16 }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'center',
            background:`${OR}28`, border:`1px solid ${OR}55`,
            borderRadius:20, padding:'7px 16px' }}>
            <span style={{ fontSize:12, color:OR, fontWeight:700, letterSpacing:2.5 }}>01 / 07</span>
          </div>
        </div>
        <span style={{ fontSize:60, fontWeight:900, color:WH, lineHeight:1.0,
          marginBottom:10, whiteSpace:'pre-line' as const }}>{sd?.headline}</span>
        <span style={{ fontSize:22, color:AM, fontWeight:700, marginBottom:28 }}>{sd?.sub}</span>

        <div style={{ display:'flex', gap:14, flex:1 }}>
          <div style={{ display:'flex', flexDirection:'column', flex:1,
            background:'rgba(239,68,68,0.12)', border:'1px solid rgba(239,68,68,0.35)',
            borderRadius:22, padding:'26px 22px' }}>
            <span style={{ fontSize:32, marginBottom:12 }}>❌</span>
            <span style={{ fontSize:18, fontWeight:800, color:'#F87171', marginBottom:10, letterSpacing:1 }}>
              KUTA / SEMINYAK
            </span>
            <span style={{ fontSize:14, color:'rgba(255,255,255,0.65)', lineHeight:1.7 }}>
              Crowded bars. Tourist prices. The Bali everyone warns you about.
            </span>
          </div>
          <div style={{ display:'flex', flexDirection:'column', flex:1,
            background:'rgba(255,122,0,0.12)', border:`1px solid ${OR}40`,
            borderRadius:22, padding:'26px 22px' }}>
            <span style={{ fontSize:32, marginBottom:12 }}>✅</span>
            <span style={{ fontSize:18, fontWeight:800, color:AM, marginBottom:10, letterSpacing:1 }}>
              UBUD / ULUWATU
            </span>
            <span style={{ fontSize:14, color:'rgba(255,255,255,0.65)', lineHeight:1.7 }}>
              Rice terraces. Cliff temples. The Bali that actually changes you.
            </span>
          </div>
        </div>

        <div style={{ display:'flex', justifyContent:'flex-end', marginTop:16 }}>
          <span style={{ fontSize:13, color:OR, fontWeight:700 }}>Swipe →</span>
        </div>
      </SlideBase>,
      { width:W, height:H }
    );
  }

  // ── SLIDE 3: Tourist terraces ──────────────────────────────────
  if (n === 3) {
    return new ImageResponse(
      <SlideBase>
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16 }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'center',
            background:`${OR}28`, border:`1px solid ${OR}55`,
            borderRadius:20, padding:'7px 16px' }}>
            <span style={{ fontSize:12, color:OR, fontWeight:700, letterSpacing:2.5 }}>02 / 07</span>
          </div>
        </div>
        <span style={{ fontSize:60, fontWeight:900, color:WH, lineHeight:1.0,
          marginBottom:10, whiteSpace:'pre-line' as const }}>{sd?.headline}</span>
        <span style={{ fontSize:22, color:AM, fontWeight:700, marginBottom:24 }}>{sd?.sub}</span>

        <div style={{ display:'flex', flexDirection:'column', gap:12, flex:1 }}>
          <div style={{ display:'flex', alignItems:'center', gap:16,
            background:'rgba(239,68,68,0.10)', border:'1px solid rgba(239,68,68,0.28)',
            borderRadius:18, padding:'18px 22px' }}>
            <span style={{ fontSize:28, flexShrink:0 }}>😩</span>
            <div style={{ display:'flex', flexDirection:'column' }}>
              <span style={{ fontSize:17, fontWeight:800, color:'#F87171', marginBottom:5 }}>TEGALLALANG</span>
              <span style={{ fontSize:13, color:'rgba(255,255,255,0.6)', lineHeight:1.5 }}>
                300+ tourists · Selfie queues · Overpriced waffle cafes
              </span>
            </div>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:16,
            background:`rgba(255,122,0,0.12)`, border:`1px solid ${OR}38`,
            borderRadius:18, padding:'18px 22px' }}>
            <span style={{ fontSize:28, flexShrink:0 }}>🌾</span>
            <div style={{ display:'flex', flexDirection:'column' }}>
              <span style={{ fontSize:17, fontWeight:800, color:AM, marginBottom:5 }}>JATILUWIH ✓</span>
              <span style={{ fontSize:13, color:'rgba(255,255,255,0.6)', lineHeight:1.5 }}>
                UNESCO · 600 hectares · Barely anyone there
              </span>
            </div>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:12,
            background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)',
            borderRadius:14, padding:'14px 18px' }}>
            <span style={{ fontSize:16 }}>🛵</span>
            <span style={{ fontSize:13, color:'rgba(255,255,255,0.5)' }}>
              ~90 min from Ubud · Worth every minute of the ride
            </span>
          </div>
        </div>

        <div style={{ display:'flex', justifyContent:'flex-end', marginTop:16 }}>
          <span style={{ fontSize:13, color:OR, fontWeight:700 }}>Swipe →</span>
        </div>
      </SlideBase>,
      { width:W, height:H }
    );
  }

  // ── SLIDE 4: Two seasons ───────────────────────────────────────
  if (n === 4) {
    return new ImageResponse(
      <SlideBase>
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16 }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'center',
            background:`${OR}28`, border:`1px solid ${OR}55`,
            borderRadius:20, padding:'7px 16px' }}>
            <span style={{ fontSize:12, color:OR, fontWeight:700, letterSpacing:2.5 }}>03 / 07</span>
          </div>
        </div>
        <span style={{ fontSize:60, fontWeight:900, color:WH, lineHeight:1.0,
          marginBottom:10, whiteSpace:'pre-line' as const }}>{sd?.headline}</span>
        <span style={{ fontSize:22, color:AM, fontWeight:700, marginBottom:24 }}>{sd?.sub}</span>

        <div style={{ display:'flex', gap:14 }}>
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', flex:1,
            background:'rgba(0,201,167,0.10)', border:'1px solid rgba(0,201,167,0.30)',
            borderRadius:22, padding:'26px 18px' }}>
            <span style={{ fontSize:40, marginBottom:12 }}>☀️</span>
            <span style={{ fontSize:13, fontWeight:800, color:'#00C9A7', letterSpacing:2, marginBottom:8 }}>DRY SEASON</span>
            <span style={{ fontSize:24, fontWeight:900, color:WH, marginBottom:10 }}>Apr – Oct</span>
            <span style={{ fontSize:12, color:'rgba(255,255,255,0.55)', textAlign:'center' as const, lineHeight:1.6 }}>
              Warm · Sunny{'\n'}Perfect for beaches
            </span>
          </div>
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', flex:1,
            background:'rgba(239,68,68,0.09)', border:'1px solid rgba(239,68,68,0.28)',
            borderRadius:22, padding:'26px 18px' }}>
            <span style={{ fontSize:40, marginBottom:12 }}>🌧️</span>
            <span style={{ fontSize:13, fontWeight:800, color:'#F87171', letterSpacing:2, marginBottom:8 }}>MONSOON</span>
            <span style={{ fontSize:24, fontWeight:900, color:WH, marginBottom:10 }}>Nov – Mar</span>
            <span style={{ fontSize:12, color:'rgba(255,255,255,0.55)', textAlign:'center' as const, lineHeight:1.6 }}>
              Heavy rain{'\n'}Hotels hide this
            </span>
          </div>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:12,
          background:`rgba(255,122,0,0.10)`, border:`1px solid ${OR}35`,
          borderRadius:16, padding:'14px 20px', marginTop:14 }}>
          <span style={{ fontSize:18 }}>💡</span>
          <span style={{ fontSize:14, color:AM, fontWeight:700 }}>
            Sweet spot: Apr or Sep — same weather, 30% cheaper
          </span>
        </div>

        <div style={{ display:'flex', justifyContent:'flex-end', marginTop:14 }}>
          <span style={{ fontSize:13, color:OR, fontWeight:700 }}>Swipe →</span>
        </div>
      </SlideBase>,
      { width:W, height:H }
    );
  }

  // ── SLIDE 5: Nusa Penida ───────────────────────────────────────
  if (n === 5) {
    return new ImageResponse(
      <SlideBase>
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16 }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'center',
            background:`${OR}28`, border:`1px solid ${OR}55`,
            borderRadius:20, padding:'7px 16px' }}>
            <span style={{ fontSize:12, color:OR, fontWeight:700, letterSpacing:2.5 }}>04 / 07</span>
          </div>
        </div>
        <span style={{ fontSize:58, fontWeight:900, color:WH, lineHeight:1.0,
          marginBottom:10, whiteSpace:'pre-line' as const }}>{sd?.headline}</span>
        <span style={{ fontSize:22, color:AM, fontWeight:700, marginBottom:22 }}>{sd?.sub}</span>

        <div style={{ display:'flex', flexDirection:'column', gap:11, flex:1 }}>
          {[
            { e:'🦅', n:'Kelingking Beach', d:'The T-Rex cliff. Most iconic view in Indonesia.' },
            { e:'🌊', n:"Angel's Billabong", d:'Natural infinity pool. Zero entrance fee.' },
            { e:'🐟', n:'Manta Bay', d:'Swim with manta rays bigger than you.' },
            { e:'⛵', n:'Getting there', d:'45-min fast boat from Sanur · Book the day before' },
          ].map((item, i) => (
            <div key={i} style={{ display:'flex', alignItems:'center', gap:14,
              background: i===0 ? `rgba(255,122,0,0.12)` : 'rgba(255,255,255,0.05)',
              border: i===0 ? `1px solid ${OR}38` : '1px solid rgba(255,255,255,0.09)',
              borderRadius:16, padding:'13px 18px' }}>
              <span style={{ fontSize:22, flexShrink:0 }}>{item.e}</span>
              <div style={{ display:'flex', flexDirection:'column' }}>
                <span style={{ fontSize:15, fontWeight:700, color: i===0 ? AM : WH, marginBottom:2 }}>{item.n}</span>
                <span style={{ fontSize:12, color:'rgba(255,255,255,0.5)' }}>{item.d}</span>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display:'flex', justifyContent:'flex-end', marginTop:14 }}>
          <span style={{ fontSize:13, color:OR, fontWeight:700 }}>Swipe →</span>
        </div>
      </SlideBase>,
      { width:W, height:H }
    );
  }

  // ── SLIDE 6: $3 breakfast ──────────────────────────────────────
  if (n === 6) {
    return new ImageResponse(
      <SlideBase>
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16 }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'center',
            background:`${OR}28`, border:`1px solid ${OR}55`,
            borderRadius:20, padding:'7px 16px' }}>
            <span style={{ fontSize:12, color:OR, fontWeight:700, letterSpacing:2.5 }}>05 / 07</span>
          </div>
        </div>
        <span style={{ fontSize:58, fontWeight:900, color:WH, lineHeight:1.0,
          marginBottom:10, whiteSpace:'pre-line' as const }}>{sd?.headline}</span>
        <span style={{ fontSize:22, color:AM, fontWeight:700, marginBottom:24 }}>{sd?.sub}</span>

        <div style={{ display:'flex', gap:16, flex:1 }}>
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', flex:1,
            background:`rgba(255,122,0,0.12)`, border:`1px solid ${OR}40`, borderRadius:22, padding:'28px 18px' }}>
            <span style={{ fontSize:36, marginBottom:10 }}>🏠</span>
            <span style={{ fontSize:13, color:OR, fontWeight:800, letterSpacing:2, marginBottom:8 }}>WARUNG</span>
            <span style={{ fontSize:56, fontWeight:900, color:WH, lineHeight:1, marginBottom:8 }}>$3</span>
            <span style={{ fontSize:12, color:'rgba(255,255,255,0.5)', textAlign:'center' as const, lineHeight:1.5 }}>
              Nasi goreng{'\n'}Fried egg{'\n'}Coconut water
            </span>
          </div>
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', flex:1,
            background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.22)', borderRadius:22, padding:'28px 18px' }}>
            <span style={{ fontSize:36, marginBottom:10 }}>🏨</span>
            <span style={{ fontSize:13, color:'#F87171', fontWeight:800, letterSpacing:2, marginBottom:8 }}>HOTEL</span>
            <span style={{ fontSize:56, fontWeight:900, color:'rgba(255,255,255,0.4)', lineHeight:1, marginBottom:8,
              textDecoration:'line-through' as const }}>$18</span>
            <span style={{ fontSize:12, color:'rgba(255,255,255,0.4)', textAlign:'center' as const, lineHeight:1.5 }}>
              Exact same dish{'\n'}6× the price{'\n'}¯\_(ツ)_/¯
            </span>
          </div>
        </div>

        <div style={{ display:'flex', justifyContent:'flex-end', marginTop:16 }}>
          <span style={{ fontSize:13, color:OR, fontWeight:700 }}>Swipe →</span>
        </div>
      </SlideBase>,
      { width:W, height:H }
    );
  }

  // ── SLIDE 7: Cheatsheet ────────────────────────────────────────
  if (n === 7) {
    const checklist = [
      { ok:true,  text:'Stay in Ubud or Uluwatu — not Kuta' },
      { ok:true,  text:'Visit Apr or Sep — not December' },
      { ok:true,  text:'Nusa Penida day trip — non-negotiable' },
      { ok:true,  text:'Eat at warungs — 6× cheaper, same food' },
      { ok:false, text:'Tegallalang — go to Jatiluwih instead' },
    ];
    return new ImageResponse(
      <SlideBase>
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'center',
            background:`${OR}28`, border:`1px solid ${OR}55`,
            borderRadius:20, padding:'7px 16px' }}>
            <span style={{ fontSize:12, color:OR, fontWeight:700, letterSpacing:2.5 }}>06 / 07</span>
          </div>
          <span style={{ fontSize:13, color:'rgba(255,255,255,0.45)', fontStyle:'italic' as const }}>Screenshot this 📸</span>
        </div>
        <span style={{ fontSize:60, fontWeight:900, color:WH, lineHeight:1.0,
          marginBottom:10, whiteSpace:'pre-line' as const }}>{sd?.headline}</span>
        <span style={{ fontSize:22, color:AM, fontWeight:700, marginBottom:20 }}>{sd?.sub}</span>

        <div style={{ display:'flex', flexDirection:'column', gap:10, flex:1 }}>
          {checklist.map((item, i) => (
            <div key={i} style={{ display:'flex', alignItems:'center', gap:14,
              background: item.ok ? 'rgba(255,122,0,0.10)' : 'rgba(239,68,68,0.08)',
              border: item.ok ? `1px solid ${OR}38` : '1px solid rgba(239,68,68,0.25)',
              borderRadius:16, padding:'15px 20px' }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'center',
                width:34, height:34, borderRadius:10, flexShrink:0,
                background: item.ok ? OR : 'rgba(239,68,68,0.4)' }}>
                <span style={{ fontSize:16, color:WH, fontWeight:900 }}>
                  {item.ok ? '✓' : '✕'}
                </span>
              </div>
              <span style={{ fontSize:16, color: item.ok ? WH : 'rgba(255,255,255,0.55)',
                fontWeight: item.ok ? 600 : 400, lineHeight:1.3 }}>
                {item.text}
              </span>
            </div>
          ))}
        </div>

        <div style={{ display:'flex', justifyContent:'flex-end', marginTop:14 }}>
          <span style={{ fontSize:13, color:OR, fontWeight:700 }}>Swipe →</span>
        </div>
      </SlideBase>,
      { width:W, height:H }
    );
  }

  // ── SLIDE 8: CTA ───────────────────────────────────────────────
  return new ImageResponse(
    <div style={{ width:W, height:H, display:'flex', flexDirection:'column', position:'relative', overflow:'hidden' }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={photo ?? ''} alt="" style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover' }} />
      <div style={{ display:'flex', position:'absolute', inset:0, background:'rgba(10,6,3,0.86)' }} />
      <div style={{ display:'flex', position:'absolute', top:0, left:0, right:0, height:5,
        background:`linear-gradient(to right,transparent,${OR},${AM},transparent)` }} />

      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', position:'relative',
        height:'100%', padding:'60px 60px' }}>

        {/* Decorative ring */}
        <div style={{ display:'flex', position:'absolute', width:420, height:420, borderRadius:'50%',
          border:`1px solid rgba(255,122,0,0.2)`, top:'50%', left:'50%',
          transform:'translate(-210px,-210px)' }} />
        <div style={{ display:'flex', position:'absolute', width:620, height:620, borderRadius:'50%',
          border:`1px solid rgba(255,122,0,0.10)`, top:'50%', left:'50%',
          transform:'translate(-310px,-310px)' }} />

        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', flex:1,
          justifyContent:'center', position:'relative' }}>
          <span style={{ fontSize:64, marginBottom:20 }}>{city.flag}</span>
          <span style={{ fontSize:14, color:OR, fontWeight:800, letterSpacing:4, marginBottom:16 }}>
            FREE TRAVEL GUIDE
          </span>
          <span style={{ fontSize:56, fontWeight:900, color:WH, lineHeight:1.05, marginBottom:16,
            textAlign:'center' as const }}>
            Your Bali trip{'\n'}starts here.
          </span>
          <span style={{ fontSize:16, color:'rgba(255,255,255,0.5)', marginBottom:36,
            textAlign:'center' as const, lineHeight:1.8 }}>
            Everything they don&apos;t post about.{'\n'}Free. No fluff. Just what works.
          </span>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'center',
            background:OR, borderRadius:36, padding:'18px 44px', marginBottom:28 }}>
            <span style={{ fontSize:18, fontWeight:800, color:WH }}>
              tripgenius.in/cities/{slug}
            </span>
          </div>
          <Logo />
          <span style={{ fontSize:13, color:'rgba(255,255,255,0.35)', marginTop:12,
            textAlign:'center' as const, lineHeight:2 }}>
            💾 Save this post · 📤 Share with your travel buddy{'\n'}🔔 Follow @tripgenius.in
          </span>
        </div>
      </div>
    </div>,
    { width:W, height:H }
  );
}

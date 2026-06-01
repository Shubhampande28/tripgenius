import { ImageResponse } from 'next/og';
import { getCityBySlug } from '@/lib/cities';

export const runtime = 'edge';

// Satori: every div with >1 child needs display:'flex'
const W = 1080, H = 1350;
const ORANGE = '#FF7A00';
const AMBER  = '#FFB347';
const CREAM  = '#FFF8EE';
const DARK   = '#0C0805';

// ── Bali-specific carousel content (editorial, not generic) ────────
const BALI_SLIDES = [
  null, // index 0 unused
  {
    headline: 'They showed you\nthe wrong Bali.',
    sub: '8 things nobody posts about.',
    body: '',
    tag: 'TRIPGENIUS · TRAVEL GUIDE 2025',
  },
  {
    headline: 'Kuta is not Bali.',
    sub: "It's where Bali goes to apologise.",
    body: 'The real island is 45 minutes away — Ubud\'s jungle, Uluwatu\'s cliffs, Canggu\'s paddy fields. Most people never leave the beach strip and wonder why Bali felt crowded.',
    tag: '01 / 07',
  },
  {
    headline: 'You went to\nthe tourist terraces.',
    sub: 'The real ones have no Instagram queue.',
    body: 'Tegallalang — beautiful, overrun by 10am. Jatiluwih is the UNESCO one. 600 hectares. Almost nobody there. The rice terraces you actually came to see.',
    tag: '02 / 07',
  },
  {
    headline: 'Bali has\ntwo Balis.',
    sub: 'Most tourists arrive in the wrong one.',
    body: 'Apr–Oct: warm, dry, perfect. Nov–Mar: monsoon. Apr and Sep are the sweet spot — half the crowds, same weather, 30% lower prices.',
    tag: '03 / 07',
  },
  {
    headline: "There's an island\nnext to Bali.",
    sub: "What Bali was 20 years ago.",
    body: 'Nusa Penida. 45-min fast boat from Sanur. Kelingking Beach cliff. Manta rays the size of a car. Angel\'s Billabong natural pool. Zero overpriced smoothie bowls.',
    tag: '04 / 07',
  },
  {
    headline: 'The $3 breakfast\nthat beats every resort.',
    sub: 'Locals eat here every morning.',
    body: 'A warung serves nasi goreng, fried egg, fresh coconut for ~$3. The same dish at your hotel costs $18. Same recipe. Same Bali.',
    tag: '05 / 07',
  },
  {
    headline: 'The Bali\ncheatsheet.',
    sub: 'Screenshot this.',
    body: '',
    tag: '06 / 07',
    checklist: [
      { tick: true,  text: 'Stay in Ubud or Uluwatu — not Kuta' },
      { tick: true,  text: 'Visit Apr or Sep — not December' },
      { tick: true,  text: 'Day trip to Nusa Penida — non-negotiable' },
      { tick: true,  text: 'Eat at warungs — 6× cheaper, same food' },
      { tick: false, text: 'Skip Tegallalang — go to Jatiluwih' },
    ],
  },
  {
    headline: 'Your Bali trip\nstarts here.',
    sub: 'Free guide. No fluff. Just what works.',
    body: 'tripgenius.in/cities/bali',
    tag: 'SAVE THIS POST',
  },
];

// Generic slide content for non-Bali cities
function genericSlide(city: ReturnType<typeof getCityBySlug>, n: number) {
  if (!city) return null;
  const mbm    = city.monthByMonth;
  const places = (city.thingsToDo ?? []).slice(0, 5);
  const hoods  = ((city.neighbourhoods ?? city.areas ?? []) as any[]).slice(0, 4);
  const tips   = (city.proTips ?? []).slice(0, 4);

  switch (n) {
    case 1: return { headline: city.name, sub: city.tagline, body: city.heroDescription?.slice(0, 120) + '...', tag: 'TRAVEL GUIDE 2025' };
    case 2: return { headline: 'Best Time\nto Visit', sub: city.stats.bestTime, mbm, tag: '01 / 07' };
    case 3: return { headline: 'Daily Budget', sub: city.stats.budget, body: 'Budget · Mid-range · Luxury breakdown', tag: '02 / 07' };
    case 4: return { headline: 'Top 5 Places', sub: 'Ranked by travellers', places, tag: '03 / 07' };
    case 5: return { headline: 'Where to Stay', sub: 'Pick your area first', hoods, tag: '04 / 07' };
    case 6: return { headline: 'Local Secrets', sub: 'Most tourists miss these', body: city.offbeatPlaces?.[0]?.name ?? 'Check the full guide', tag: '05 / 07' };
    case 7: return { headline: `${city.name}\nCheatsheet`, sub: 'Screenshot this', checklist: tips.map((t, i) => ({ tick: i % 2 === 0, text: t })), tag: '06 / 07' };
    case 8: return { headline: 'Your trip\nstarts here.', sub: 'Free guide. No fluff.', body: `tripgenius.in/cities/${city.slug}`, tag: 'SAVE THIS' };
    default: return null;
  }
}

function Logo() {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', width:26, height:26, borderRadius:7, background:ORANGE }}>
        <span style={{ fontSize:13 }}>✈️</span>
      </div>
      <span style={{ fontSize:12, fontWeight:700, color:'rgba(255,248,238,0.7)', letterSpacing:2.5 }}>TRIPGENIUS</span>
    </div>
  );
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ city: string; slide: string }> }
) {
  const { city: slug, slide: slideStr } = await params;
  const city = getCityBySlug(slug);
  if (!city) return new Response('City not found', { status: 404 });

  const n = parseInt(slideStr, 10);
  if (isNaN(n) || n < 1 || n > 8) return new Response('Slide 1–8', { status: 400 });

  const heroImg = city.heroImage || city.image;
  const isBali  = slug === 'bali';
  const data    = isBali ? BALI_SLIDES[n] : genericSlide(city, n);
  if (!data) return new Response('No data', { status: 404 });

  const TOTAL = 8;

  // ── Slide 1: Hero cover (photo bg) ─────────────────────────────
  if (n === 1) {
    return new ImageResponse(
      <div style={{ width:W, height:H, display:'flex', flexDirection:'column', position:'relative', overflow:'hidden' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={heroImg} alt="" style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover' }} />

        {/* Strong multi-stop overlay — very dark from 45% downward */}
        <div style={{ display:'flex', position:'absolute', inset:0,
          background:'linear-gradient(to bottom, rgba(10,6,2,0.15) 0%, rgba(10,6,2,0.3) 30%, rgba(10,6,2,0.75) 50%, rgba(10,6,2,0.97) 70%, rgba(10,6,2,1) 100%)' }} />

        {/* Warm orange glow at bottom left for brand warmth */}
        <div style={{ display:'flex', position:'absolute', bottom:-60, left:-60, width:400, height:400,
          borderRadius:'50%', background:`radial-gradient(circle,${ORANGE}30 0%,transparent 65%)` }} />

        {/* Top accent line */}
        <div style={{ display:'flex', position:'absolute', top:0, left:0, right:0, height:4,
          background:`linear-gradient(to right,transparent,${ORANGE},${AMBER},transparent)` }} />

        <div style={{ display:'flex', flexDirection:'column', position:'relative', padding:'44px 52px', height:'100%' }}>

          {/* Nav */}
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'auto' }}>
            <Logo />
            <div style={{ display:'flex', alignItems:'center', justifyContent:'center',
              background:'rgba(255,122,0,0.18)', border:`1px solid ${ORANGE}50`,
              borderRadius:20, padding:'6px 14px' }}>
              <span style={{ fontSize:11, color:AMBER, fontWeight:700, letterSpacing:1.5 }}>2025 GUIDE</span>
            </div>
          </div>

          {/* Text block — solid dark backing for guaranteed readability */}
          <div style={{ display:'flex', flexDirection:'column',
            background:'rgba(10,6,2,0.55)', borderRadius:20,
            padding:'28px 32px', marginBottom:28 }}>

            {/* Country badge */}
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:18 }}>
              <span style={{ fontSize:22 }}>{city.flag}</span>
              <span style={{ fontSize:13, color:ORANGE, fontWeight:700, letterSpacing:4 }}>
                {city.country.toUpperCase()}
              </span>
            </div>

            {/* Headline — large and punchy */}
            <span style={{ fontSize:80, fontWeight:900, color:'#FFFFFF', lineHeight:0.96,
              marginBottom:18, whiteSpace:'pre-line' as const,
              textShadow:'0 2px 20px rgba(0,0,0,0.8)' }}>
              {(data as any).headline}
            </span>

            {/* Subheadline — clearly visible amber */}
            <span style={{ fontSize:26, color:AMBER, fontWeight:700, lineHeight:1.3, marginBottom:0 }}>
              {(data as any).sub}
            </span>
          </div>

          {/* Bottom CTA row */}
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center',
            borderTop:`1px solid ${ORANGE}30`, paddingTop:20 }}>
            <span style={{ fontSize:16, color:'rgba(255,248,238,0.7)', fontWeight:500 }}>
              Swipe for the full story
            </span>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'center',
              background:ORANGE, borderRadius:30, padding:'14px 30px' }}>
              <span style={{ fontSize:16, fontWeight:800, color:'#fff', letterSpacing:0.5 }}>
                1 of {TOTAL} →
              </span>
            </div>
          </div>
        </div>
      </div>,
      { width:W, height:H }
    );
  }

  // ── Slides 2–7: Dark editorial ──────────────────────────────────
  if (n <= 7) {
    const d = data as any;
    return new ImageResponse(
      <div style={{ width:W, height:H, display:'flex', flexDirection:'column', position:'relative', overflow:'hidden',
        background:`linear-gradient(155deg,#1A0E04 0%,${DARK} 60%,#080503 100%)` }}>

        {/* Ambient glow shifts each slide */}
        <div style={{ display:'flex', position:'absolute', width:500, height:500, borderRadius:'50%',
          top:-60 + n*30, left:-120 + n*20,
          background:`radial-gradient(circle,${ORANGE}20 0%,transparent 70%)` }} />

        {/* Top line */}
        <div style={{ display:'flex', position:'absolute', top:0, left:0, right:0, height:3,
          background:`linear-gradient(to right,transparent,${ORANGE},${AMBER},transparent)` }} />

        {/* Left strip */}
        <div style={{ display:'flex', position:'absolute', left:0, top:0, bottom:0, width:3,
          background:`linear-gradient(to bottom,transparent,${ORANGE}80,transparent)` }} />

        <div style={{ display:'flex', flexDirection:'column', flex:1, padding:'40px 52px', position:'relative' }}>

          {/* Top bar */}
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:32 }}>
            <Logo />
            <div style={{ display:'flex', alignItems:'center', gap:5 }}>
              {Array.from({ length: TOTAL }).map((_, i) => (
                <div key={i} style={{ display:'flex', width: i === n-1 ? 22 : 5, height:5, borderRadius:3,
                  background: i === n-1 ? ORANGE : 'rgba(255,248,238,0.18)' }} />
              ))}
            </div>
          </div>

          {/* Slide tag */}
          <div style={{ display:'flex', alignItems:'center', justifyContent:'center',
            background:`${ORANGE}22`, border:`1px solid ${ORANGE}45`,
            borderRadius:20, padding:'6px 14px', alignSelf:'flex-start', marginBottom:20 }}>
            <span style={{ fontSize:11, color:ORANGE, fontWeight:700, letterSpacing:3 }}>{d.tag}</span>
          </div>

          {/* Headline */}
          <span style={{ fontSize:58, fontWeight:900, color:'#FFFFFF', lineHeight:1.02,
            marginBottom:14, whiteSpace:'pre-line' as const }}>
            {d.headline}
          </span>

          {/* Subheadline */}
          {d.sub && (
            <span style={{ fontSize:22, color:AMBER, fontWeight:700, marginBottom:26, lineHeight:1.3 }}>
              {d.sub}
            </span>
          )}

          {/* Body */}
          {d.body && !d.checklist && (
            <span style={{ fontSize:17, color:'rgba(255,248,238,0.80)', lineHeight:1.75, marginBottom:20 }}>
              {d.body}
            </span>
          )}

          {/* Checklist */}
          {d.checklist && (
            <div style={{ display:'flex', flexDirection:'column', gap:12, marginTop:4 }}>
              {d.checklist.map((item: any, i: number) => (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:14,
                  background: item.tick ? 'rgba(255,122,0,0.10)' : 'rgba(255,248,238,0.06)',
                  border: item.tick ? `1px solid ${ORANGE}40` : '1px solid rgba(255,248,238,0.12)',
                  borderRadius:14, padding:'14px 18px' }}>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'center',
                    width:28, height:28, borderRadius:8, flexShrink:0,
                    background: item.tick ? ORANGE : 'rgba(255,248,238,0.08)',
                    border: item.tick ? 'none' : '1px solid rgba(255,248,238,0.15)' }}>
                    <span style={{ fontSize:13, color:'#fff', fontWeight:700 }}>
                      {item.tick ? '✓' : '✕'}
                    </span>
                  </div>
                  <span style={{ fontSize:15, color: item.tick ? CREAM : 'rgba(255,248,238,0.55)', lineHeight:1.4 }}>
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Month grid for best time slide */}
          {d.mbm && (
            <div style={{ display:'flex', flexDirection:'column', gap:12, marginTop:8 }}>
              {[
                { label:'✅ BEST',  months: d.mbm.months.filter((m:any)=>m.rating==='excellent').map((m:any)=>m.short), color:'#00C9A7' },
                { label:'👍 GOOD',  months: d.mbm.months.filter((m:any)=>m.rating==='good').map((m:any)=>m.short),      color:'#60A5FA' },
                { label:'❌ AVOID', months: d.mbm.months.filter((m:any)=>m.rating==='avoid').map((m:any)=>m.short),     color:'#F87171' },
              ].filter((g:any) => g.months.length > 0).map((g:any) => (
                <div key={g.label} style={{ display:'flex', alignItems:'center', gap:14,
                  background:`${g.color}15`, border:`1px solid ${g.color}35`, borderRadius:16, padding:'16px 20px' }}>
                  <div style={{ display:'flex', flexDirection:'column', flex:1, gap:6 }}>
                    <span style={{ fontSize:10, color:g.color, fontWeight:700, letterSpacing:3 }}>{g.label}</span>
                    <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                      {g.months.map((m:string) => (
                        <span key={m} style={{ fontSize:15, color:'rgba(255,248,238,0.9)',
                          background:`${g.color}25`, border:`1px solid ${g.color}55`,
                          borderRadius:22, padding:'5px 13px', fontWeight:600 }}>{m}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center',
          borderTop:'1px solid rgba(255,248,238,0.07)', padding:'14px 52px', position:'relative' }}>
          <span style={{ fontSize:10, color:'rgba(255,248,238,0.3)' }}>tripgenius.in</span>
          {n < TOTAL
            ? <span style={{ fontSize:11, color:ORANGE, fontWeight:700 }}>Swipe →</span>
            : <span style={{ fontSize:11, color:'rgba(255,248,238,0.3)' }}>{n}/{TOTAL}</span>
          }
        </div>
      </div>,
      { width:W, height:H }
    );
  }

  // ── Slide 8: CTA ────────────────────────────────────────────────
  return new ImageResponse(
    <div style={{ width:W, height:H, display:'flex', flexDirection:'column',
      alignItems:'center', justifyContent:'center', overflow:'hidden',
      background:`linear-gradient(145deg,${DARK} 0%,#1A0800 50%,${DARK} 100%)` }}>

      <div style={{ display:'flex', position:'absolute', width:280, height:280, borderRadius:'50%',
        border:`1px solid ${ORANGE}60`, top:'50%', left:'50%',
        transform:'translate(-140px,-140px)' }} />
      <div style={{ display:'flex', position:'absolute', width:430, height:430, borderRadius:'50%',
        border:`1px solid ${ORANGE}35`, top:'50%', left:'50%',
        transform:'translate(-215px,-215px)' }} />
      <div style={{ display:'flex', position:'absolute', width:580, height:580, borderRadius:'50%',
        border:`1px solid ${ORANGE}18`, top:'50%', left:'50%',
        transform:'translate(-290px,-290px)' }} />

      <div style={{ display:'flex', position:'absolute', width:340, height:340, borderRadius:'50%',
        top:'50%', left:'50%', transform:'translate(-170px,-170px)',
        background:`radial-gradient(circle,${ORANGE}28 0%,transparent 65%)` }} />

      <div style={{ display:'flex', position:'absolute', top:0, left:0, right:0, height:3,
        background:`linear-gradient(to right,transparent,${ORANGE},${AMBER},transparent)` }} />

      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', position:'relative',
        padding:'60px 80px' }}>
        <span style={{ fontSize:60, marginBottom:16 }}>{city.flag}</span>
        <span style={{ fontSize:12, color:ORANGE, letterSpacing:4, fontWeight:700, marginBottom:14 }}>FREE TRAVEL GUIDE</span>
        <span style={{ fontSize:54, fontWeight:900, color:CREAM, lineHeight:1.05, marginBottom:12,
          textAlign:'center' as const }}>
          Your Bali trip{'\n'}starts here.
        </span>
        <span style={{ fontSize:15, color:'rgba(255,248,238,0.45)', marginBottom:36,
          textAlign:'center' as const, lineHeight:1.9 }}>
          Everything they don&apos;t post about.{'\n'}Free. No fluff.
        </span>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center',
          background:ORANGE, borderRadius:40, padding:'16px 44px', marginBottom:24 }}>
          <span style={{ fontSize:17, fontWeight:800, color:'#fff' }}>tripgenius.in/cities/{slug}</span>
        </div>
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:6 }}>
          <Logo />
          <span style={{ fontSize:12, color:'rgba(255,248,238,0.3)', textAlign:'center' as const, lineHeight:1.9 }}>
            💾 Save this · 📤 Share with a friend{'\n'}🔔 Follow @tripgenius.in
          </span>
        </div>
      </div>
    </div>,
    { width:W, height:H }
  );
}

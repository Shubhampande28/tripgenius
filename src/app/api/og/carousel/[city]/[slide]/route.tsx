import { ImageResponse } from 'next/og';
import { getCityBySlug } from '@/lib/cities';

export const runtime = 'edge';

// Satori rules: EVERY div with >1 child needs display:'flex'.
// Treat it like React Native — nothing is block by default.

const W = 1080, H = 1350;
const ORANGE = '#FF7A00';
const AMBER  = '#FFB347';
const CREAM  = '#FFF8EE';
const DARK   = '#0F0A05';
const WARM   = '#1A0E04';
const G      = 'rgba(255,248,238,0.08)';
const GB     = '1px solid rgba(255,248,238,0.14)';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ city: string; slide: string }> }
) {
  const { city: slug, slide: slideStr } = await params;
  const city = getCityBySlug(slug);
  if (!city) return new Response('City not found', { status: 404 });

  const n     = parseInt(slideStr, 10);
  if (isNaN(n) || n < 1 || n > 8) return new Response('Slide 1–8', { status: 400 });

  const heroImg = city.heroImage || city.image;
  const mbm     = city.monthByMonth;
  const places  = (city.thingsToDo ?? []).slice(0, 5);
  const hoods   = ((city.neighbourhoods ?? city.areas ?? []) as any[]).slice(0, 4);
  const rests   = (city.restaurants ?? []).slice(0, 3);
  const gems    = (city.offbeatPlaces ?? []).slice(0, 4);
  const tips    = (city.proTips ?? []).slice(0, 4);
  const TOTAL   = 8;

  // ── Common background wrapper (used by slides 2-8) ────────────
  function bg(children: React.ReactNode) {
    return (
      <div style={{ width:W, height:H, display:'flex', flexDirection:'column',
        background:`linear-gradient(155deg,${WARM} 0%,${DARK} 60%,#0A0500 100%)`,
        position:'relative', overflow:'hidden' }}>

        {/* Glow orb */}
        <div style={{ display:'flex', position:'absolute', width:600, height:600,
          borderRadius:'50%', top:-80 + n*35, left:-150 + n*25,
          background:`radial-gradient(circle,${ORANGE}22 0%,transparent 70%)` }} />

        {/* Top accent bar */}
        <div style={{ display:'flex', position:'absolute', top:0, left:0, right:0, height:3,
          background:`linear-gradient(to right,transparent,${ORANGE},${AMBER},transparent)` }} />

        {/* Left accent strip */}
        <div style={{ display:'flex', position:'absolute', left:0, top:0, bottom:0, width:3,
          background:`linear-gradient(to bottom,transparent,${ORANGE}70,transparent)` }} />

        {/* All content */}
        <div style={{ display:'flex', flexDirection:'column', flex:1, padding:'36px 48px', position:'relative' }}>

          {/* Header row */}
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:28 }}>
            {/* Logo */}
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'center',
                width:26, height:26, borderRadius:7, background:ORANGE }}>
                <span style={{ fontSize:13 }}>✈️</span>
              </div>
              <span style={{ fontSize:12, fontWeight:700, color:'rgba(255,248,238,0.7)', letterSpacing:2.5 }}>TRIPGENIUS</span>
            </div>
            {/* Slide counter dots */}
            <div style={{ display:'flex', alignItems:'center', gap:5 }}>
              {Array.from({ length: TOTAL }).map((_, i) => (
                <div key={i} style={{ display:'flex', width: i === n-1 ? 20 : 5, height:5,
                  borderRadius:3, background: i === n-1 ? ORANGE : 'rgba(255,248,238,0.2)' }} />
              ))}
            </div>
          </div>

          {/* Slide body */}
          <div style={{ display:'flex', flexDirection:'column', flex:1 }}>
            {children}
          </div>

          {/* Footer */}
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center',
            borderTop:'1px solid rgba(255,248,238,0.08)', paddingTop:14, marginTop:10 }}>
            <span style={{ fontSize:10, color:'rgba(255,248,238,0.3)' }}>tripgenius.in</span>
            {n < TOTAL
              ? <span style={{ fontSize:11, color:ORANGE, fontWeight:700 }}>Swipe →</span>
              : <span style={{ fontSize:11, color:'rgba(255,248,238,0.3)' }}>{n}/{TOTAL}</span>
            }
          </div>
        </div>
      </div>
    );
  }

  // ── SLIDE 1: Hook — full bleed photo ──────────────────────────
  if (n === 1) {
    return new ImageResponse(
      <div style={{ width:W, height:H, display:'flex', flexDirection:'column', position:'relative', overflow:'hidden' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={heroImg} alt="" style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover' }} />
        <div style={{ display:'flex', position:'absolute', inset:0,
          background:'linear-gradient(175deg,rgba(15,10,5,0.3) 0%,rgba(15,10,5,0.96) 100%)' }} />
        <div style={{ display:'flex', position:'absolute', top:0, left:0, right:0, height:4,
          background:`linear-gradient(to right,transparent,${ORANGE},${AMBER},transparent)` }} />

        <div style={{ display:'flex', flexDirection:'column', position:'relative', padding:'40px 48px', height:'100%' }}>

          {/* Nav */}
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'auto' }}>
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'center',
                width:28, height:28, borderRadius:8, background:ORANGE }}>
                <span style={{ fontSize:14 }}>✈️</span>
              </div>
              <span style={{ fontSize:13, fontWeight:700, color:'rgba(255,248,238,0.75)', letterSpacing:2 }}>TRIPGENIUS</span>
            </div>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'center',
              background:'rgba(255,122,0,0.2)', border:`1px solid ${ORANGE}55`,
              borderRadius:20, padding:'6px 14px' }}>
              <span style={{ fontSize:10, color:AMBER, fontWeight:700, letterSpacing:1.5 }}>TRAVEL GUIDE 2025</span>
            </div>
          </div>

          {/* Main content block */}
          <div style={{ display:'flex', flexDirection:'column', marginBottom:32 }}>
            <span style={{ fontSize:13, color:ORANGE, fontWeight:700, letterSpacing:4, marginBottom:14 }}>
              {city.flag} {city.country.toUpperCase()}
            </span>
            <span style={{ fontSize:90, fontWeight:900, color:'#fff', lineHeight:1, marginBottom:12 }}>
              {city.name}
            </span>
            <span style={{ fontSize:20, color:AMBER, fontStyle:'italic', marginBottom:18 }}>
              &ldquo;{city.tagline}&rdquo;
            </span>
            <span style={{ fontSize:15, color:'rgba(255,248,238,0.6)', lineHeight:1.65, maxWidth:540 }}>
              {city.heroDescription?.slice(0, 110)}...
            </span>
          </div>

          {/* Stat chips */}
          <div style={{ display:'flex', gap:10, marginBottom:28 }}>
            {[
              { icon:'📅', val: city.stats.bestTime },
              { icon:'💰', val: city.stats.budget },
              { icon:'✈️', val: city.vibes?.[0] ?? 'Travel' },
            ].map(s => (
              <div key={s.val} style={{ display:'flex', alignItems:'center', gap:8,
                background:G, border:GB, borderRadius:24, padding:'10px 18px' }}>
                <span style={{ fontSize:14 }}>{s.icon}</span>
                <span style={{ fontSize:13, color:'rgba(255,248,238,0.85)', fontWeight:600 }}>{s.val}</span>
              </div>
            ))}
          </div>

          {/* CTA strip */}
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center',
            borderTop:'1px solid rgba(255,248,238,0.1)', paddingTop:20 }}>
            <span style={{ fontSize:13, color:'rgba(255,248,238,0.4)' }}>8 slides inside</span>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'center',
              background:ORANGE, borderRadius:30, padding:'13px 28px' }}>
              <span style={{ fontSize:14, fontWeight:800, color:'#fff' }}>Swipe to explore →</span>
            </div>
          </div>
        </div>
      </div>,
      { width:W, height:H }
    );
  }

  // ── SLIDE 2: Best Time ─────────────────────────────────────────
  if (n === 2) {
    const groups = [
      { emoji:'✅', label:'BEST', months: mbm?.months.filter(m=>m.rating==='excellent').map(m=>m.short)??[], color:'#00C9A7' },
      { emoji:'👍', label:'GOOD', months: mbm?.months.filter(m=>m.rating==='good').map(m=>m.short)??[],      color:'#60A5FA' },
      { emoji:'❌', label:'AVOID',months: mbm?.months.filter(m=>m.rating==='avoid').map(m=>m.short)??[],    color:'#F87171' },
    ].filter(g => g.months.length > 0);

    return new ImageResponse(
      bg(
        <div style={{ display:'flex', flexDirection:'column' }}>
          <span style={{ fontSize:13, color:ORANGE, fontWeight:700, letterSpacing:4, marginBottom:8 }}>📅 WHEN TO GO</span>
          <span style={{ fontSize:48, fontWeight:900, color:CREAM, lineHeight:1.05, marginBottom:6 }}>Best Time to Visit</span>
          <span style={{ fontSize:48, fontWeight:900, color:ORANGE, lineHeight:1.05, marginBottom:16 }}>{city.name}</span>
          <span style={{ fontSize:13, color:'rgba(255,248,238,0.45)', marginBottom:28, lineHeight:1.5 }}>
            {mbm?.summary?.slice(0, 80) ?? `Best: ${city.stats.bestTime}`}
          </span>
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            {groups.map(g => (
              <div key={g.label} style={{ display:'flex', alignItems:'center', gap:16,
                background:`${g.color}15`, border:`1px solid ${g.color}35`,
                borderRadius:18, padding:'18px 22px' }}>
                <span style={{ fontSize:26 }}>{g.emoji}</span>
                <div style={{ display:'flex', flexDirection:'column', flex:1, gap:8 }}>
                  <span style={{ fontSize:10, color:g.color, fontWeight:700, letterSpacing:3 }}>{g.label} MONTHS</span>
                  <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                    {g.months.map(m => (
                      <span key={m} style={{ fontSize:15, color:'rgba(255,248,238,0.9)',
                        background:`${g.color}25`, border:`1px solid ${g.color}55`,
                        borderRadius:24, padding:'5px 14px', fontWeight:600 }}>{m}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ display:'flex', alignItems:'flex-start', gap:12,
            background:`${ORANGE}18`, border:`1px solid ${ORANGE}40`,
            borderRadius:16, padding:'16px 20px', marginTop:20 }}>
            <span style={{ fontSize:20 }}>💡</span>
            <span style={{ fontSize:13, color:'rgba(255,248,238,0.8)', lineHeight:1.6 }}>
              Sweet spot: {city.stats.bestTime} — good weather, fewer tourists than peak.
            </span>
          </div>
        </div>
      ),
      { width:W, height:H }
    );
  }

  // ── SLIDE 3: Budget ────────────────────────────────────────────
  if (n === 3) {
    const tiers = [
      { icon:'🎒', label:'Budget',    price:'$40–70',  note:'Hostel · Street food · Scooter',  hi:false },
      { icon:'✈️', label:'Mid-Range', price:'$80–150', note:'Villa · Restaurants · Tours',     hi:true },
      { icon:'👑', label:'Luxury',    price:'$200+',   note:'5-star · Driver · Fine dining',   hi:false },
    ];
    return new ImageResponse(
      bg(
        <div style={{ display:'flex', flexDirection:'column' }}>
          <span style={{ fontSize:13, color:ORANGE, fontWeight:700, letterSpacing:4, marginBottom:8 }}>💰 BUDGET</span>
          <span style={{ fontSize:48, fontWeight:900, color:CREAM, lineHeight:1.05, marginBottom:6 }}>How Much Does</span>
          <span style={{ fontSize:48, fontWeight:900, color:ORANGE, lineHeight:1.05, marginBottom:24 }}>{city.name} Cost?</span>
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            {tiers.map(t => (
              <div key={t.label} style={{ display:'flex', alignItems:'center', gap:18,
                background: t.hi ? `${ORANGE}22` : G,
                border: t.hi ? `1px solid ${ORANGE}55` : GB,
                borderRadius:18, padding:'20px 24px' }}>
                <span style={{ fontSize:30 }}>{t.icon}</span>
                <div style={{ display:'flex', flexDirection:'column', flex:1 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:5 }}>
                    <span style={{ fontSize:17, fontWeight:700, color: t.hi ? AMBER : CREAM }}>{t.label}</span>
                    <span style={{ fontSize:26, fontWeight:900, color: t.hi ? ORANGE : 'rgba(255,248,238,0.7)' }}>
                      {t.price}/day
                    </span>
                  </div>
                  <span style={{ fontSize:13, color:'rgba(255,248,238,0.5)' }}>{t.note}</span>
                </div>
              </div>
            ))}
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:12, background:G, border:GB,
            borderRadius:16, padding:'16px 20px', marginTop:20 }}>
            <span style={{ fontSize:20 }}>🛵</span>
            <span style={{ fontSize:13, color:'rgba(255,248,238,0.7)', lineHeight:1.6 }}>
              Tip: Scooter (~$5/day) + local warungs = half the cost, double the fun.
            </span>
          </div>
        </div>
      ),
      { width:W, height:H }
    );
  }

  // ── SLIDE 4: Top Places ────────────────────────────────────────
  if (n === 4) {
    return new ImageResponse(
      bg(
        <div style={{ display:'flex', flexDirection:'column' }}>
          <span style={{ fontSize:13, color:ORANGE, fontWeight:700, letterSpacing:4, marginBottom:8 }}>🗺️ TOP PLACES</span>
          <span style={{ fontSize:48, fontWeight:900, color:CREAM, lineHeight:1.05, marginBottom:6 }}>5 Places You</span>
          <span style={{ fontSize:48, fontWeight:900, color:ORANGE, lineHeight:1.05, marginBottom:24 }}>Cannot Skip</span>
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {places.map((p, i) => (
              <div key={p.name} style={{ display:'flex', alignItems:'center', gap:16,
                background: i === 0 ? `${ORANGE}22` : G,
                border: i === 0 ? `1px solid ${ORANGE}55` : GB,
                borderRadius:18, padding:'16px 20px' }}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'center',
                  width:50, height:50, borderRadius:14, flexShrink:0,
                  background: i === 0 ? ORANGE : `${ORANGE}28`,
                  border:`1px solid ${ORANGE}55` }}>
                  <span style={{ fontSize:18, fontWeight:900, color: i === 0 ? '#fff' : AMBER }}>
                    {String(i+1).padStart(2,'0')}
                  </span>
                </div>
                <span style={{ fontSize:26, flexShrink:0 }}>{p.icon}</span>
                <div style={{ display:'flex', flexDirection:'column', flex:1 }}>
                  <span style={{ fontSize:17, fontWeight:800, color:CREAM, lineHeight:1.2, marginBottom:3 }}>{p.name}</span>
                  <span style={{ fontSize:11, color:'rgba(255,248,238,0.45)' }}>{p.category} · {p.duration}</span>
                </div>
                {i === 0 && (
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'center',
                    background:ORANGE, borderRadius:10, padding:'4px 10px' }}>
                    <span style={{ fontSize:9, color:'#fff', fontWeight:700 }}>TOP PICK</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ),
      { width:W, height:H }
    );
  }

  // ── SLIDE 5: Where to Stay ─────────────────────────────────────
  if (n === 5) {
    const pm: Record<string,string> = { '$':'Budget','$$':'Mid-range','$$$':'Upscale','$$$$':'Luxury' };
    return new ImageResponse(
      bg(
        <div style={{ display:'flex', flexDirection:'column' }}>
          <span style={{ fontSize:13, color:ORANGE, fontWeight:700, letterSpacing:4, marginBottom:8 }}>🏨 AREAS</span>
          <span style={{ fontSize:48, fontWeight:900, color:CREAM, lineHeight:1.05, marginBottom:6 }}>Which Area Is</span>
          <span style={{ fontSize:48, fontWeight:900, color:ORANGE, lineHeight:1.05, marginBottom:24 }}>Right for You?</span>
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {hoods.map((h: any) => (
              <div key={h.name} style={{ display:'flex', alignItems:'center', gap:14,
                background:G, border:GB, borderRadius:18, padding:'16px 20px' }}>
                <span style={{ fontSize:24, flexShrink:0 }}>{h.emoji ?? '📍'}</span>
                <div style={{ display:'flex', flexDirection:'column', flex:1 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:4 }}>
                    <span style={{ fontSize:17, fontWeight:800, color:CREAM }}>{h.name}</span>
                    {h.priceRange && (
                      <span style={{ fontSize:10, color:ORANGE, background:`${ORANGE}22`,
                        border:`1px solid ${ORANGE}44`, borderRadius:12, padding:'3px 10px' }}>
                        {h.priceRange} · {pm[h.priceRange]??''}
                      </span>
                    )}
                  </div>
                  <span style={{ fontSize:12, color:'rgba(255,248,238,0.5)', lineHeight:1.4 }}>
                    {(h.vibe||h.tagline||'').slice(0,55)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ),
      { width:W, height:H }
    );
  }

  // ── SLIDE 6: Hidden Gems ───────────────────────────────────────
  if (n === 6) {
    return new ImageResponse(
      bg(
        <div style={{ display:'flex', flexDirection:'column' }}>
          <span style={{ fontSize:13, color:ORANGE, fontWeight:700, letterSpacing:4, marginBottom:8 }}>💎 HIDDEN GEMS</span>
          <span style={{ fontSize:48, fontWeight:900, color:CREAM, lineHeight:1.05, marginBottom:6 }}>Places Most</span>
          <span style={{ fontSize:48, fontWeight:900, color:ORANGE, lineHeight:1.05, marginBottom:8 }}>Tourists Miss</span>
          <span style={{ fontSize:14, color:AMBER, fontStyle:'italic', marginBottom:24 }}>Save this 👇</span>
          <div style={{ display:'flex', flexDirection:'column', gap:13 }}>
            {gems.length > 0 ? gems.map((g, i) => (
              <div key={g.name} style={{ display:'flex', gap:14,
                background: i===0 ? `${AMBER}15` : G,
                border: i===0 ? `1px solid ${AMBER}40` : GB,
                borderRadius:18, padding:'16px 20px' }}>
                <span style={{ fontSize:26, flexShrink:0, marginTop:2 }}>{g.icon}</span>
                <div style={{ display:'flex', flexDirection:'column' }}>
                  <span style={{ fontSize:17, fontWeight:800, color:CREAM, marginBottom:3 }}>{g.name}</span>
                  <span style={{ fontSize:11, color:ORANGE, marginBottom:4 }}>{g.type}</span>
                  <span style={{ fontSize:12, color:'rgba(255,248,238,0.55)', lineHeight:1.5 }}>{g.why.slice(0,80)}</span>
                </div>
              </div>
            )) : (
              <span style={{ fontSize:14, color:'rgba(255,248,238,0.3)' }}>Full list at tripgenius.in</span>
            )}
          </div>
        </div>
      ),
      { width:W, height:H }
    );
  }

  // ── SLIDE 7: Cheatsheet ────────────────────────────────────────
  if (n === 7) {
    return new ImageResponse(
      bg(
        <div style={{ display:'flex', flexDirection:'column' }}>
          <span style={{ fontSize:13, color:ORANGE, fontWeight:700, letterSpacing:4, marginBottom:8 }}>📋 CHEATSHEET</span>
          <span style={{ fontSize:48, fontWeight:900, color:CREAM, lineHeight:1.05, marginBottom:4 }}>{city.name} in 60s</span>
          <span style={{ fontSize:13, color:AMBER, fontStyle:'italic', marginBottom:22 }}>Screenshot this slide 📸</span>

          {/* Row 1 of stats */}
          <div style={{ display:'flex', gap:10, marginBottom:10 }}>
            <div style={{ display:'flex', flexDirection:'column', flex:1, gap:4, background:G, border:GB, borderRadius:16, padding:'14px 16px' }}>
              <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                <span style={{ fontSize:14 }}>📅</span>
                <span style={{ fontSize:9, color:'rgba(255,248,238,0.35)', letterSpacing:2 }}>BEST TIME</span>
              </div>
              <span style={{ fontSize:14, fontWeight:700, color:AMBER }}>{city.stats.bestTime}</span>
            </div>
            <div style={{ display:'flex', flexDirection:'column', flex:1, gap:4, background:G, border:GB, borderRadius:16, padding:'14px 16px' }}>
              <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                <span style={{ fontSize:14 }}>💰</span>
                <span style={{ fontSize:9, color:'rgba(255,248,238,0.35)', letterSpacing:2 }}>DAILY BUDGET</span>
              </div>
              <span style={{ fontSize:14, fontWeight:700, color:AMBER }}>{city.stats.budget}</span>
            </div>
          </div>

          {/* Row 2 of stats */}
          <div style={{ display:'flex', gap:10, marginBottom:18 }}>
            <div style={{ display:'flex', flexDirection:'column', flex:1, gap:4, background:G, border:GB, borderRadius:16, padding:'14px 16px' }}>
              <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                <span style={{ fontSize:14 }}>💱</span>
                <span style={{ fontSize:9, color:'rgba(255,248,238,0.35)', letterSpacing:2 }}>CURRENCY</span>
              </div>
              <span style={{ fontSize:14, fontWeight:700, color:AMBER }}>{city.stats.currency}</span>
            </div>
            <div style={{ display:'flex', flexDirection:'column', flex:1, gap:4, background:G, border:GB, borderRadius:16, padding:'14px 16px' }}>
              <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                <span style={{ fontSize:14 }}>🗣️</span>
                <span style={{ fontSize:9, color:'rgba(255,248,238,0.35)', letterSpacing:2 }}>LANGUAGE</span>
              </div>
              <span style={{ fontSize:14, fontWeight:700, color:AMBER }}>{city.stats.language}</span>
            </div>
          </div>

          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {tips.map((tip, i) => (
              <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:12,
                background:G, border:GB, borderRadius:14, padding:'12px 16px' }}>
                <span style={{ fontSize:15, color:ORANGE, fontWeight:700, marginTop:1 }}>✓</span>
                <span style={{ fontSize:13, color:'rgba(255,248,238,0.75)', lineHeight:1.5 }}>{tip}</span>
              </div>
            ))}
          </div>
        </div>
      ),
      { width:W, height:H }
    );
  }

  // ── SLIDE 8: CTA ───────────────────────────────────────────────
  return new ImageResponse(
    <div style={{ width:W, height:H, display:'flex', flexDirection:'column',
      alignItems:'center', justifyContent:'center', overflow:'hidden',
      background:`linear-gradient(145deg,${DARK} 0%,#1a0800 50%,${DARK} 100%)` }}>

      {/* Rings */}
      {[280,420,560].map((s, i) => (
        <div key={s} style={{ display:'flex', position:'absolute', width:s, height:s,
          borderRadius:'50%', border:`1px solid ${ORANGE}${['55','30','15'][i]}`,
          top:'50%', left:'50%',
          transform:`translate(-${s/2}px,-${s/2}px)` }} />
      ))}

      {/* Glow */}
      <div style={{ display:'flex', position:'absolute', width:360, height:360,
        borderRadius:'50%', top:'50%', left:'50%',
        transform:'translate(-180px,-180px)',
        background:`radial-gradient(circle,${ORANGE}28 0%,transparent 65%)` }} />

      {/* Top line */}
      <div style={{ display:'flex', position:'absolute', top:0, left:0, right:0, height:3,
        background:`linear-gradient(to right,transparent,${ORANGE},${AMBER},transparent)` }} />

      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', position:'relative',
        textAlign:'center' as const, padding:'60px 80px' }}>
        <span style={{ fontSize:64, marginBottom:18 }}>{city.flag}</span>
        <span style={{ fontSize:13, color:ORANGE, letterSpacing:4, fontWeight:700, marginBottom:14 }}>FREE TRAVEL GUIDE</span>
        <span style={{ fontSize:52, fontWeight:900, color:CREAM, lineHeight:1.05, marginBottom:14 }}>
          Plan Your {city.name} Trip
        </span>
        <span style={{ fontSize:14, color:'rgba(255,248,238,0.5)', marginBottom:36, lineHeight:1.9 }}>
          Things to do · Where to stay · Budget{'\n'}Hidden gems · Local tips · Best time
        </span>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center',
          background:ORANGE, borderRadius:40, padding:'16px 44px', marginBottom:26 }}>
          <span style={{ fontSize:18, fontWeight:800, color:'#fff' }}>tripgenius.in/cities/{slug}</span>
        </div>
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:6 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'center',
              width:22, height:22, borderRadius:6, background:ORANGE }}>
              <span style={{ fontSize:11 }}>✈️</span>
            </div>
            <span style={{ fontSize:11, fontWeight:700, color:'rgba(255,248,238,0.6)', letterSpacing:2 }}>TRIPGENIUS</span>
          </div>
          <span style={{ fontSize:12, color:'rgba(255,248,238,0.35)', lineHeight:1.9 }}>
            💾 Save · 📤 Share · 🔔 Follow @tripgenius.in
          </span>
        </div>
      </div>
    </div>,
    { width:W, height:H }
  );
}

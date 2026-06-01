import { ImageResponse } from 'next/og';
import { getCityBySlug } from '@/lib/cities';

export const runtime = 'edge';

const W = 1080, H = 1350;

// ── Design tokens ──────────────────────────────────────────────────
const ORANGE  = '#FF7A00';
const AMBER   = '#FFB347';
const CREAM   = '#FFF8EE';
const DARK    = '#0F0A05';
const WARM    = '#1A0E04';
const GLASS   = 'rgba(255,248,238,0.08)';
const GLASS_B = '1px solid rgba(255,248,238,0.14)';

// ── Shared elements ────────────────────────────────────────────────
function Logo({ light = false }: { light?: boolean }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
      <div style={{ width:26, height:26, borderRadius:7, background:ORANGE, display:'flex', alignItems:'center', justifyContent:'center' }}>
        <span style={{ fontSize:13 }}>✈️</span>
      </div>
      <span style={{ fontSize:12, fontWeight:700, color: light ? ORANGE : 'rgba(255,248,238,0.7)', letterSpacing:2.5 }}>TRIPGENIUS</span>
    </div>
  );
}

function SlideCounter({ n, total }: { n: number; total: number }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:6 }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{ width: i === n - 1 ? 20 : 5, height:5, borderRadius:3,
          background: i === n - 1 ? ORANGE : 'rgba(255,248,238,0.25)', transition:'all 0.3s' }} />
      ))}
    </div>
  );
}

// ── Seamless shell: consistent warm dark bg + flowing accent ───────
function Shell({ children, n, total, tag }: {
  children: React.ReactNode; n: number; total: number; tag: string;
}) {
  return (
    <div style={{ width:W, height:H, display:'flex', flexDirection:'column', position:'relative',
      background:`linear-gradient(155deg, ${WARM} 0%, ${DARK} 60%, #0A0500 100%)`, overflow:'hidden' }}>

      {/* Seamless warm glow — shifts position per slide for flow effect */}
      <div style={{ position:'absolute', width:700, height:700, borderRadius:'50%',
        background:`radial-gradient(circle, ${ORANGE}20 0%, transparent 70%)`,
        top: -100 + (n * 40), left: -200 + (n * 30), display:'flex' }} />

      {/* Top accent line (seamless across slides) */}
      <div style={{ position:'absolute', top:0, left:0, right:0, height:3,
        background:`linear-gradient(to right, transparent, ${ORANGE}, ${AMBER}, transparent)`, display:'flex' }} />

      {/* Side accent strip */}
      <div style={{ position:'absolute', left:0, top:0, bottom:0, width:3,
        background:`linear-gradient(to bottom, transparent, ${ORANGE}60, transparent)`, display:'flex' }} />

      {/* Content */}
      <div style={{ position:'relative', display:'flex', flexDirection:'column',
        padding:'36px 44px', height:'100%', gap:0 }}>

        {/* Top bar */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:28 }}>
          <Logo />
          <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:5 }}>
            <SlideCounter n={n} total={total} />
            <span style={{ fontSize:9, color:'rgba(255,248,238,0.35)', letterSpacing:2 }}>{tag}</span>
          </div>
        </div>

        {/* Main content area */}
        <div style={{ display:'flex', flexDirection:'column', flex:1 }}>
          {children}
        </div>

        {/* Bottom bar */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center',
          borderTop:'1px solid rgba(255,248,238,0.08)', paddingTop:16, marginTop:12 }}>
          <span style={{ fontSize:10, color:'rgba(255,248,238,0.3)', letterSpacing:1 }}>tripgenius.in</span>
          {n < total && (
            <span style={{ fontSize:11, color:ORANGE, fontWeight:700, letterSpacing:1 }}>Swipe →</span>
          )}
        </div>
      </div>
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
  if (isNaN(n) || n < 1 || n > 9) return new Response('Slide 1–9 only', { status: 400 });

  const heroImg   = city.heroImage || city.image;
  const mbm       = city.monthByMonth;
  const places    = (city.thingsToDo ?? []).slice(0, 5);
  const hoods     = (city.neighbourhoods ?? city.areas ?? []).slice(0, 4) as any[];
  const rests     = (city.restaurants ?? []).slice(0, 3);
  const gems      = (city.offbeatPlaces ?? []).slice(0, 4);
  const tips      = (city.proTips ?? []).slice(0, 4);
  const TOTAL     = 8;

  // ── SLIDE 1: Hook — curiosity gap ─────────────────────────────
  if (n === 1) {
    return new ImageResponse(
      <div style={{ width:W, height:H, position:'relative', display:'flex', flexDirection:'column', overflow:'hidden' }}>
        {/* Hero photo */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={heroImg} alt="" style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover' }} />

        {/* Rich dark overlay — heavier at bottom */}
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(175deg,rgba(15,10,5,0.35) 0%,rgba(15,10,5,0.5) 40%,rgba(15,10,5,0.96) 100%)', display:'flex' }} />

        {/* Warm orange glow bottom left */}
        <div style={{ position:'absolute', bottom:-100, left:-100, width:500, height:500,
          borderRadius:'50%', background:`radial-gradient(circle, ${ORANGE}35 0%, transparent 65%)`, display:'flex' }} />

        {/* Top seamless line */}
        <div style={{ position:'absolute', top:0, left:0, right:0, height:3,
          background:`linear-gradient(to right, transparent, ${ORANGE}, ${AMBER}, transparent)`, display:'flex' }} />

        {/* Content */}
        <div style={{ position:'relative', display:'flex', flexDirection:'column', padding:'36px 44px', height:'100%' }}>

          {/* Top bar */}
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'auto' }}>
            <Logo />
            <div style={{ display:'flex', alignItems:'center', gap:6, background:'rgba(255,122,0,0.2)',
              border:`1px solid ${ORANGE}50`, borderRadius:20, padding:'6px 14px' }}>
              <span style={{ fontSize:10, color:AMBER, fontWeight:700, letterSpacing:1.5 }}>TRAVEL GUIDE 2025</span>
            </div>
          </div>

          {/* Hook headline — curiosity gap */}
          <div style={{ display:'flex', flexDirection:'column', marginBottom:32 }}>
            <div style={{ fontSize:14, color:ORANGE, fontWeight:700, letterSpacing:4, marginBottom:16 }}>
              {city.flag} {city.country.toUpperCase()}
            </div>

            {/* Giant city name */}
            <div style={{ fontSize:96, fontWeight:900, color:'#fff', lineHeight:0.95, marginBottom:14 }}>
              {city.name}
            </div>

            {/* Hook line */}
            <div style={{ fontSize:22, color:AMBER, fontStyle:'italic', marginBottom:20, lineHeight:1.3 }}>
              &ldquo;{city.tagline}&rdquo;
            </div>

            {/* Teaser */}
            <div style={{ fontSize:16, color:'rgba(255,248,238,0.6)', lineHeight:1.65, maxWidth:560 }}>
              {city.heroDescription?.slice(0, 110)}...
            </div>
          </div>

          {/* Stats chips */}
          <div style={{ display:'flex', gap:10, marginBottom:28, flexWrap:'wrap' }}>
            {[
              { icon:'📅', val: city.stats.bestTime },
              { icon:'💰', val: city.stats.budget },
              { icon:'✈️', val: city.vibes?.[0] ?? 'Adventure' },
            ].map(s => (
              <div key={s.val} style={{ display:'flex', alignItems:'center', gap:8, background:GLASS,
                border:GLASS_B, borderRadius:24, padding:'10px 18px' }}>
                <span style={{ fontSize:14 }}>{s.icon}</span>
                <span style={{ fontSize:13, color:'rgba(255,248,238,0.85)', fontWeight:600 }}>{s.val}</span>
              </div>
            ))}
          </div>

          {/* CTA strip */}
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center',
            borderTop:'1px solid rgba(255,248,238,0.1)', paddingTop:20 }}>
            <div style={{ display:'flex', flexDirection:'column' }}>
              <span style={{ fontSize:13, color:'rgba(255,248,238,0.4)' }}>8 slides inside</span>
              <span style={{ fontSize:11, color:'rgba(255,248,238,0.25)' }}>tripgenius.in</span>
            </div>
            <div style={{ background:ORANGE, borderRadius:30, padding:'13px 28px', display:'flex', alignItems:'center', gap:8 }}>
              <span style={{ fontSize:14, fontWeight:800, color:'#fff', letterSpacing:0.5 }}>Swipe to explore →</span>
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
      { emoji:'🌤️', label:'BEST MONTHS',  months: mbm?.months.filter(m=>m.rating==='excellent').map(m=>m.short)??[], color:'#00C9A7', bg:'rgba(0,201,167,0.12)' },
      { emoji:'⛅', label:'GOOD MONTHS',  months: mbm?.months.filter(m=>m.rating==='good').map(m=>m.short)??[],      color:'#60A5FA', bg:'rgba(96,165,250,0.12)' },
      { emoji:'🌧️', label:'AVOID',         months: mbm?.months.filter(m=>m.rating==='avoid').map(m=>m.short)??[],    color:'#F87171', bg:'rgba(248,113,113,0.12)' },
    ].filter(g => g.months.length > 0);

    return new ImageResponse(
      <Shell n={n} total={TOTAL} tag="WHEN TO VISIT">
        {/* Huge decorative number */}
        <div style={{ position:'absolute', right:20, top:60, fontSize:260, fontWeight:900,
          color:'rgba(255,122,0,0.05)', lineHeight:1, fontFamily:'system-ui', display:'flex' }}>02</div>

        <div style={{ fontSize:15, color:ORANGE, fontWeight:700, letterSpacing:4, marginBottom:10 }}>
          📅 WHEN TO GO
        </div>
        <div style={{ fontSize:48, fontWeight:900, color:CREAM, lineHeight:1.05, marginBottom:8 }}>
          Best Time to<br />Visit {city.name}
        </div>
        <div style={{ fontSize:14, color:'rgba(255,248,238,0.45)', marginBottom:32, lineHeight:1.5 }}>
          {mbm?.summary?.slice(0, 85) ?? `Best: ${city.stats.bestTime}`}
        </div>

        <div style={{ display:'flex', flexDirection:'column', gap:14, flex:1 }}>
          {groups.map(g => (
            <div key={g.label} style={{ background:g.bg, border:`1px solid ${g.color}35`,
              borderRadius:20, padding:'20px 24px', display:'flex', gap:18, alignItems:'center' }}>
              <span style={{ fontSize:28 }}>{g.emoji}</span>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:10, color:g.color, fontWeight:700, letterSpacing:3, marginBottom:10 }}>{g.label}</div>
                <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                  {g.months.map(m => (
                    <span key={m} style={{ fontSize:16, color:'rgba(255,248,238,0.9)',
                      background:`${g.color}22`, border:`1px solid ${g.color}55`,
                      borderRadius:28, padding:'6px 16px', fontWeight:600 }}>{m}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ background:`${ORANGE}18`, border:`1px solid ${ORANGE}40`, borderRadius:16,
          padding:'16px 20px', display:'flex', gap:12, marginTop:16, alignItems:'flex-start' }}>
          <span style={{ fontSize:20 }}>💡</span>
          <span style={{ fontSize:14, color:'rgba(255,248,238,0.8)', lineHeight:1.6 }}>
            <span style={{ color:AMBER, fontWeight:700 }}>{city.stats.bestTime}</span> is the sweet spot — great weather, fewer tourists than peak.
          </span>
        </div>
      </Shell>,
      { width:W, height:H }
    );
  }

  // ── SLIDE 3: Budget ────────────────────────────────────────────
  if (n === 3) {
    const tiers = [
      { icon:'🎒', label:'Budget',     price:'$40–70',  note:'Hostel · Street food · Scooter', highlight:false },
      { icon:'✈️', label:'Mid-Range',  price:'$80–150', note:'Villa · Restaurants · Tours',    highlight:true },
      { icon:'👑', label:'Luxury',     price:'$200+',   note:'5-star resort · Driver · Dining', highlight:false },
    ];
    return new ImageResponse(
      <Shell n={n} total={TOTAL} tag="BUDGET GUIDE">
        <div style={{ position:'absolute', right:20, top:60, fontSize:260, fontWeight:900,
          color:'rgba(255,122,0,0.05)', lineHeight:1, fontFamily:'system-ui', display:'flex' }}>03</div>

        <div style={{ fontSize:15, color:ORANGE, fontWeight:700, letterSpacing:4, marginBottom:10 }}>💰 BUDGET</div>
        <div style={{ fontSize:48, fontWeight:900, color:CREAM, lineHeight:1.05, marginBottom:6 }}>
          How Much Does<br />{city.name} Cost?
        </div>
        <div style={{ fontSize:14, color:'rgba(255,248,238,0.4)', marginBottom:32 }}>Per person per day (all in)</div>

        <div style={{ display:'flex', flexDirection:'column', gap:14, flex:1 }}>
          {tiers.map(t => (
            <div key={t.label} style={{ background: t.highlight ? `${ORANGE}20` : GLASS,
              border: t.highlight ? `1px solid ${ORANGE}55` : GLASS_B,
              borderRadius:20, padding:'22px 26px', display:'flex', gap:18, alignItems:'center',
              transform: t.highlight ? 'scale(1.02)' : 'scale(1)' }}>
              <span style={{ fontSize:32 }}>{t.icon}</span>
              <div style={{ flex:1 }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:6 }}>
                  <span style={{ fontSize:18, fontWeight:700, color: t.highlight ? AMBER : CREAM }}>{t.label}</span>
                  <span style={{ fontSize:28, fontWeight:900, color: t.highlight ? ORANGE : 'rgba(255,248,238,0.7)' }}>{t.price}<span style={{ fontSize:14 }}>/day</span></span>
                </div>
                <span style={{ fontSize:13, color:'rgba(255,248,238,0.5)' }}>{t.note}</span>
              </div>
            </div>
          ))}
        </div>

        <div style={{ background:GLASS, border:GLASS_B, borderRadius:16, padding:'16px 20px',
          display:'flex', gap:12, marginTop:16 }}>
          <span style={{ fontSize:20 }}>🛵</span>
          <span style={{ fontSize:14, color:'rgba(255,248,238,0.7)', lineHeight:1.6 }}>
            Pro tip: Scooter (~$5/day) + local warungs = half the cost, double the fun.
          </span>
        </div>
      </Shell>,
      { width:W, height:H }
    );
  }

  // ── SLIDE 4: Top Places ────────────────────────────────────────
  if (n === 4) {
    return new ImageResponse(
      <Shell n={n} total={TOTAL} tag="MUST-SEE">
        <div style={{ position:'absolute', right:20, top:60, fontSize:260, fontWeight:900,
          color:'rgba(255,122,0,0.05)', lineHeight:1, fontFamily:'system-ui', display:'flex' }}>04</div>

        <div style={{ fontSize:15, color:ORANGE, fontWeight:700, letterSpacing:4, marginBottom:10 }}>🗺️ TOP PLACES</div>
        <div style={{ fontSize:48, fontWeight:900, color:CREAM, lineHeight:1.05, marginBottom:6 }}>
          5 Places You<br />Cannot Skip
        </div>
        <div style={{ fontSize:14, color:'rgba(255,248,238,0.4)', marginBottom:28 }}>Ranked by what travellers love most</div>

        <div style={{ display:'flex', flexDirection:'column', gap:12, flex:1 }}>
          {places.map((p, i) => (
            <div key={p.name} style={{ display:'flex', alignItems:'center', gap:18,
              background: i === 0 ? `${ORANGE}22` : GLASS,
              border: i === 0 ? `1px solid ${ORANGE}50` : GLASS_B,
              borderRadius:18, padding:'16px 20px' }}>
              {/* Rank */}
              <div style={{ width:52, height:52, borderRadius:14, flexShrink:0,
                background: i === 0 ? ORANGE : 'rgba(255,122,0,0.2)',
                border:`1px solid ${ORANGE}50`,
                display:'flex', alignItems:'center', justifyContent:'center' }}>
                <span style={{ fontSize:20, fontWeight:900, color: i === 0 ? '#fff' : AMBER }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
              </div>
              <span style={{ fontSize:28, flexShrink:0 }}>{p.icon}</span>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:17, fontWeight:800, color:CREAM, lineHeight:1.2, marginBottom:3 }}>{p.name}</div>
                <div style={{ fontSize:11, color:'rgba(255,248,238,0.45)' }}>{p.category} · {p.duration}</div>
              </div>
              {i === 0 && (
                <div style={{ background:ORANGE, borderRadius:12, padding:'4px 10px', flexShrink:0 }}>
                  <span style={{ fontSize:9, color:'#fff', fontWeight:700 }}>TOP PICK</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </Shell>,
      { width:W, height:H }
    );
  }

  // ── SLIDE 5: Where to Stay ─────────────────────────────────────
  if (n === 5) {
    const priceMap: Record<string,string> = { '$':'Budget','$$':'Mid-range','$$$':'Upscale','$$$$':'Luxury' };
    return new ImageResponse(
      <Shell n={n} total={TOTAL} tag="WHERE TO STAY">
        <div style={{ position:'absolute', right:20, top:60, fontSize:260, fontWeight:900,
          color:'rgba(255,122,0,0.05)', lineHeight:1, fontFamily:'system-ui', display:'flex' }}>05</div>

        <div style={{ fontSize:15, color:ORANGE, fontWeight:700, letterSpacing:4, marginBottom:10 }}>🏨 AREAS</div>
        <div style={{ fontSize:48, fontWeight:900, color:CREAM, lineHeight:1.05, marginBottom:6 }}>
          Which Area<br />Is Right for You?
        </div>
        <div style={{ fontSize:14, color:'rgba(255,248,238,0.4)', marginBottom:28 }}>Pick your base before booking</div>

        <div style={{ display:'flex', flexDirection:'column', gap:12, flex:1 }}>
          {hoods.map((n: any) => (
            <div key={n.name} style={{ background:GLASS, border:GLASS_B, borderRadius:18,
              padding:'16px 20px', display:'flex', gap:14, alignItems:'center' }}>
              <span style={{ fontSize:24, flexShrink:0 }}>{n.emoji ?? '📍'}</span>
              <div style={{ flex:1 }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:4 }}>
                  <span style={{ fontSize:17, fontWeight:800, color:CREAM }}>{n.name}</span>
                  {n.priceRange && (
                    <span style={{ fontSize:10, color:ORANGE, background:`${ORANGE}22`,
                      border:`1px solid ${ORANGE}44`, borderRadius:12, padding:'3px 10px', flexShrink:0 }}>
                      {n.priceRange} · {priceMap[n.priceRange] ?? ''}
                    </span>
                  )}
                </div>
                <span style={{ fontSize:12, color:'rgba(255,248,238,0.5)', lineHeight:1.4 }}>
                  {(n.vibe || n.tagline || '').slice(0, 55)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Shell>,
      { width:W, height:H }
    );
  }

  // ── SLIDE 6: Hidden Gems ───────────────────────────────────────
  if (n === 6) {
    return new ImageResponse(
      <Shell n={n} total={TOTAL} tag="HIDDEN GEMS">
        <div style={{ position:'absolute', right:20, top:60, fontSize:260, fontWeight:900,
          color:'rgba(255,122,0,0.05)', lineHeight:1, fontFamily:'system-ui', display:'flex' }}>06</div>

        <div style={{ fontSize:15, color:ORANGE, fontWeight:700, letterSpacing:4, marginBottom:10 }}>💎 HIDDEN GEMS</div>
        <div style={{ fontSize:48, fontWeight:900, color:CREAM, lineHeight:1.05, marginBottom:6 }}>
          Places Most<br />Tourists Miss
        </div>
        <div style={{ fontSize:14, color:AMBER, marginBottom:28, fontStyle:'italic' }}>
          Save this — your friends won&apos;t know these 👇
        </div>

        <div style={{ display:'flex', flexDirection:'column', gap:14, flex:1 }}>
          {gems.length > 0 ? gems.map((g, i) => (
            <div key={g.name} style={{ background: i === 0 ? `rgba(255,179,71,0.12)` : GLASS,
              border: i === 0 ? `1px solid ${AMBER}40` : GLASS_B,
              borderRadius:18, padding:'16px 20px', display:'flex', gap:14 }}>
              <span style={{ fontSize:26, flexShrink:0, marginTop:2 }}>{g.icon}</span>
              <div>
                <div style={{ fontSize:17, fontWeight:800, color:CREAM, marginBottom:3 }}>{g.name}</div>
                <div style={{ fontSize:11, color:ORANGE, marginBottom:5 }}>{g.type}</div>
                <div style={{ fontSize:12, color:'rgba(255,248,238,0.55)', lineHeight:1.5 }}>{g.why.slice(0, 80)}</div>
              </div>
            </div>
          )) : (
            <div style={{ color:'rgba(255,248,238,0.3)', fontSize:14 }}>Check tripgenius.in for the full list</div>
          )}
        </div>
      </Shell>,
      { width:W, height:H }
    );
  }

  // ── SLIDE 7: Cheatsheet (screenshot-worthy) ────────────────────
  if (n === 7) {
    return new ImageResponse(
      <Shell n={n} total={TOTAL} tag="CHEATSHEET">
        <div style={{ position:'absolute', right:20, top:60, fontSize:260, fontWeight:900,
          color:'rgba(255,122,0,0.05)', lineHeight:1, fontFamily:'system-ui', display:'flex' }}>07</div>

        <div style={{ fontSize:15, color:ORANGE, fontWeight:700, letterSpacing:4, marginBottom:10 }}>📋 CHEATSHEET</div>
        <div style={{ fontSize:48, fontWeight:900, color:CREAM, lineHeight:1.05, marginBottom:4 }}>
          {city.name} in<br />60 Seconds
        </div>
        <div style={{ fontSize:13, color:AMBER, fontStyle:'italic', marginBottom:24 }}>Screenshot this slide 📸</div>

        {/* 2-column stat grid — using flex rows since Satori doesn't support CSS grid */}
        <div style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:16 }}>
          {[
            [
              { icon:'📅', label:'Best Time',   val: city.stats.bestTime },
              { icon:'💰', label:'Daily Budget', val: city.stats.budget },
            ],
            [
              { icon:'💱', label:'Currency',     val: city.stats.currency },
              { icon:'🗣️', label:'Language',     val: city.stats.language },
            ],
          ].map((row, ri) => (
            <div key={ri} style={{ display:'flex', gap:10 }}>
              {row.map(f => (
                <div key={f.label} style={{ flex:1, background:GLASS, border:GLASS_B, borderRadius:16, padding:'14px 16px',
                  display:'flex', flexDirection:'column', gap:4 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                    <span style={{ fontSize:14 }}>{f.icon}</span>
                    <span style={{ fontSize:9, color:'rgba(255,248,238,0.35)', letterSpacing:2 }}>{f.label.toUpperCase()}</span>
                  </div>
                  <span style={{ fontSize:14, fontWeight:700, color:AMBER }}>{f.val}</span>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div style={{ display:'flex', flexDirection:'column', gap:8, flex:1 }}>
          {tips.map((tip, i) => (
            <div key={i} style={{ display:'flex', gap:12, alignItems:'flex-start',
              background:GLASS, border:GLASS_B, borderRadius:14, padding:'12px 16px' }}>
              <span style={{ color:ORANGE, fontSize:15, marginTop:1, flexShrink:0, fontWeight:700 }}>✓</span>
              <span style={{ fontSize:13, color:'rgba(255,248,238,0.75)', lineHeight:1.5 }}>{tip}</span>
            </div>
          ))}
        </div>
      </Shell>,
      { width:W, height:H }
    );
  }

  // ── SLIDE 8: CTA ───────────────────────────────────────────────
  return new ImageResponse(
    <div style={{ width:W, height:H, position:'relative', display:'flex', flexDirection:'column',
      alignItems:'center', justifyContent:'center', overflow:'hidden',
      background:`linear-gradient(145deg, ${DARK} 0%, #1a0800 50%, ${DARK} 100%)` }}>

      {/* Decorative rings */}
      {[300, 460, 620].map((s, i) => (
        <div key={s} style={{ position:'absolute', width:s, height:s, borderRadius:'50%',
          border:`1px solid ${ORANGE}${['50','30','15'][i]}`,
          top:'50%', left:'50%', transform:'translate(-50%,-50%)', display:'flex' }} />
      ))}

      {/* Warm glow center */}
      <div style={{ position:'absolute', width:400, height:400, borderRadius:'50%',
        background:`radial-gradient(circle, ${ORANGE}28 0%, transparent 65%)`,
        top:'50%', left:'50%', transform:'translate(-50%,-50%)', display:'flex' }} />

      {/* Top line */}
      <div style={{ position:'absolute', top:0, left:0, right:0, height:3,
        background:`linear-gradient(to right, transparent, ${ORANGE}, ${AMBER}, transparent)`, display:'flex' }} />

      <div style={{ position:'relative', display:'flex', flexDirection:'column',
        alignItems:'center', textAlign:'center', padding:'60px 80px' }}>

        <span style={{ fontSize:68, marginBottom:20 }}>{city.flag}</span>

        <div style={{ fontSize:13, color:ORANGE, letterSpacing:4, fontWeight:700, marginBottom:14 }}>
          FREE TRAVEL GUIDE
        </div>

        <div style={{ fontSize:54, fontWeight:900, color:CREAM, lineHeight:1.05, marginBottom:16 }}>
          Ready to Plan<br />Your {city.name} Trip?
        </div>

        <div style={{ fontSize:15, color:'rgba(255,248,238,0.5)', marginBottom:40, lineHeight:1.9 }}>
          Full guide · Things to do · Where to stay<br />
          Budget tips · Hidden gems · Local food
        </div>

        <div style={{ background:ORANGE, borderRadius:40, padding:'18px 44px', marginBottom:28, display:'flex' }}>
          <span style={{ fontSize:18, fontWeight:800, color:'#fff', letterSpacing:0.5 }}>
            tripgenius.in/cities/{slug}
          </span>
        </div>

        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:8 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <Logo />
          </div>
          <div style={{ fontSize:13, color:'rgba(255,248,238,0.35)', lineHeight:1.9 }}>
            💾 Save · 📤 Share with your travel buddy<br />
            🔔 Follow @tripgenius.in for more
          </div>
        </div>
      </div>
    </div>,
    { width:W, height:H }
  );
}

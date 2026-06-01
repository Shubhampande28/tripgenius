import { ImageResponse } from 'next/og';
import { getCityBySlug } from '@/lib/cities';

export const runtime = 'edge';

const ORANGE = '#FF7A00';
const DARK   = '#0D0D0D';
const GLASS  = 'rgba(255,255,255,0.09)';
const GLASS_B = '1px solid rgba(255,255,255,0.15)';
const W = 1080, H = 1350;

function Logo() {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
      <div style={{ width:28,height:28,borderRadius:8,background:ORANGE,display:'flex',alignItems:'center',justifyContent:'center' }}>
        <span style={{ fontSize:14 }}>✈️</span>
      </div>
      <span style={{ fontSize:13,fontWeight:700,color:'rgba(255,255,255,0.75)',letterSpacing:2 }}>TRIPGENIUS</span>
    </div>
  );
}

function TopBar({ label, slide, total }: { label: string; slide: number; total: number }) {
  return (
    <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:32 }}>
      <Logo />
      <div style={{ display:'flex',alignItems:'center',gap:12 }}>
        <span style={{ fontSize:10,color:'rgba(255,255,255,0.4)',letterSpacing:3 }}>{label}</span>
        <span style={{ fontSize:10,color:'rgba(255,255,255,0.3)' }}>{slide}/{total}</span>
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

  const slide = parseInt(slideStr, 10);
  if (isNaN(slide) || slide < 1 || slide > 9) return new Response('Slide must be 1–9', { status: 400 });

  const heroImg  = city.heroImage || city.image;
  const mbm      = city.monthByMonth;
  const places   = (city.thingsToDo ?? []).slice(0, 5);
  const hoods    = (city.neighbourhoods ?? city.areas ?? []).slice(0, 4);
  const rests    = (city.restaurants ?? []).slice(0, 4);
  const gems     = (city.offbeatPlaces ?? []).slice(0, 4);
  const tips     = (city.proTips ?? []).slice(0, 5);

  // ── Base shell for slides 2–8 ──────────────────────────────────
  function Shell({ children, label }: { children: React.ReactNode; label: string }) {
    return (
      <div style={{ width:W,height:H,display:'flex',flexDirection:'column',position:'relative',
        background:`linear-gradient(155deg,#111 0%,#1a0e05 100%)`,overflow:'hidden',padding:'44px 52px' }}>
        <div style={{ position:'absolute',inset:0,background:`radial-gradient(ellipse 80% 50% at 5% 100%, ${ORANGE}18, transparent)`,display:'flex' }} />
        <div style={{ position:'absolute',top:0,left:0,right:0,height:4,background:`linear-gradient(to right,${ORANGE},#FFB347,transparent)`,display:'flex' }} />
        <div style={{ position:'relative',display:'flex',flexDirection:'column',flex:1 }}>
          <TopBar label={label} slide={slide} total={9} />
          {children}
        </div>
        <div style={{ position:'relative',display:'flex',justifyContent:'space-between',alignItems:'center',
          borderTop:'1px solid rgba(255,255,255,0.1)',paddingTop:18,marginTop:20 }}>
          <Logo />
          <span style={{ fontSize:11,color:'rgba(255,255,255,0.35)',letterSpacing:1 }}>tripgenius.in</span>
        </div>
      </div>
    );
  }

  // ── Slide 1: Hook ──────────────────────────────────────────────
  if (slide === 1) {
    return new ImageResponse(
      <div style={{ width:W,height:H,position:'relative',display:'flex',flexDirection:'column',overflow:'hidden' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={heroImg} alt="" style={{ position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover' }} />
        <div style={{ position:'absolute',inset:0,background:'linear-gradient(165deg,rgba(0,0,0,0.25) 0%,rgba(0,0,0,0.92) 100%)',display:'flex' }} />
        <div style={{ position:'absolute',top:0,left:0,right:0,height:5,background:`linear-gradient(to right,${ORANGE},#FFB347)`,display:'flex' }} />

        <div style={{ position:'relative',display:'flex',flexDirection:'column',padding:'44px 52px',height:'100%' }}>
          <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'auto' }}>
            <Logo />
            <span style={{ fontSize:11,color:'rgba(255,255,255,0.4)',letterSpacing:2 }}>TRAVEL GUIDE 2025</span>
          </div>

          <div style={{ display:'flex',flexDirection:'column',marginBottom:40 }}>
            <div style={{ display:'flex',alignItems:'center',gap:12,marginBottom:18 }}>
              <span style={{ fontSize:13,color:ORANGE,fontWeight:700,letterSpacing:4 }}>YOUR COMPLETE GUIDE TO</span>
            </div>
            <div style={{ display:'flex',alignItems:'baseline',gap:18,marginBottom:12 }}>
              <span style={{ fontSize:88,fontWeight:900,color:'#fff',lineHeight:1 }}>{city.name}</span>
              <span style={{ fontSize:60 }}>{city.flag}</span>
            </div>
            <div style={{ fontSize:20,color:'#FFB347',fontStyle:'italic',marginBottom:20 }}>{city.tagline}</div>
            <div style={{ fontSize:15,color:'rgba(255,255,255,0.6)',lineHeight:1.7,maxWidth:560 }}>
              {city.heroDescription?.slice(0, 130)}...
            </div>
          </div>

          <div style={{ display:'flex',gap:12,marginBottom:36 }}>
            {[city.stats.bestTime, city.stats.budget, `${city.vibes?.[0] ?? 'Travel'}`].map(v => (
              <div key={v} style={{ background:GLASS,border:GLASS_B,borderRadius:24,padding:'10px 18px' }}>
                <span style={{ fontSize:13,color:'rgba(255,255,255,0.8)' }}>{v}</span>
              </div>
            ))}
          </div>

          <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',
            borderTop:'1px solid rgba(255,255,255,0.12)',paddingTop:22 }}>
            <span style={{ fontSize:14,color:'rgba(255,255,255,0.45)' }}>Swipe for the full guide →</span>
            <div style={{ background:ORANGE,borderRadius:28,padding:'12px 28px',display:'flex',alignItems:'center' }}>
              <span style={{ fontSize:14,fontWeight:700,color:'#fff' }}>Slide 1 of 9 →</span>
            </div>
          </div>
        </div>
      </div>,
      { width:W, height:H }
    );
  }

  // ── Slide 2: Best Time ─────────────────────────────────────────
  if (slide === 2) {
    const groups = [
      { label:'✅ BEST',  months: mbm?.months.filter(m=>m.rating==='excellent').map(m=>m.short)??[], color:'#00C9A7' },
      { label:'👍 GOOD',  months: mbm?.months.filter(m=>m.rating==='good').map(m=>m.short)??[],     color:'#60A5FA' },
      { label:'🟡 OKAY',  months: mbm?.months.filter(m=>m.rating==='average').map(m=>m.short)??[],  color:'#FFD166' },
      { label:'❌ AVOID', months: mbm?.months.filter(m=>m.rating==='avoid').map(m=>m.short)??[],    color:'#F87171' },
    ].filter(g=>g.months.length>0);

    return new ImageResponse(
      <Shell label="BEST TIME TO VISIT">
        <div style={{ fontSize:42,fontWeight:800,color:'#fff',lineHeight:1.1,marginBottom:8 }}>When to Visit<br />{city.name} 📅</div>
        <div style={{ fontSize:14,color:'rgba(255,255,255,0.45)',marginBottom:36 }}>{mbm?.summary?.slice(0,90)??`Best: ${city.stats.bestTime}`}</div>
        <div style={{ display:'flex',flexDirection:'column',gap:14,flex:1 }}>
          {groups.map(g=>(
            <div key={g.label} style={{ background:GLASS,border:GLASS_B,borderRadius:18,padding:'20px 22px',display:'flex',alignItems:'center',gap:18 }}>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:12,color:g.color,fontWeight:700,letterSpacing:2,marginBottom:10 }}>{g.label}</div>
                <div style={{ display:'flex',gap:10,flexWrap:'wrap' }}>
                  {g.months.map(m=>(
                    <span key={m} style={{ fontSize:16,color:'#fff',background:`${g.color}25`,border:`1px solid ${g.color}50`,borderRadius:24,padding:'6px 14px' }}>{m}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ background:`${ORANGE}20`,border:`1px solid ${ORANGE}40`,borderRadius:16,padding:'16px 20px',
          display:'flex',gap:12,alignItems:'flex-start',marginTop:20 }}>
          <span style={{ fontSize:22 }}>💡</span>
          <span style={{ fontSize:14,color:'rgba(255,255,255,0.75)',lineHeight:1.6 }}>
            Sweet spot: <strong style={{ color:'#FFB347' }}>{city.stats.bestTime}</strong> — great weather, fewer tourists than peak season.
          </span>
        </div>
      </Shell>,
      { width:W, height:H }
    );
  }

  // ── Slide 3: Budget ────────────────────────────────────────────
  if (slide === 3) {
    const tiers = [
      { icon:'🎒', label:'Budget Traveller',  range:'$40–70/day',  note:'Hostel · Street food · Scooter' },
      { icon:'✈️', label:'Mid-Range',          range:'$80–150/day', note:'Private villa · Restaurants · Tours', highlight:true },
      { icon:'👑', label:'Luxury',             range:'$200+/day',   note:'5-star resort · Driver · Fine dining' },
    ];
    return new ImageResponse(
      <Shell label="BUDGET GUIDE">
        <div style={{ fontSize:42,fontWeight:800,color:'#fff',lineHeight:1.1,marginBottom:8 }}>How Much Does<br />{city.name} Cost? 💰</div>
        <div style={{ fontSize:14,color:'rgba(255,255,255,0.45)',marginBottom:36 }}>Daily budget: <strong style={{ color:'#FFB347' }}>{city.stats.budget}</strong></div>
        <div style={{ display:'flex',flexDirection:'column',gap:14,flex:1 }}>
          {tiers.map(t=>(
            <div key={t.label} style={{ background: t.highlight ? `${ORANGE}25` : GLASS,
              border: t.highlight ? `1px solid ${ORANGE}55` : GLASS_B,
              borderRadius:18,padding:'22px 24px',display:'flex',gap:18,alignItems:'center' }}>
              <span style={{ fontSize:32 }}>{t.icon}</span>
              <div style={{ flex:1 }}>
                <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:6 }}>
                  <span style={{ fontSize:16,fontWeight:700,color: t.highlight ? '#FFB347' : '#fff' }}>{t.label}</span>
                  <span style={{ fontSize:22,fontWeight:800,color: t.highlight ? ORANGE : 'rgba(255,255,255,0.8)' }}>{t.range}</span>
                </div>
                <span style={{ fontSize:13,color:'rgba(255,255,255,0.5)' }}>{t.note}</span>
              </div>
            </div>
          ))}
        </div>
        <div style={{ background:GLASS,border:GLASS_B,borderRadius:16,padding:'16px 20px',display:'flex',gap:12,marginTop:20 }}>
          <span style={{ fontSize:22 }}>🛵</span>
          <span style={{ fontSize:14,color:'rgba(255,255,255,0.65)',lineHeight:1.6 }}>
            Pro tip: Rent a scooter (~$5/day) and eat at local warungs — cuts costs in half.
          </span>
        </div>
      </Shell>,
      { width:W, height:H }
    );
  }

  // ── Slide 4: Top 5 Places ──────────────────────────────────────
  if (slide === 4) {
    return new ImageResponse(
      <Shell label="MUST-SEE PLACES">
        <div style={{ fontSize:42,fontWeight:800,color:'#fff',lineHeight:1.1,marginBottom:8 }}>5 Places You<br />Cannot Skip 🗺️</div>
        <div style={{ fontSize:14,color:'rgba(255,255,255,0.45)',marginBottom:32 }}>Ranked by what travellers love most</div>
        <div style={{ display:'flex',flexDirection:'column',gap:14,flex:1 }}>
          {places.map((p,i)=>(
            <div key={p.name} style={{ display:'flex',alignItems:'center',gap:18,background:GLASS,border:GLASS_B,borderRadius:18,padding:'18px 22px' }}>
              <div style={{ width:48,height:48,borderRadius:14,background: i===0?ORANGE:`${ORANGE}30`,
                border:`1px solid ${ORANGE}55`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}>
                <span style={{ fontSize:18,fontWeight:800,color: i===0?'#fff':'#FFB347' }}>{String(i+1).padStart(2,'0')}</span>
              </div>
              <span style={{ fontSize:28,flexShrink:0 }}>{p.icon}</span>
              <div style={{ display:'flex',flexDirection:'column',flex:1 }}>
                <span style={{ fontSize:18,fontWeight:700,color:'#fff',lineHeight:1.2 }}>{p.name}</span>
                <span style={{ fontSize:12,color:'rgba(255,255,255,0.45)',marginTop:3 }}>{p.category} · {p.duration}</span>
              </div>
            </div>
          ))}
        </div>
      </Shell>,
      { width:W, height:H }
    );
  }

  // ── Slide 5: Where to Stay ─────────────────────────────────────
  if (slide === 5) {
    const priceMap: Record<string,string> = { '$':'Budget','$$':'Mid-range','$$$':'Upscale','$$$$':'Luxury' };
    return new ImageResponse(
      <Shell label="WHERE TO STAY">
        <div style={{ fontSize:42,fontWeight:800,color:'#fff',lineHeight:1.1,marginBottom:8 }}>Which Area Is<br />Right for You? 🏨</div>
        <div style={{ fontSize:14,color:'rgba(255,255,255,0.45)',marginBottom:32 }}>Pick your base before booking</div>
        <div style={{ display:'flex',flexDirection:'column',gap:12,flex:1 }}>
          {(hoods as any[]).map((n)=>(
            <div key={n.name} style={{ background:GLASS,border:GLASS_B,borderRadius:18,padding:'18px 22px',display:'flex',gap:16,alignItems:'flex-start' }}>
              <span style={{ fontSize:26,marginTop:2 }}>{n.emoji ?? '📍'}</span>
              <div style={{ flex:1 }}>
                <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:5 }}>
                  <span style={{ fontSize:18,fontWeight:700,color:'#fff' }}>{n.name}</span>
                  {n.priceRange && (
                    <span style={{ fontSize:11,color:ORANGE,background:`${ORANGE}22`,border:`1px solid ${ORANGE}44`,borderRadius:12,padding:'3px 10px' }}>
                      {n.priceRange} · {priceMap[n.priceRange]??''}
                    </span>
                  )}
                </div>
                <span style={{ fontSize:13,color:'rgba(255,255,255,0.5)',lineHeight:1.5 }}>
                  {(n.vibe||n.tagline||'').slice(0,65)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Shell>,
      { width:W, height:H }
    );
  }

  // ── Slide 6: Food ──────────────────────────────────────────────
  if (slide === 6) {
    return new ImageResponse(
      <Shell label="FOOD GUIDE">
        <div style={{ fontSize:42,fontWeight:800,color:'#fff',lineHeight:1.1,marginBottom:8 }}>What to Eat<br />in {city.name} 🍜</div>
        <div style={{ fontSize:14,color:'rgba(255,255,255,0.45)',marginBottom:32 }}>From street stalls to splurge-worthy</div>
        <div style={{ display:'flex',flexDirection:'column',gap:13,flex:1 }}>
          {rests.map(r=>(
            <div key={r.name} style={{ background:GLASS,border:GLASS_B,borderRadius:18,padding:'18px 22px' }}>
              <div style={{ display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:5 }}>
                <span style={{ fontSize:17,fontWeight:700,color:'#fff' }}>🍴 {r.name}</span>
                <span style={{ fontSize:12,color:'rgba(255,255,255,0.4)',flexShrink:0,marginLeft:12 }}>{r.priceRange}</span>
              </div>
              <div style={{ fontSize:12,color:'#FFB347',fontStyle:'italic',marginBottom:4 }}>{r.cuisine}</div>
              <div style={{ fontSize:12,color:'rgba(255,255,255,0.5)',lineHeight:1.5 }}>Must try: {r.mustTry}</div>
            </div>
          ))}
        </div>
      </Shell>,
      { width:W, height:H }
    );
  }

  // ── Slide 7: Hidden Gems ───────────────────────────────────────
  if (slide === 7) {
    return new ImageResponse(
      <Shell label="HIDDEN GEMS">
        <div style={{ fontSize:42,fontWeight:800,color:'#fff',lineHeight:1.1,marginBottom:8 }}>Places Most<br />Tourists Miss 💎</div>
        <div style={{ fontSize:14,color:'rgba(255,255,255,0.45)',marginBottom:32 }}>Save this — your friends won&apos;t know these</div>
        <div style={{ display:'flex',flexDirection:'column',gap:13,flex:1 }}>
          {gems.length>0 ? gems.map(g=>(
            <div key={g.name} style={{ background:GLASS,border:GLASS_B,borderRadius:18,padding:'18px 22px',display:'flex',gap:16 }}>
              <span style={{ fontSize:28,flexShrink:0 }}>{g.icon}</span>
              <div>
                <div style={{ fontSize:17,fontWeight:700,color:'#fff',marginBottom:3 }}>{g.name}</div>
                <div style={{ fontSize:12,color:ORANGE,marginBottom:4 }}>{g.type}</div>
                <div style={{ fontSize:12,color:'rgba(255,255,255,0.5)',lineHeight:1.5 }}>{g.why.slice(0,90)}</div>
              </div>
            </div>
          )) : (
            <div style={{ color:'rgba(255,255,255,0.3)',fontSize:14 }}>Visit tripgenius.in for the full list</div>
          )}
        </div>
      </Shell>,
      { width:W, height:H }
    );
  }

  // ── Slide 8: Cheatsheet ────────────────────────────────────────
  if (slide === 8) {
    return new ImageResponse(
      <Shell label="TRAVEL CHEATSHEET">
        <div style={{ fontSize:42,fontWeight:800,color:'#fff',lineHeight:1.1,marginBottom:4 }}>{city.name}<br />Cheatsheet 📋</div>
        <div style={{ fontSize:13,color:'#FFB347',fontStyle:'italic',marginBottom:28 }}>Screenshot this slide</div>
        <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:16 }}>
          {[
            { label:'Best Time', val:city.stats.bestTime },
            { label:'Daily Budget', val:city.stats.budget },
            { label:'Currency', val:city.stats.currency },
            { label:'Language', val:city.stats.language },
          ].map(f=>(
            <div key={f.label} style={{ background:GLASS,border:GLASS_B,borderRadius:14,padding:'14px 16px' }}>
              <div style={{ fontSize:10,color:'rgba(255,255,255,0.4)',letterSpacing:2,marginBottom:5 }}>{f.label.toUpperCase()}</div>
              <div style={{ fontSize:15,fontWeight:700,color:'#FFB347' }}>{f.val}</div>
            </div>
          ))}
        </div>
        <div style={{ display:'flex',flexDirection:'column',gap:8,flex:1 }}>
          {tips.map((tip,i)=>(
            <div key={i} style={{ display:'flex',gap:12,alignItems:'flex-start',background:GLASS,border:GLASS_B,borderRadius:14,padding:'13px 16px' }}>
              <span style={{ color:ORANGE,fontSize:16,marginTop:1,flexShrink:0 }}>✓</span>
              <span style={{ fontSize:14,color:'rgba(255,255,255,0.75)',lineHeight:1.5 }}>{tip}</span>
            </div>
          ))}
        </div>
      </Shell>,
      { width:W, height:H }
    );
  }

  // ── Slide 9: CTA ───────────────────────────────────────────────
  return new ImageResponse(
    <div style={{ width:W,height:H,position:'relative',display:'flex',flexDirection:'column',
      alignItems:'center',justifyContent:'center',overflow:'hidden',
      background:`linear-gradient(145deg, #0D0D0D 0%, #1a0800 50%, #0D0D0D 100%)` }}>
      {[280,420,560].map((s,i)=>(
        <div key={s} style={{ position:'absolute',width:s,height:s,borderRadius:'50%',
          border:`1px solid ${ORANGE}${['44','28','14'][i]}`,
          top:'50%',left:'50%',transform:'translate(-50%,-50%)',display:'flex' }} />
      ))}
      <div style={{ position:'absolute',inset:0,background:`radial-gradient(circle at 50% 50%, ${ORANGE}22 0%, transparent 60%)`,display:'flex' }} />
      <div style={{ position:'absolute',top:0,left:0,right:0,height:5,background:`linear-gradient(to right,${ORANGE},#FFB347)`,display:'flex' }} />

      <div style={{ position:'relative',display:'flex',flexDirection:'column',alignItems:'center',textAlign:'center',padding:'60px 70px' }}>
        <span style={{ fontSize:64,marginBottom:20 }}>{city.flag}</span>
        <div style={{ fontSize:14,color:ORANGE,letterSpacing:4,fontWeight:700,marginBottom:14 }}>FREE TRAVEL GUIDE</div>
        <div style={{ fontSize:50,fontWeight:900,color:'#fff',lineHeight:1.1,marginBottom:16 }}>
          Plan Your<br />{city.name} Trip 🌴
        </div>
        <div style={{ fontSize:15,color:'rgba(255,255,255,0.5)',marginBottom:40,lineHeight:1.8 }}>
          Things to do · Where to stay<br />Budget · Hidden gems · Local tips
        </div>

        <div style={{ background:ORANGE,borderRadius:36,padding:'16px 40px',marginBottom:28,display:'flex' }}>
          <span style={{ fontSize:16,fontWeight:700,color:'#fff',letterSpacing:0.5 }}>
            tripgenius.in/cities/{slug}
          </span>
        </div>

        <div style={{ fontSize:14,color:'rgba(255,255,255,0.4)',lineHeight:2 }}>
          💾 Save this post for your trip<br />
          🔔 Follow @tripgenius.in for more free guides
        </div>
      </div>
    </div>,
    { width:W, height:H }
  );
}

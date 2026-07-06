'use client';

import { useState } from 'react';
import { City } from '@/lib/types';
import Image from 'next/image';

// ── Slide dimensions (scaled for screen, screenshot at 1080×1350) ──
const W = 540;
const H = 675;

interface SlideProps { city: City; }

// ── Shared design tokens ───────────────────────────────────────────
const ORANGE  = '#FF7A00';
const ORANGE2 = '#FF9A3C';
const DARK    = '#0D0D0D';
const GLASS   = 'rgba(255,255,255,0.10)';
const GLASS_B = '1px solid rgba(255,255,255,0.18)';

function Logo() {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:6, opacity:0.9 }}>
      <div style={{ width:22, height:22, borderRadius:6, background:ORANGE, display:'flex', alignItems:'center', justifyContent:'center' }}>
        <span style={{ fontSize:12 }}>✈️</span>
      </div>
      <span style={{ fontSize:11, fontWeight:700, color:'#fff', letterSpacing:1.5, textTransform:'uppercase' }}>TripGenius</span>
    </div>
  );
}

// ── Slide 1: Hook ──────────────────────────────────────────────────
function Slide1({ city }: SlideProps) {
  return (
    <div style={{ width:W, height:H, position:'relative', overflow:'hidden', borderRadius:16, background:DARK, fontFamily:'Georgia,serif' }}>
      <Image src={city.heroImage || city.image} alt={city.name} fill style={{ objectFit:'cover', opacity:0.55 }} sizes={`${W}px`} />
      {/* gradient overlay */}
      <div style={{ position:'absolute', inset:0, background:'linear-gradient(170deg,rgba(0,0,0,0.2) 0%,rgba(0,0,0,0.7) 100%)' }} />

      {/* top bar */}
      <div style={{ position:'absolute', top:24, left:24, right:24, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <Logo />
        <span style={{ fontSize:11, color:'rgba(255,255,255,0.6)', fontFamily:'system-ui', letterSpacing:1 }}>TRAVEL GUIDE 2025</span>
      </div>

      {/* flag + country */}
      <div style={{ position:'absolute', top:'38%', left:24, right:24 }}>
        <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:GLASS, border:GLASS_B, borderRadius:20, padding:'6px 14px', marginBottom:20 }}>
          <span style={{ fontSize:18 }}>{city.flag}</span>
          <span style={{ fontSize:11, color:'rgba(255,255,255,0.8)', fontFamily:'system-ui', letterSpacing:2, textTransform:'uppercase' }}>{city.country}</span>
        </div>

        <div>
          <div style={{ fontSize:52, fontWeight:700, color:'#fff', lineHeight:1.05, marginBottom:8 }}>{city.name}</div>
          <div style={{ fontSize:16, color:ORANGE2, fontStyle:'italic', marginBottom:20 }}>{city.tagline}</div>
          <div style={{ fontSize:13, color:'rgba(255,255,255,0.65)', lineHeight:1.6, maxWidth:420, fontFamily:'system-ui' }}>
            {city.heroDescription?.slice(0, 120)}...
          </div>
        </div>
      </div>

      {/* bottom hook */}
      <div style={{ position:'absolute', bottom:0, left:0, right:0, padding:'20px 24px', background:'linear-gradient(to top,rgba(0,0,0,0.85),transparent)', display:'flex', justifyContent:'space-between', alignItems:'flex-end' }}>
        <div style={{ fontSize:13, color:'rgba(255,255,255,0.7)', fontFamily:'system-ui' }}>
          Everything you need to know
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:6, background:ORANGE, borderRadius:20, padding:'8px 18px' }}>
          <span style={{ fontSize:12, color:'#fff', fontWeight:700, fontFamily:'system-ui' }}>Swipe →</span>
        </div>
      </div>
    </div>
  );
}

// ── Slide 2: Best Time ─────────────────────────────────────────────
function Slide2({ city }: SlideProps) {
  const mbm = city.monthByMonth;
  const best  = mbm?.months.filter(m => m.rating === 'excellent').map(m => m.short) ?? [];
  const good  = mbm?.months.filter(m => m.rating === 'good').map(m => m.short) ?? [];
  const avg   = mbm?.months.filter(m => m.rating === 'average').map(m => m.short) ?? [];
  const avoid = mbm?.months.filter(m => m.rating === 'avoid').map(m => m.short) ?? [];

  const groups = [
    { label:'BEST', months: best,  color:'#00C9A7', icon:'✅' },
    { label:'GOOD', months: good,  color:'#60A5FA', icon:'👍' },
    { label:'OKAY', months: avg,   color:'#FFD166', icon:'🟡' },
    { label:'AVOID',months: avoid, color:'#F87171', icon:'❌' },
  ].filter(g => g.months.length > 0);

  return (
    <SlideShell index={2} total={9} label="WHEN TO VISIT" city={city}>
      <div style={{ fontSize:32, fontWeight:700, color:'#fff', marginBottom:6, fontFamily:'Georgia,serif' }}>
        Best Time to Visit<br />{city.name}
      </div>
      <div style={{ fontSize:13, color:'rgba(255,255,255,0.55)', fontFamily:'system-ui', marginBottom:28 }}>
        {mbm?.summary?.slice(0, 100) ?? `Plan around ${city.stats.bestTime}`}
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
        {groups.map(g => (
          <div key={g.label} style={{ background:GLASS, border:GLASS_B, borderRadius:14, padding:'14px 18px', display:'flex', alignItems:'center', gap:16 }}>
            <span style={{ fontSize:20 }}>{g.icon}</span>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:10, color:g.color, fontWeight:700, fontFamily:'system-ui', letterSpacing:2, marginBottom:4 }}>{g.label}</div>
              <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                {g.months.map(m => (
                  <span key={m} style={{ fontSize:13, color:'#fff', fontFamily:'system-ui', background:`${g.color}22`, border:`1px solid ${g.color}44`, borderRadius:20, padding:'3px 10px' }}>{m}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop:20, background:`${ORANGE}22`, border:`1px solid ${ORANGE}44`, borderRadius:12, padding:'12px 16px', display:'flex', gap:10, alignItems:'flex-start' }}>
        <span style={{ fontSize:18 }}>💡</span>
        <span style={{ fontSize:12, color:'rgba(255,255,255,0.8)', fontFamily:'system-ui', lineHeight:1.5 }}>
          Best overall: <strong style={{ color:ORANGE2 }}>{city.stats.bestTime}</strong> — ideal weather, fewer crowds than peak.
        </span>
      </div>
    </SlideShell>
  );
}

// ── Slide 3: Budget ────────────────────────────────────────────────
function Slide3({ city }: SlideProps) {
  const tiers = [
    { icon:'🎒', label:'Budget Traveller', range:'$40–70/day',  desc:'Guesthouse · Street food · Scooter' },
    { icon:'✈️', label:'Mid-Range',        range:'$80–150/day', desc:'Private villa · Restaurants · Tours' },
    { icon:'👑', label:'Luxury',           range:'$200+/day',   desc:'5-star resort · Driver · Fine dining' },
  ];
  return (
    <SlideShell index={3} total={9} label="BUDGET GUIDE" city={city}>
      <div style={{ fontSize:32, fontWeight:700, color:'#fff', marginBottom:6, fontFamily:'Georgia,serif' }}>
        {city.name} Budget<br />Breakdown 2025
      </div>
      <div style={{ fontSize:12, color:'rgba(255,255,255,0.55)', fontFamily:'system-ui', marginBottom:28 }}>
        Daily cost: <strong style={{ color:ORANGE2 }}>{city.stats.budget}</strong>
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
        {tiers.map((t, i) => (
          <div key={t.label} style={{ background: i === 1 ? `${ORANGE}22` : GLASS, border: i === 1 ? `1px solid ${ORANGE}44` : GLASS_B, borderRadius:14, padding:'16px 18px', display:'flex', gap:14, alignItems:'center' }}>
            <span style={{ fontSize:24 }}>{t.icon}</span>
            <div style={{ flex:1 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:4 }}>
                <span style={{ fontSize:13, fontWeight:700, color: i === 1 ? ORANGE2 : '#fff', fontFamily:'system-ui' }}>{t.label}</span>
                <span style={{ fontSize:16, fontWeight:700, color: i === 1 ? ORANGE : 'rgba(255,255,255,0.9)', fontFamily:'system-ui' }}>{t.range}</span>
              </div>
              <div style={{ fontSize:11, color:'rgba(255,255,255,0.55)', fontFamily:'system-ui' }}>{t.desc}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop:16, background:GLASS, border:GLASS_B, borderRadius:12, padding:'12px 16px', display:'flex', gap:10 }}>
        <span style={{ fontSize:16 }}>💳</span>
        <span style={{ fontSize:11, color:'rgba(255,255,255,0.7)', fontFamily:'system-ui', lineHeight:1.5 }}>
          Tip: Eat at local warungs — same food, 5× cheaper. Scooter rental: ~$5/day.
        </span>
      </div>
    </SlideShell>
  );
}

// ── Slide 4: Top Experiences ────────────────────────────────────────
function Slide4({ city }: SlideProps) {
  const top5 = city.thingsToDo?.slice(0, 5) ?? [];
  return (
    <SlideShell index={4} total={9} label="TOP EXPERIENCES" city={city}>
      <div style={{ fontSize:32, fontWeight:700, color:'#fff', marginBottom:20, fontFamily:'Georgia,serif' }}>
        5 Experiences<br />You Cannot Skip
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
        {top5.map((item, i) => (
          <div key={item.name} style={{ display:'flex', alignItems:'center', gap:14, background:GLASS, border:GLASS_B, borderRadius:14, padding:'14px 16px' }}>
            <div style={{ width:36, height:36, borderRadius:10, background:`${ORANGE}33`, border:`1px solid ${ORANGE}55`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <span style={{ fontSize:14, fontWeight:800, color:ORANGE, fontFamily:'system-ui' }}>
                {String(i + 1).padStart(2, '0')}
              </span>
            </div>
            <span style={{ fontSize:20 }}>{item.icon}</span>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:13, fontWeight:700, color:'#fff', fontFamily:'system-ui', marginBottom:2 }}>{item.name}</div>
              <div style={{ fontSize:10, color:'rgba(255,255,255,0.5)', fontFamily:'system-ui' }}>{item.category} · {item.duration}</div>
            </div>
          </div>
        ))}
      </div>
    </SlideShell>
  );
}

// ── Slide 5: Where to Stay ─────────────────────────────────────────
function Slide5({ city }: SlideProps) {
  const hoods = city.neighbourhoods?.slice(0, 4) ?? city.areas?.slice(0, 4) ?? [];
  const priceMap: Record<string, string> = { '$':'Budget', '$$':'Mid-range', '$$$':'Upscale', '$$$$':'Luxury' };
  return (
    <SlideShell index={5} total={9} label="WHERE TO STAY" city={city}>
      <div style={{ fontSize:32, fontWeight:700, color:'#fff', marginBottom:6, fontFamily:'Georgia,serif' }}>
        Which Area Is<br />Right for You?
      </div>
      <div style={{ fontSize:12, color:'rgba(255,255,255,0.5)', fontFamily:'system-ui', marginBottom:22 }}>Pick your base before you book</div>
      <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
        {hoods.map((n: any) => (
          <div key={n.name} style={{ background:GLASS, border:GLASS_B, borderRadius:14, padding:'13px 16px', display:'flex', gap:12, alignItems:'flex-start' }}>
            <span style={{ fontSize:20, marginTop:2 }}>{n.emoji ?? '📍'}</span>
            <div style={{ flex:1 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:3 }}>
                <span style={{ fontSize:14, fontWeight:700, color:'#fff', fontFamily:'system-ui' }}>{n.name}</span>
                {n.priceRange && (
                  <span style={{ fontSize:10, color:ORANGE, fontFamily:'system-ui', background:`${ORANGE}22`, border:`1px solid ${ORANGE}33`, borderRadius:10, padding:'2px 8px' }}>
                    {n.priceRange} · {priceMap[n.priceRange] ?? ''}
                  </span>
                )}
              </div>
              <div style={{ fontSize:11, color:'rgba(255,255,255,0.55)', fontFamily:'system-ui', lineHeight:1.4 }}>
                {(n.vibe || n.tagline || '').slice(0, 60)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </SlideShell>
  );
}

// ── Slide 6: Food Guide ────────────────────────────────────────────
function Slide6({ city }: SlideProps) {
  const restaurants = city.restaurants?.slice(0, 4) ?? [];
  return (
    <SlideShell index={6} total={9} label="FOOD GUIDE" city={city}>
      <div style={{ fontSize:32, fontWeight:700, color:'#fff', marginBottom:6, fontFamily:'Georgia,serif' }}>
        What to Eat<br />in {city.name}
      </div>
      <div style={{ fontSize:12, color:'rgba(255,255,255,0.5)', fontFamily:'system-ui', marginBottom:22 }}>From street stalls to splurge-worthy</div>
      <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
        {restaurants.map(r => (
          <div key={r.name} style={{ background:GLASS, border:GLASS_B, borderRadius:14, padding:'13px 16px' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:4 }}>
              <span style={{ fontSize:13, fontWeight:700, color:'#fff', fontFamily:'system-ui' }}>🍴 {r.name}</span>
              <span style={{ fontSize:10, color:'rgba(255,255,255,0.5)', fontFamily:'system-ui', flexShrink:0, marginLeft:8 }}>{r.priceRange}</span>
            </div>
            <div style={{ fontSize:10, color:ORANGE2, fontFamily:'system-ui', marginBottom:3, fontStyle:'italic' }}>{r.cuisine}</div>
            <div style={{ fontSize:11, color:'rgba(255,255,255,0.55)', fontFamily:'system-ui', lineHeight:1.4 }}>
              Must try: {r.mustTry}
            </div>
          </div>
        ))}
      </div>
    </SlideShell>
  );
}

// ── Slide 7: Hidden Gems ───────────────────────────────────────────
function Slide7({ city }: SlideProps) {
  const gems = city.offbeatPlaces?.slice(0, 4) ?? [];
  return (
    <SlideShell index={7} total={9} label="HIDDEN GEMS" city={city}>
      <div style={{ fontSize:32, fontWeight:700, color:'#fff', marginBottom:6, fontFamily:'Georgia,serif' }}>
        Places Most<br />Tourists Miss 💎
      </div>
      <div style={{ fontSize:12, color:'rgba(255,255,255,0.5)', fontFamily:'system-ui', marginBottom:22 }}>Save this — your friends won't know these</div>
      {gems.length > 0 ? (
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {gems.map(g => (
            <div key={g.name} style={{ background:GLASS, border:GLASS_B, borderRadius:14, padding:'13px 16px' }}>
              <div style={{ display:'flex', gap:10, alignItems:'flex-start' }}>
                <span style={{ fontSize:20 }}>{g.icon}</span>
                <div>
                  <div style={{ fontSize:13, fontWeight:700, color:'#fff', fontFamily:'system-ui', marginBottom:3 }}>{g.name}</div>
                  <div style={{ fontSize:10, color:ORANGE2, fontFamily:'system-ui', marginBottom:3 }}>{g.type}</div>
                  <div style={{ fontSize:11, color:'rgba(255,255,255,0.55)', fontFamily:'system-ui', lineHeight:1.4 }}>{g.why.slice(0, 80)}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ color:'rgba(255,255,255,0.4)', fontFamily:'system-ui', fontSize:13 }}>Check the full guide at tripgenius.in</div>
      )}
    </SlideShell>
  );
}

// ── Slide 8: Cheatsheet ────────────────────────────────────────────
function Slide8({ city }: SlideProps) {
  const tips = city.proTips?.slice(0, 6) ?? [
    `Best time: ${city.stats.bestTime}`,
    `Currency: ${city.stats.currency}`,
    `Language: ${city.stats.language}`,
    `Budget: ${city.stats.budget}`,
  ];
  return (
    <SlideShell index={8} total={9} label="TRAVEL CHEATSHEET" city={city}>
      <div style={{ fontSize:32, fontWeight:700, color:'#fff', marginBottom:4, fontFamily:'Georgia,serif' }}>
        {city.name} in a<br />Nutshell 📋
      </div>
      <div style={{ fontSize:11, color:ORANGE2, fontFamily:'system-ui', marginBottom:20, fontStyle:'italic' }}>Screenshot this slide</div>

      {/* Quick facts strip */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:14 }}>
        {[
          { label:'Best Time', val: city.stats.bestTime },
          { label:'Budget/day', val: city.stats.budget },
          { label:'Currency',  val: city.stats.currency },
          { label:'Visa',      val: city.visa ? 'On Arrival' : 'Check' },
        ].map(f => (
          <div key={f.label} style={{ background:GLASS, border:GLASS_B, borderRadius:10, padding:'10px 12px' }}>
            <div style={{ fontSize:9, color:'rgba(255,255,255,0.45)', fontFamily:'system-ui', letterSpacing:1.5, marginBottom:3 }}>{f.label.toUpperCase()}</div>
            <div style={{ fontSize:13, fontWeight:700, color:ORANGE2, fontFamily:'system-ui' }}>{f.val}</div>
          </div>
        ))}
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:7 }}>
        {tips.slice(0, 5).map((tip, i) => (
          <div key={i} style={{ display:'flex', gap:10, alignItems:'flex-start', background:GLASS, border:GLASS_B, borderRadius:10, padding:'10px 13px' }}>
            <span style={{ color:ORANGE, fontSize:13, marginTop:1 }}>✓</span>
            <span style={{ fontSize:11, color:'rgba(255,255,255,0.75)', fontFamily:'system-ui', lineHeight:1.4 }}>{tip}</span>
          </div>
        ))}
      </div>
    </SlideShell>
  );
}

// ── Slide 9: CTA ───────────────────────────────────────────────────
function Slide9({ city }: SlideProps) {
  return (
    <div style={{ width:W, height:H, position:'relative', overflow:'hidden', borderRadius:16, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', background:`linear-gradient(145deg, #0D0D0D 0%, #1a0a00 50%, #0D0D0D 100%)` }}>
      {/* decorative rings */}
      {[220,320,420].map((s, i) => (
        <div key={s} style={{ position:'absolute', width:s, height:s, borderRadius:'50%', border:`1px solid ${ORANGE}${['33','22','11'][i]}`, top:'50%', left:'50%', transform:'translate(-50%,-50%)' }} />
      ))}
      <div style={{ position:'absolute', inset:0, background:`radial-gradient(circle at 50% 50%, ${ORANGE}18 0%, transparent 65%)` }} />

      <div style={{ position:'relative', textAlign:'center', padding:40 }}>
        <div style={{ fontSize:48, marginBottom:16 }}>{city.flag}</div>
        <div style={{ fontSize:13, color:ORANGE, fontFamily:'system-ui', letterSpacing:3, marginBottom:12, fontWeight:700 }}>FREE TRAVEL GUIDE</div>
        <div style={{ fontSize:36, fontWeight:700, color:'#fff', fontFamily:'Georgia,serif', lineHeight:1.15, marginBottom:8 }}>
          Plan your {city.name}<br />trip right 🌴
        </div>
        <div style={{ fontSize:13, color:'rgba(255,255,255,0.55)', fontFamily:'system-ui', marginBottom:30, lineHeight:1.6 }}>
          Things to do · Where to stay<br />Budget · Hidden gems · Local tips
        </div>

        <div style={{ background:ORANGE, borderRadius:30, padding:'14px 32px', display:'inline-block', marginBottom:20 }}>
          <span style={{ fontSize:14, fontWeight:700, color:'#fff', fontFamily:'system-ui', letterSpacing:0.5 }}>
            tripgenius.in/cities/{city.slug}
          </span>
        </div>

        <div style={{ fontSize:12, color:'rgba(255,255,255,0.4)', fontFamily:'system-ui', lineHeight:1.8 }}>
          💾 Save this post for your trip<br />
          📲 Follow @tripgenius.in for more
        </div>

        <div style={{ position:'absolute', bottom:-20, left:'50%', transform:'translateX(-50%)' }}>
          <Logo />
        </div>
      </div>
    </div>
  );
}

// ── Shared slide shell ─────────────────────────────────────────────
function SlideShell({ children, index, total, label, city }: { children: React.ReactNode; index: number; total: number; label: string; city: City }) {
  return (
    <div style={{ width:W, height:H, position:'relative', overflow:'hidden', borderRadius:16, background:`linear-gradient(160deg, #111 0%, #1a0e05 100%)`, display:'flex', flexDirection:'column', padding:'22px 24px' }}>
      <div style={{ position:'absolute', inset:0, background:`radial-gradient(ellipse 80% 60% at 0% 100%, ${ORANGE}18, transparent)` }} />
      <div style={{ position:'absolute', top:0, left:0, right:0, height:3, background:`linear-gradient(to right, ${ORANGE}, ${ORANGE2}, transparent)` }} />

      {/* top bar */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24, position:'relative' }}>
        <Logo />
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <span style={{ fontSize:9, color:'rgba(255,255,255,0.4)', fontFamily:'system-ui', letterSpacing:2 }}>{label}</span>
          <span style={{ fontSize:10, color:'rgba(255,255,255,0.3)', fontFamily:'system-ui' }}>{index}/{total}</span>
        </div>
      </div>

      <div style={{ flex:1, position:'relative', overflow:'hidden' }}>
        {children}
      </div>
    </div>
  );
}

// ── Main viewer ────────────────────────────────────────────────────
const SLIDES = [Slide1, Slide2, Slide3, Slide4, Slide5, Slide6, Slide7, Slide8, Slide9];
const LABELS = ['Hook', 'Best Time', 'Budget', 'Top 5', 'Where to Stay', 'Food', 'Hidden Gems', 'Cheatsheet', 'CTA'];

export default function CarouselViewer({ city }: { city: City }) {
  const [active, setActive] = useState(0);
  const Slide = SLIDES[active];

  return (
    <div style={{ minHeight:'100vh', background:'#0a0a0a', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:32, fontFamily:'system-ui' }}>
      {/* Header */}
      <div style={{ width: W, marginBottom:20, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div>
          <div style={{ fontSize:20, fontWeight:700, color:'#fff' }}>{city.flag} {city.name} Carousel</div>
          <div style={{ fontSize:12, color:'rgba(255,255,255,0.4)' }}>9 slides · Screenshot at 1080×1350 px</div>
        </div>
        <a href={`/cities/${city.slug}`} style={{ fontSize:12, color:ORANGE, textDecoration:'none' }}>← City Guide</a>
      </div>

      {/* Active slide */}
      <div style={{ boxShadow:'0 32px 80px rgba(0,0,0,0.8)', borderRadius:16 }}>
        <Slide city={city} />
      </div>

      {/* Slide selector */}
      <div style={{ display:'flex', gap:8, marginTop:20, flexWrap:'wrap', justifyContent:'center', maxWidth: W }}>
        {LABELS.map((label, i) => (
          <button key={i} onClick={() => setActive(i)}
            style={{ padding:'7px 14px', borderRadius:20, border:'none', cursor:'pointer', fontSize:11, fontWeight:600,
              background: active === i ? ORANGE : 'rgba(255,255,255,0.08)',
              color: active === i ? '#fff' : 'rgba(255,255,255,0.5)',
              transition:'all 0.15s' }}>
            {i + 1}. {label}
          </button>
        ))}
      </div>

      {/* Instructions */}
      <div style={{ marginTop:20, width:W, background:'rgba(255,255,255,0.05)', borderRadius:12, padding:'14px 18px' }}>
        <div style={{ fontSize:11, color:'rgba(255,255,255,0.5)', lineHeight:1.8 }}>
          <strong style={{ color:'rgba(255,255,255,0.8)' }}>How to export:</strong><br />
          1. Click each slide above · 2. Right-click → &quot;Inspect&quot; · 3. Use browser DevTools to screenshot at 1080×1350 px<br />
          Or: Open in full screen (Ctrl+Shift+M in Chrome) → set dimensions to 1080×1350 → screenshot
        </div>
      </div>

      {/* All slides preview */}
      <div style={{ marginTop:32, width:'100%', maxWidth:1200 }}>
        <div style={{ fontSize:13, color:'rgba(255,255,255,0.4)', marginBottom:16, textAlign:'center' }}>All 9 slides — print or screenshot view</div>
        <div style={{ display:'flex', gap:12, overflowX:'auto', paddingBottom:12, justifyContent:'center', flexWrap:'wrap' }}>
          {SLIDES.map((S, i) => (
            <div key={i} style={{ flexShrink:0, cursor:'pointer', opacity: active === i ? 1 : 0.6, transition:'opacity 0.2s', transform: active === i ? 'scale(1.03)' : 'scale(1)' }} onClick={() => setActive(i)}>
              <div style={{ transform:'scale(0.28)', transformOrigin:'top left', width:W, height:H, pointerEvents:'none' }}>
                <S city={city} />
              </div>
              <div style={{ width: W*0.28, textAlign:'center', marginTop:4 }}>
                <span style={{ fontSize:9, color:'rgba(255,255,255,0.4)' }}>{i+1}. {LABELS[i]}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

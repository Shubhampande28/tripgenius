'use client';

import Link from 'next/link';
import { Compass } from 'lucide-react';
import { City } from '@/lib/types';

const goaData = {
  beaches: [
    { name: 'Palolem Beach', note: 'Most scenic crescent' },
    { name: 'Vagator Beach', note: 'Dramatic red cliffs' },
    { name: 'Agonda Beach', note: 'Quiet & peaceful' },
    { name: 'Calangute', note: 'Most popular, buzzing' },
    { name: 'Kakolem Tiger Beach', note: 'Hidden gem, trek in' },
  ],
  mustVisit: [
    { name: 'Basilica of Bom Jesus', note: 'UNESCO Heritage' },
    { name: 'Dudhsagar Falls', note: '600m waterfall' },
    { name: 'Chapora Fort', note: 'Sunset views' },
    { name: 'Fontainhas', note: "Goa's Latin Quarter" },
    { name: 'Anjuna Flea Market', note: 'Every Wednesday' },
  ],
  food: [
    { name: 'Fish Curry Rice', note: 'The Goan staple' },
    { name: 'Prawn Balchão', note: 'Spicy & tangy pickle' },
    { name: 'Bebinca', note: 'Layered coconut dessert' },
    { name: 'Xacuti Curry', note: 'Rich coconut masala' },
    { name: 'Feni', note: 'Cashew spirit, try it!' },
  ],
  cafesNightlife: [
    { name: 'Thalassa', note: 'Greek beachside bar' },
    { name: 'Antares', note: 'Sunset rooftop dining' },
    { name: 'Curlies Beach Shack', note: 'Anjuna institution' },
    { name: 'Leopard Valley', note: 'Open-air club' },
    { name: 'Gunpowder', note: 'Best regional Indian' },
  ],
  hiddenGems: [
    { name: 'Divar Island', note: 'Sleepy Portuguese village' },
    { name: 'Cabo de Rama Fort', note: 'Clifftop ruins' },
    { name: 'Cola Beach Lagoons', note: 'Two hidden lagoons' },
    { name: 'Spice Plantations', note: 'Ponda countryside' },
    { name: 'Siolim Village', note: 'Charming & local' },
  ],
  tips: [
    '🛵 Rent a scooter — the only real way to explore',
    '💵 Carry cash — many shacks are cash only',
    '🌧️ Season: Nov–Mar only (monsoon closes beaches)',
    '📍 North Goa = lively · South Goa = peaceful',
    '✈️ Best flight deals: book 4–8 weeks ahead',
    '🍽️ Eat where locals eat — half the price, twice the flavor',
  ],
  apps: ['Goa Miles', 'Google Maps', 'Rapido', 'Swiggy', 'IndiGo'],
};

const cityData: Record<string, typeof goaData> = {
  goa: goaData,
};

const cardColors = [
  { bg: '#FFF9C4', border: '#F9E45A', title: '#B7860B' },
  { bg: '#E8F5E9', border: '#81C784', title: '#2E7D32' },
  { bg: '#FCE4EC', border: '#F48FB1', title: '#C2185B' },
  { bg: '#E3F2FD', border: '#90CAF9', title: '#1565C0' },
  { bg: '#FFF3E0', border: '#FFCC80', title: '#E65100' },
  { bg: '#F3E5F5', border: '#CE93D8', title: '#6A1B9A' },
];

function StickyCard({
  title,
  emoji,
  items,
  colorIdx,
  rotate = 0,
}: {
  title: string;
  emoji: string;
  items: { name: string; note: string }[];
  colorIdx: number;
  rotate?: number;
}) {
  const c = cardColors[colorIdx % cardColors.length];
  return (
    <div
      style={{
        backgroundColor: c.bg,
        border: `2px solid ${c.border}`,
        borderRadius: 12,
        padding: '14px 16px',
        boxShadow: '3px 4px 12px rgba(0,0,0,0.12)',
        transform: `rotate(${rotate}deg)`,
        flex: '1 1 48%',
        minWidth: 0,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
        <span style={{ fontSize: 18 }}>{emoji}</span>
        <span style={{ fontWeight: 800, fontSize: 13, color: c.title, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {title}
        </span>
      </div>
      <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 5 }}>
        {items.map((item) => (
          <li key={item.name} style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
            <span style={{ color: c.title, fontSize: 11, marginTop: 1, flexShrink: 0 }}>•</span>
            <span style={{ fontSize: 12, color: '#333', lineHeight: 1.4 }}>
              <strong>{item.name}</strong>
              {item.note && <span style={{ color: '#666', fontWeight: 400 }}> — {item.note}</span>}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function CityCheatsheet({ city }: { city: City }) {
  const data = cityData[city.slug];

  if (!data) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0D1117', color: '#E6EDF3', fontFamily: 'system-ui' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: 24, marginBottom: 8 }}>🗺️</p>
          <p>Cheatsheet for <strong>{city.name}</strong> coming soon!</p>
          <Link href={`/cities/${city.slug}`} style={{ color: '#FF6B35', marginTop: 12, display: 'block' }}>
            View full {city.name} guide →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: '#87CEEB', minHeight: '100vh', fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
      {/* Back link */}
      <div style={{ position: 'fixed', top: 16, left: 16, zIndex: 50 }}>
        <Link
          href={`/cities/${city.slug}`}
          style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px',
            background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)',
            borderRadius: 20, color: '#fff', textDecoration: 'none', fontSize: 12, fontWeight: 600,
          }}
        >
          ← Full Guide
        </Link>
      </div>

      {/* Screenshot area — 1080×1350 equivalent proportions */}
      <div
        id="cheatsheet-poster"
        style={{
          maxWidth: 480,
          margin: '0 auto',
          background: 'linear-gradient(180deg, #87CEEB 0%, #B0E2FF 40%, #E0F4FF 100%)',
          position: 'relative',
          overflow: 'hidden',
          paddingBottom: 32,
        }}
      >
        {/* Sky decorations */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 200, overflow: 'hidden', pointerEvents: 'none' }}>
          <span style={{ position: 'absolute', top: 20, left: 20, fontSize: 40, opacity: 0.5 }}>🌴</span>
          <span style={{ position: 'absolute', top: 10, right: 24, fontSize: 32, opacity: 0.6 }}>🌺</span>
          <span style={{ position: 'absolute', top: 40, right: 80, fontSize: 20, opacity: 0.4 }}>✈️</span>
          <span style={{ position: 'absolute', top: 15, left: '45%', fontSize: 16, opacity: 0.35 }}>☁️</span>
          <span style={{ position: 'absolute', top: 60, left: '60%', fontSize: 22, opacity: 0.3 }}>☁️</span>
        </div>

        {/* Header */}
        <div style={{ textAlign: 'center', paddingTop: 56, paddingBottom: 20, position: 'relative', zIndex: 2 }}>
          <div style={{ fontSize: 60, marginBottom: 4 }}>{city.flag}</div>
          <h1 style={{
            fontSize: 42,
            fontWeight: 900,
            color: '#fff',
            margin: '0 0 4px',
            textShadow: '2px 3px 8px rgba(0,0,0,0.25)',
            letterSpacing: '-0.02em',
            lineHeight: 1,
            textTransform: 'uppercase',
          }}>
            {city.name.toUpperCase()}
          </h1>
          <div style={{
            display: 'inline-block',
            background: '#FF6B35',
            color: '#fff',
            fontWeight: 800,
            fontSize: 13,
            padding: '5px 20px',
            borderRadius: 20,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            boxShadow: '0 3px 10px rgba(255,107,53,0.4)',
          }}>
            Travel Cheatsheet
          </div>

          {/* Quick stats strip */}
          <div style={{
            display: 'flex', justifyContent: 'center', gap: 16, marginTop: 16,
            flexWrap: 'wrap', padding: '0 20px',
          }}>
            {[
              { icon: '🗓️', label: city.stats.bestTime },
              { icon: '💰', label: city.stats.budget },
              { icon: '🗣️', label: city.stats.currency },
            ].map(({ icon, label }) => (
              <div key={label} style={{
                background: 'rgba(255,255,255,0.7)', borderRadius: 20,
                padding: '4px 12px', fontSize: 11, fontWeight: 600, color: '#333',
                display: 'flex', alignItems: 'center', gap: 5,
                backdropFilter: 'blur(4px)',
              }}>
                <span>{icon}</span> {label}
              </div>
            ))}
          </div>
        </div>

        {/* Cards grid */}
        <div style={{ padding: '0 14px', display: 'flex', flexDirection: 'column', gap: 12, position: 'relative', zIndex: 2 }}>

          {/* Row 1: Beaches + Must Visit */}
          <div style={{ display: 'flex', gap: 10 }}>
            <StickyCard title="Best Beaches" emoji="🏖️" items={data.beaches} colorIdx={0} rotate={-0.5} />
            <StickyCard title="Must Visit" emoji="📍" items={data.mustVisit} colorIdx={1} rotate={0.5} />
          </div>

          {/* Row 2: Food */}
          <div style={{ display: 'flex', gap: 10 }}>
            <StickyCard title="Food to Try" emoji="🍽️" items={data.food} colorIdx={2} rotate={-0.3} />
            <StickyCard title="Cafes & Nightlife" emoji="🍹" items={data.cafesNightlife} colorIdx={3} rotate={0.4} />
          </div>

          {/* Row 3: Hidden gems full width */}
          <div style={{
            background: '#E8F5E9', border: '2px solid #81C784',
            borderRadius: 12, padding: '14px 16px',
            boxShadow: '3px 4px 12px rgba(0,0,0,0.12)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
              <span style={{ fontSize: 18 }}>🗺️</span>
              <span style={{ fontWeight: 800, fontSize: 13, color: '#2E7D32', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Hidden Gems
              </span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 16px' }}>
              {data.hiddenGems.map((gem) => (
                <div key={gem.name} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12 }}>
                  <span style={{ color: '#2E7D32' }}>•</span>
                  <strong>{gem.name}</strong>
                  <span style={{ color: '#666' }}>— {gem.note}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Row 4: Tips */}
          <div style={{
            background: '#FFF9C4', border: '2px solid #F9E45A',
            borderRadius: 12, padding: '14px 16px',
            boxShadow: '3px 4px 12px rgba(0,0,0,0.12)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
              <span style={{ fontSize: 18 }}>💡</span>
              <span style={{ fontWeight: 800, fontSize: 13, color: '#B7860B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Travel Tips
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              {data.tips.map((tip) => (
                <p key={tip} style={{ margin: 0, fontSize: 12, color: '#333', lineHeight: 1.4 }}>{tip}</p>
              ))}
            </div>
          </div>

          {/* Row 5: Apps */}
          <div style={{
            background: '#E3F2FD', border: '2px solid #90CAF9',
            borderRadius: 12, padding: '12px 16px',
            boxShadow: '3px 4px 12px rgba(0,0,0,0.12)',
            display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap',
          }}>
            <span style={{ fontSize: 18 }}>📱</span>
            <span style={{ fontWeight: 800, fontSize: 12, color: '#1565C0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Useful Apps:
            </span>
            {data.apps.map((app) => (
              <span key={app} style={{
                background: '#1565C0', color: '#fff', borderRadius: 20,
                padding: '3px 10px', fontSize: 11, fontWeight: 600,
              }}>
                {app}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom palm + branding */}
        <div style={{ position: 'relative', marginTop: 20, textAlign: 'center' }}>
          <div style={{ fontSize: 36, marginBottom: 6 }}>🌴🌊🌴</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <div style={{
              width: 20, height: 20, borderRadius: 6, background: '#FF6B35',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Compass size={12} color="#fff" />
            </div>
            <span style={{ fontWeight: 800, fontSize: 14, color: '#333', letterSpacing: '-0.01em' }}>
              TripGenius.in
            </span>
          </div>
          <p style={{ margin: '4px 0 0', fontSize: 10, color: '#555', letterSpacing: '0.05em' }}>
            PREMIUM TRAVEL GUIDES
          </p>
        </div>
      </div>

      {/* Screenshot instructions */}
      <div style={{
        maxWidth: 480, margin: '0 auto', padding: '20px 16px',
        background: '#0D1117', color: '#E6EDF3', textAlign: 'center',
      }}>
        <p style={{ fontWeight: 700, fontSize: 16, marginBottom: 8 }}>📸 Share this cheatsheet</p>
        <p style={{ fontSize: 13, color: '#8B949E', marginBottom: 16, lineHeight: 1.5 }}>
          Take a screenshot of the poster above and post it on Instagram, WhatsApp, or save it for your trip.
        </p>
        <Link
          href={`/cities/${city.slug}`}
          style={{
            display: 'inline-block', padding: '10px 24px',
            background: '#FF6B35', color: '#fff', borderRadius: 20,
            fontWeight: 700, fontSize: 13, textDecoration: 'none',
          }}
        >
          View Full {city.name} Guide →
        </Link>
      </div>
    </div>
  );
}

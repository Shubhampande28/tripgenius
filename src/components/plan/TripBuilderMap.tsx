'use client';

import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { ThingToDo, Coordinates } from '@/lib/types';

export interface PinMeta {
  day: number;
  order: number;
  color: string;
}

interface Props {
  things: ThingToDo[];
  pinMeta: Map<string, PinMeta>;
  center: Coordinates;
  activeDay: number;
  onTogglePin: (name: string) => void;
}

function pinIcon(emoji: string, meta?: PinMeta) {
  if (meta) {
    return L.divIcon({
      html: `<div style="
        background:${meta.color};
        color:#fff;
        border:2px solid #fff;
        border-radius:50%;
        width:30px;height:30px;
        display:flex;align-items:center;justify-content:center;
        font-size:13px;font-weight:700;
        font-family:system-ui,-apple-system,sans-serif;
        box-shadow:0 2px 8px rgba(0,0,0,0.35);
        cursor:pointer;
      ">${meta.order}</div>`,
      className: '',
      iconSize: [30, 30],
      iconAnchor: [15, 15],
      popupAnchor: [0, -16],
    });
  }
  return L.divIcon({
    html: `<div style="
      background:#ffffff;
      border:1.5px solid #d6d8dc;
      border-radius:50%;
      width:28px;height:28px;
      display:flex;align-items:center;justify-content:center;
      font-size:14px;
      box-shadow:0 1px 4px rgba(0,0,0,0.2);
      cursor:pointer;
    ">${emoji}</div>`,
    className: '',
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -15],
  });
}

export default function TripBuilderMap({ things, pinMeta, center, activeDay, onTogglePin }: Props) {
  return (
    <MapContainer
      center={[center.lat, center.lng]}
      zoom={10}
      scrollWheelZoom
      className="h-[420px] sm:h-[560px] w-full rounded-2xl z-0"
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        subdomains="abcd"
        maxZoom={20}
      />

      {things.map((t) => {
        if (!t.coordinates) return null;
        const meta = pinMeta.get(t.name);
        return (
          <Marker
            key={t.name}
            position={[t.coordinates.lat, t.coordinates.lng]}
            icon={pinIcon(t.icon, meta)}
            eventHandlers={{ click: () => onTogglePin(t.name) }}
          >
            <Popup minWidth={210} maxWidth={240}>
              <div style={{ width: 200 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                  <span style={{ fontSize: 18 }}>{t.icon}</span>
                  <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#666' }}>
                    {t.category}
                  </span>
                </div>
                <p style={{ margin: 0, marginBottom: 4, fontWeight: 600, fontSize: 13, color: '#111' }}>{t.name}</p>
                <p style={{ margin: 0, marginBottom: 8, fontSize: 11.5, color: '#555', lineHeight: 1.4 }}>
                  {t.description.length > 110 ? `${t.description.slice(0, 110)}…` : t.description}
                </p>
                <button
                  onClick={() => onTogglePin(t.name)}
                  style={{
                    width: '100%',
                    padding: '6px 10px',
                    borderRadius: 8,
                    border: 'none',
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer',
                    background: meta ? '#f1f1f3' : '#FF6B35',
                    color: meta ? '#333' : '#fff',
                  }}
                >
                  {meta ? `Remove from Day ${meta.day}` : `Add to Day ${activeDay}`}
                </button>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}

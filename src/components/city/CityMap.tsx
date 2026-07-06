'use client';

import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { City } from '@/lib/types';
import { buildAttractionPins, getCategoryColour } from '@/lib/mapUtils';
import CityMapPopup from './CityMapPopup';
import { ExternalLink } from 'lucide-react';

interface Props {
  city: City;
}

function makeEmojiMarker(emoji: string, colour: string) {
  return L.divIcon({
    html: `<div style="
      background:${colour};
      border:2.5px solid #fff;
      border-radius:50%;
      width:36px;
      height:36px;
      display:flex;
      align-items:center;
      justify-content:center;
      font-size:17px;
      box-shadow:0 2px 6px rgba(0,0,0,0.35);
      cursor:pointer;
    ">${emoji}</div>`,
    className: '',
    iconSize:    [36, 36],
    iconAnchor:  [18, 18],
    popupAnchor: [0, -20],
  });
}

export default function CityMap({ city }: Props) {
  if (!city.coordinates) {
    return (
      <div className="h-60 sm:h-[400px] w-full rounded-xl bg-elevated border border-border flex flex-col items-center justify-center gap-3 text-muted">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-30">
          <circle cx="12" cy="10" r="3" />
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
        </svg>
        <p className="text-sm font-medium opacity-40">Map data coming soon</p>
      </div>
    );
  }

  const pins = buildAttractionPins(city);
  const { lat, lng } = city.coordinates;
  const mapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(city.name)}`;

  return (
    <div className="relative">
      <MapContainer
        center={[lat, lng]}
        zoom={12}
        scrollWheelZoom={false}
        className="h-60 sm:h-[400px] w-full rounded-xl z-0"
        style={{ zIndex: 0 }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          maxZoom={19}
        />

        {pins.map((pin, i) => (
          <Marker
            key={i}
            position={[pin.lat, pin.lng]}
            icon={makeEmojiMarker(pin.icon, getCategoryColour(pin.category))}
          >
            <Popup minWidth={220} maxWidth={240}>
              <CityMapPopup pin={pin} />
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* "Open in Google Maps" — positioned over the map bottom-right */}
      <a
        href={mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-3 right-3 z-[400] flex items-center gap-1.5 bg-dark/90 backdrop-blur-sm border border-border text-xs font-medium text-muted hover:text-primary-text rounded-lg px-3 py-1.5 transition-colors"
      >
        Open in Google Maps
        <ExternalLink size={11} />
      </a>
    </div>
  );
}

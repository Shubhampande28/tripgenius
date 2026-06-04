import { MapPin } from '@/lib/mapUtils';

interface Props {
  pin: MapPin;
}

// Intentionally uses inline styles: this component renders inside Leaflet's
// detached popup DOM, where CSS cascade and Tailwind class availability cannot
// be guaranteed across all browsers and Leaflet versions.
export default function CityMapPopup({ pin }: Props) {
  const descriptionPreview =
    pin.description.length > 100
      ? pin.description.slice(0, 100) + '…'
      : pin.description;

  return (
    <div style={{ width: 220, padding: '2px 0' }}>
      {/* Icon + category badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
        <span style={{ fontSize: 20, lineHeight: 1 }}>{pin.icon}</span>
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            color: pin.colour,
            backgroundColor: pin.colour + '1a',
            border: `1px solid ${pin.colour}40`,
            borderRadius: 99,
            padding: '2px 8px',
            whiteSpace: 'nowrap',
          }}
        >
          {pin.category}
        </span>
      </div>

      {/* Name */}
      <p style={{ margin: 0, marginBottom: 4, fontWeight: 600, fontSize: 13, lineHeight: 1.3, color: '#111' }}>
        {pin.label}
      </p>

      {/* Description */}
      <p style={{ margin: 0, fontSize: 11.5, color: '#555', lineHeight: 1.45 }}>
        {descriptionPreview}
      </p>
    </div>
  );
}

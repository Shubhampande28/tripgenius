// Next.js webpack bundles Leaflet but mangles the default marker icon URL resolution
// because it rewrites asset paths. This file patches the default icon at import time.
// Note: this fix is not needed when using L.divIcon (custom markers), but is
// included as a safety net for any future use of L.Icon.Default.
import L from 'leaflet';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

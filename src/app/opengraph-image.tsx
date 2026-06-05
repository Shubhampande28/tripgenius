import { ImageResponse } from 'next/og';
import { readFileSync } from 'fs';
import { join } from 'path';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  const logoData = readFileSync(join(process.cwd(), 'public/logo.png'));
  const logoSrc = `data:image/png;base64,${logoData.toString('base64')}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0D1117',
          position: 'relative',
        }}
      >
        {/* Subtle red accent line at top */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: '#DC2626',
          }}
        />

        {/* Logo */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={logoSrc}
          alt="TripGenius"
          style={{ height: 80, marginBottom: 32, objectFit: 'contain' }}
        />

        {/* Tagline */}
        <div
          style={{
            fontSize: 28,
            color: '#8B949E',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}
        >
          Free Travel Guides for India &amp; the World
        </div>

        {/* Domain */}
        <div
          style={{
            position: 'absolute',
            bottom: 32,
            fontSize: 18,
            color: '#30363D',
          }}
        >
          tripgenius.in
        </div>
      </div>
    ),
    { ...size }
  );
}

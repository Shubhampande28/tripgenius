'use client';

import { useState } from 'react';
import Image, { ImageProps } from 'next/image';

interface SafeImageProps extends Omit<ImageProps, 'onError'> {
  city?: string;
  accentColor?: string;
}

// Deterministic gradient from city name
const GRADIENTS = [
  ['#1a1a2e', '#16213e', '#0f3460'],
  ['#2d1b0e', '#3d2211', '#5a3a1a'],
  ['#0a1628', '#0e2040', '#1a3a5c'],
  ['#1a0a2e', '#2d1b4e', '#3d2b5e'],
  ['#0a2818', '#0e3d24', '#1a5e38'],
  ['#2e1a0a', '#4e2d11', '#6e4018'],
  ['#0a1a2e', '#112840', '#1a3d5c'],
  ['#2e0a1a', '#4e1128', '#6e1a3d'],
];

function slugToGradient(slug: string) {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) hash = slug.charCodeAt(i) + ((hash << 5) - hash);
  const g = GRADIENTS[Math.abs(hash) % GRADIENTS.length];
  return `linear-gradient(135deg, ${g[0]}, ${g[1]}, ${g[2]})`;
}

export default function SafeImage({
  src,
  alt,
  city,
  accentColor,
  className,
  fill,
  style,
  ...props
}: SafeImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError]   = useState(false);

  const gradient = slugToGradient(city ?? String(alt));

  const containerStyle: React.CSSProperties = fill
    ? { position: 'absolute', inset: 0, ...style }
    : { position: 'relative', width: '100%', height: '100%', ...style };

  return (
    <div style={containerStyle}>
      {/* Always-visible gradient base */}
      <div
        style={{ position: 'absolute', inset: 0, background: gradient }}
        aria-hidden
      />
      {/* Accent glow on top of gradient */}
      {accentColor && (
        <div
          style={{
            position: 'absolute', inset: 0,
            background: `radial-gradient(ellipse at 30% 60%, ${accentColor}30, transparent 70%)`,
          }}
          aria-hidden
        />
      )}

      {/* Photo — only attempt if src looks valid */}
      {!error && src && (
        <Image
          src={src}
          alt={alt}
          fill={fill}
          className={`${className ?? ''} transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          style={{ objectFit: 'cover', position: 'absolute', inset: 0 }}
          {...props}
        />
      )}
    </div>
  );
}

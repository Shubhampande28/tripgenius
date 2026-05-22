'use client';

import { useState } from 'react';
import Image, { ImageProps } from 'next/image';

interface SafeImageProps extends Omit<ImageProps, 'onError'> {
  fallbackGradient?: string;
  city?: string;
}

const gradients = [
  'from-orange-900 via-amber-800 to-orange-950',
  'from-rose-900 via-pink-800 to-rose-950',
  'from-indigo-900 via-purple-800 to-indigo-950',
  'from-teal-900 via-cyan-800 to-teal-950',
  'from-amber-900 via-yellow-800 to-amber-950',
  'from-emerald-900 via-green-800 to-emerald-950',
  'from-blue-900 via-sky-800 to-blue-950',
  'from-red-900 via-rose-800 to-red-950',
];

function stringToGradient(s: string) {
  let hash = 0;
  for (let i = 0; i < s.length; i++) hash = s.charCodeAt(i) + ((hash << 5) - hash);
  return gradients[Math.abs(hash) % gradients.length];
}

export default function SafeImage({ src, alt, city, className, ...props }: SafeImageProps) {
  const [broken, setBroken] = useState(false);
  const gradient = stringToGradient(city ?? (alt as string) ?? 'travel');

  if (broken) {
    return (
      <div
        className={`bg-gradient-to-br ${gradient} flex items-end justify-start p-4 ${className ?? ''}`}
        style={props.style}
      >
        <span className="text-white/40 text-xs font-medium">{alt}</span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      className={className}
      onError={() => setBroken(true)}
      {...props}
    />
  );
}

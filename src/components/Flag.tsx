// SVG flag rendered from an emoji flag string. Emoji flags are two Unicode
// regional-indicator code points that spell the ISO 3166-1 alpha-2 code, so the
// code is derived — no lookup table to maintain. The SVGs are self-hosted in
// public/flags/4x3/ (copied from the flag-icons package by
// scripts/copy-flags.mjs) — no CSS import, no bundler resolution to break.
// Emoji flags don't render on Windows Chrome, which is why this exists.
// Falls back to the raw emoji for anything that isn't a plain two-letter flag.

const RI_A = 0x1f1e6; // regional indicator "A"

function emojiToIso(emoji: string): string | null {
  const points = [...emoji.trim()].map((c) => c.codePointAt(0) ?? 0);
  if (points.length !== 2) return null;
  if (points.some((p) => p < RI_A || p > RI_A + 25)) return null;
  return points.map((p) => String.fromCharCode(p - RI_A + 97)).join('');
}

export default function Flag({
  emoji,
  size,
  className = '',
  title,
}: {
  emoji: string;
  /** Flag height; width is 4:3 automatically.
   *  Omit to inherit the surrounding font-size (size with text-* classes). */
  size?: string | number;
  className?: string;
  title?: string;
}) {
  const iso = emojiToIso(emoji);
  const fontSize = size === undefined ? undefined : typeof size === 'number' ? `${size}px` : size;
  if (!iso) return <span className={className} style={{ fontSize }}>{emoji}</span>;
  return (
    <span
      className={`inline-block rounded-[2px] align-[-0.1em] ${className}`}
      style={{
        fontSize,
        width: '1.333em',
        height: '1em',
        backgroundImage: `url(/flags/4x3/${iso}.svg)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
      role="img"
      aria-label={title ?? 'Flag'}
      title={title}
    />
  );
}

// Pinterest pin factory — image renderer.
// 1000×1500 pin images generated programmatically with satori (JSX-free
// element trees → SVG) + resvg (SVG → PNG). No Canva, no headless browser.
//
// Two template variants, alternated per pin so saves/clicks can be compared:
//   A: full-bleed photo, dark gradient, text bottom
//   B: solid brand color block top, photo bottom half
//
// Usage: npx tsx automation/pinterest/render.ts <slug>   (renders both variants)

import fs from 'node:fs';
import path from 'node:path';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import type { QueueEntry } from './build-queue';

const DIR = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'));
const OUT_DIR = path.join(DIR, 'output');
const PUBLIC_DIR = path.join(DIR, '..', '..', 'public');
const SITE_ORIGIN = 'https://www.tripgenius.in';
const W = 1000;
const H = 1500;
const BRAND = '#FF6B35';
const DARK = '#151A22';

const MIME_BY_EXT: Record<string, string> = {
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png',
  '.webp': 'image/webp', '.gif': 'image/gif', '.svg': 'image/svg+xml',
};

// Every pin's image is one of our own /public assets served at
// {SITE_ORIGIN}/city-images/*.jpg (see build-queue.ts's absoluteImage()) — no
// need for a network round-trip to fetch a file that's already sitting on
// disk. Returns the resolved path only for same-origin/root-relative URLs
// whose file actually exists under public/; anything else (external fallback
// photos, dynamic /api/ routes) returns null so the caller falls back to
// fetch(). Guards against path traversal escaping public/.
function localPublicPath(url: string): string | null {
  let pathname: string;
  if (url.startsWith('/')) {
    pathname = url;
  } else {
    try {
      const parsed = new URL(url);
      if (parsed.origin !== SITE_ORIGIN) return null;
      pathname = parsed.pathname;
    } catch {
      return null;
    }
  }
  const resolved = path.join(PUBLIC_DIR, decodeURIComponent(pathname));
  if (resolved !== PUBLIC_DIR && !resolved.startsWith(PUBLIC_DIR + path.sep)) return null;
  return fs.existsSync(resolved) && fs.statSync(resolved).isFile() ? resolved : null;
}

export type Variant = 'a' | 'b';

const fonts = () => [
  { name: 'Poppins', data: fs.readFileSync(path.join(DIR, 'fonts', 'Poppins-Bold.ttf')), weight: 700 as const, style: 'normal' as const },
  { name: 'Poppins', data: fs.readFileSync(path.join(DIR, 'fonts', 'Poppins-Regular.ttf')), weight: 400 as const, style: 'normal' as const },
];

// satori element helpers — keep the tree JSX-free.
const el = (type: string, style: Record<string, unknown>, children?: unknown) => ({
  type,
  props: { style, ...(children !== undefined ? { children } : {}) },
});
const img = (src: string, style: Record<string, unknown>) => ({
  type: 'img',
  props: { src, style },
});

async function fetchImageDataUri(url: string): Promise<string> {
  const localPath = localPublicPath(url);
  if (localPath) {
    const type = MIME_BY_EXT[path.extname(localPath).toLowerCase()] ?? 'image/jpeg';
    const buf = fs.readFileSync(localPath);
    return `data:${type};base64,${buf.toString('base64')}`;
  }

  const res = await fetch(url, { headers: { 'User-Agent': 'TripGeniusPinFactory/1.0' } });
  if (!res.ok) throw new Error(`Image fetch failed (${res.status}): ${url}`);
  const type = res.headers.get('content-type') ?? 'image/jpeg';
  const buf = Buffer.from(await res.arrayBuffer());
  return `data:${type};base64,${buf.toString('base64')}`;
}

const wordmark = el('div', {
  display: 'flex', alignItems: 'center', gap: 10,
}, [
  el('div', { width: 14, height: 14, borderRadius: 7, backgroundColor: BRAND }),
  el('div', { fontSize: 30, fontWeight: 700, color: '#FFFFFF', letterSpacing: 1 }, 'tripgenius.in'),
]);

function textBlock(entry: QueueEntry, headlineColor: string, sublineColor: string) {
  return [
    el('div', {
      fontSize: 88, fontWeight: 700, color: headlineColor, lineHeight: 1.05,
      letterSpacing: -1, display: 'flex',
    }, entry.headline),
    el('div', {
      fontSize: 38, fontWeight: 400, color: sublineColor, lineHeight: 1.3,
      marginTop: 24, display: 'flex',
    }, entry.subline),
  ];
}

function variantA(entry: QueueEntry, imgUri: string) {
  return el('div', {
    width: W, height: H, display: 'flex', flexDirection: 'column', fontFamily: 'Poppins',
  }, [
    img(imgUri, { position: 'absolute', top: 0, left: 0, width: W, height: H, objectFit: 'cover' }),
    // dark gradient over the bottom 45%
    el('div', {
      position: 'absolute', bottom: 0, left: 0, width: W, height: Math.round(H * 0.5),
      backgroundImage: 'linear-gradient(to top, rgba(10,12,16,0.94) 45%, rgba(10,12,16,0))',
    }),
    el('div', {
      position: 'absolute', bottom: 0, left: 0, width: W, padding: '0 64px 72px 64px',
      display: 'flex', flexDirection: 'column',
    }, [
      ...textBlock(entry, '#FFFFFF', 'rgba(255,255,255,0.85)'),
      el('div', { marginTop: 44, display: 'flex' }, [wordmark]),
    ]),
  ]);
}

function variantB(entry: QueueEntry, imgUri: string) {
  return el('div', {
    width: W, height: H, display: 'flex', flexDirection: 'column', fontFamily: 'Poppins',
    backgroundColor: DARK,
  }, [
    el('div', {
      height: Math.round(H * 0.46), width: W, padding: '80px 64px 0 64px',
      display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
    }, [
      el('div', { display: 'flex', flexDirection: 'column' }, [
        el('div', {
          fontSize: 26, fontWeight: 700, color: BRAND, letterSpacing: 4,
          textTransform: 'uppercase', display: 'flex', marginBottom: 28,
        }, entry.type === 'itinerary' ? 'Day-by-day itinerary' : 'Best time to visit'),
        ...textBlock(entry, '#FFFFFF', 'rgba(255,255,255,0.75)'),
      ]),
      el('div', { display: 'flex', paddingBottom: 44 }, [wordmark]),
    ]),
    img(imgUri, { width: W, height: H - Math.round(H * 0.46), objectFit: 'cover' }),
  ]);
}

export async function renderPin(entry: QueueEntry, variant: Variant): Promise<string> {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const imgUri = await fetchImageDataUri(entry.imageSource);
  const tree = variant === 'a' ? variantA(entry, imgUri) : variantB(entry, imgUri);

  const svg = await satori(tree as any, { width: W, height: H, fonts: fonts() });
  const png = new Resvg(svg, { fitTo: { mode: 'width', value: W } }).render().asPng();

  const outPath = path.join(OUT_DIR, `${entry.slug.replace(/\//g, '-')}-${variant}.png`);
  fs.writeFileSync(outPath, png);
  return outPath;
}

// CLI: render both variants of one slug for design review.
if (process.argv[1] && import.meta.url.endsWith(path.basename(process.argv[1]))) {
  const slug = process.argv[2];
  if (!slug) {
    console.error('Usage: npx tsx automation/pinterest/render.ts <queue-slug>');
    process.exit(1);
  }
  const queue: QueueEntry[] = JSON.parse(
    fs.readFileSync(path.join(DIR, 'queue.json'), 'utf-8'),
  );
  const entry = queue.find((e) => e.slug === slug);
  if (!entry) {
    console.error(`Slug not in queue: ${slug}`);
    process.exit(1);
  }
  Promise.all([renderPin(entry, 'a'), renderPin(entry, 'b')]).then((paths) => {
    for (const p of paths) console.log(`Rendered ${p}`);
  }).catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

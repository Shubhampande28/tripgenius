import { readFileSync, mkdirSync, copyFileSync, readdirSync } from 'fs';

// Collect every flag emoji in the data files, convert to ISO code, and copy
// the matching 4x3 SVG from flag-icons into public/flags/.
const RI_A = 0x1f1e6;
const emojiToIso = (e) => {
  const pts = [...e].map((c) => c.codePointAt(0));
  if (pts.length !== 2 || pts.some((p) => p < RI_A || p > RI_A + 25)) return null;
  return pts.map((p) => String.fromCharCode(p - RI_A + 97)).join('');
};

const files = [
  'src/lib/cities.ts', 'src/lib/worldCities.ts', 'src/lib/indianCities.ts',
  'src/lib/indianCitiesExtended.ts', 'src/lib/newIndianCities.ts', 'src/data/countries.ts',
];
const isos = new Set(['in']); // trust bar
for (const f of files) {
  const src = readFileSync(f, 'utf8');
  for (const m of src.matchAll(/flag["']?\s*:\s*["']([^"']+)["']/g)) {
    const iso = emojiToIso(m[1].trim());
    if (iso) isos.add(iso);
  }
}
mkdirSync('public/flags/4x3', { recursive: true });
let copied = 0, missing = [];
for (const iso of isos) {
  try {
    copyFileSync(`node_modules/flag-icons/flags/4x3/${iso}.svg`, `public/flags/4x3/${iso}.svg`);
    copied++;
  } catch { missing.push(iso); }
}
console.log(`copied ${copied} flags:`, [...isos].sort().join(', '));
if (missing.length) console.log('MISSING:', missing.join(', '));
console.log('in public/flags/4x3:', readdirSync('public/flags/4x3').length, 'files');

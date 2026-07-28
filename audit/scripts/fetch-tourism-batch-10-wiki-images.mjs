// Fetch lead images for the July 2026 tourism expansion batch from Wikipedia.
// The output includes the article and original Wikimedia file URL for auditability.
import fs from 'node:fs';
import path from 'node:path';

const OUT_DIR = path.join(process.cwd(), 'public', 'city-images');
fs.mkdirSync(OUT_DIR, { recursive: true });

const USER_AGENT = 'TripGeniusImageFetcher/1.0 (https://www.tripgenius.in; contact@tripgenius.in)';
const destinations = {
  varna: ['Varna, Bulgaria'],
  ljubljana: ['Ljubljana'],
  'lake-bled': ['Lake Bled'],
  piran: ['Piran'],
  belgrade: ['Belgrade'],
  'novi-sad': ['Novi Sad'],
  kotor: ['Kotor'],
  budva: ['Budva'],
  bratislava: ['Bratislava'],
  tallinn: ['Tallinn'],
};

async function getSummary(title) {
  const slug = encodeURIComponent(title.replaceAll(' ', '_'));
  const response = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${slug}`, {
    headers: { 'User-Agent': USER_AGENT, accept: 'application/json' },
  });
  if (!response.ok) return null;
  const summary = await response.json();
  if (summary.type === 'disambiguation') return null;
  const imageUrl = summary.originalimage?.source ?? summary.thumbnail?.source;
  if (!imageUrl) return null;
  return {
    articleTitle: summary.title,
    articleUrl: summary.content_urls?.desktop?.page,
    imageUrl,
  };
}

async function download(url, destination) {
  const response = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
  if (!response.ok) throw new Error(`Image request failed with HTTP ${response.status}`);
  const bytes = Buffer.from(await response.arrayBuffer());
  if (bytes.length < 5000) throw new Error(`Image response was only ${bytes.length} bytes`);
  fs.writeFileSync(destination, bytes);
  return bytes.length;
}

async function getCommonsMetadata(imageUrl) {
  const fileName = decodeURIComponent(new URL(imageUrl).pathname.split('/').pop());
  const title = `File:${fileName.replace(/^\d+px-/, '')}`;
  const params = new URLSearchParams({
    action: 'query',
    format: 'json',
    origin: '*',
    prop: 'imageinfo',
    titles: title,
    iiprop: 'url|extmetadata',
  });
  const response = await fetch(`https://commons.wikimedia.org/w/api.php?${params}`, {
    headers: { 'User-Agent': USER_AGENT, accept: 'application/json' },
  });
  if (!response.ok) return null;
  const data = await response.json();
  const page = Object.values(data.query?.pages ?? {})[0];
  const info = page?.imageinfo?.[0];
  if (!info) return null;
  const metadata = info.extmetadata ?? {};
  return {
    commonsFileUrl: info.descriptionurl,
    licence: metadata.LicenseShortName?.value,
    licenceUrl: metadata.LicenseUrl?.value,
    artist: metadata.Artist?.value?.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim(),
    credit: metadata.Credit?.value?.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim(),
  };
}

const results = [];
for (const [slug, titles] of Object.entries(destinations)) {
  let result = null;
  for (const title of titles) {
    const summary = await getSummary(title);
    if (!summary) continue;
    const destination = path.join(OUT_DIR, `${slug}.jpg`);
    const bytes = await download(summary.imageUrl, destination);
    const commons = await getCommonsMetadata(summary.imageUrl);
    result = { slug, status: 'ok', localPath: `/city-images/${slug}.jpg`, bytes, ...summary, ...commons };
    break;
  }
  if (!result) result = { slug, status: 'failed' };
  results.push(result);
  console.log(`${result.status === 'ok' ? 'OK' : 'FAIL'} ${slug}`);
}

const reportPath = path.join(process.cwd(), 'audit', 'tourism-batch-10-wiki-images.json');
fs.writeFileSync(reportPath, `${JSON.stringify(results, null, 2)}\n`);
console.log(`Wrote ${reportPath}`);

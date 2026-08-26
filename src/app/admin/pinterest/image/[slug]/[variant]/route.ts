// On-demand pin image renderer for /admin/pinterest — calls the exact same
// renderPin() used by the automated publish.ts, so a manually-reviewed image
// is byte-for-byte what automation would have posted. [slug] may contain an
// encoded "/" (visit-type slugs are "city/month"); Next.js decodes it back
// to a literal slash before this handler runs.
import fs from 'node:fs';
import { NextRequest, NextResponse } from 'next/server';
import { isAdminAuthorized } from '@/lib/adminAuth';
import { readQueue, getEntry } from '@/lib/pinterestQueue';
import { renderPin, type Variant } from '../../../../../../../automation/pinterest/render';

export const runtime = 'nodejs';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string; variant: string }> },
) {
  const { slug, variant } = await params;
  const key = req.nextUrl.searchParams.get('key') ?? undefined;
  if (!isAdminAuthorized(key)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  if (variant !== 'a' && variant !== 'b') {
    return NextResponse.json({ error: 'invalid variant' }, { status: 400 });
  }

  const entry = getEntry(readQueue(), slug);
  if (!entry) {
    return NextResponse.json({ error: `slug not in queue: ${slug}` }, { status: 404 });
  }

  const outPath = await renderPin(entry, variant as Variant);
  const png = fs.readFileSync(outPath);
  return new NextResponse(new Uint8Array(png), {
    headers: {
      'Content-Type': 'image/png',
      // Always re-render — this is a review tool for content that changes
      // (queue.json edits, re-runs of build-queue.ts), not a CDN asset.
      'Cache-Control': 'no-store',
    },
  });
}

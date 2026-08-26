// Server-only helpers for reading/writing automation/pinterest/queue.json
// from the Next.js app (used by /admin/pinterest). Same file, same shape,
// same 'pending' | 'posted' status field publish.ts uses — this is the
// manual-posting counterpart to that automated script, sharing its queue.
import fs from 'node:fs';
import path from 'node:path';
import type { QueueEntry } from '../../automation/pinterest/build-queue';
export type { QueueEntry };

const QUEUE_FILE = path.join(process.cwd(), 'automation', 'pinterest', 'queue.json');

export function readQueue(): QueueEntry[] {
  return JSON.parse(fs.readFileSync(QUEUE_FILE, 'utf-8'));
}

function writeQueue(queue: QueueEntry[]): void {
  fs.writeFileSync(QUEUE_FILE, JSON.stringify(queue, null, 2));
}

// Same selection order publish.ts uses (first 'pending' entry in array
// order — build-queue.ts already writes the array in priority order), minus
// whichever slugs this browsing session has already skipped.
export function nextPendingEntry(queue: QueueEntry[], skipSlugs: Set<string>): QueueEntry | null {
  return queue.find((e) => e.status === 'pending' && !skipSlugs.has(e.slug)) ?? null;
}

export function getEntry(queue: QueueEntry[], slug: string): QueueEntry | null {
  return queue.find((e) => e.slug === slug) ?? null;
}

// Marks one entry posted in place — same two fields publish.ts sets after a
// real API post, so it doesn't matter which path (automated or manual)
// posted a given pin: the queue looks identical either way.
export function markEntryPosted(slug: string): void {
  const queue = readQueue();
  const entry = getEntry(queue, slug);
  if (!entry) throw new Error(`Slug not in queue: ${slug}`);
  entry.status = 'posted';
  entry.postedAt = new Date().toISOString();
  writeQueue(queue);
}

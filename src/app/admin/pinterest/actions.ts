'use server';

import { redirect } from 'next/navigation';
import { isAdminAuthorized } from '@/lib/adminAuth';
import { markEntryPosted } from '@/lib/pinterestQueue';

// Sets the same 'status'/'postedAt' fields the automated publish.ts sets
// after a real API post — so it doesn't matter which path posted a given
// pin, the queue looks identical either way and publish.ts won't re-offer it.
export async function markPosted(formData: FormData) {
  const key = formData.get('key')?.toString();
  const slug = formData.get('slug')?.toString();
  if (!isAdminAuthorized(key)) throw new Error('unauthorized');
  if (!slug) throw new Error('missing slug');

  markEntryPosted(slug);
  redirect(`/admin/pinterest?key=${encodeURIComponent(key!)}`);
}

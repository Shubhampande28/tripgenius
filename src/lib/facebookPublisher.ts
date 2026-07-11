// Facebook Page publisher — posts a photo + caption to the TripGenius Page via
// the Graph API. Same Meta app family as the Instagram publisher; Pages use a
// PAGE access token (not the IG user token).
//
// Env:
//   FACEBOOK_PAGE_ID           — numeric Page id
//   FACEBOOK_PAGE_ACCESS_TOKEN — long-lived Page token with pages_manage_posts
//   INSTAGRAM_GRAPH_VERSION    — shared Graph version (default v24.0)

interface GraphError {
  error?: { message?: string; type?: string; code?: number };
}

export function isFacebookConfigured(): boolean {
  return Boolean(process.env.FACEBOOK_PAGE_ID && process.env.FACEBOOK_PAGE_ACCESS_TOKEN);
}

export async function publishFacebookPhotoPost(input: {
  imageUrl: string;
  caption: string;
}): Promise<{ id: string }> {
  const pageId = process.env.FACEBOOK_PAGE_ID;
  const token = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
  if (!pageId || !token) throw new Error('Facebook Page credentials are not configured');
  const graphVersion = process.env.INSTAGRAM_GRAPH_VERSION ?? 'v24.0';

  const res = await fetch(`https://graph.facebook.com/${graphVersion}/${pageId}/photos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      url: input.imageUrl,
      // Unlike Instagram, Facebook captions support clickable links — the
      // caller appends the page URL so posts drive traffic directly.
      caption: input.caption,
      access_token: token,
    }),
  });
  const data = (await res.json()) as { id?: string; post_id?: string } & GraphError;
  if (!res.ok || data.error) {
    throw new Error(data.error?.message ?? `Facebook photo post failed with ${res.status}`);
  }
  return { id: data.post_id ?? data.id ?? 'unknown' };
}

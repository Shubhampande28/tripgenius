import { generateInstagramDraft } from '@/lib/instagramDraft';
import { verifyInstagramRequest } from '@/lib/instagramAuth';
import { publishInstagramImagePost } from '@/lib/instagramPublisher';

export async function POST(request: Request) {
  const auth = verifyInstagramRequest(request);
  if (!auth.ok) return Response.json({ error: auth.error }, { status: auth.status });

  try {
    const body = (await request.json()) as {
      citySlug?: string;
      angle?: string;
      imageUrl?: string;
      publish?: boolean;
    };

    if (!body.citySlug) {
      return Response.json({ error: 'citySlug is required' }, { status: 400 });
    }

    const draft = await generateInstagramDraft({
      citySlug: body.citySlug,
      angle: body.angle,
    });

    const imageUrl = body.imageUrl || draft.suggestedImageUrl;
    const caption = `${draft.caption}\n\n${draft.hashtags.join(' ')}`;

    if (!body.publish) {
      return Response.json({ draft: { ...draft, imageUrl, caption } });
    }

    const published = await publishInstagramImagePost({ imageUrl, caption });
    return Response.json({ success: true, draft: { ...draft, imageUrl, caption }, published });
  } catch (err) {
    console.error('[/api/instagram/city-post]', err);
    return Response.json({ error: err instanceof Error ? err.message : 'Failed to create Instagram city post' }, { status: 500 });
  }
}

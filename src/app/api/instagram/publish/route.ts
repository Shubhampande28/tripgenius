import { verifyInstagramRequest } from '@/lib/instagramAuth';
import { publishInstagramImagePost } from '@/lib/instagramPublisher';

export async function POST(request: Request) {
  const auth = verifyInstagramRequest(request);
  if (!auth.ok) return Response.json({ error: auth.error }, { status: auth.status });

  try {
    const body = (await request.json()) as { imageUrl?: string; caption?: string };
    if (!body.imageUrl || !body.caption) {
      return Response.json({ error: 'imageUrl and caption are required' }, { status: 400 });
    }

    const published = await publishInstagramImagePost({
      imageUrl: body.imageUrl,
      caption: body.caption,
    });

    return Response.json({ success: true, ...published });
  } catch (err) {
    console.error('[/api/instagram/publish]', err);
    return Response.json({ error: err instanceof Error ? err.message : 'Failed to publish Instagram post' }, { status: 500 });
  }
}

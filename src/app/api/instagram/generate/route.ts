import { generateInstagramDraft } from '@/lib/instagramDraft';
import { verifyInstagramRequest } from '@/lib/instagramAuth';

export async function POST(request: Request) {
  const auth = verifyInstagramRequest(request);
  if (!auth.ok) return Response.json({ error: auth.error }, { status: auth.status });

  try {
    const body = (await request.json()) as { citySlug?: string; angle?: string };
    if (!body.citySlug) {
      return Response.json({ error: 'citySlug is required' }, { status: 400 });
    }

    const draft = await generateInstagramDraft({
      citySlug: body.citySlug,
      angle: body.angle,
    });

    return Response.json(draft);
  } catch (err) {
    console.error('[/api/instagram/generate]', err);
    return Response.json({ error: err instanceof Error ? err.message : 'Failed to generate Instagram draft' }, { status: 500 });
  }
}

import { verifyInstagramRequest } from '@/lib/instagramAuth';
import { publishInstagramImagePost } from '@/lib/instagramPublisher';

export const dynamic = 'force-dynamic';

// TEMPORARY diagnostic — remove after debugging the "Application has been
// deleted" prod-only failure. Returns a redacted fingerprint of the env vars
// this deployed function actually sees at runtime, gated behind the same
// secret as everything else here.
export async function GET(request: Request) {
  const auth = verifyInstagramRequest(request);
  if (!auth.ok) return Response.json({ error: auth.error }, { status: auth.status });
  const token = process.env.INSTAGRAM_ACCESS_TOKEN ?? '';
  return Response.json({
    businessAccountId: process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID ?? null,
    graphVersion: process.env.INSTAGRAM_GRAPH_VERSION ?? null,
    tokenLength: token.length,
    tokenLast8: token.slice(-8),
    vercelEnv: process.env.VERCEL_ENV ?? null,
    vercelUrl: process.env.VERCEL_URL ?? null,
  });
}

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

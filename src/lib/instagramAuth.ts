export function verifyInstagramRequest(request: Request) {
  const secret = process.env.INSTAGRAM_POST_SECRET;
  if (!secret) {
    return { ok: false, status: 500, error: 'INSTAGRAM_POST_SECRET is not configured' };
  }

  const auth = request.headers.get('authorization') ?? '';
  const token = auth.replace(/^Bearer\s+/i, '').trim();

  if (token !== secret) {
    return { ok: false, status: 401, error: 'Unauthorized' };
  }

  return { ok: true, status: 200, error: '' };
}

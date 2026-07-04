// Pinterest API v5 publisher. Uses an official OAuth access token — never
// account passwords (password bots violate Pinterest ToS and get accounts
// banned). Create a (free) app at https://developers.pinterest.com, generate a
// token with pins:write + boards:read scope, and set:
//   PINTEREST_ACCESS_TOKEN — the OAuth token
//   PINTEREST_BOARD_ID    — the board to pin to (from the board URL or GET /v5/boards)

interface PinterestError {
  code?: number;
  message?: string;
}

export interface CreatePinInput {
  title: string;        // ≤100 chars
  description: string;  // ≤800 chars
  link: string;         // destination URL
  imageUrl: string;     // public HTTPS image (Pinterest fetches it)
  boardId?: string;     // defaults to PINTEREST_BOARD_ID
}

function getConfig() {
  const token = process.env.PINTEREST_ACCESS_TOKEN;
  const boardId = process.env.PINTEREST_BOARD_ID;
  if (!token) throw new Error('PINTEREST_ACCESS_TOKEN is not configured');
  if (!boardId) throw new Error('PINTEREST_BOARD_ID is not configured');
  return { token, boardId };
}

export async function createPin(input: CreatePinInput): Promise<{ id: string }> {
  const { token, boardId } = getConfig();

  const res = await fetch('https://api.pinterest.com/v5/pins', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      board_id: input.boardId ?? boardId,
      title: input.title.slice(0, 100),
      description: input.description.slice(0, 800),
      link: input.link,
      media_source: { source_type: 'image_url', url: input.imageUrl },
    }),
  });

  const data = (await res.json()) as { id?: string } & PinterestError;
  if (!res.ok || !data.id) {
    throw new Error(`Pinterest pin failed (${res.status}): ${data.message ?? 'unknown error'}`);
  }
  return { id: data.id };
}

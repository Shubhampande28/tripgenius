interface GraphError {
  error?: {
    message?: string;
    type?: string;
    code?: number;
    error_subcode?: number;
  };
}

interface ContainerStatus {
  id: string;
  status_code?: 'EXPIRED' | 'ERROR' | 'FINISHED' | 'IN_PROGRESS' | 'PUBLISHED';
  status?: string;
}

interface CreateContainerResponse {
  id: string;
}

interface PublishResponse {
  id: string;
}

function getInstagramConfig() {
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
  const businessAccountId = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID;
  const graphVersion = process.env.INSTAGRAM_GRAPH_VERSION ?? 'v24.0';

  if (!accessToken || !businessAccountId) {
    throw new Error('Instagram credentials are not configured');
  }

  return {
    accessToken,
    businessAccountId,
    graphVersion,
    baseUrl: `https://graph.facebook.com/${graphVersion}`,
  };
}

async function readGraphResponse<T>(response: Response): Promise<T> {
  const data = (await response.json()) as T & GraphError;

  if (!response.ok || data.error) {
    const message = data.error?.message ?? `Graph API request failed with ${response.status}`;
    throw new Error(message);
  }

  return data;
}

async function postGraph<T>(url: string, params: URLSearchParams): Promise<T> {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params,
  });

  return readGraphResponse<T>(response);
}

async function getGraph<T>(url: string): Promise<T> {
  const response = await fetch(url, { method: 'GET' });
  return readGraphResponse<T>(response);
}

function assertPublicImageUrl(imageUrl: string) {
  let parsed: URL;
  try {
    parsed = new URL(imageUrl);
  } catch {
    throw new Error('imageUrl must be a valid public HTTPS URL');
  }

  if (parsed.protocol !== 'https:') {
    throw new Error('imageUrl must be an HTTPS URL that Meta can fetch');
  }
}

async function waitForContainer(creationId: string) {
  const { accessToken, baseUrl } = getInstagramConfig();

  for (let i = 0; i < 10; i += 1) {
    const params = new URLSearchParams({
      fields: 'status_code,status',
      access_token: accessToken,
    });
    const status = await getGraph<ContainerStatus>(`${baseUrl}/${creationId}?${params.toString()}`);

    if (status.status_code === 'FINISHED') return status;
    if (status.status_code === 'ERROR' || status.status_code === 'EXPIRED') {
      throw new Error(status.status ?? `Instagram media container ${status.status_code.toLowerCase()}`);
    }

    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  throw new Error('Instagram media container was not ready in time');
}

export async function publishInstagramImagePost(input: { imageUrl: string; caption: string }) {
  const { imageUrl, caption } = input;
  const { accessToken, businessAccountId, baseUrl } = getInstagramConfig();

  if (!caption.trim()) throw new Error('caption is required');
  assertPublicImageUrl(imageUrl);

  const container = await postGraph<CreateContainerResponse>(
    `${baseUrl}/${businessAccountId}/media`,
    new URLSearchParams({
      image_url: imageUrl,
      caption,
      access_token: accessToken,
    }),
  );

  await waitForContainer(container.id);

  const published = await postGraph<PublishResponse>(
    `${baseUrl}/${businessAccountId}/media_publish`,
    new URLSearchParams({
      creation_id: container.id,
      access_token: accessToken,
    }),
  );

  return {
    id: published.id,
    creationId: container.id,
  };
}

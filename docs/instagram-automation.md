# Instagram Automation

This integration keeps Instagram and Claude credentials server-side and exposes protected API routes for draft generation and publishing.

## Required env vars

Add these to `.env.local` on the server:

```bash
ANTHROPIC_API_KEY=your_anthropic_api_key
INSTAGRAM_BUSINESS_ACCOUNT_ID=17841400008460056
INSTAGRAM_ACCESS_TOKEN=your_long_lived_instagram_token
INSTAGRAM_GRAPH_VERSION=v24.0
INSTAGRAM_POST_SECRET=choose_a_long_random_secret
```

Never use `NEXT_PUBLIC_` for Instagram tokens or app secrets.

## Endpoints

All endpoints require:

```http
Authorization: Bearer $INSTAGRAM_POST_SECRET
```

Generate a Claude draft:

```bash
curl -X POST https://your-domain.com/api/instagram/generate \
  -H "Authorization: Bearer $INSTAGRAM_POST_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"citySlug":"bali","angle":"first-time visitors"}'
```

Publish an already approved image post:

```bash
curl -X POST https://your-domain.com/api/instagram/publish \
  -H "Authorization: Bearer $INSTAGRAM_POST_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"imageUrl":"https://example.com/photo.jpg","caption":"Caption text #travel"}'
```

Generate a city post and optionally publish it:

```bash
curl -X POST https://your-domain.com/api/instagram/city-post \
  -H "Authorization: Bearer $INSTAGRAM_POST_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"citySlug":"jaipur","publish":false}'
```

Set `publish` to `true` only after confirming the generated caption and image URL are safe to post.

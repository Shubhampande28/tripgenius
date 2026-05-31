import Anthropic from '@anthropic-ai/sdk';
import { allCities } from '@/lib/cities';
import { City } from '@/lib/types';

export interface InstagramDraft {
  caption: string;
  hashtags: string[];
  altText: string;
  suggestedImageUrl: string;
  citySlug: string;
  cityName: string;
}

interface DraftOptions {
  citySlug: string;
  angle?: string;
}

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

function getCity(citySlug: string) {
  return allCities.find((city) => city.slug === citySlug && !city.stub);
}

function topNames<T extends { name: string }>(items: T[] | undefined, count: number) {
  return (items ?? []).slice(0, count).map((item) => item.name);
}

function buildPrompt(city: City, angle?: string) {
  const attractions = topNames(city.thingsToDo, 10);
  const areas = topNames(city.areas, 6);
  const restaurants = topNames(city.restaurants, 5);

  return `Create one Instagram travel post for TripGenius. Return valid JSON only.

City:
- Name: ${city.name}, ${city.country}
- Tagline: ${city.tagline}
- Description: ${city.description}
- Best time: ${city.stats.bestTime}
- Budget: ${city.stats.budget}
- Key attractions: ${attractions.join(', ')}
- Areas: ${areas.join(', ')}
- Restaurants: ${restaurants.join(', ')}
- Angle: ${angle || 'make travellers want to save this city guide'}

Rules:
- Caption must be 900 characters or fewer.
- Make it practical, polished, and specific.
- Avoid fake personal claims.
- Include a clear save/share call-to-action.
- Hashtags must be 8 to 14 short travel hashtags, no spaces.
- Alt text must describe the visual in one sentence.

JSON shape:
{
  "caption": "string",
  "hashtags": ["string"],
  "altText": "string"
}`;
}

function parseJson(text: string) {
  const raw = text.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
  return JSON.parse(raw) as Pick<InstagramDraft, 'caption' | 'hashtags' | 'altText'>;
}

export async function generateInstagramDraft(options: DraftOptions): Promise<InstagramDraft> {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY is not configured');
  }

  const city = getCity(options.citySlug);
  if (!city) {
    throw new Error('City not found');
  }

  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1200,
    system: 'You are a senior travel social media editor. Always return valid JSON only.',
    messages: [{ role: 'user', content: buildPrompt(city, options.angle) }],
  });

  const textContent = message.content.find((content) => content.type === 'text');
  if (!textContent || textContent.type !== 'text') {
    throw new Error('No text response from Claude');
  }

  const draft = parseJson(textContent.text);
  const hashtags = draft.hashtags.map((tag) => (tag.startsWith('#') ? tag : `#${tag}`));

  return {
    caption: draft.caption,
    hashtags,
    altText: draft.altText,
    suggestedImageUrl: city.heroImage || city.image,
    citySlug: city.slug,
    cityName: city.name,
  };
}

import Anthropic from '@anthropic-ai/sdk';
import { TripPlanRequest, TripItinerary } from '@/lib/types';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

function buildPrompt(req: TripPlanRequest): string {
  const start = new Date(req.startDate);
  const end = new Date(req.endDate);
  const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

  const dateFormatter = new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  return `You are an expert travel planner. Create a detailed, personalized travel itinerary and return it as valid JSON only — no markdown, no explanation, just the JSON object.

Trip details:
- Destination: ${req.destination}
- Dates: ${dateFormatter.format(start)} to ${dateFormatter.format(end)} (${days} days)
- Travellers: ${req.people} ${req.people === 1 ? 'person' : 'people'}
- Travel style: ${req.style}
- Interests: ${req.interests.length > 0 ? req.interests.join(', ') : 'general sightseeing'}

Return a JSON object matching this exact TypeScript interface:

{
  destination: string,          // e.g. "Bali, Indonesia"
  duration: string,             // e.g. "7 Days"
  style: string,                // e.g. "Adventure"
  overview: string,             // 2-3 sentence trip overview/teaser
  days: Array<{
    day: number,
    date: string,               // formatted date e.g. "Monday, June 10"
    theme: string,              // catchy theme for the day e.g. "Sacred Temples & Jungle Walks"
    morning: {
      time: "Morning",
      activity: string,         // specific activity/place name
      description: string,      // 2-3 sentences with rich detail
      tip?: string              // optional insider tip
    },
    afternoon: {
      time: "Afternoon",
      activity: string,
      description: string,
      tip?: string
    },
    evening: {
      time: "Evening",
      activity: string,
      description: string,
      tip?: string
    }
  }>,
  budget: Array<{
    category: string,           // e.g. "Accommodation", "Food & Dining", "Activities", "Transport", "Total"
    amount: string,             // e.g. "$45–80/night" or "$280–450 total"
    note: string                // brief explanation
  }>,
  packingTips: string[],        // 6-8 essential items/tips for this specific trip
  bestAdvice: string            // one powerful piece of advice for this trip
}

Make every activity specific and real. Use actual restaurant names, attraction names, and local details. The descriptions should feel like they were written by someone who has lived in ${req.destination}. Tailor everything to the ${req.style} travel style.`;
}

export async function POST(request: Request) {
  try {
    const body: TripPlanRequest = await request.json();

    if (!body.destination || !body.startDate || !body.endDate || !body.style) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return Response.json({ error: 'API key not configured' }, { status: 500 });
    }

    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      system: 'You are an expert travel planner. Always respond with valid JSON only — no markdown code blocks, no explanation text, just a raw JSON object.',
      messages: [
        {
          role: 'user',
          content: buildPrompt(body),
        },
      ],
    });

    const textContent = message.content.find((c) => c.type === 'text');
    if (!textContent || textContent.type !== 'text') {
      return Response.json({ error: 'No response from AI' }, { status: 500 });
    }

    let raw = textContent.text.trim();
    // Strip any accidental markdown fences
    raw = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();

    const itinerary: TripItinerary = JSON.parse(raw);
    return Response.json(itinerary);
  } catch (err) {
    console.error('[/api/plan]', err);
    if (err instanceof SyntaxError) {
      return Response.json({ error: 'AI returned invalid JSON — please try again' }, { status: 500 });
    }
    return Response.json({ error: 'Failed to generate itinerary' }, { status: 500 });
  }
}

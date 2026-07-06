import { TripPlanRequest } from '@/lib/types';
import { generateTripItinerary } from '@/lib/planEngine';

export async function POST(request: Request) {
  try {
    const body: TripPlanRequest = await request.json();

    if (!body.destination || !body.startDate || !body.endDate || !body.style) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const itinerary = generateTripItinerary(body);
    if (!itinerary) {
      return Response.json(
        { error: `We don't have data for "${body.destination}" yet — try a destination like Bali, Goa, Dubai, Thailand, or Paris.` },
        { status: 404 },
      );
    }

    return Response.json(itinerary);
  } catch {
    return Response.json({ error: 'Failed to generate itinerary' }, { status: 500 });
  }
}

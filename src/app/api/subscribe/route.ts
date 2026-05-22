/**
 * Email subscription API.
 *
 * Works out of the box — logs the email.
 * To enable Mailchimp, add to .env.local:
 *   MAILCHIMP_API_KEY=your-api-key-here
 *   MAILCHIMP_LIST_ID=your-list-id
 *   MAILCHIMP_DC=us1   (the datacenter in your API key, e.g. us1, us21)
 */

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes('@')) {
      return Response.json({ error: 'Valid email required' }, { status: 400 });
    }

    // ── Mailchimp integration (activates when env vars are set) ──
    const apiKey = process.env.MAILCHIMP_API_KEY;
    const listId = process.env.MAILCHIMP_LIST_ID;
    const dc     = process.env.MAILCHIMP_DC ?? 'us1';

    if (apiKey && listId) {
      const mcRes = await fetch(
        `https://${dc}.api.mailchimp.com/3.0/lists/${listId}/members`,
        {
          method: 'POST',
          headers: {
            Authorization: `apikey ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email_address: email,
            status: 'subscribed',
            tags: ['tripgenius-waitlist'],
          }),
        }
      );

      if (!mcRes.ok) {
        const err = await mcRes.json();
        // Already subscribed is fine
        if (err.title !== 'Member Exists') {
          console.error('[subscribe] Mailchimp error:', err);
          return Response.json({ error: 'Could not subscribe. Please try again.' }, { status: 500 });
        }
      }

      return Response.json({ success: true, provider: 'mailchimp' });
    }

    // ── No provider configured — log and succeed ──
    console.log(`[subscribe] New signup: ${email}`);
    return Response.json({ success: true, provider: 'log' });

  } catch (err) {
    console.error('[subscribe]', err);
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}

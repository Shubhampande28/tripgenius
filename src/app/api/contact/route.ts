export async function POST(req: Request) {
  try {
    const { name, email, subject, message } = await req.json();

    if (!name || !email || !message) {
      return Response.json({ error: 'Name, email, and message are required.' }, { status: 400 });
    }

    if (!email.includes('@')) {
      return Response.json({ error: 'Valid email required.' }, { status: 400 });
    }

    // Log contact submission (add Resend/SendGrid integration here later)
    console.log('[contact]', { name, email, subject, message, ts: new Date().toISOString() });

    return Response.json({ success: true });
  } catch (err) {
    console.error('[contact]', err);
    return Response.json({ error: 'Server error. Please try again.' }, { status: 500 });
  }
}

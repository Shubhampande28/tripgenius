// Telegram channel publisher — posts a photo + caption to the TripGenius
// channel via the Bot API. Setup is self-serve (no app review, unlike
// Meta/X/LinkedIn): message @BotFather on Telegram, /newbot, get a token;
// create a public channel, add the bot as admin, use @channelname as the
// chat id (or the numeric id for a private channel).
//
// Env:
//   TELEGRAM_BOT_TOKEN    — from @BotFather
//   TELEGRAM_CHANNEL_ID   — e.g. "@tripgenius" or a numeric -100... id

interface TelegramError {
  ok: false;
  description?: string;
}

export function isTelegramConfigured(): boolean {
  return Boolean(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHANNEL_ID);
}

export async function publishTelegramPhotoPost(input: {
  imageUrl: string;
  caption: string;
}): Promise<{ id: string }> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHANNEL_ID;
  if (!token || !chatId) throw new Error('Telegram credentials are not configured');

  const res = await fetch(`https://api.telegram.org/bot${token}/sendPhoto`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      photo: input.imageUrl,
      // Telegram captions support clickable links (unlike Instagram), so the
      // caller includes the page URL directly, same as Facebook's approach.
      caption: input.caption,
      parse_mode: 'HTML',
    }),
  });
  const data = (await res.json()) as { ok: boolean; result?: { message_id?: number } } & TelegramError;
  if (!res.ok || !data.ok) {
    throw new Error(data.description ?? `Telegram sendPhoto failed with ${res.status}`);
  }
  return { id: String(data.result?.message_id ?? 'unknown') };
}

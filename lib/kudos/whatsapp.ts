import type { Recognition } from './types';

// WhatsApp integration is stubbed pending provider selection.
// Set WHATSAPP_WEBHOOK_URL in env to enable posting to a webhook
// (e.g. a Twilio WhatsApp webhook, Meta Cloud API, or similar).
export async function postToWhatsApp(recognition: Recognition): Promise<void> {
  const to = recognition.recipientNames.join(' & ');
  const categoryLabel = recognition.category.replace(/-/g, ' ');
  const message =
    `🏆 *Coach Kudos*\n\n` +
    `*${recognition.giverName}* gave kudos to *${to}* 👏\n\n` +
    `📌 _${categoryLabel}_\n\n` +
    `"${recognition.note}"`;

  if (process.env.WHATSAPP_WEBHOOK_URL) {
    try {
      await fetch(process.env.WHATSAPP_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });
    } catch (err) {
      console.error('[WhatsApp] Failed to post recognition:', err);
    }
  } else {
    console.log('[WhatsApp stub] Would post to group:\n', message);
  }
}

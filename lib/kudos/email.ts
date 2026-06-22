import { Resend } from 'resend';
import type { Recognition, Boost } from './types';

function getResend() {
  if (!process.env.RESEND_API_KEY) return null;
  return new Resend(process.env.RESEND_API_KEY);
}

const FROM_ADDRESS = process.env.RESEND_FROM ?? 'Coach Kudos <kudos@bridportyfc.com>';

export async function sendKudosEmail(recognition: Recognition, recipientEmails: string[]): Promise<void> {
  const resend = getResend();
  if (!resend || recipientEmails.length === 0) {
    console.log('[Email stub] Would send kudos email to:', recipientEmails);
    return;
  }

  const categoryLabel = recognition.category
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  const html = `
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px; background: #f9fafb;">
      <div style="background: #166534; border-radius: 16px; padding: 32px; text-align: center; margin-bottom: 24px;">
        <div style="font-size: 48px; margin-bottom: 8px;">🏆</div>
        <h1 style="color: white; margin: 0; font-size: 24px;">You got kudos!</h1>
        <p style="color: #86efac; margin: 8px 0 0;">Bridport Youth Football Club</p>
      </div>
      <div style="background: white; border-radius: 12px; padding: 24px; border: 1px solid #e5e7eb;">
        <p style="color: #374151; margin: 0 0 16px;">
          <strong>${recognition.giverName}</strong> recognised you 👏
        </p>
        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 12px 16px; margin-bottom: 16px;">
          <span style="color: #166534; font-size: 13px; font-weight: 600;">${categoryLabel}</span>
        </div>
        <blockquote style="border-left: 3px solid #16a34a; margin: 0; padding: 0 0 0 16px; color: #4b5563; font-style: italic; line-height: 1.6;">
          "${recognition.note}"
        </blockquote>
      </div>
      <p style="text-align: center; color: #9ca3af; font-size: 12px; margin-top: 24px;">
        Coach Kudos · Bridport Youth Football Club
      </p>
    </div>
  `;

  try {
    const result = await resend.emails.send({
      from: FROM_ADDRESS,
      to: recipientEmails,
      subject: `🏆 ${recognition.giverName} gave you kudos!`,
      html,
    });
    console.log('[Email] Resend response:', JSON.stringify(result));
  } catch (err) {
    console.error('[Email] Failed to send kudos email:', err);
  }
}

export async function sendBoostEmail(recognition: Recognition, boost: Boost, recipientEmails: string[]): Promise<void> {
  const resend = getResend();
  if (!resend || recipientEmails.length === 0) {
    console.log('[Email stub] Would send boost email to:', recipientEmails);
    return;
  }

  const categoryLabel = recognition.category
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  const html = `
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px; background: #f9fafb;">
      <div style="background: #166534; border-radius: 16px; padding: 32px; text-align: center; margin-bottom: 24px;">
        <div style="font-size: 48px; margin-bottom: 8px;">⭐</div>
        <h1 style="color: white; margin: 0; font-size: 24px;">Your kudos got a boost!</h1>
        <p style="color: #86efac; margin: 8px 0 0;">Bridport Youth Football Club</p>
      </div>
      <div style="background: white; border-radius: 12px; padding: 24px; border: 1px solid #e5e7eb;">
        <p style="color: #374151; margin: 0 0 16px;">
          The Chairman wanted to add a note to the kudos <strong>${recognition.giverName}</strong> gave you:
        </p>
        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 12px 16px; margin-bottom: 16px;">
          <span style="color: #166534; font-size: 13px; font-weight: 600;">${categoryLabel}</span>
        </div>
        <blockquote style="border-left: 3px solid #16a34a; margin: 0 0 16px; padding: 0 0 0 16px; color: #4b5563; font-style: italic; line-height: 1.6;">
          "${recognition.note}"
        </blockquote>
        <div style="background: #fefce8; border: 1px solid #fde047; border-radius: 8px; padding: 12px 16px;">
          <p style="color: #854d0e; font-size: 13px; font-weight: 600; margin: 0 0 6px;">⭐ Chairman's boost</p>
          <p style="color: #713f12; margin: 0; line-height: 1.6;">"${boost.comment}"</p>
        </div>
      </div>
      <p style="text-align: center; color: #9ca3af; font-size: 12px; margin-top: 24px;">
        Coach Kudos · Bridport Youth Football Club
      </p>
    </div>
  `;

  try {
    const result = await resend.emails.send({
      from: FROM_ADDRESS,
      to: recipientEmails,
      subject: `⭐ Your kudos got a boost from the Chairman!`,
      html,
    });
    console.log('[Email] Boost resend response:', JSON.stringify(result));
  } catch (err) {
    console.error('[Email] Failed to send boost email:', err);
  }
}

import { Resend } from 'resend';
import type { Recognition, Boost } from './types';

function getResend() {
  if (!process.env.RESEND_API_KEY) return null;
  return new Resend(process.env.RESEND_API_KEY);
}

const FROM_ADDRESS = process.env.RESEND_FROM ?? 'Coach Kudos <kudos@bridportyfc.com>';

export async function sendMonthlyThanksEmail(recipientEmails: string[], chairmanName: string): Promise<void> {
  const resend = getResend();
  if (!resend || recipientEmails.length === 0) {
    console.log('[Email stub] Would send monthly thanks to:', recipientEmails);
    return;
  }
  const html = `
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px; background: #f9fafb;">
      <div style="background: #166534; border-radius: 16px; padding: 32px; text-align: center; margin-bottom: 24px;">
        <div style="font-size: 48px; margin-bottom: 8px;">💚</div>
        <h1 style="color: white; margin: 0; font-size: 24px;">Thank you from the Chairman</h1>
        <p style="color: #86efac; margin: 8px 0 0;">Bridport Youth Football Club</p>
      </div>
      <div style="background: white; border-radius: 12px; padding: 24px; border: 1px solid #e5e7eb;">
        <p style="color: #374151; line-height: 1.7; margin: 0;">
          I just wanted to take a moment to say <strong>thank you</strong> for everything you do for Bridport Youth Football Club.
        </p>
        <p style="color: #374151; line-height: 1.7; margin: 16px 0 0;">
          The time you give, the effort you put in week after week — it doesn't go unnoticed. You make a real difference to the kids and to this club.
        </p>
        <p style="color: #374151; line-height: 1.7; margin: 16px 0 0;">
          With appreciation,<br/><strong>${chairmanName}</strong>
        </p>
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
      subject: `💚 A message from the Chairman — thank you`,
      html,
    });
    console.log('[Email] Monthly thanks response:', JSON.stringify(result));
  } catch (err) {
    console.error('[Email] Failed to send monthly thanks:', err);
  }
}

export async function sendAllKudosGivenEmail(coachName: string, email: string, chairmanName: string, limit: number): Promise<void> {
  const resend = getResend();
  if (!resend) {
    console.log('[Email stub] Would send all-kudos-given email to:', email);
    return;
  }
  const html = `
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px; background: #f9fafb;">
      <div style="background: #166534; border-radius: 16px; padding: 32px; text-align: center; margin-bottom: 24px;">
        <div style="font-size: 48px; margin-bottom: 8px;">🌟</div>
        <h1 style="color: white; margin: 0; font-size: 24px;">You're a star, ${coachName.split(' ')[0]}!</h1>
        <p style="color: #86efac; margin: 8px 0 0;">Bridport Youth Football Club</p>
      </div>
      <div style="background: white; border-radius: 12px; padding: 24px; border: 1px solid #e5e7eb;">
        <p style="color: #374151; line-height: 1.7; margin: 0;">
          You've used all ${limit} of your Coach Kudos this month — and that means a lot.
        </p>
        <p style="color: #374151; line-height: 1.7; margin: 16px 0 0;">
          Taking the time to recognise your fellow coaches makes this club a better place. It builds the kind of culture we're all proud to be part of.
        </p>
        <p style="color: #374151; line-height: 1.7; margin: 16px 0 0;">
          Thank you for making the effort,<br/><strong>${chairmanName}</strong>
        </p>
      </div>
      <p style="text-align: center; color: #9ca3af; font-size: 12px; margin-top: 24px;">
        Coach Kudos · Bridport Youth Football Club
      </p>
    </div>
  `;
  try {
    const result = await resend.emails.send({
      from: FROM_ADDRESS,
      to: [email],
      subject: `🌟 Thanks for giving all your kudos this month, ${coachName.split(' ')[0]}`,
      html,
    });
    console.log('[Email] All-kudos-given response:', JSON.stringify(result));
  } catch (err) {
    console.error('[Email] Failed to send all-kudos-given email:', err);
  }
}

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
    const { writeLog } = await import('./log');
    await writeLog('email_failed', `Kudos email failed to ${recipientEmails.join(', ')}`, { error: String(err) });
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

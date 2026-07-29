/**
 * Bashir&Co — contact channels (real, client-supplied).
 *
 * The house has no email address: every inquiry goes through WhatsApp
 * (primary — the "Оставить запрос" button opens it with the message
 * pre-filled) or Telegram. Nothing here is a placeholder.
 */

/** Telegram handle, shown as text and linked to t.me. */
export const CONTACT_TELEGRAM = "@luciani001";
export const CONTACT_TELEGRAM_URL = "https://t.me/luciani001";

/** WhatsApp — digits only for the wa.me link, plus a display form. */
export const CONTACT_WHATSAPP_NUMBER = "77013130000";
export const CONTACT_WHATSAPP_DISPLAY = "+7 701 313 00 00";
export const CONTACT_WHATSAPP_URL = `https://wa.me/${CONTACT_WHATSAPP_NUMBER}`;

/**
 * Build a WhatsApp link with a pre-filled message — used by the inquiry
 * form and by every "Оставить запрос" CTA.
 */
export function whatsappLink(message: string): string {
  return `${CONTACT_WHATSAPP_URL}?text=${encodeURIComponent(message)}`;
}

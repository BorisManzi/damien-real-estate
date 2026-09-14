const DEFAULT_PHONE = "250788000000";

export function getWhatsAppPhone(): string {
  return (
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, "") || DEFAULT_PHONE
  );
}

export function buildWhatsAppUrl(message: string): string {
  const phone = getWhatsAppPhone();
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export function propertyInterestMessage(title: string, location: string): string {
  return `Hello Damien, I'm interested in the ${title} in ${location}. Is it still available?`;
}

export function generalHelpMessage(): string {
  return "Hello Damien, I'm looking for a place in Rwanda. Can you help me?";
}

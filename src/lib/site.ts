export const SITE = {
  name: "Damien Real Estate",
  tagline: "Find your place in Rwanda.",
  description:
    "Homes, apartments and properties in Rwanda — made easier to find. Search rentals, homes for sale and land with Damien.",
  url: "https://damien.rw",
  phoneDisplay: "+250 788 123 456",
  phoneE164: "+250788123456",
  email: "hello@damien.rw",
  location: "Kigali, Rwanda",
  instagram: "https://instagram.com/damienrealestate",
} as const;

export const WHATSAPP_PHONE =
  (typeof import.meta !== "undefined" && import.meta.env.VITE_WHATSAPP_PHONE
    ? String(import.meta.env.VITE_WHATSAPP_PHONE)
    : "250788123456"
  ).replace(/[^\d]/g, "");

export function whatsappUrl(message: string) {
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
}

export function defaultWhatsappMessage() {
  return "Hello Damien, I’m looking for a place in Rwanda. Can you help me find something?";
}

export function propertyWhatsappMessage(title: string, location: string) {
  return `Hello Damien, I’m interested in the ${title} in ${location}. Is it still available?`;
}

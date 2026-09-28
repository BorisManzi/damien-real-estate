import { defaultWhatsappMessage, whatsappUrl } from "@/lib/site";

export function WhatsAppFab() {
  return (
    <a
      href={whatsappUrl(defaultWhatsappMessage())}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with Damien on WhatsApp"
      className="fixed bottom-20 right-4 z-30 inline-flex size-12 items-center justify-center rounded-full bg-whatsapp text-paper shadow-border-hover transition-transform duration-150 hover:scale-105 lg:bottom-6 lg:right-6"
    >
      <svg viewBox="0 0 24 24" className="size-6" fill="currentColor" aria-hidden>
        <path d="M12.04 2c-5.5 0-10 4.46-10 9.96 0 1.76.46 3.48 1.34 5L2 22l4.16-1.36A10 10 0 0 0 12.04 22c5.5 0 9.96-4.5 9.96-10S17.54 2 12.04 2Zm5.8 14.24c-.24.68-1.4 1.26-1.94 1.34-.5.08-1.12.12-1.82-.12-.42-.14-.96-.32-1.66-.62-2.92-1.26-4.82-4.2-4.96-4.4-.14-.18-1.16-1.54-1.16-2.94s.74-2.08 1-2.36c.24-.28.54-.34.72-.34h.52c.16 0 .4-.06.62.48.24.56.8 1.94.86 2.08.08.14.12.3.02.48-.1.18-.14.3-.28.46-.14.16-.3.36-.42.48-.14.14-.28.28-.12.54.16.28.72 1.18 1.54 1.92 1.06.94 1.94 1.24 2.22 1.38.28.14.44.12.6-.06.16-.18.7-.82.88-1.1.18-.28.36-.22.62-.12.24.1 1.56.74 1.82.86.28.14.46.2.52.3.08.12.08.68-.16 1.36Z" />
      </svg>
    </a>
  );
}

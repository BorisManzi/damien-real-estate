"use client";

import { WhatsAppButton } from "@/components/contact/WhatsAppButton";
import { FavoriteButton } from "@/components/property/FavoriteButton";
import { Button } from "@/components/ui/Button";
import {
  buildWhatsAppUrl,
  propertyInterestMessage,
} from "@/lib/whatsapp";
import { formatLocation, formatPrice } from "@/lib/format";
import type { Property } from "@/types/property";
import { Share2 } from "lucide-react";
import Link from "next/link";

export function PropertyActionPanel({ property }: { property: Property }) {
  const location = formatLocation(property);
  const waMessage = propertyInterestMessage(property.title, location);

  async function share() {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (navigator.share) {
      await navigator.share({
        title: property.title,
        text: `Check out ${property.title} on Damien Real Estate`,
        url,
      });
      return;
    }
    await navigator.clipboard.writeText(url);
  }

  return (
    <aside className="rounded-2xl border border-border bg-white p-5 shadow-sm lg:sticky lg:top-24">
      <p className="font-display text-2xl font-bold text-green">
        {formatPrice(property.price, property.currency, property.pricePeriod)}
      </p>
      <p className="mt-1 text-sm text-muted">{location}</p>

      <div className="mt-5 grid gap-2">
        <Link
          href={`/contact?property=${property.slug}&intent=viewing`}
          className="block"
        >
          <Button className="w-full" size="lg" variant="accent">
            Schedule a viewing
          </Button>
        </Link>
        <Link href={`/contact?property=${property.slug}`} className="block">
          <Button className="w-full" size="lg" variant="primary">
            Contact Damien
          </Button>
        </Link>
        <WhatsAppButton
          message={waMessage}
          label="Ask about this property"
          variant="secondary"
          size="lg"
          className="w-full"
        />
      </div>

      <div className="mt-4 flex items-center gap-2 border-t border-border pt-4">
        <div className="relative">
          <FavoriteButton propertyId={property.id} className="static shadow-none border border-border" />
        </div>
        <button
          type="button"
          onClick={share}
          className="inline-flex h-9 flex-1 items-center justify-center gap-2 rounded-full border border-border text-sm font-medium text-charcoal hover:bg-cream"
        >
          <Share2 className="h-4 w-4" />
          Share
        </button>
        <a
          href={buildWhatsAppUrl(waMessage)}
          className="sr-only"
          tabIndex={-1}
        >
          WhatsApp
        </a>
      </div>
    </aside>
  );
}

export function MobileStickyCTA({ property }: { property: Property }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-cream/95 p-3 backdrop-blur-md lg:hidden">
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-charcoal">
            {formatPrice(property.price, property.currency, property.pricePeriod)}
          </p>
        </div>
        <Link href={`/contact?property=${property.slug}&intent=viewing`}>
          <Button variant="accent" size="md">
            Schedule viewing
          </Button>
        </Link>
      </div>
    </div>
  );
}

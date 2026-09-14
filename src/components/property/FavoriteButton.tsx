"use client";

import { cn } from "@/lib/utils";
import { Heart } from "lucide-react";
import { useEffect, useState } from "react";

const STORAGE_KEY = "damien-saved-properties";

export function FavoriteButton({
  propertyId,
  className,
}: {
  propertyId: string;
  className?: string;
}) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const ids: string[] = raw ? JSON.parse(raw) : [];
      setSaved(ids.includes(propertyId));
    } catch {
      setSaved(false);
    }
  }, [propertyId]);

  function toggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const ids: string[] = raw ? JSON.parse(raw) : [];
      const next = ids.includes(propertyId)
        ? ids.filter((id) => id !== propertyId)
        : [...ids, propertyId];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setSaved(next.includes(propertyId));
    } catch {
      /* ignore */
    }
  }

  return (
    <button
      type="button"
      aria-label={saved ? "Remove from saved" : "Save property"}
      aria-pressed={saved}
      onClick={toggle}
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-charcoal shadow-sm backdrop-blur transition-transform hover:scale-105 active:scale-95",
        className
      )}
    >
      <Heart
        className={cn(
          "h-4 w-4 transition-colors",
          saved ? "fill-accent text-accent" : "text-charcoal"
        )}
      />
    </button>
  );
}

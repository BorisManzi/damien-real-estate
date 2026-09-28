import { Heart } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useFavorites } from "@/lib/favorites";

export function FavoriteButton({
  id,
  className,
  invert = false,
}: {
  id: string;
  className?: string;
  invert?: boolean;
}) {
  const has = useFavorites((s) => s.ids.includes(id));
  const toggle = useFavorites((s) => s.toggle);
  const [pop, setPop] = useState(false);

  return (
    <button
      type="button"
      aria-pressed={has}
      aria-label={has ? "Remove from saved" : "Save property"}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(id);
        setPop(true);
        window.setTimeout(() => setPop(false), 280);
      }}
      className={cn(
        "inline-flex size-10 items-center justify-center rounded-full transition-colors duration-150",
        invert
          ? "bg-green-ink/40 text-cream hover:bg-green-ink/60"
          : "bg-paper/90 text-charcoal shadow-border hover:bg-paper",
        className,
      )}
    >
      <Heart
        className={cn("size-4", pop && "heart-pop", has && "fill-terracotta text-terracotta")}
        strokeWidth={1.75}
      />
    </button>
  );
}

import { X } from "lucide-react";
import { useEffect } from "react";
import { PropertySearch } from "@/components/search/property-search";

export function SearchSheet({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onOpenChange(false);
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-cream"
      role="dialog"
      aria-modal="true"
      aria-labelledby="search-sheet-title"
    >
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <h2
          id="search-sheet-title"
          className="font-display text-lg font-semibold tracking-tight"
        >
          Search properties
        </h2>
        <button
          type="button"
          className="inline-flex size-11 items-center justify-center rounded-full hover:bg-cream-dark"
          aria-label="Close search"
          onClick={() => onOpenChange(false)}
        >
          <X className="size-5" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-5">
        <PropertySearch
          variant="sheet"
          onSearched={() => onOpenChange(false)}
        />
      </div>
    </div>
  );
}

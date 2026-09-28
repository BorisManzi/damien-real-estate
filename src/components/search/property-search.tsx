import { useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/select-native";
import { LOCATIONS, PROPERTY_TYPES } from "@/data/properties";
import {
  budgetsFor,
  type PropertySearch as SearchValues,
} from "@/lib/filters";
import type { PropertyKind, TransactionType } from "@/data/properties";
import { cn } from "@/lib/utils";

const TABS: { id: TransactionType; label: string }[] = [
  { id: "rent", label: "Rent" },
  { id: "buy", label: "Buy" },
  { id: "land", label: "Land" },
];

export function PropertySearch({
  variant = "hero",
  initial,
  onSearched,
}: {
  variant?: "hero" | "page" | "sheet";
  initial?: SearchValues;
  onSearched?: () => void;
}) {
  const navigate = useNavigate();
  const [intent, setIntent] = useState<TransactionType>(initial?.intent ?? "rent");
  const [location, setLocation] = useState(initial?.location ?? "");
  const [type, setType] = useState<PropertyKind | "">(initial?.type ?? "");
  const [budget, setBudget] = useState(initial?.budget ?? "");

  const budgets = useMemo(() => budgetsFor(intent), [intent]);

  function submit(e: FormEvent) {
    e.preventDefault();
    const search = {
      intent,
      location: location || undefined,
      type: type || undefined,
      budget: budget || undefined,
    };
    const to =
      intent === "rent" ? "/rent" : intent === "buy" ? "/buy" : "/land";
    void navigate({ to, search });
    onSearched?.();
  }

  return (
    <form
      onSubmit={submit}
      className={cn(
        variant === "hero" &&
          "rounded-xl bg-paper p-3 shadow-border sm:p-4",
        variant === "page" && "w-full",
        variant === "sheet" && "flex flex-col gap-5",
      )}
    >
      {variant !== "page" ? (
        <p className="px-1 text-sm font-medium text-quiet">
          What are you looking for?
        </p>
      ) : null}

      <div
        className={cn(
          "flex gap-1 p-1",
          variant === "hero" && "mt-2 rounded-full bg-cream",
          variant === "sheet" && "rounded-full bg-cream",
          variant === "page" && "mb-3 w-fit rounded-full bg-cream-dark",
        )}
        role="tablist"
        aria-label="Search type"
      >
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={intent === tab.id}
            onClick={() => {
              setIntent(tab.id);
              setBudget("");
              if (tab.id === "land") setType("land");
              else if (type === "land") setType("");
            }}
            className={cn(
              "h-9 min-w-16 rounded-full px-4 text-sm font-medium transition-colors",
              intent === tab.id
                ? "bg-green text-cream"
                : "text-quiet hover:text-charcoal",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div
        className={cn(
          variant === "hero" &&
            "mt-3 grid grid-cols-1 gap-3 md:grid-cols-[1.2fr_1fr_1.1fr_auto]",
          variant === "page" && "grid grid-cols-1 gap-3 sm:grid-cols-3",
          variant === "sheet" && "grid grid-cols-1 gap-4",
        )}
      >
        <Field label="Location" htmlFor={`loc-${variant}`}>
          <NativeSelect
            id={`loc-${variant}`}
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          >
            <option value="">Anywhere in Rwanda</option>
            {LOCATIONS.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </NativeSelect>
        </Field>
        <Field label="Property type" htmlFor={`type-${variant}`}>
          <NativeSelect
            id={`type-${variant}`}
            value={type}
            onChange={(e) => setType(e.target.value as PropertyKind | "")}
          >
            {PROPERTY_TYPES.filter((t) =>
              intent === "land" ? t.value === "" || t.value === "land" : t.value !== "land",
            ).map((t) => (
              <option key={t.label} value={t.value}>
                {t.label}
              </option>
            ))}
          </NativeSelect>
        </Field>
        <Field label="Budget" htmlFor={`budget-${variant}`}>
          <NativeSelect
            id={`budget-${variant}`}
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
          >
            {budgets.map((b) => (
              <option key={b.label} value={b.value}>
                {b.label}
              </option>
            ))}
          </NativeSelect>
        </Field>
        {variant !== "page" ? (
          <div className={cn(variant === "hero" && "flex items-end")}>
            <Button type="submit" variant="terracotta" className="w-full md:w-auto">
              <Search className="size-4" />
              Search properties
            </Button>
          </div>
        ) : null}
      </div>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
    </div>
  );
}

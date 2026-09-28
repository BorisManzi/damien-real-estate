import type { HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-[0.12em]",
  {
    variants: {
      variant: {
        rent: "bg-green text-cream",
        sale: "bg-charcoal text-cream",
        land: "bg-cream text-green",
        new: "bg-terracotta text-paper",
        featured: "bg-sage/90 text-green-ink",
        muted: "bg-cream-dark text-quiet",
      },
    },
    defaultVariants: {
      variant: "muted",
    },
  },
);

export function Badge({
  className,
  variant,
  ...props
}: HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

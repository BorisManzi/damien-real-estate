import { cn } from "@/lib/utils";

export function Badge({
  children,
  className,
  tone = "green",
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "green" | "accent" | "neutral" | "sage";
}) {
  const tones = {
    green: "bg-green text-white",
    accent: "bg-accent text-white",
    neutral: "bg-charcoal/80 text-white",
    sage: "bg-sage-soft text-green",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-semibold tracking-wide uppercase",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}

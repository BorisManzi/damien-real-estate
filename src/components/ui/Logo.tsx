import { cn } from "@/lib/utils";

export function Logo({
  className,
  showWordmark = true,
  inverted = false,
}: {
  className?: string;
  showWordmark?: boolean;
  inverted?: boolean;
}) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <svg
        width="36"
        height="36"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M8 6h14c7.18 0 13 5.82 13 13s-5.82 13-13 13H8V6z"
          fill={inverted ? "#F8F5EC" : "#0F5132"}
        />
        <path d="M16 28V16.5L22 12l6 4.5V28h-4.5V20h-3v8H16z" fill="#E76F22" />
        <path
          d="M22 12l6 4.5H16L22 12z"
          fill={inverted ? "#0F5132" : "#F8F5EC"}
        />
      </svg>
      {showWordmark && (
        <div className="leading-tight">
          <div
            className={cn(
              "font-display text-[15px] font-bold tracking-tight",
              inverted ? "text-white" : "text-charcoal"
            )}
          >
            Damien
          </div>
          <div
            className={cn(
              "text-[11px] font-medium tracking-wide",
              inverted ? "text-white/70" : "text-muted"
            )}
          >
            Real Estate
          </div>
        </div>
      )}
      <span className="sr-only">Damien Real Estate</span>
    </div>
  );
}

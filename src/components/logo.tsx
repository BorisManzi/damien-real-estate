import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  markClassName?: string;
  invert?: boolean;
  withWordmark?: boolean;
  compact?: boolean;
};

export function LogoMark({
  className,
  invert = false,
}: {
  className?: string;
  invert?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
      className={cn("size-9", className)}
    >
      <path
        d="M8 6h16.2C35.05 6 42 13.4 42 23.5S35.05 41 24.2 41H8V6Z"
        className={invert ? "fill-cream" : "fill-green"}
      />
      <path
        d="M22.2 16.4 34 26.2V36.2H14.5V26.2l7.7-9.8Z"
        className={invert ? "fill-green" : "fill-cream"}
      />
      <rect
        x="20.6"
        y="28.4"
        width="6.8"
        height="7.8"
        rx="0.6"
        className="fill-terracotta"
      />
    </svg>
  );
}

export function Logo({
  className,
  markClassName,
  invert = false,
  withWordmark = true,
  compact = false,
}: LogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark invert={invert} className={markClassName} />
      {withWordmark ? (
        <span className="flex flex-col leading-none">
          <span
            className={cn(
              "font-display text-lg font-semibold tracking-tight",
              invert ? "text-cream" : "text-green",
            )}
          >
            Damien
          </span>
          {compact ? null : (
            <span
              className={cn(
                "mt-0.5 text-xs font-medium uppercase tracking-[0.18em]",
                invert ? "text-cream/70" : "text-quiet",
              )}
            >
              Real Estate
            </span>
          )}
        </span>
      ) : null}
    </span>
  );
}

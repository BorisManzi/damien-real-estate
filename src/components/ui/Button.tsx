import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "primary" | "accent" | "secondary" | "ghost" | "outline";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variants: Record<Variant, string> = {
  primary:
    "bg-green text-white hover:bg-green-dark shadow-sm",
  accent:
    "bg-accent text-white hover:bg-accent-hover shadow-sm",
  secondary:
    "bg-white text-charcoal border border-border hover:border-green/30 hover:bg-cream",
  ghost: "bg-transparent text-charcoal hover:bg-cream-dark",
  outline:
    "bg-transparent text-green border border-green/30 hover:bg-green hover:text-white",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3.5 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-base",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  )
);
Button.displayName = "Button";

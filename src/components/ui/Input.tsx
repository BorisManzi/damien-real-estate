import { cn } from "@/lib/utils";
import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, id, ...props }, ref) => (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className="mb-1.5 block text-sm font-medium text-charcoal"
        >
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={id}
        className={cn(
          "h-12 w-full rounded-xl border border-border bg-white px-4 text-sm text-charcoal placeholder:text-muted/70 transition-colors focus:border-green focus:outline-none focus:ring-2 focus:ring-green/15",
          className
        )}
        {...props}
      />
    </div>
  )
);
Input.displayName = "Input";

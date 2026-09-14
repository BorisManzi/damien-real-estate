import { cn } from "@/lib/utils";
import { SelectHTMLAttributes, forwardRef } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, id, children, ...props }, ref) => (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className="mb-1.5 block text-sm font-medium text-charcoal"
        >
          {label}
        </label>
      )}
      <select
        ref={ref}
        id={id}
        className={cn(
          "h-12 w-full appearance-none rounded-xl border border-border bg-white px-4 text-sm text-charcoal transition-colors focus:border-green focus:outline-none focus:ring-2 focus:ring-green/15",
          className
        )}
        {...props}
      >
        {children}
      </select>
    </div>
  )
);
Select.displayName = "Select";

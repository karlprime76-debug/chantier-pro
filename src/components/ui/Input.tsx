import * as React from "react";

import { cn } from "@/lib/cn";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  hint?: string;
  error?: string;
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, hint, error, id, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id ?? generatedId;
    const describedBy = hint || error ? `${inputId}-hint` : undefined;

    return (
      <label className="block">
        {label ? (
          <div className="mb-1 text-sm font-semibold text-[var(--app-text)]">{label}</div>
        ) : null}
        <input
          ref={ref}
          id={inputId}
          aria-describedby={describedBy}
          aria-invalid={Boolean(error) || undefined}
          className={cn(
            "h-11 w-full rounded-xl bg-[var(--app-input-bg)] px-3 text-sm text-[var(--app-text)] placeholder:text-[color-mix(in_oklab,var(--app-text),transparent_65%)] ring-1 ring-[var(--app-card-border)] outline-none transition focus:ring-2 focus:ring-[var(--cp-accent)]",
            error ? "ring-[color-mix(in_oklab,var(--cp-accent),white_10%)]" : "",
            className,
          )}
          {...props}
        />
        {error ? (
          <div id={`${inputId}-hint`} className="mt-1 text-xs text-[var(--cp-accent)]">
            {error}
          </div>
        ) : hint ? (
          <div id={`${inputId}-hint`} className="mt-1 text-xs text-[var(--app-text-muted)]">
            {hint}
          </div>
        ) : null}
      </label>
    );
  },
);

Input.displayName = "Input";

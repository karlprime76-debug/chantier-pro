"use client";

import { cn } from "@/lib/cn";
import { useTheme } from "@/components/theme/ThemeProvider";

type ThemeToggleProps = {
  className?: string;
};

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();

  const items: Array<{ key: "auto" | "light" | "dark"; label: string; hint: string }> = [
    { key: "auto", label: "Automatique", hint: "06:00–18:30 clair, sinon sombre" },
    { key: "light", label: "Clair", hint: "Toujours mode jour" },
    { key: "dark", label: "Sombre", hint: "Toujours mode nuit" },
  ];

  return (
    <div className={cn("grid gap-3", className)}>
      <div className="grid grid-cols-3 gap-2">
        {items.map((it) => {
          const active = theme === it.key;
          return (
            <button
              key={it.key}
              type="button"
              onClick={() => setTheme(it.key)}
              className={cn(
                "rounded-2xl px-3 py-2 text-left text-sm font-semibold transition ring-1",
                active
                  ? "bg-[color-mix(in_oklab,var(--app-primary),transparent_86%)] text-[var(--app-primary)] ring-[color-mix(in_oklab,var(--app-primary),transparent_55%)]"
                  : "bg-[color-mix(in_oklab,var(--app-card),transparent_6%)] text-[color-mix(in_oklab,var(--app-text),transparent_20%)] ring-[var(--app-card-border)] hover:bg-[color-mix(in_oklab,var(--app-text),transparent_94%)]",
              )}
            >
              <div>{it.label}</div>
              <div className="mt-1 text-[11px] font-medium text-[var(--app-text-muted)]">{it.hint}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

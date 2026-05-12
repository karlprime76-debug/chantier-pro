"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

type ThemeMode = "light" | "dark" | "auto";

type ThemeContextValue = {
  theme: ThemeMode;
  resolvedTheme: "light" | "dark";
  setTheme: (theme: ThemeMode) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

const STORAGE_KEY = "chantier-pro-theme";

function resolveThemeByHour(date: Date) {
  const h = date.getHours();
  const m = date.getMinutes();
  const minutes = h * 60 + m;
  const dayStart = 6 * 60;
  const dayEnd = 18 * 60 + 30;
  return minutes >= dayStart && minutes < dayEnd ? ("light" as const) : ("dark" as const);
}

function readStoredTheme(): ThemeMode {
  if (typeof window === "undefined") return "auto";
  try {
    const v = window.localStorage.getItem(STORAGE_KEY);
    if (v === "light" || v === "dark" || v === "auto") return v;
    return "auto";
  } catch {
    return "auto";
  }
}

function applyTheme(resolved: "light" | "dark") {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.setAttribute("data-theme", resolved);
  root.classList.toggle("theme-light", resolved === "light");
  root.classList.toggle("theme-dark", resolved === "dark");
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>(() => readStoredTheme());
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">(() => {
    const initial = readStoredTheme();
    return initial === "auto" ? resolveThemeByHour(new Date()) : initial;
  });

  useEffect(() => {
    applyTheme(resolvedTheme);
  }, [resolvedTheme]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (theme !== "auto") return;

    const id = window.setInterval(() => {
      const next = resolveThemeByHour(new Date());
      setResolvedTheme((prev) => (prev === next ? prev : next));
    }, 60_000);

    return () => window.clearInterval(id);
  }, [theme]);

  const setTheme = useCallback((next: ThemeMode) => {
    setThemeState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ignore
    }

    if (next === "auto") {
      setResolvedTheme(resolveThemeByHour(new Date()));
      return;
    }

    setResolvedTheme(next);
  }, []);

  const value = useMemo<ThemeContextValue>(() => ({ theme, resolvedTheme, setTheme }), [theme, resolvedTheme, setTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return ctx;
}

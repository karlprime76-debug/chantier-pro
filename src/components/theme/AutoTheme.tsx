"use client";

import { useEffect } from "react";

function getThemeByHour(date: Date) {
  const h = date.getHours();
  if (h >= 6 && h <= 18) return "light" as const;
  return "dark" as const;
}

export function AutoTheme() {
  useEffect(() => {
    const apply = () => {
      const theme = getThemeByHour(new Date());
      document.documentElement.setAttribute("data-theme", theme);
    };

    apply();
    const id = window.setInterval(apply, 60_000);
    return () => window.clearInterval(id);
  }, []);

  return null;
}

import * as React from "react";

import { cn } from "@/lib/cn";

type AppShellProps = {
  children: React.ReactNode;
  className?: string;
};

export function AppShell({ children, className }: AppShellProps) {
  return (
    <div className={cn("mx-auto w-full max-w-6xl px-4 py-8 sm:px-6", className)}>
      {children}
    </div>
  );
}

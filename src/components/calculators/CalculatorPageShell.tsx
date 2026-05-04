import type { ReactNode } from "react";

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";

type CalculatorPageShellProps = {
  title: string;
  description: string;
  children: ReactNode;
};

export function CalculatorPageShell({ title, description, children }: CalculatorPageShellProps) {
  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-white">{title}</h1>
        <p className="mt-1 text-sm text-white/60">{description}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Calcul</CardTitle>
          <CardDescription>Remplis les champs ci-dessous pour obtenir une estimation.</CardDescription>
        </CardHeader>

        <div className="grid gap-4 p-6">{children}</div>

        <div className="border-t border-white/10 p-6">
          <div className="text-sm font-semibold text-white">Note technique</div>
          <div className="mt-1 text-sm text-white/60">
            Ces résultats sont estimatifs et doivent être validés par un professionnel selon les plans, les normes
            applicables et les conditions réelles du chantier.
          </div>
        </div>
      </Card>
    </div>
  );
}

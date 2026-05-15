"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/Button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";

type QuoteLine = {
  id: string;
  designation: string;
  unit: string;
  quantity: string;
  unitPrice: string;
};

function uid() {
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function toNumber(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const n = Number(trimmed.replace(",", "."));
  return Number.isFinite(n) ? n : null;
}

function formatFcfa(n: number): string {
  const v = Number.isFinite(n) ? n : 0;
  return `${new Intl.NumberFormat("fr-FR").format(Math.round(v))} FCFA`;
}

export function EnterpriseQuoteGenerator() {
  const [clientName, setClientName] = useState("");
  const [projectName, setProjectName] = useState("");
  const [date, setDate] = useState(() => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${dd}`;
  });
  const [description, setDescription] = useState("");

  const [discountPercent, setDiscountPercent] = useState("0");
  const [marginPercent, setMarginPercent] = useState("0");

  const [lines, setLines] = useState<QuoteLine[]>(() => [
    { id: uid(), designation: "", unit: "u", quantity: "1", unitPrice: "0" },
  ]);

  const [error, setError] = useState<string | null>(null);

  const computed = useMemo(() => {
    const rows = lines.map((l) => {
      const q = toNumber(l.quantity) ?? 0;
      const pu = toNumber(l.unitPrice) ?? 0;
      const quantity = Math.max(0, q);
      const unitPrice = Math.max(0, pu);
      return {
        ...l,
        quantity,
        unitPrice,
        amount: quantity * unitPrice,
      };
    });

    const totalHT = rows.reduce((sum, r) => sum + r.amount, 0);

    const discount = Math.max(0, toNumber(discountPercent) ?? 0);
    const margin = Math.max(0, toNumber(marginPercent) ?? 0);

    const discountAmount = totalHT * (discount / 100);
    const baseAfterDiscount = totalHT - discountAmount;
    const marginAmount = baseAfterDiscount * (margin / 100);
    const totalFinal = baseAfterDiscount + marginAmount;

    return {
      rows,
      totalHT,
      discount,
      discountAmount,
      margin,
      marginAmount,
      totalFinal,
    };
  }, [lines, discountPercent, marginPercent]);

  function validate(): boolean {
    setError(null);

    for (const l of lines) {
      if (!l.designation.trim()) {
        setError("Chaque ligne doit avoir une désignation.");
        return false;
      }

      const q = toNumber(l.quantity);
      const pu = toNumber(l.unitPrice);

      if (q === null || pu === null) {
        setError("Vérifie les quantités et prix unitaires.");
        return false;
      }

      if (q < 0 || pu < 0) {
        setError("Les valeurs négatives ne sont pas autorisées.");
        return false;
      }
    }

    const d = toNumber(discountPercent);
    const m = toNumber(marginPercent);
    if (d === null || m === null) {
      setError("Vérifie la remise et la marge.");
      return false;
    }
    if (d < 0 || m < 0) {
      setError("La remise et la marge ne peuvent pas être négatives.");
      return false;
    }

    return true;
  }

  function handleReset() {
    setClientName("");
    setProjectName("");
    setDescription("");
    setDiscountPercent("0");
    setMarginPercent("0");
    setLines([{ id: uid(), designation: "", unit: "u", quantity: "1", unitPrice: "0" }]);
    setError(null);
  }

  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Informations</CardTitle>
          <CardDescription>Devis simple (Entreprise) avec lignes dynamiques.</CardDescription>
        </CardHeader>

        <div className="grid gap-4 px-6 pb-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Nom du client" value={clientName} onChange={(e) => setClientName(e.target.value)} />
            <Input label="Nom du projet" value={projectName} onChange={(e) => setProjectName(e.target.value)} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Date" value={date} onChange={(e) => setDate(e.target.value)} />
            <Input label="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lignes</CardTitle>
          <CardDescription>Désignation, unité, quantité, prix unitaire.</CardDescription>
        </CardHeader>

        <div className="grid gap-3 px-6 pb-6">
          {computed.rows.map((l) => (
            <div key={l.id} className="grid gap-3 rounded-2xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-4 sm:grid-cols-12">
              <div className="sm:col-span-5">
                <Input
                  label="Désignation"
                  value={l.designation}
                  onChange={(e) =>
                    setLines((prev) => prev.map((x) => (x.id === l.id ? { ...x, designation: e.target.value } : x)))
                  }
                />
              </div>
              <div className="sm:col-span-2">
                <Input
                  label="Unité"
                  value={l.unit}
                  onChange={(e) => setLines((prev) => prev.map((x) => (x.id === l.id ? { ...x, unit: e.target.value } : x)))}
                />
              </div>
              <div className="sm:col-span-2">
                <Input
                  label="Quantité"
                  value={l.quantity}
                  inputMode="decimal"
                  onChange={(e) =>
                    setLines((prev) => prev.map((x) => (x.id === l.id ? { ...x, quantity: e.target.value } : x)))
                  }
                />
              </div>
              <div className="sm:col-span-2">
                <Input
                  label="Prix unitaire"
                  value={l.unitPrice}
                  inputMode="decimal"
                  onChange={(e) =>
                    setLines((prev) => prev.map((x) => (x.id === l.id ? { ...x, unitPrice: e.target.value } : x)))
                  }
                />
              </div>
              <div className="sm:col-span-1 flex flex-col justify-end">
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => setLines((prev) => prev.filter((x) => x.id !== l.id))}
                  disabled={lines.length <= 1}
                >
                  Suppr.
                </Button>
              </div>

              <div className="sm:col-span-12 text-sm text-[var(--app-text-muted)]">
                <span className="text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">Montant ligne:</span> {formatFcfa(l.amount)}
              </div>
            </div>
          ))}

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setLines((prev) => [...prev, { id: uid(), designation: "", unit: "u", quantity: "1", unitPrice: "0" }])}
            >
              Ajouter une ligne
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                if (!validate()) return;
              }}
            >
              Calculer
            </Button>
            <Button type="button" variant="ghost" onClick={handleReset}>
              Réinitialiser
            </Button>
          </div>

          {error ? <div className="text-sm text-[var(--cp-accent)]">{error}</div> : null}
        </div>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Totaux</CardTitle>
          <CardDescription>Résumé HT, remise, marge, total final.</CardDescription>
        </CardHeader>

        <div className="grid gap-4 px-6 pb-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Remise (%)"
              value={discountPercent}
              onChange={(e) => setDiscountPercent(e.target.value)}
              inputMode="decimal"
            />
            <Input label="Marge (%)" value={marginPercent} onChange={(e) => setMarginPercent(e.target.value)} inputMode="decimal" />
          </div>

          <div className="grid gap-2 rounded-2xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-4 text-sm text-[var(--app-text-muted)]">
            <div>
              <span className="text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">Total HT:</span> {formatFcfa(computed.totalHT)}
            </div>
            <div>
              <span className="text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">Remise ({computed.discount}%):</span> -{formatFcfa(computed.discountAmount)}
            </div>
            <div>
              <span className="text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">Marge ({computed.margin}%):</span> +{formatFcfa(computed.marginAmount)}
            </div>
            <div className="pt-2 text-base font-extrabold text-[var(--app-text)]">Total final: {formatFcfa(computed.totalFinal)}</div>
          </div>

          <div className="text-xs text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">
            L’export avancé pourra être ajouté plus tard.
          </div>
        </div>
      </Card>

      <div className="text-xs text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">
        Les résultats sont des estimations d’aide au chantier. Ils doivent être vérifiés selon les conditions réelles du projet.
      </div>
    </div>
  );
}

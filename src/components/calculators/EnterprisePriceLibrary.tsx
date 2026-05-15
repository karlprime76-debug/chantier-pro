"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/Button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";

type PriceLine = {
  id: string;
  designation: string;
  category: string;
  unit: string;
  unitPrice: string;
  quantity: string;
  supplierOrNote: string;
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

export function EnterprisePriceLibrary() {
  const [designation, setDesignation] = useState("");
  const [category, setCategory] = useState("Matériaux");
  const [unit, setUnit] = useState("u");
  const [unitPrice, setUnitPrice] = useState("0");
  const [quantity, setQuantity] = useState("");
  const [supplierOrNote, setSupplierOrNote] = useState("");

  const [lines, setLines] = useState<PriceLine[]>([]);
  const [error, setError] = useState<string | null>(null);

  const computed = useMemo(() => {
    const rows = lines.map((l) => {
      const pu = Math.max(0, toNumber(l.unitPrice) ?? 0);
      const qRaw = toNumber(l.quantity);
      const q = qRaw === null ? null : Math.max(0, qRaw);
      const amount = q === null ? null : q * pu;
      return { ...l, unitPriceN: pu, quantityN: q, amount };
    });

    const total = rows.reduce((sum, r) => sum + (r.amount ?? 0), 0);

    return { rows, total };
  }, [lines]);

  function handleAdd() {
    setError(null);

    if (!designation.trim()) {
      setError("Renseigne une désignation.");
      return;
    }

    const pu = toNumber(unitPrice);
    if (pu === null) {
      setError("Prix unitaire invalide.");
      return;
    }
    if (pu < 0) {
      setError("Le prix unitaire ne peut pas être négatif.");
      return;
    }

    const q = quantity.trim() ? toNumber(quantity) : null;
    if (quantity.trim() && q === null) {
      setError("Quantité invalide.");
      return;
    }
    if (q !== null && q < 0) {
      setError("La quantité ne peut pas être négative.");
      return;
    }

    setLines((prev) => [
      {
        id: uid(),
        designation: designation.trim(),
        category: category.trim() || "Matériaux",
        unit: unit.trim() || "u",
        unitPrice: String(pu),
        quantity: quantity.trim(),
        supplierOrNote: supplierOrNote.trim(),
      },
      ...prev,
    ]);

    setDesignation("");
    setUnitPrice("0");
    setQuantity("");
    setSupplierOrNote("");
  }

  function handleReset() {
    setDesignation("");
    setCategory("Matériaux");
    setUnit("u");
    setUnitPrice("0");
    setQuantity("");
    setSupplierOrNote("");
    setLines([]);
    setError(null);
  }

  return (
    <div className="grid gap-4">
      <div className="rounded-2xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-4 text-sm text-[var(--app-text-muted)]">
        Première version : les données sont conservées pendant la session.
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ajouter un prix</CardTitle>
          <CardDescription>Désignation, unité, prix unitaire, quantité (optionnel), fournisseur/observation.</CardDescription>
        </CardHeader>

        <div className="grid gap-4 px-6 pb-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Désignation" value={designation} onChange={(e) => setDesignation(e.target.value)} />
            <Input label="Catégorie" value={category} onChange={(e) => setCategory(e.target.value)} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Unité" value={unit} onChange={(e) => setUnit(e.target.value)} />
            <Input label="Prix unitaire" value={unitPrice} onChange={(e) => setUnitPrice(e.target.value)} inputMode="decimal" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Quantité (optionnel)" value={quantity} onChange={(e) => setQuantity(e.target.value)} inputMode="decimal" />
            <Input label="Fournisseur / observation" value={supplierOrNote} onChange={(e) => setSupplierOrNote(e.target.value)} />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button type="button" variant="secondary" onClick={handleAdd}>
              Ajouter
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
          <div className="flex items-center justify-between gap-3">
            <CardTitle>Liste</CardTitle>
            <div className="text-xs font-bold text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">{computed.rows.length} ligne(s)</div>
          </div>
          <CardDescription>Le montant est calculé seulement si une quantité est renseignée.</CardDescription>
        </CardHeader>

        <div className="grid gap-2 px-6 pb-6">
          {computed.rows.length === 0 ? (
            <div className="rounded-xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-4 text-sm text-[var(--app-text-muted)]">
              Aucune ligne.
            </div>
          ) : (
            computed.rows.map((r) => (
              <div
                key={r.id}
                className="rounded-2xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-[var(--app-text)]">{r.designation}</div>
                    <div className="mt-1 text-sm text-[var(--app-text-muted)]">
                      {r.category} · {formatFcfa(r.unitPriceN)} / {r.unit}
                      {r.supplierOrNote ? ` · ${r.supplierOrNote}` : ""}
                    </div>
                    <div className="mt-1 text-sm text-[var(--app-text-muted)]">
                      <span className="text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">Quantité:</span>{" "}
                      {r.quantityN === null ? "—" : r.quantityN}
                      {r.amount === null ? null : (
                        <>
                          {" "}
                          <span className="text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">· Montant:</span> {formatFcfa(r.amount)}
                        </>
                      )}
                    </div>
                  </div>

                  <Button type="button" size="sm" variant="ghost" onClick={() => setLines((prev) => prev.filter((x) => x.id !== r.id))}>
                    Supprimer
                  </Button>
                </div>
              </div>
            ))
          )}

          <div className="mt-2 grid gap-2 rounded-2xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-4 text-sm text-[var(--app-text-muted)]">
            <div className="text-base font-extrabold text-[var(--app-text)]">Total: {formatFcfa(computed.total)}</div>
          </div>
        </div>
      </Card>

      <div className="text-xs text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">
        Les résultats sont des estimations d’aide au chantier. Ils doivent être vérifiés selon les conditions réelles du projet.
      </div>
    </div>
  );
}

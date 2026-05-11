"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/Button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { MvpToolShell } from "@/components/calculs/MvpToolShell";
import { readLocalStorageJson, writeLocalStorageJson } from "@/lib/storage/localStorage";

type PriceRow = {
  id: string;
  name: string;
  unit: string;
  price: number;
  supplier: string;
  updatedAt: string;
};

const STORAGE_KEY = "cp_price_library_v1";

function uid() {
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function formatNumber(n: number) {
  if (!Number.isFinite(n)) return "";
  return new Intl.NumberFormat("fr-FR").format(n);
}

export default function PriceLibraryClient() {
  const [rows, setRows] = useState<PriceRow[]>(() => {
    return readLocalStorageJson<PriceRow[]>(STORAGE_KEY, [
      {
        id: uid(),
        name: "Ciment (50kg)",
        unit: "sac",
        price: 0,
        supplier: "",
        updatedAt: new Date().toISOString(),
      },
      {
        id: uid(),
        name: "Sable",
        unit: "m³",
        price: 0,
        supplier: "",
        updatedAt: new Date().toISOString(),
      },
    ]);
  });
  const [name, setName] = useState("");
  const [unit, setUnit] = useState("u");
  const [price, setPrice] = useState("0");
  const [supplier, setSupplier] = useState("");

  const totalItems = rows.length;

  const sortedRows = useMemo(() => {
    return [...rows].sort((a, b) => (a.name || "").localeCompare(b.name || "", "fr"));
  }, [rows]);

  function persist(next: PriceRow[]) {
    setRows(next);
    writeLocalStorageJson(STORAGE_KEY, next);
  }

  return (
    <MvpToolShell
      title="Bibliothèque prix matériaux"
      subtitle="MVP: gestion locale sur ton appareil (aucune synchronisation)."
    >
      <div className="rounded-2xl border border-[var(--cp-border)] bg-[color-mix(in_oklab,var(--cp-card),transparent_8%)] p-4 text-sm text-[color-mix(in_oklab,var(--cp-text),transparent_25%)]">
        <div className="font-bold text-[var(--cp-text)]">Sauvegarde</div>
        <div className="mt-1">Les données sont sauvegardées sur cet appareil (localStorage).</div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ajouter un matériau</CardTitle>
          <CardDescription>Nom, unité, prix indicatif, fournisseur.</CardDescription>
        </CardHeader>

        <div className="grid gap-3 px-6 pb-6 sm:grid-cols-2">
          <Input label="Matériau" name="name" value={name} onChange={(e) => setName(e.target.value)} />
          <Input label="Unité" name="unit" value={unit} onChange={(e) => setUnit(e.target.value)} />
          <Input
            label="Prix indicatif"
            name="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            inputMode="decimal"
          />
          <Input label="Fournisseur" name="supplier" value={supplier} onChange={(e) => setSupplier(e.target.value)} />

          <div className="sm:col-span-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
            <Button
              type="button"
              size="lg"
              onClick={() => {
                const p = Number(String(price).replace(",", "."));
                if (!name.trim()) return;

                const next: PriceRow[] = [
                  {
                    id: uid(),
                    name: name.trim(),
                    unit: unit.trim() || "u",
                    price: Number.isFinite(p) ? p : 0,
                    supplier: supplier.trim(),
                    updatedAt: new Date().toISOString(),
                  },
                  ...rows,
                ];
                persist(next);
                setName("");
                setPrice("0");
                setSupplier("");
              }}
            >
              Ajouter
            </Button>
            <Button
              type="button"
              size="lg"
              variant="secondary"
              onClick={() => {
                persist([]);
              }}
            >
              Vider la liste
            </Button>
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            <CardTitle>Matériaux</CardTitle>
            <div className="text-xs font-bold text-[color-mix(in_oklab,var(--cp-text),transparent_45%)]">
              {totalItems} élément{totalItems > 1 ? "s" : ""}
            </div>
          </div>
          <CardDescription>Appuie sur supprimer pour retirer un élément.</CardDescription>
        </CardHeader>

        <div className="grid gap-2 px-6 pb-6">
          {sortedRows.length === 0 ? (
            <div className="text-sm text-[color-mix(in_oklab,var(--cp-text),transparent_35%)]">Aucun élément.</div>
          ) : (
            sortedRows.map((r) => (
              <div
                key={r.id}
                className="rounded-2xl border border-[var(--cp-border)] bg-[color-mix(in_oklab,var(--cp-card),transparent_8%)] p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-[var(--cp-text)]">{r.name}</div>
                    <div className="mt-1 text-sm text-[color-mix(in_oklab,var(--cp-text),transparent_35%)]">
                      {formatNumber(r.price)} FCFA / {r.unit}
                      {r.supplier ? ` · ${r.supplier}` : ""}
                    </div>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      persist(rows.filter((x) => x.id !== r.id));
                    }}
                  >
                    Supprimer
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </MvpToolShell>
  );
}

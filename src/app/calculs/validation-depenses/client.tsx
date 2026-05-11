"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/Button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { MvpToolShell } from "@/components/calculs/MvpToolShell";
import { readLocalStorageJson, writeLocalStorageJson } from "@/lib/storage/localStorage";

type ExpenseStatus = "pending" | "approved" | "rejected";

type Expense = {
  id: string;
  label: string;
  category: string;
  amount: number;
  status: ExpenseStatus;
  createdAt: string;
};

const STORAGE_KEY = "cp_expenses_validation_v1";

function uid() {
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function n(v: string) {
  const x = Number(String(v).replace(",", "."));
  return Number.isFinite(x) ? x : 0;
}

function fmt(v: number) {
  return new Intl.NumberFormat("fr-FR").format(Math.round(v));
}

export default function ValidationDepensesClient() {
  const [items, setItems] = useState<Expense[]>(() => {
    return readLocalStorageJson<Expense[]>(STORAGE_KEY, [
      {
        id: uid(),
        label: "Ciment",
        category: "Matériaux",
        amount: 0,
        status: "pending",
        createdAt: new Date().toISOString(),
      },
    ]);
  });
  const [label, setLabel] = useState("");
  const [category, setCategory] = useState("Divers");
  const [amount, setAmount] = useState("0");

  function persist(next: Expense[]) {
    setItems(next);
    writeLocalStorageJson(STORAGE_KEY, next);
  }

  const summary = useMemo(() => {
    const approved = items.filter((i) => i.status === "approved").reduce((s, i) => s + i.amount, 0);
    const pending = items.filter((i) => i.status === "pending").reduce((s, i) => s + i.amount, 0);
    const rejected = items.filter((i) => i.status === "rejected").reduce((s, i) => s + i.amount, 0);
    return { approved, pending, rejected };
  }, [items]);

  return (
    <MvpToolShell title="Validation dépenses" subtitle="MVP: workflow local (sur cet appareil).">
      <div className="grid gap-3 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total validé</CardTitle>
            <CardDescription>Somme des dépenses validées</CardDescription>
          </CardHeader>
          <div className="px-6 pb-6 text-2xl font-extrabold tracking-tight text-[var(--cp-text)]">
            {fmt(summary.approved)} FCFA
          </div>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>En attente</CardTitle>
            <CardDescription>Somme des dépenses en attente</CardDescription>
          </CardHeader>
          <div className="px-6 pb-6 text-2xl font-extrabold tracking-tight text-[var(--cp-text)]">
            {fmt(summary.pending)} FCFA
          </div>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Rejeté</CardTitle>
            <CardDescription>Somme des dépenses rejetées</CardDescription>
          </CardHeader>
          <div className="px-6 pb-6 text-2xl font-extrabold tracking-tight text-[var(--cp-text)]">
            {fmt(summary.rejected)} FCFA
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ajouter une dépense</CardTitle>
          <CardDescription>Ajoute une dépense à valider.</CardDescription>
        </CardHeader>
        <div className="grid gap-3 px-6 pb-6 sm:grid-cols-3">
          <Input label="Dépense" name="label" value={label} onChange={(e) => setLabel(e.target.value)} />
          <Input label="Catégorie" name="category" value={category} onChange={(e) => setCategory(e.target.value)} />
          <Input
            label="Montant (FCFA)"
            name="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            inputMode="decimal"
          />

          <div className="sm:col-span-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
            <Button
              type="button"
              size="lg"
              onClick={() => {
                if (!label.trim()) return;
                const a = n(amount);
                const next: Expense[] = [
                  {
                    id: uid(),
                    label: label.trim(),
                    category: category.trim() || "Divers",
                    amount: a,
                    status: "pending",
                    createdAt: new Date().toISOString(),
                  },
                  ...items,
                ];
                persist(next);
                setLabel("");
                setAmount("0");
              }}
            >
              Ajouter
            </Button>
            <Button type="button" size="lg" variant="secondary" onClick={() => persist([])}>
              Vider
            </Button>
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Liste</CardTitle>
          <CardDescription>Valide ou rejette chaque dépense.</CardDescription>
        </CardHeader>

        <div className="grid gap-2 px-6 pb-6">
          {items.length === 0 ? (
            <div className="text-sm text-[color-mix(in_oklab,var(--cp-text),transparent_35%)]">Aucune dépense.</div>
          ) : (
            items.map((e) => (
              <div
                key={e.id}
                className="rounded-2xl border border-[var(--cp-border)] bg-[color-mix(in_oklab,var(--cp-card),transparent_8%)] p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-[var(--cp-text)]">{e.label}</div>
                    <div className="mt-1 text-sm text-[color-mix(in_oklab,var(--cp-text),transparent_35%)]">
                      {fmt(e.amount)} FCFA · {e.category}
                    </div>
                    <div className="mt-2 text-xs font-bold text-[color-mix(in_oklab,var(--cp-text),transparent_45%)]">
                      Statut: {e.status === "pending" ? "En attente" : e.status === "approved" ? "Validée" : "Rejetée"}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      onClick={() => {
                        persist(items.map((x) => (x.id === e.id ? { ...x, status: "approved" } : x)));
                      }}
                    >
                      Valider
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        persist(items.map((x) => (x.id === e.id ? { ...x, status: "rejected" } : x)));
                      }}
                    >
                      Rejeter
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </MvpToolShell>
  );
}

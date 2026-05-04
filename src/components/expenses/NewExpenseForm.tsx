"use client";

import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export function NewExpenseForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [projectId, setProjectId] = useState("");
  const [category, setCategory] = useState("");
  const [label, setLabel] = useState("");
  const [amount, setAmount] = useState("");
  const [supplier, setSupplier] = useState("");
  const [date, setDate] = useState("");
  const [note, setNote] = useState("");

  return (
    <form
      className="grid gap-4"
      onSubmit={async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const res = await fetch("/api/expenses", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ projectId, category, label, amount, supplier, date, note }),
        });

        if (!res.ok) {
          setError("Enregistrement impossible. Vérifie le chantier et les champs.");
          setLoading(false);
          return;
        }

        setProjectId("");
        setCategory("");
        setLabel("");
        setAmount("");
        setSupplier("");
        setDate("");
        setNote("");

        window.location.reload();
      }}
    >
      <Input
        label="Chantier (ID)"
        name="projectId"
        value={projectId}
        onChange={(e) => setProjectId(e.target.value)}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Catégorie"
          name="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <Input
          label="Montant (FCFA)"
          name="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>
      <Input label="Libellé" name="label" value={label} onChange={(e) => setLabel(e.target.value)} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Fournisseur"
          name="supplier"
          value={supplier}
          onChange={(e) => setSupplier(e.target.value)}
        />
        <Input label="Date" name="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </div>
      <Input label="Note" name="note" value={note} onChange={(e) => setNote(e.target.value)} />

      {error ? <div className="text-sm text-[var(--cp-accent)]">{error}</div> : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
        <Button type="submit" variant="secondary" disabled={loading}>
          Enregistrer
        </Button>
      </div>
    </form>
  );
}

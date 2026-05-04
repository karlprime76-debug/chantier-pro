"use client";

import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export function NewQuoteForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [projectId, setProjectId] = useState("");
  const [title, setTitle] = useState("");
  const [clientName, setClientName] = useState("");
  const [itemLabel, setItemLabel] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unitPrice, setUnitPrice] = useState("");

  return (
    <form
      className="grid gap-4"
      onSubmit={async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const res = await fetch("/api/quotes", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ projectId, title, clientName, itemLabel, quantity, unitPrice }),
        });

        if (!res.ok) {
          setError("Enregistrement impossible. Vérifie le chantier et les champs.");
          setLoading(false);
          return;
        }

        setProjectId("");
        setTitle("");
        setClientName("");
        setItemLabel("");
        setQuantity("");
        setUnitPrice("");

        window.location.reload();
      }}
    >
      <Input
        label="Chantier (ID)"
        name="projectId"
        value={projectId}
        onChange={(e) => setProjectId(e.target.value)}
      />
      <Input label="Titre" name="title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <Input
        label="Client"
        name="clientName"
        value={clientName}
        onChange={(e) => setClientName(e.target.value)}
      />

      <div className="grid gap-3 rounded-2xl border border-white/10 bg-black/20 p-4">
        <div className="text-sm font-bold text-white">Ligne 1</div>
        <Input
          label="Libellé"
          name="itemLabel"
          value={itemLabel}
          onChange={(e) => setItemLabel(e.target.value)}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Quantité"
            name="quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
          <Input
            label="PU"
            name="unitPrice"
            value={unitPrice}
            onChange={(e) => setUnitPrice(e.target.value)}
          />
        </div>
      </div>

      {error ? <div className="text-sm text-[var(--cp-accent)]">{error}</div> : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
        <Button type="submit" variant="secondary" disabled={loading}>
          Enregistrer
        </Button>
      </div>
    </form>
  );
}

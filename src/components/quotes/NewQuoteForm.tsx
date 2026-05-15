"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { canAccessFeature, type UserPlan } from "@/lib/subscription/access";

type NewQuoteFormProps = {
  userPlan: UserPlan;
};

export function NewQuoteForm({ userPlan }: NewQuoteFormProps) {
  const searchParams = useSearchParams();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [projectId, setProjectId] = useState("");
  const [title, setTitle] = useState("");
  const [clientName, setClientName] = useState("");
  const [itemLabel, setItemLabel] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unitPrice, setUnitPrice] = useState("");

  const templates = useMemo(
    () =>
      [
        { id: "labor", label: "Main-d’œuvre", itemLabel: "Main-d’œuvre", quantity: "1", unitPrice: "" },
        { id: "paint", label: "Peinture", itemLabel: "Peinture (m²)", quantity: "1", unitPrice: "" },
        {
          id: "slab",
          label: "Dalle béton",
          itemLabel: "Dalle béton (m³)",
          quantity: "1",
          unitPrice: "",
          premium: true,
        },
        {
          id: "foundation",
          label: "Fondation",
          itemLabel: "Fondations (m³)",
          quantity: "1",
          unitPrice: "",
          premium: true,
        },
        {
          id: "blocks",
          label: "Mur en agglos",
          itemLabel: "Mur en agglos (m²)",
          quantity: "1",
          unitPrice: "",
          premium: true,
        },
        {
          id: "tiling",
          label: "Carrelage",
          itemLabel: "Carrelage (m²)",
          quantity: "1",
          unitPrice: "",
          premium: true,
        },
        {
          id: "fence",
          label: "Clôture",
          itemLabel: "Clôture (ml)",
          quantity: "1",
          unitPrice: "",
          premium: true,
        },
      ] as const,
    [],
  );

  useEffect(() => {
    const t = setTimeout(() => {
      const qpProjectId = searchParams.get("projectId")?.trim() || "";
      const qpTitle = searchParams.get("title")?.trim() || "";
      const qpClientName = searchParams.get("clientName")?.trim() || "";
      const qpItemLabel = searchParams.get("itemLabel")?.trim() || "";
      const qpQuantity = searchParams.get("quantity")?.trim() || "";
      const qpUnitPrice = searchParams.get("unitPrice")?.trim() || "";

      if (qpProjectId) setProjectId(qpProjectId);
      if (qpTitle) setTitle(qpTitle);
      if (qpClientName) setClientName(qpClientName);
      if (qpItemLabel) setItemLabel(qpItemLabel);
      if (qpQuantity) setQuantity(qpQuantity);
      if (qpUnitPrice) setUnitPrice(qpUnitPrice);
    }, 0);

    return () => clearTimeout(t);
  }, [searchParams]);

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

      <div className="grid gap-3 rounded-2xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-sm font-bold text-[var(--app-text)]">Modèles rapides</div>
            <div className="mt-1 text-xs text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">Clique pour pré-remplir une ligne.</div>
          </div>
          <div className="text-xs font-semibold text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">Plan: {userPlan}</div>
        </div>

        <div className="flex flex-wrap gap-2">
          {templates.map((t) => {
            const isPremiumTemplate = Boolean((t as { premium?: boolean }).premium);
            const canUse = !isPremiumTemplate || canAccessFeature(userPlan, "quote_templates");

            return (
              <Button
                key={t.id}
                type="button"
                size="sm"
                variant={canUse ? "secondary" : "ghost"}
                disabled={!canUse}
                onClick={() => {
                  setItemLabel(t.itemLabel);
                  setQuantity(t.quantity);
                  setUnitPrice(t.unitPrice);
                }}
              >
                {t.label}
              </Button>
            );
          })}
        </div>

        {!canAccessFeature(userPlan, "quote_templates") ? (
          <div className="text-xs text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">Certains modèles sont Pro.</div>
        ) : null}
      </div>

      <div className="grid gap-3 rounded-2xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-4">
        <div className="text-sm font-bold text-[var(--app-text)]">Ligne 1</div>
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

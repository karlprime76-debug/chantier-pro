"use client";

import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { MvpToolShell } from "@/components/calculs/MvpToolShell";

function Section({
  title,
  value,
  onChange,
}: {
  title: string;
  value: string;
  onChange: (next: string) => void;
}) {
  return (
    <div className="rounded-2xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_6%)] p-4">
      <div className="text-sm font-bold text-[var(--app-text)]">{title}</div>
      <textarea
        className="mt-3 min-h-[110px] w-full rounded-xl border border-[var(--app-card-border)] bg-[var(--app-input-bg)] px-3 py-2 text-sm text-[var(--app-text)]"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Points contrôlés, anomalies, actions…"
      />
    </div>
  );
}

export default function RapportsControleClient() {
  const [chantier, setChantier] = useState("Villa Akpakpa");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  const [coffrage, setCoffrage] = useState("");
  const [ferraillage, setFerraillage] = useState("");
  const [avantBeton, setAvantBeton] = useState("");
  const [betonLivre, setBetonLivre] = useState("");
  const [cure, setCure] = useState("");
  const [reserves, setReserves] = useState("");
  const [observations, setObservations] = useState("");

  return (
    <MvpToolShell title="Rapports de contrôle" subtitle="MVP: sections clés + export PDF via impression.">
      <Card>
        <CardHeader>
          <CardTitle>Contexte</CardTitle>
          <CardDescription>Renseigne le chantier et la date.</CardDescription>
        </CardHeader>
        <div className="grid gap-3 px-6 pb-6">
          <Input label="Chantier" name="chantier" value={chantier} onChange={(e) => setChantier(e.target.value)} />
          <Input label="Date" name="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contrôles</CardTitle>
          <CardDescription>Points sensibles à vérifier sur chantier.</CardDescription>
        </CardHeader>
        <div className="grid gap-3 px-6 pb-6">
          <Section title="Contrôle du coffrage" value={coffrage} onChange={setCoffrage} />
          <Section title="Contrôle du ferraillage" value={ferraillage} onChange={setFerraillage} />
          <Section title="Contrôle avant bétonnage" value={avantBeton} onChange={setAvantBeton} />
          <Section title="Contrôle béton livré" value={betonLivre} onChange={setBetonLivre} />
          <Section title="Contrôle cure béton" value={cure} onChange={setCure} />
          <Section title="Réserves / non-conformités" value={reserves} onChange={setReserves} />
          <Section title="Observations générales" value={observations} onChange={setObservations} />

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
            <Button type="button" size="lg" variant="secondary" onClick={() => window.print()}>
              Exporter PDF
            </Button>
          </div>
        </div>
      </Card>
    </MvpToolShell>
  );
}

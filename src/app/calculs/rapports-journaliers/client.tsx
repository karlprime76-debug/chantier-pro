"use client";

import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { MvpToolShell } from "@/components/calculs/MvpToolShell";

export default function RapportsJournaliersClient() {
  const [chantier, setChantier] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [travaux, setTravaux] = useState("");
  const [personnel, setPersonnel] = useState("");
  const [materiel, setMateriel] = useState("");
  const [observations, setObservations] = useState("");

  return (
    <MvpToolShell title="Rapports journaliers" subtitle="MVP: saisie + export PDF via impression.">
      <Card>
        <CardHeader>
          <CardTitle>Rapport</CardTitle>
          <CardDescription>Renseigne les infos du jour.</CardDescription>
        </CardHeader>

        <div className="grid gap-3 px-6 pb-6">
          <Input label="Chantier" name="chantier" value={chantier} onChange={(e) => setChantier(e.target.value)} />
          <Input label="Date" name="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          <Input
            label="Travaux réalisés"
            name="travaux"
            value={travaux}
            onChange={(e) => setTravaux(e.target.value)}
          />
          <Input
            label="Personnel présent"
            name="personnel"
            value={personnel}
            onChange={(e) => setPersonnel(e.target.value)}
          />
          <Input
            label="Matériels utilisés"
            name="materiel"
            value={materiel}
            onChange={(e) => setMateriel(e.target.value)}
          />
          <Input
            label="Observations"
            name="observations"
            value={observations}
            onChange={(e) => setObservations(e.target.value)}
          />

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

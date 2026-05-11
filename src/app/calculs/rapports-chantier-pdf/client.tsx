"use client";

import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { MvpToolShell } from "@/components/calculs/MvpToolShell";

export default function RapportsChantierPdfClient() {
  const [chantier, setChantier] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [meteo, setMeteo] = useState("");
  const [effectif, setEffectif] = useState("");
  const [travaux, setTravaux] = useState("");
  const [observations, setObservations] = useState("");
  const [difficultes, setDifficultes] = useState("");
  const [nextSteps, setNextSteps] = useState("");

  return (
    <MvpToolShell title="Rapports chantier PDF" subtitle="MVP: formulaire + PDF via impression navigateur.">
      <Card>
        <CardHeader>
          <CardTitle>Rapport chantier</CardTitle>
          <CardDescription>Renseigne les infos puis exporte en PDF.</CardDescription>
        </CardHeader>

        <div className="grid gap-3 px-6 pb-6">
          <Input label="Chantier" name="chantier" value={chantier} onChange={(e) => setChantier(e.target.value)} />
          <Input label="Date" name="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          <Input label="Météo" name="meteo" value={meteo} onChange={(e) => setMeteo(e.target.value)} />
          <Input label="Effectif" name="effectif" value={effectif} onChange={(e) => setEffectif(e.target.value)} />
          <Input
            label="Travaux réalisés"
            name="travaux"
            value={travaux}
            onChange={(e) => setTravaux(e.target.value)}
          />
          <Input
            label="Observations"
            name="observations"
            value={observations}
            onChange={(e) => setObservations(e.target.value)}
          />
          <Input
            label="Difficultés"
            name="difficultes"
            value={difficultes}
            onChange={(e) => setDifficultes(e.target.value)}
          />
          <Input
            label="Prochaines étapes"
            name="nextSteps"
            value={nextSteps}
            onChange={(e) => setNextSteps(e.target.value)}
          />

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
            <Button type="button" size="lg" variant="secondary" onClick={() => window.print()}>
              Générer PDF
            </Button>
          </div>
        </div>
      </Card>
    </MvpToolShell>
  );
}

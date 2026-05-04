"use client";

import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export function NewReportForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [projectId, setProjectId] = useState("");
  const [date, setDate] = useState("");
  const [weather, setWeather] = useState("");
  const [workersCount, setWorkersCount] = useState("");
  const [workDone, setWorkDone] = useState("");
  const [materialsIn, setMaterialsIn] = useState("");
  const [incidents, setIncidents] = useState("");
  const [observations, setObservations] = useState("");
  const [progressEst, setProgressEst] = useState("");

  return (
    <form
      className="grid gap-4"
      onSubmit={async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const res = await fetch("/api/reports", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            projectId,
            date,
            weather,
            workersCount,
            workDone,
            materialsIn,
            incidents,
            observations,
            progressEst,
          }),
        });

        if (!res.ok) {
          setError("Enregistrement impossible. Vérifie le chantier, la date et le contenu.");
          setLoading(false);
          return;
        }

        setProjectId("");
        setDate("");
        setWeather("");
        setWorkersCount("");
        setWorkDone("");
        setMaterialsIn("");
        setIncidents("");
        setObservations("");
        setProgressEst("");

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
        <Input label="Date" name="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <Input
          label="Météo"
          name="weather"
          value={weather}
          onChange={(e) => setWeather(e.target.value)}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Nombre d'ouvriers"
          name="workersCount"
          value={workersCount}
          onChange={(e) => setWorkersCount(e.target.value)}
        />
        <Input
          label="Avancement estimé (%)"
          name="progressEst"
          value={progressEst}
          onChange={(e) => setProgressEst(e.target.value)}
        />
      </div>
      <Input
        label="Travaux réalisés"
        name="workDone"
        value={workDone}
        onChange={(e) => setWorkDone(e.target.value)}
      />
      <Input
        label="Matériaux reçus"
        name="materialsIn"
        value={materialsIn}
        onChange={(e) => setMaterialsIn(e.target.value)}
      />
      <Input
        label="Incidents"
        name="incidents"
        value={incidents}
        onChange={(e) => setIncidents(e.target.value)}
      />
      <Input
        label="Observations"
        name="observations"
        value={observations}
        onChange={(e) => setObservations(e.target.value)}
      />

      {error ? <div className="text-sm text-[var(--cp-accent)]">{error}</div> : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
        <Button type="submit" variant="secondary" disabled={loading}>
          Enregistrer
        </Button>
      </div>
    </form>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export function NewProjectForm() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [clientName, setClientName] = useState("");
  const [location, setLocation] = useState("");
  const [projectType, setProjectType] = useState("");
  const [estimatedBudget, setEstimatedBudget] = useState("");
  const [progress, setProgress] = useState("");
  const [startDate, setStartDate] = useState("");
  const [plannedEndDate, setPlannedEndDate] = useState("");

  return (
    <form
      className="grid gap-4"
      onSubmit={async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const res = await fetch("/api/projects", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            name,
            clientName,
            location,
            projectType,
            estimatedBudget,
            progress,
            startDate,
            plannedEndDate,
          }),
        });

        const data = (await res.json().catch(() => null)) as
          | { ok: true; projectId: string }
          | { ok: false; error: string }
          | null;

        if (!res.ok || !data || data.ok !== true) {
          setError("Création impossible. Vérifie les champs.");
          setLoading(false);
          return;
        }

        router.push(`/dashboard/projects/${data.projectId}`);
      }}
    >
      <Input label="Nom" name="name" value={name} onChange={(e) => setName(e.target.value)} />
      <Input
        label="Client"
        name="clientName"
        value={clientName}
        onChange={(e) => setClientName(e.target.value)}
      />
      <Input
        label="Localisation"
        name="location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />
      <Input
        label="Type de chantier"
        name="projectType"
        value={projectType}
        onChange={(e) => setProjectType(e.target.value)}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Budget estimé"
          name="estimatedBudget"
          value={estimatedBudget}
          onChange={(e) => setEstimatedBudget(e.target.value)}
        />
        <Input
          label="Avancement (%)"
          name="progress"
          value={progress}
          onChange={(e) => setProgress(e.target.value)}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Date début"
          name="startDate"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <Input
          label="Fin prévue"
          name="plannedEndDate"
          type="date"
          value={plannedEndDate}
          onChange={(e) => setPlannedEndDate(e.target.value)}
        />
      </div>

      {error ? <div className="text-sm text-[var(--cp-accent)]">{error}</div> : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
        <Button href="/dashboard/projects" variant="ghost">
          Annuler
        </Button>
        <Button type="submit" variant="secondary" disabled={loading}>
          Enregistrer
        </Button>
      </div>
    </form>
  );
}

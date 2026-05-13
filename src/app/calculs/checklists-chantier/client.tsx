"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/Button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { MvpToolShell } from "@/components/calculs/MvpToolShell";

type ChecklistTask = { id: string; label: string; done: boolean };

const PHASES: Array<{ key: string; label: string; tasks: Array<{ id: string; label: string }> }> = [
  {
    key: "installation",
    label: "Installation de chantier",
    tasks: [
      { id: "inst_1", label: "Accès chantier sécurisé (barrières, affichage)" },
      { id: "inst_2", label: "Zone stockage matériaux organisée" },
      { id: "inst_3", label: "EPI disponibles et rappel sécurité" },
    ],
  },
  {
    key: "terrassement",
    label: "Terrassement",
    tasks: [
      { id: "ter_1", label: "Implantation / repères vérifiés" },
      { id: "ter_2", label: "Niveaux contrôlés" },
      { id: "ter_3", label: "Gestion déblais/remblais prévue" },
    ],
  },
  {
    key: "fondations",
    label: "Fondations",
    tasks: [
      { id: "fon_1", label: "Fond de fouille propre et contrôlé" },
      { id: "fon_2", label: "Béton de propreté (si prévu)" },
      { id: "fon_3", label: "Ferraillage conforme (diamètres, enrobage)" },
      { id: "fon_4", label: "Réservations / attentes positionnées" },
    ],
  },
  {
    key: "coffrage",
    label: "Coffrage",
    tasks: [
      { id: "cof_1", label: "Stabilité et étaiement OK" },
      { id: "cof_2", label: "Dimensions / aplomb / niveaux OK" },
      { id: "cof_3", label: "Huile décoffrage (si utilisé)" },
    ],
  },
  {
    key: "ferraillage",
    label: "Ferraillage",
    tasks: [
      { id: "fer_1", label: "Plans / calepinage disponibles" },
      { id: "fer_2", label: "Ligatures et recouvrements OK" },
      { id: "fer_3", label: "Cales d’enrobage en place" },
    ],
  },
  {
    key: "betonnage",
    label: "Bétonnage",
    tasks: [
      { id: "bet_1", label: "Moyens de vibration/compactage disponibles" },
      { id: "bet_2", label: "Cheminement béton (goulotte, brouette, pompe) prêt" },
      { id: "bet_3", label: "Contrôle livraison (temps, consistance)" },
    ],
  },
  {
    key: "cure",
    label: "Cure béton",
    tasks: [
      { id: "cur_1", label: "Protection contre soleil/pluie" },
      { id: "cur_2", label: "Arrosage / cure planifiée" },
      { id: "cur_3", label: "Accès limité pendant prise" },
    ],
  },
  {
    key: "elevation",
    label: "Élévation",
    tasks: [
      { id: "ele_1", label: "Niveaux et aplomb suivis" },
      { id: "ele_2", label: "Chaînages et reprises contrôlés" },
      { id: "ele_3", label: "Organisation du stockage blocs/ciment" },
    ],
  },
  {
    key: "qualite",
    label: "Contrôle qualité",
    tasks: [
      { id: "qua_1", label: "Non-conformités notées" },
      { id: "qua_2", label: "Photos / preuves collectées" },
      { id: "qua_3", label: "Actions correctives planifiées" },
    ],
  },
  {
    key: "reception",
    label: "Réception",
    tasks: [
      { id: "rec_1", label: "Réserves listées" },
      { id: "rec_2", label: "Nettoyage et remise en état" },
      { id: "rec_3", label: "Documents rassemblés" },
    ],
  },
];

function buildInitialTasks(phaseKey: string): ChecklistTask[] {
  const phase = PHASES.find((p) => p.key === phaseKey) ?? PHASES[0];
  return phase.tasks.map((t) => ({ ...t, done: false }));
}

export default function ChecklistsChantierClient() {
  const [phaseKey, setPhaseKey] = useState(PHASES[0].key);
  const [chantier, setChantier] = useState("Villa Akpakpa");
  const [tasks, setTasks] = useState<ChecklistTask[]>(() => buildInitialTasks(PHASES[0].key));
  const [observations, setObservations] = useState("");

  const phase = useMemo(() => PHASES.find((p) => p.key === phaseKey) ?? PHASES[0], [phaseKey]);

  const progress = useMemo(() => {
    if (tasks.length === 0) return 0;
    const done = tasks.filter((t) => t.done).length;
    return Math.round((done / tasks.length) * 100);
  }, [tasks]);

  const statusLabel = progress === 0 ? "À faire" : progress === 100 ? "Terminé" : "En cours";

  return (
    <MvpToolShell title="Checklists chantier" subtitle="MVP: listes prêtes à l’emploi + export PDF via impression.">
      <Card>
        <CardHeader>
          <CardTitle>Paramètres</CardTitle>
          <CardDescription>Choisis une phase et coche les tâches au fur et à mesure.</CardDescription>
        </CardHeader>
        <div className="grid gap-4 px-6 pb-6">
          <Input label="Chantier (indicatif)" value={chantier} onChange={(e) => setChantier(e.target.value)} />

          <div className="grid gap-2">
            <label className="text-sm font-semibold text-[var(--app-text)]">Phase</label>
            <select
              className="w-full rounded-xl border border-[var(--app-card-border)] bg-[var(--app-input-bg)] px-3 py-2 text-sm text-[var(--app-text)]"
              value={phaseKey}
              onChange={(e) => {
                const next = e.target.value;
                setPhaseKey(next);
                setTasks(buildInitialTasks(next));
                setObservations("");
              }}
            >
              {PHASES.map((p) => (
                <option key={p.key} value={p.key}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>

          <div className="rounded-2xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-4 text-sm text-[var(--app-text-muted)]">
            <div className="flex items-center justify-between gap-3">
              <span className="font-semibold text-[var(--app-text)]">Statut</span>
              <span className="font-bold text-[var(--app-text)]">{statusLabel}</span>
            </div>
            <div className="mt-2">Avancement : {progress}%</div>
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{phase.label}</CardTitle>
          <CardDescription>Tâches à cocher.</CardDescription>
        </CardHeader>
        <div className="grid gap-3 px-6 pb-6">
          {tasks.map((t) => (
            <label
              key={t.id}
              className="flex items-start gap-3 rounded-2xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_6%)] p-4"
            >
              <input
                type="checkbox"
                className="mt-1"
                checked={t.done}
                onChange={(e) => {
                  const checked = e.target.checked;
                  setTasks((prev) => prev.map((x) => (x.id === t.id ? { ...x, done: checked } : x)));
                }}
              />
              <span className="text-sm text-[var(--app-text)]">{t.label}</span>
            </label>
          ))}
        </div>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Observations</CardTitle>
          <CardDescription>Notes simples (optionnel).</CardDescription>
        </CardHeader>
        <div className="grid gap-3 px-6 pb-6">
          <textarea
            className="min-h-[120px] w-full rounded-xl border border-[var(--app-card-border)] bg-[var(--app-input-bg)] px-3 py-2 text-sm text-[var(--app-text)]"
            value={observations}
            onChange={(e) => setObservations(e.target.value)}
            placeholder="Notes, points à vérifier, incidents…"
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

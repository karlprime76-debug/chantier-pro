"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/Button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";

function formatFcfa(n: number): string {
  const v = Number.isFinite(n) ? n : 0;
  return `${new Intl.NumberFormat("fr-FR").format(Math.round(v))} FCFA`;
}

function toNumber(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const n = Number(trimmed.replace(",", "."));
  return Number.isFinite(n) ? n : null;
}

export function EnterpriseSmartReport() {
  const [siteName, setSiteName] = useState("");
  const [date, setDate] = useState(() => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${dd}`;
  });
  const [weather, setWeather] = useState("");
  const [headcount, setHeadcount] = useState("0");

  const [worksDone, setWorksDone] = useState("");
  const [materialsUsed, setMaterialsUsed] = useState("");
  const [equipmentUsed, setEquipmentUsed] = useState("");
  const [dailyExpenses, setDailyExpenses] = useState("0");
  const [incidents, setIncidents] = useState("");
  const [progressPercent, setProgressPercent] = useState("0");

  const [generated, setGenerated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const report = useMemo(() => {
    if (!generated) return null;

    const h = Math.max(0, toNumber(headcount) ?? 0);
    const exp = Math.max(0, toNumber(dailyExpenses) ?? 0);
    const progress = Math.max(0, Math.min(100, toNumber(progressPercent) ?? 0));

    const synth = (() => {
      const works = worksDone.trim() ? `Les travaux réalisés concernent ${worksDone.trim()}.` : "Travaux réalisés non renseignés.";
      const eff = `Effectif présent: ${h} pers.`;
      const adv = `Avancement estimé: ${progress}%.`;
      const watch = incidents.trim() ? `Points à surveiller: ${incidents.trim()}.` : "Aucune observation majeure signalée.";
      return `${works} ${eff} ${adv} ${watch}`;
    })();

    return {
      siteName: siteName || "(non renseigné)",
      date,
      weather: weather || "(non renseigné)",
      headcount: h,
      worksDone: worksDone || "(non renseigné)",
      materialsUsed: materialsUsed || "(non renseigné)",
      equipmentUsed: equipmentUsed || "(non renseigné)",
      dailyExpenses: exp,
      incidents: incidents || "(non renseigné)",
      progress,
      synthesis: synth,
    };
  }, [generated, siteName, date, weather, headcount, worksDone, materialsUsed, equipmentUsed, dailyExpenses, incidents, progressPercent]);

  function handleGenerate() {
    setError(null);

    const h = toNumber(headcount);
    const exp = toNumber(dailyExpenses);
    const prog = toNumber(progressPercent);

    if (h === null || exp === null || prog === null) {
      setGenerated(false);
      setError("Vérifie les champs numériques (effectif, dépenses, avancement). ");
      return;
    }

    if (h < 0 || exp < 0) {
      setGenerated(false);
      setError("Les valeurs négatives ne sont pas autorisées.");
      return;
    }

    setGenerated(true);
  }

  function handleReset() {
    setSiteName("");
    setWeather("");
    setHeadcount("0");
    setWorksDone("");
    setMaterialsUsed("");
    setEquipmentUsed("");
    setDailyExpenses("0");
    setIncidents("");
    setProgressPercent("0");
    setGenerated(false);
    setError(null);
  }

  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Entrées</CardTitle>
          <CardDescription>Génère un rapport structuré à partir de tes informations.</CardDescription>
        </CardHeader>

        <div className="grid gap-4 px-6 pb-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Nom du chantier" value={siteName} onChange={(e) => setSiteName(e.target.value)} />
            <Input label="Date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Météo" value={weather} onChange={(e) => setWeather(e.target.value)} />
            <Input label="Effectif présent" value={headcount} onChange={(e) => setHeadcount(e.target.value)} inputMode="decimal" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Travaux réalisés" value={worksDone} onChange={(e) => setWorksDone(e.target.value)} />
            <Input label="Matériaux utilisés" value={materialsUsed} onChange={(e) => setMaterialsUsed(e.target.value)} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Matériels utilisés" value={equipmentUsed} onChange={(e) => setEquipmentUsed(e.target.value)} />
            <Input label="Dépenses du jour" value={dailyExpenses} onChange={(e) => setDailyExpenses(e.target.value)} inputMode="decimal" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Incidents / observations" value={incidents} onChange={(e) => setIncidents(e.target.value)} />
            <Input
              label="Avancement estimé (%)"
              value={progressPercent}
              onChange={(e) => setProgressPercent(e.target.value)}
              inputMode="decimal"
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button type="button" variant="secondary" onClick={handleGenerate}>
              Générer le rapport
            </Button>
            <Button type="button" variant="ghost" onClick={handleReset}>
              Réinitialiser
            </Button>
          </div>

          {error ? <div className="text-sm text-[var(--cp-accent)]">{error}</div> : null}
        </div>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Rapport</CardTitle>
          <CardDescription>Copiable et structuré.</CardDescription>
        </CardHeader>

        {report ? (
          <div className="grid gap-3 px-6 pb-6 text-sm text-[var(--app-text-muted)]">
            <div className="rounded-2xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-4">
              <div className="text-sm font-bold text-[var(--app-text)]">Synthèse</div>
              <div className="mt-1">{report.synthesis}</div>
            </div>

            <div className="grid gap-2 rounded-2xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-4">
              <div>
                <span className="text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">Chantier:</span> {report.siteName}
              </div>
              <div>
                <span className="text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">Date:</span> {report.date}
              </div>
              <div>
                <span className="text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">Météo:</span> {report.weather}
              </div>
              <div>
                <span className="text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">Effectif:</span> {report.headcount}
              </div>
              <div>
                <span className="text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">Travaux réalisés:</span> {report.worksDone}
              </div>
              <div>
                <span className="text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">Matériaux:</span> {report.materialsUsed}
              </div>
              <div>
                <span className="text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">Matériels:</span> {report.equipmentUsed}
              </div>
              <div>
                <span className="text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">Dépenses:</span> {formatFcfa(report.dailyExpenses)}
              </div>
              <div>
                <span className="text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">Observations:</span> {report.incidents}
              </div>
              <div>
                <span className="text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">Avancement:</span> {report.progress}%
              </div>
            </div>
          </div>
        ) : (
          <div className="px-6 pb-6">
            <div className="rounded-xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-4 text-sm text-[var(--app-text-muted)]">
              Renseigne les champs puis clique sur “Générer le rapport”.
            </div>
          </div>
        )}
      </Card>

      <div className="text-xs text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">
        Les résultats sont des estimations d’aide au chantier. Ils doivent être vérifiés selon les conditions réelles du projet.
      </div>
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/Button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { MvpToolShell } from "@/components/calculs/MvpToolShell";

type DosageItem = {
  id: string;
  title: string;
  subtitle: string;
  lines: string[];
};

const DOSAGES: DosageItem[] = [
  {
    id: "beton-courant",
    title: "Dosage béton courant",
    subtitle: "Repère terrain (indicatif)",
    lines: [
      "Béton 350 kg/m³ (indicatif)",
      "Ciment : ~7 sacs (50 kg) / m³",
      "Sable : ~0,50 m³ / m³",
      "Gravier : ~0,80 m³ / m³",
      "Eau : ajuster selon consistance",
    ],
  },
  {
    id: "mortier",
    title: "Mortier (maçonnerie)",
    subtitle: "Repère terrain (indicatif)",
    lines: ["1 volume ciment", "3 volumes sable", "Eau : selon ouvrabilité"],
  },
  {
    id: "enduit",
    title: "Enduit (traditionnel)",
    subtitle: "Repère terrain (indicatif)",
    lines: ["1 volume ciment", "4 volumes sable", "Eau : selon finition"],
  },
  {
    id: "chape",
    title: "Chape",
    subtitle: "Repère terrain (indicatif)",
    lines: ["1 volume ciment", "4 volumes sable", "Épaisseur : 3 à 5 cm (selon usage)"],
  },
  {
    id: "beton-proprete",
    title: "Béton de propreté",
    subtitle: "Repère terrain (indicatif)",
    lines: ["Béton faiblement dosé (indicatif)", "Ciment : ~5 sacs (50 kg) / m³", "Épaisseur : 5 cm"],
  },
  {
    id: "reperes",
    title: "Repères terrain",
    subtitle: "Rappels simples",
    lines: [
      "Toujours vérifier les dosages selon matériaux disponibles",
      "Adapter selon humidité du sable et granulométrie",
      "Privilégier des seaux/mesures constantes sur chantier",
    ],
  },
];

export default function DosageLibraryClient() {
  const [copied, setCopied] = useState<string | null>(null);

  const disclaimer = useMemo(() => "Les valeurs sont indicatives et doivent être adaptées au projet.", []);

  return (
    <MvpToolShell title="Bibliothèque de dosages" subtitle="Dosages indicatifs, repères terrain et rappels pratiques.">
      <div className="rounded-2xl border border-[var(--cp-border)] bg-[color-mix(in_oklab,var(--cp-card),transparent_8%)] p-4 text-sm text-[color-mix(in_oklab,var(--cp-text),transparent_25%)]">
        <div className="font-bold text-[var(--cp-text)]">Note</div>
        <div className="mt-1">{disclaimer}</div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {DOSAGES.map((d) => (
          <Card key={d.id}>
            <CardHeader>
              <CardTitle>{d.title}</CardTitle>
              <CardDescription>{d.subtitle}</CardDescription>
            </CardHeader>
            <div className="px-6 pb-6">
              <ul className="list-disc space-y-1 pl-5 text-sm text-[color-mix(in_oklab,var(--cp-text),transparent_25%)]">
                {d.lines.map((l) => (
                  <li key={l}>{l}</li>
                ))}
              </ul>

              <div className="mt-4 flex items-center justify-between gap-3">
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  onClick={async () => {
                    const text = [d.title, ...d.lines].join("\n");
                    await navigator.clipboard.writeText(text);
                    setCopied(d.id);
                    window.setTimeout(() => setCopied(null), 1500);
                  }}
                >
                  {copied === d.id ? "Copié" : "Copier"}
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </MvpToolShell>
  );
}

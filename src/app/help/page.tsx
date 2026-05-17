"use client";

import { useState } from "react";

import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/Button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { SITE_CONFIG } from "@/lib/site-config";

const FAQS = [
  {
    q: "Comment créer un chantier ?",
    a: "Va dans Chantiers > Nouveau chantier, puis renseigne les informations essentielles. Tu pourras ensuite ajouter des rapports et des dépenses.",
  },
  {
    q: "Comment utiliser les calculateurs ?",
    a: "Va dans Calculs, choisis un calculateur, remplis les paramètres puis lance le calcul. Certains calculateurs permettent aussi de sauvegarder l’historique par chantier.",
  },
  {
    q: "Comment accéder aux outils Pro ?",
    a: "Les outils Pro/Entreprise apparaissent dans Calculateurs avec une indication. Tu peux passer Pro depuis la page Tarifs.",
  },
  {
    q: "Comment changer d’abonnement ?",
    a: "Va dans Réglages > Abonnement puis utilise le bouton de gestion. Tu peux aussi passer par la page Tarifs.",
  },
  {
    q: "Comment installer l’application ?",
    a: "Va dans Réglages > Installer l’application, ou ouvre le guide d’installation. Sur iPhone, l’ajout se fait via Partager > Sur l’écran d’accueil.",
  },
  {
    q: "Comment contacter le support ?",
    a: `Tu peux contacter le support par email à ${SITE_CONFIG.supportEmail}.`,
  },
];

export default function HelpPage() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <AppShell>
      <div className="grid gap-6">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[var(--cp-text)]">Centre d’aide</h1>
          <p className="mt-1 text-sm text-[color-mix(in_oklab,var(--cp-text),transparent_45%)]">
            Réponses rapides aux questions les plus fréquentes.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>FAQ</CardTitle>
            <CardDescription>Appuie sur une question pour voir la réponse.</CardDescription>
          </CardHeader>

          <div className="grid gap-2">
            {FAQS.map((f, idx) => {
              const isOpen = open === idx;
              return (
                <button
                  key={f.q}
                  type="button"
                  onClick={() => setOpen(isOpen ? null : idx)}
                  className="rounded-2xl border border-[var(--cp-border)] bg-[color-mix(in_oklab,var(--cp-card),transparent_8%)] p-4 text-left transition hover:bg-[color-mix(in_oklab,var(--cp-card),transparent_4%)]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="text-sm font-bold text-[var(--cp-text)]">{f.q}</div>
                    <div className="text-sm font-bold text-[color-mix(in_oklab,var(--cp-text),transparent_45%)]">
                      {isOpen ? "—" : "+"}
                    </div>
                  </div>
                  {isOpen ? (
                    <div className="mt-2 text-sm text-[color-mix(in_oklab,var(--cp-text),transparent_25%)]">{f.a}</div>
                  ) : null}
                </button>
              );
            })}
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button href="/support" variant="secondary" size="lg">
              Contacter le support
            </Button>
            <Button href={`mailto:${SITE_CONFIG.supportEmail}`} size="lg">
              Envoyer un email
            </Button>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}

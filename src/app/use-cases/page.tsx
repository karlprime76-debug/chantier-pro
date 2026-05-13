import { MarketingHeader } from "@/components/layout/MarketingHeader";
import { MarketingFooter } from "@/components/layout/MarketingFooter";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

type UseCase = {
  title: string;
  situation: string;
  problem: string;
  solution: string;
  ctaLabel: string;
  ctaHref: string;
};

const USE_CASES: UseCase[] = [
  {
    title: "Préparer une commande béton",
    situation: "Dalle, poteaux ou longrines à couler.",
    problem: "Risque d’erreur de volume et de manque de matériaux.",
    solution: "Utilise les calculateurs béton + formulation pour estimer volumes et quantités.",
    ctaLabel: "Ouvrir les calculs",
    ctaHref: "/calculs",
  },
  {
    title: "Calculer une semelle isolée",
    situation: "Fondations ponctuelles sous poteaux.",
    problem: "Quantitatifs (béton, acier, coffrage) difficiles à fiabiliser.",
    solution: "Module Fondations : volumes, acier, coffrage et estimations indicatives.",
    ctaLabel: "Découvrir Fondations",
    ctaHref: "/features/fondations",
  },
  {
    title: "Suivre les dépenses d’un chantier",
    situation: "Dépenses au fil de la journée.",
    problem: "Perte des tickets, oubli des montants et dérive budget.",
    solution: "Enregistre les dépenses, compare prévu vs réel et garde l’historique.",
    ctaLabel: "Découvrir Suivi budget",
    ctaHref: "/features/suivi-budget",
  },
  {
    title: "Créer un rapport journalier",
    situation: "Fin de journée : avancement et incidents.",
    problem: "Messages WhatsApp dispersés et non structurés.",
    solution: "Rapports journaliers : structure simple + export via impression.",
    ctaLabel: "Découvrir Rapports journaliers",
    ctaHref: "/features/rapports-journaliers",
  },
  {
    title: "Contrôler le ferraillage avant bétonnage",
    situation: "Avant coulage, contrôle terrain.",
    problem: "Oublis de points critiques (enrobage, recouvrements, attentes).",
    solution: "Rapports de contrôle : sections prêtes à l’emploi + export.",
    ctaLabel: "Voir Rapports de contrôle",
    ctaHref: "/calculs/rapports-controle",
  },
  {
    title: "Suivre les fondations d’une villa",
    situation: "Du terrassement au remblai.",
    problem: "Difficile de structurer les étapes + quantitatifs.",
    solution: "Page Fondations (schémas) + calculateur Entreprise.",
    ctaLabel: "Voir la fonctionnalité",
    ctaHref: "/features/fondations",
  },
  {
    title: "Estimer une formulation de béton",
    situation: "Béton indicatif + corrections humidité.",
    problem: "Dosage approximatif et eau mal ajustée.",
    solution: "Formulation béton : repères indicatifs + corrections humidité/absorption.",
    ctaLabel: "Découvrir Formulation béton",
    ctaHref: "/features/formulation-beton",
  },
  {
    title: "Gérer plusieurs chantiers en entreprise",
    situation: "Suivi multi-projets.",
    problem: "Manque de visibilité, documents dispersés.",
    solution: "Entreprise : multi-utilisateurs + modules avancés + exports.",
    ctaLabel: "Voir l’offre Entreprise",
    ctaHref: "/pricing",
  },
];

export default function UseCasesPage() {
  return (
    <div className="min-h-full">
      <MarketingHeader />
      <AppShell className="pb-16">
        <div className="mx-auto w-full max-w-3xl">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-[var(--app-text)]">Cas d’usage Chantier Pro</h1>
            <p className="mt-2 text-sm text-[var(--app-text-muted)]">
              Des scénarios terrain concrets pour comprendre quand utiliser Chantier Pro.
            </p>
          </div>

          <div className="mt-6 grid gap-4">
            {USE_CASES.map((c) => (
              <Card key={c.title}>
                <CardHeader>
                  <CardTitle>{c.title}</CardTitle>
                  <CardDescription>
                    <div className="mt-2 grid gap-2 text-sm text-[var(--app-text-muted)]">
                      <div>
                        <span className="font-bold text-[var(--app-text)]">Situation :</span> {c.situation}
                      </div>
                      <div>
                        <span className="font-bold text-[var(--app-text)]">Problème terrain :</span> {c.problem}
                      </div>
                      <div>
                        <span className="font-bold text-[var(--app-text)]">Solution Chantier Pro :</span> {c.solution}
                      </div>
                    </div>
                  </CardDescription>
                </CardHeader>
                <div className="px-6 pb-6">
                  <Button href={c.ctaHref} variant="secondary">
                    {c.ctaLabel}
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button href="/demo" size="lg" variant="secondary">
              Tester avec un chantier exemple
            </Button>
            <Button href="/pricing" size="lg">
              Voir les tarifs
            </Button>
          </div>
        </div>
      </AppShell>
      <MarketingFooter />
    </div>
  );
}

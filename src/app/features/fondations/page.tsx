import { MarketingHeader } from "@/components/layout/MarketingHeader";
import { MarketingFooter } from "@/components/layout/MarketingFooter";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { getSession } from "@/lib/auth/session";

type MiniDiagramVariant =
  | "implantation"
  | "fouilles"
  | "controle_fond"
  | "beton_proprete"
  | "coffrage"
  | "ferraillage"
  | "reservations"
  | "betonnage"
  | "cure"
  | "remblai"
  | "controle_rapport"
  | "semelle_isolee"
  | "semelle_filante"
  | "longrine"
  | "radier"
  | "puits"
  | "pieux"
  | "massif"
  | "cloture";

function FoundationMiniDiagram({ variant }: { variant: MiniDiagramVariant }) {
  const frame =
    "rounded-2xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_6%)] p-3";
  const soil = "absolute inset-x-3 bottom-3 h-5 rounded-xl bg-[color-mix(in_oklab,var(--app-text),transparent_92%)]";
  const excavation =
    "absolute inset-x-6 bottom-3 h-6 rounded-b-xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-bg),transparent_0%)]";
  const blinding = "absolute inset-x-6 bottom-3 h-2 rounded-b-xl bg-[color-mix(in_oklab,var(--cp-accent),transparent_78%)]";
  const concrete = "absolute inset-x-6 bottom-5 h-6 rounded-xl bg-[color-mix(in_oklab,var(--app-text),transparent_88%)]";
  const concreteThin = "absolute inset-x-6 bottom-5 h-4 rounded-xl bg-[color-mix(in_oklab,var(--app-text),transparent_88%)]";
  const rebar = "absolute inset-x-7 bottom-7 h-1 rounded bg-[color-mix(in_oklab,var(--cp-accent),black_18%)]";

  if (variant === "implantation") {
    return (
      <div className={frame}>
        <div className="relative h-16">
          <div className="absolute inset-x-3 top-3 h-8 rounded-xl border border-[var(--app-card-border)] bg-[var(--app-bg)]" />
          <div className="absolute left-6 top-6 h-4 w-10 rounded bg-[color-mix(in_oklab,var(--cp-accent),transparent_70%)]" />
          <div className="absolute right-6 top-6 h-4 w-10 rounded bg-[color-mix(in_oklab,var(--cp-accent),transparent_70%)]" />
          <div className="absolute inset-x-8 top-6 h-0.5 bg-[color-mix(in_oklab,var(--app-text),transparent_55%)]" />
          <div className="absolute inset-y-6 left-1/2 w-0.5 -translate-x-1/2 bg-[color-mix(in_oklab,var(--app-text),transparent_55%)]" />
        </div>
      </div>
    );
  }

  if (variant === "fouilles") {
    return (
      <div className={frame}>
        <div className="relative h-16">
          <div className={soil} />
          <div className={excavation} />
        </div>
      </div>
    );
  }

  if (variant === "controle_fond") {
    return (
      <div className={frame}>
        <div className="relative h-16">
          <div className={soil} />
          <div className={excavation} />
          <div className="absolute bottom-6 left-1/2 h-7 w-7 -translate-x-1/2 rounded-full border border-[var(--app-card-border)] bg-[var(--app-bg)]" />
          <div className="absolute bottom-8 left-1/2 h-0.5 w-4 -translate-x-1/2 bg-[color-mix(in_oklab,var(--app-text),transparent_40%)]" />
          <div className="absolute bottom-10 left-1/2 h-0.5 w-3 -translate-x-1/2 bg-[color-mix(in_oklab,var(--app-text),transparent_40%)]" />
        </div>
      </div>
    );
  }

  if (variant === "beton_proprete") {
    return (
      <div className={frame}>
        <div className="relative h-16">
          <div className={soil} />
          <div className={excavation} />
          <div className={blinding} />
        </div>
      </div>
    );
  }

  if (variant === "coffrage") {
    return (
      <div className={frame}>
        <div className="relative h-16">
          <div className={soil} />
          <div className={excavation} />
          <div className={blinding} />
          <div className="absolute inset-x-6 bottom-5 h-6 rounded-xl border-2 border-dashed border-[color-mix(in_oklab,var(--app-text),transparent_60%)]" />
        </div>
      </div>
    );
  }

  if (variant === "ferraillage") {
    return (
      <div className={frame}>
        <div className="relative h-16">
          <div className={soil} />
          <div className={excavation} />
          <div className={blinding} />
          <div className={concreteThin} />
          <div className={rebar} />
          <div className="absolute bottom-7 left-10 h-4 w-0.5 bg-[color-mix(in_oklab,var(--cp-accent),black_18%)]" />
          <div className="absolute bottom-7 right-10 h-4 w-0.5 bg-[color-mix(in_oklab,var(--cp-accent),black_18%)]" />
        </div>
      </div>
    );
  }

  if (variant === "reservations") {
    return (
      <div className={frame}>
        <div className="relative h-16">
          <div className={soil} />
          <div className={excavation} />
          <div className={blinding} />
          <div className={concreteThin} />
          <div className="absolute bottom-6 left-1/2 h-7 w-10 -translate-x-1/2 rounded-xl border border-[var(--app-card-border)] bg-[var(--app-bg)]" />
        </div>
      </div>
    );
  }

  if (variant === "betonnage") {
    return (
      <div className={frame}>
        <div className="relative h-16">
          <div className={soil} />
          <div className={excavation} />
          <div className={blinding} />
          <div className={concrete} />
          <div className="absolute right-6 top-4 h-7 w-7 rounded-full bg-[color-mix(in_oklab,var(--cp-accent),transparent_70%)]" />
          <div className="absolute right-8 top-10 h-5 w-0.5 bg-[color-mix(in_oklab,var(--cp-accent),transparent_30%)]" />
        </div>
      </div>
    );
  }

  if (variant === "cure") {
    return (
      <div className={frame}>
        <div className="relative h-16">
          <div className={soil} />
          <div className={excavation} />
          <div className={blinding} />
          <div className={concrete} />
          <div className="absolute inset-x-7 bottom-12 h-0.5 bg-[color-mix(in_oklab,var(--app-text),transparent_65%)]" />
          <div className="absolute inset-x-10 bottom-10 h-0.5 bg-[color-mix(in_oklab,var(--app-text),transparent_75%)]" />
        </div>
      </div>
    );
  }

  if (variant === "remblai") {
    return (
      <div className={frame}>
        <div className="relative h-16">
          <div className={soil} />
          <div className={concrete} />
          <div className="absolute inset-x-3 bottom-3 h-6 rounded-xl bg-[color-mix(in_oklab,var(--app-text),transparent_94%)]" />
        </div>
      </div>
    );
  }

  if (variant === "controle_rapport") {
    return (
      <div className={frame}>
        <div className="relative h-16">
          <div className="absolute left-4 top-3 h-10 w-8 rounded-xl border border-[var(--app-card-border)] bg-[var(--app-bg)]" />
          <div className="absolute left-5 top-5 h-0.5 w-6 bg-[color-mix(in_oklab,var(--app-text),transparent_55%)]" />
          <div className="absolute left-5 top-7 h-0.5 w-5 bg-[color-mix(in_oklab,var(--app-text),transparent_70%)]" />
          <div className="absolute left-5 top-9 h-0.5 w-4 bg-[color-mix(in_oklab,var(--app-text),transparent_70%)]" />
          <div className="absolute right-4 bottom-4 h-8 w-8 rounded-full bg-[color-mix(in_oklab,var(--cp-accent),transparent_78%)]" />
          <div className="absolute right-6 bottom-7 h-3 w-0.5 rotate-45 bg-[color-mix(in_oklab,var(--cp-accent),black_18%)]" />
          <div className="absolute right-5 bottom-6 h-5 w-0.5 -rotate-45 bg-[color-mix(in_oklab,var(--cp-accent),black_18%)]" />
        </div>
      </div>
    );
  }

  if (variant === "semelle_isolee") {
    return (
      <div className={frame}>
        <div className="relative h-16">
          <div className={soil} />
          <div className="absolute left-1/2 bottom-5 h-6 w-10 -translate-x-1/2 rounded-xl bg-[color-mix(in_oklab,var(--app-text),transparent_88%)]" />
          <div className="absolute left-1/2 bottom-11 h-8 w-2 -translate-x-1/2 rounded bg-[color-mix(in_oklab,var(--app-text),transparent_86%)]" />
        </div>
      </div>
    );
  }

  if (variant === "semelle_filante") {
    return (
      <div className={frame}>
        <div className="relative h-16">
          <div className={soil} />
          <div className="absolute inset-x-6 bottom-5 h-6 rounded-xl bg-[color-mix(in_oklab,var(--app-text),transparent_88%)]" />
          <div className="absolute inset-x-10 bottom-11 h-8 rounded bg-[color-mix(in_oklab,var(--app-text),transparent_86%)]" />
        </div>
      </div>
    );
  }

  if (variant === "longrine") {
    return (
      <div className={frame}>
        <div className="relative h-16">
          <div className={soil} />
          <div className="absolute left-7 bottom-5 h-6 w-6 rounded-xl bg-[color-mix(in_oklab,var(--app-text),transparent_88%)]" />
          <div className="absolute right-7 bottom-5 h-6 w-6 rounded-xl bg-[color-mix(in_oklab,var(--app-text),transparent_88%)]" />
          <div className="absolute inset-x-12 bottom-9 h-4 rounded-xl bg-[color-mix(in_oklab,var(--app-text),transparent_86%)]" />
        </div>
      </div>
    );
  }

  if (variant === "radier") {
    return (
      <div className={frame}>
        <div className="relative h-16">
          <div className={soil} />
          <div className="absolute inset-x-4 bottom-5 h-7 rounded-2xl bg-[color-mix(in_oklab,var(--app-text),transparent_88%)]" />
          <div className="absolute inset-x-6 bottom-8 h-1 rounded bg-[color-mix(in_oklab,var(--cp-accent),black_18%)]" />
        </div>
      </div>
    );
  }

  if (variant === "puits") {
    return (
      <div className={frame}>
        <div className="relative h-16">
          <div className={soil} />
          <div className="absolute left-1/2 bottom-5 h-8 w-10 -translate-x-1/2 rounded-xl bg-[color-mix(in_oklab,var(--app-text),transparent_88%)]" />
          <div className="absolute left-1/2 bottom-5 h-11 w-5 -translate-x-1/2 rounded-xl bg-[color-mix(in_oklab,var(--app-text),transparent_92%)]" />
        </div>
      </div>
    );
  }

  if (variant === "pieux") {
    return (
      <div className={frame}>
        <div className="relative h-16">
          <div className={soil} />
          <div className="absolute left-10 bottom-5 h-10 w-2 rounded bg-[color-mix(in_oklab,var(--app-text),transparent_88%)]" />
          <div className="absolute left-1/2 bottom-5 h-10 w-2 -translate-x-1/2 rounded bg-[color-mix(in_oklab,var(--app-text),transparent_88%)]" />
          <div className="absolute right-10 bottom-5 h-10 w-2 rounded bg-[color-mix(in_oklab,var(--app-text),transparent_88%)]" />
          <div className="absolute inset-x-7 bottom-14 h-2 rounded-xl bg-[color-mix(in_oklab,var(--app-text),transparent_86%)]" />
        </div>
      </div>
    );
  }

  if (variant === "massif") {
    return (
      <div className={frame}>
        <div className="relative h-16">
          <div className={soil} />
          <div className="absolute left-1/2 bottom-5 h-8 w-12 -translate-x-1/2 rounded-2xl bg-[color-mix(in_oklab,var(--app-text),transparent_88%)]" />
          <div className="absolute left-1/2 bottom-13 h-4 w-4 -translate-x-1/2 rounded bg-[color-mix(in_oklab,var(--cp-accent),transparent_75%)]" />
        </div>
      </div>
    );
  }

  return (
    <div className={frame}>
      <div className="relative h-16">
        <div className={soil} />
        <div className="absolute inset-x-8 bottom-5 h-6 rounded-xl bg-[color-mix(in_oklab,var(--app-text),transparent_88%)]" />
        <div className="absolute inset-x-10 bottom-11 h-6 rounded bg-[color-mix(in_oklab,var(--app-text),transparent_92%)]" />
      </div>
    </div>
  );
}

function FoundationVisualCard({
  title,
  description,
  variant,
}: {
  title: string;
  description: string;
  variant: MiniDiagramVariant;
}) {
  return (
    <Card>
      <CardHeader>
        <div className="grid gap-3">
          <FoundationMiniDiagram variant={variant} />
          <div>
            <CardTitle className="text-base">{title}</CardTitle>
            <CardDescription className="mt-1">{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}

export default async function FeatureFondationsPage() {
  const session = await getSession();

  return (
    <div className="min-h-full">
      <MarketingHeader />
      <AppShell className="pb-16">
        <div className="mx-auto w-full max-w-3xl">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-[var(--app-text)]">
              Fondations — Calculs, étapes et quantitatifs BTP
            </h1>
            <p className="mt-2 text-sm text-[var(--app-text-muted)]">
              Le module Fondations de Chantier Pro aide les équipes BTP à préparer, calculer et suivre les fondations d’un projet, depuis
              les fouilles jusqu’au bétonnage.
            </p>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Types de fondations couverts</CardTitle>
                <CardDescription>
                  <div className="mt-2 grid gap-1 text-sm text-[var(--app-text-muted)]">
                    <div>Semelles isolées</div>
                    <div>Semelles filantes</div>
                    <div>Longrines</div>
                    <div>Radier</div>
                    <div>Puits</div>
                    <div>Pieux</div>
                    <div>Massifs</div>
                    <div>Fondations de clôtures / portail (si pertinent)</div>
                  </div>
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Étapes du début à la fin</CardTitle>
                <CardDescription>
                  <div className="mt-2 grid gap-1 text-sm text-[var(--app-text-muted)]">
                    <div>Analyse des données du projet</div>
                    <div>Choix du type de fondation</div>
                    <div>Implantation</div>
                    <div>Fouilles</div>
                    <div>Contrôle du sol</div>
                    <div>Béton de propreté</div>
                    <div>Coffrage (si nécessaire)</div>
                    <div>Ferraillage</div>
                    <div>Réservations / attentes</div>
                    <div>Bétonnage</div>
                    <div>Cure</div>
                    <div>Remblai</div>
                    <div>Contrôle et rapport</div>
                  </div>
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="sm:col-span-2">
              <CardHeader>
                <CardTitle>Étapes d’exécution illustrées</CardTitle>
                <CardDescription>Des schémas simplifiés pour visualiser le déroulement des travaux de fondation.</CardDescription>
              </CardHeader>
              <div className="px-6 pb-6">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <FoundationVisualCard
                    title="Implantation"
                    description="Repérage précis des axes et dimensions sur le terrain."
                    variant="implantation"
                  />
                  <FoundationVisualCard
                    title="Fouilles / terrassement"
                    description="Excavation selon les dimensions et profondeurs prévues."
                    variant="fouilles"
                  />
                  <FoundationVisualCard
                    title="Contrôle du fond de fouille"
                    description="Vérification du sol et des niveaux avant béton."
                    variant="controle_fond"
                  />
                  <FoundationVisualCard
                    title="Béton de propreté"
                    description="Couche propre pour préparer la fondation."
                    variant="beton_proprete"
                  />
                  <FoundationVisualCard
                    title="Coffrage (si nécessaire)"
                    description="Mise en place pour maintenir les formes."
                    variant="coffrage"
                  />
                  <FoundationVisualCard
                    title="Ferraillage"
                    description="Disposition des armatures selon prescriptions."
                    variant="ferraillage"
                  />
                  <FoundationVisualCard
                    title="Réservations / attentes"
                    description="Passages et attentes avant coulage."
                    variant="reservations"
                  />
                  <FoundationVisualCard
                    title="Bétonnage"
                    description="Coulage avec contrôle de mise en œuvre."
                    variant="betonnage"
                  />
                  <FoundationVisualCard title="Cure" description="Protection et maintien des conditions de durcissement." variant="cure" />
                  <FoundationVisualCard title="Remblai" description="Remise en place après durcissement et contrôle." variant="remblai" />
                  <FoundationVisualCard
                    title="Contrôle / rapport final"
                    description="Contrôle qualité et récapitulatif des travaux."
                    variant="controle_rapport"
                  />
                </div>

                <div className="mt-4 rounded-2xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-4 text-sm text-[var(--app-text-muted)]">
                  Ces schémas sont fournis à titre illustratif. Les dimensions, ferraillages et dispositions finales doivent toujours
                  respecter les plans d’exécution, les études de sol et les notes de calcul validées par les professionnels compétents.
                </div>
              </div>
            </Card>

            <Card className="sm:col-span-2">
              <CardHeader>
                <CardTitle>Types de fondations couverts (illustrations)</CardTitle>
                <CardDescription>Mini schémas pédagogiques pour visualiser les principales configurations.</CardDescription>
              </CardHeader>
              <div className="px-6 pb-6">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <FoundationVisualCard
                    title="Semelle isolée"
                    description="Fondation ponctuelle sous poteau."
                    variant="semelle_isolee"
                  />
                  <FoundationVisualCard
                    title="Semelle filante"
                    description="Fondation continue sous mur porteur."
                    variant="semelle_filante"
                  />
                  <FoundationVisualCard
                    title="Longrine"
                    description="Liaison entre appuis, reprise et répartition de charges."
                    variant="longrine"
                  />
                  <FoundationVisualCard
                    title="Radier"
                    description="Dalle de fondation répartissant les charges sur toute la surface."
                    variant="radier"
                  />
                  <FoundationVisualCard title="Puits" description="Fondation profonde par excavation locale." variant="puits" />
                  <FoundationVisualCard
                    title="Pieux"
                    description="Fondation profonde transmettant les charges à un sol plus résistant."
                    variant="pieux"
                  />
                  <FoundationVisualCard title="Massifs" description="Bloc béton de reprise ponctuelle." variant="massif" />
                  <FoundationVisualCard
                    title="Clôture / portail"
                    description="Fondations simplifiées pour ouvrages légers."
                    variant="cloture"
                  />
                </div>
              </div>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Calculs & quantitatifs</CardTitle>
                <CardDescription>
                  <div className="mt-2 grid gap-1 text-sm text-[var(--app-text-muted)]">
                    <div>Volume de fouille</div>
                    <div>Volume de béton de propreté</div>
                    <div>Volume de béton de fondation</div>
                    <div>Quantité d’acier</div>
                    <div>Surface de coffrage</div>
                    <div>Estimation remblai</div>
                    <div>Estimation coûts</div>
                    <div>Rapport récapitulatif</div>
                  </div>
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pour qui ?</CardTitle>
                <CardDescription>
                  <div className="mt-2 grid gap-1 text-sm text-[var(--app-text-muted)]">
                    <div>Entreprises BTP</div>
                    <div>Chefs chantier</div>
                    <div>Ingénieurs</div>
                    <div>Techniciens génie civil</div>
                    <div>Conducteurs de travaux</div>
                    <div>Équipes de suivi chantier</div>
                  </div>
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="sm:col-span-2">
              <CardHeader>
                <CardTitle>Avertissement professionnel</CardTitle>
                <CardDescription>
                  Les calculs proposés servent d’aide au quantitatif et au suivi chantier. Les dimensions structurelles doivent toujours
                  respecter les plans d’exécution, les études de sol et les notes de calcul validées par les professionnels compétents.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          <div className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Calculateurs Fondations</CardTitle>
                <CardDescription>
                  Accède aux calculateurs (fouilles, propreté, béton, acier, coffrage, remblai, coût). Réservé à l’offre Entreprise.
                </CardDescription>
              </CardHeader>
              <div className="px-6 pb-6 flex flex-col gap-3 sm:flex-row">
                <Button href="/dashboard/calculators/fondations" variant="secondary" size="lg">
                  Accéder au calculateur Fondations
                </Button>
                <Button href="/pricing" variant="ghost" size="lg">
                  Voir l’offre Entreprise
                </Button>
              </div>
            </Card>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button href="/pricing" variant="secondary" size="lg">
              Voir l’offre Entreprise
            </Button>
            {session ? (
              <Button href="/dashboard" size="lg">
                Tableau de bord
              </Button>
            ) : (
              <Button href="/register" size="lg">
                Créer un compte
              </Button>
            )}
          </div>

          <div className="mt-6 rounded-2xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-5">
            <div className="text-sm font-bold text-[var(--app-text)]">Positionnement</div>
            <div className="mt-2 text-sm text-[var(--app-text-muted)]">
              Calculs, étapes et quantitatifs pour fondations, du terrassement au bétonnage.
            </div>
          </div>
        </div>
      </AppShell>
      <MarketingFooter />
    </div>
  );
}

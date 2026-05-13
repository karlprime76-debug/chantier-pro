import { MarketingHeader } from "@/components/layout/MarketingHeader";
import { MarketingFooter } from "@/components/layout/MarketingFooter";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { HomeClientExtras } from "@/components/home/HomeClientExtras";
import { HomePublicCtas } from "@/components/home/HomePublicCtas";
import { HomeProtectedCardLink } from "@/components/home/HomeProtectedCardLink";
import { cn } from "@/lib/cn";

export default function Home() {
  return (
    <div className="min-h-full">
      <MarketingHeader />
      <AppShell className="pb-[calc(104px+env(safe-area-inset-bottom))]">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_12%)] px-3 py-1 text-xs font-semibold text-[var(--app-text-muted)]">
              SaaS mobile-first pour le BTP
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--cp-accent)]" />
              Chantier Pro
            </div>
            <div className="mt-4 grid gap-6 lg:grid-cols-2 lg:items-start">
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-[var(--app-text)] sm:text-4xl">
                  Gère tes chantiers BTP depuis ton téléphone.
                  <br />
                  Calcule le béton, l’acier, les dépenses et les rapports journaliers en quelques minutes.
                  <br />
                  Un suivi clair, du terrain au bureau.
                </h1>
                <p className="mt-4 max-w-xl text-base leading-7 text-[var(--app-text-muted)]">
                  Chantier Pro centralise tes chantiers, automatise les calculs de quantités et t’aide à suivre les coûts et l’avancement,
                  directement sur mobile.
                </p>

                <HomePublicCtas variant="hero" />
              </div>

              <div className="rounded-3xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-4">
                <div className="mx-auto max-w-sm">
                  <div className="rounded-[34px] border border-[var(--app-card-border)] bg-[var(--app-bg)] p-3 shadow-[0_14px_40px_-26px_rgba(0,0,0,0.65)]">
                    <div className="flex items-center justify-between px-1">
                      <div className="text-xs font-bold text-[var(--app-text)]">Chantier Pro</div>
                      <div className="text-[11px] text-[var(--app-text-muted)]">Aperçu mobile</div>
                    </div>

                    <div className="mt-3 grid gap-3">
                      <div className="rounded-2xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_8%)] p-3">
                        <div className="text-xs text-[var(--app-text-muted)]">Calcul béton</div>
                        <div className="mt-1 text-sm font-extrabold text-[var(--app-text)]">Volume : 12,5 m³</div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="rounded-2xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_8%)] p-3">
                          <div className="text-xs text-[var(--app-text-muted)]">Dépenses</div>
                          <div className="mt-1 text-sm font-extrabold text-[var(--app-text)]">420 000 FCFA</div>
                        </div>
                        <div className="rounded-2xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_8%)] p-3">
                          <div className="text-xs text-[var(--app-text-muted)]">Budget</div>
                          <div className="mt-1 text-sm font-extrabold text-[var(--app-text)]">Prévu vs réel</div>
                        </div>
                      </div>

                      <div className="rounded-2xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_8%)] p-3">
                        <div className="text-xs text-[var(--app-text-muted)]">Rapport journalier</div>
                        <div className="mt-1 text-sm font-extrabold text-[var(--app-text)]">3 tâches • 1 incident</div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 grid gap-2 text-xs text-[var(--app-text-muted)]">
                    <div className="rounded-2xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_6%)] p-3">
                      Pensé mobile : saisie rapide sur le terrain.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-5">
              <div className="text-sm font-bold text-[var(--app-text)]">Preuve produit</div>
              <div className="mt-2 text-sm text-[var(--app-text-muted)]">
                Exemple : calculez rapidement le volume de béton, estimez les quantités d’acier, puis rattachez le calcul à un chantier.
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_6%)] p-4">
                  <div className="text-xs text-[var(--app-text-muted)]">Étape 1</div>
                  <div className="mt-1 text-sm font-bold text-[var(--app-text)]">Calcul béton</div>
                  <div className="mt-2 grid gap-2">
                    <div className="rounded-xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-3 text-sm text-[var(--app-text-muted)]">
                      Dalle : 12 m × 8 m × 0,12 m
                    </div>
                    <div className="rounded-xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-3">
                      <div className="text-xs text-[var(--app-text-muted)]">Résultat</div>
                      <div className="mt-1 text-lg font-extrabold text-[var(--app-text)]">11,52 m³</div>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_6%)] p-4">
                  <div className="text-xs text-[var(--app-text-muted)]">Étape 2</div>
                  <div className="mt-1 text-sm font-bold text-[var(--app-text)]">Rattacher au chantier</div>
                  <div className="mt-2 grid gap-2">
                    <div className="rounded-xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-3 text-sm text-[var(--app-text-muted)]">
                      Chantier : Villa Cotonou — Dalle RDC
                    </div>
                    <div className="rounded-xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-3 text-sm text-[var(--app-text-muted)]">
                      Historique : calcul sauvegardé, partage et réutilisation.
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <HomePublicCtas variant="pair" />
              </div>
            </div>

            <HomeClientExtras />

            <div className="mt-8 rounded-2xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-5">
              <div className="text-sm font-bold text-[var(--app-text)]">Comment ça marche (3 étapes)</div>
              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_6%)] p-4">
                  <div className="text-xs font-bold text-[var(--cp-accent)]">1</div>
                  <div className="mt-2 text-sm font-bold text-[var(--app-text)]">Crée ton chantier</div>
                  <div className="mt-1 text-sm text-[var(--app-text-muted)]">Projet, équipe, infos essentielles.</div>
                </div>
                <div className="rounded-2xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_6%)] p-4">
                  <div className="text-xs font-bold text-[var(--cp-accent)]">2</div>
                  <div className="mt-2 text-sm font-bold text-[var(--app-text)]">Lance tes calculs</div>
                  <div className="mt-1 text-sm text-[var(--app-text-muted)]">Béton & acier, résultats clairs.</div>
                </div>
                <div className="rounded-2xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_6%)] p-4">
                  <div className="text-xs font-bold text-[var(--cp-accent)]">3</div>
                  <div className="mt-2 text-sm font-bold text-[var(--app-text)]">Suis budget & rapports</div>
                  <div className="mt-1 text-sm text-[var(--app-text-muted)]">Dépenses, historique, journal.</div>
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-5">
              <div className="text-sm font-bold text-[var(--app-text)]">Pourquoi Chantier Pro ?</div>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_6%)] p-4 text-sm text-[var(--app-text-muted)]">
                  Moins d’erreurs de quantité sur le terrain.
                </div>
                <div className="rounded-2xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_6%)] p-4 text-sm text-[var(--app-text-muted)]">
                  Gain de temps sur les calculs et les suivis.
                </div>
                <div className="rounded-2xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_6%)] p-4 text-sm text-[var(--app-text-muted)]">
                  Meilleur suivi du budget (prévu vs réel).
                </div>
                <div className="rounded-2xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_6%)] p-4 text-sm text-[var(--app-text-muted)]">
                  Rapports plus propres et historique par chantier.
                </div>
              </div>
            </div>

            <div id="pour-qui" className="mt-8 rounded-2xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-5">
              <div className="text-sm font-bold text-[var(--app-text)]">Pour qui ?</div>
              <div className="mt-3 grid gap-2 text-sm text-[var(--app-text-muted)] sm:grid-cols-2">
                <div className="rounded-xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_6%)] p-3">Techniciens génie civil</div>
                <div className="rounded-xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_6%)] p-3">Chefs chantier bâtiments</div>
                <div className="rounded-xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_6%)] p-3">Conducteurs de travaux</div>
                <div className="rounded-xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_6%)] p-3">PME BTP</div>
                <div className="rounded-xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_6%)] p-3 sm:col-span-2">Responsables de projet</div>
              </div>
            </div>

            <div id="fonctionnalites" className="mt-6 rounded-2xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-5">
              <div className="text-sm font-bold text-[var(--app-text)]">Fonctionnalités clés</div>
              <div className="mt-3 grid gap-2 text-sm text-[var(--app-text-muted)] sm:grid-cols-2">
                <div className="rounded-xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_6%)] p-3">Calcul béton</div>
                <div className="rounded-xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_6%)] p-3">Calcul acier</div>
                <div className="rounded-xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_6%)] p-3">Suivi dépenses</div>
                <div className="rounded-xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_6%)] p-3">Budget prévu vs réel</div>
                <div className="rounded-xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_6%)] p-3">Rapports journaliers</div>
                <div className="rounded-xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_6%)] p-3">Historique par chantier</div>
              </div>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <HomeProtectedCardLink
                hrefAuthenticated="/calculs"
                hrefUnauthenticated="/features/calculs-beton-acier"
                ariaLabelAuthenticated="Ouvrir les calculateurs"
                ariaLabelUnauthenticated="Découvrir les calculs béton et acier sur Chantier Pro"
                className={cn(
                  "cp-hover-lift rounded-2xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-4 transition",
                  "cursor-pointer hover:bg-[color-mix(in_oklab,var(--app-card),transparent_2%)]",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cp-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--app-bg)]",
                )}
              >
                <div className="text-sm font-bold text-[var(--app-text)]">Calculs</div>
                <div className="mt-1 text-xs text-[var(--app-text-muted)]">Béton & acier</div>
              </HomeProtectedCardLink>

              <HomeProtectedCardLink
                hrefAuthenticated="/dashboard"
                hrefUnauthenticated="/features/suivi-budget"
                ariaLabelAuthenticated="Ouvrir le suivi sur le dashboard"
                ariaLabelUnauthenticated="Découvrir le suivi budget sur Chantier Pro"
                className={cn(
                  "cp-hover-lift rounded-2xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-4 transition",
                  "cursor-pointer hover:bg-[color-mix(in_oklab,var(--app-card),transparent_2%)]",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cp-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--app-bg)]",
                )}
              >
                <div className="text-sm font-bold text-[var(--app-text)]">Suivi</div>
                <div className="mt-1 text-xs text-[var(--app-text-muted)]">Budget vs réel</div>
              </HomeProtectedCardLink>

              <HomeProtectedCardLink
                hrefAuthenticated="/dashboard/reports"
                hrefUnauthenticated="/features/rapports-journaliers"
                ariaLabelAuthenticated="Ouvrir les rapports journaliers"
                ariaLabelUnauthenticated="Découvrir les rapports journaliers sur Chantier Pro"
                className={cn(
                  "cp-hover-lift rounded-2xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-4 transition",
                  "cursor-pointer hover:bg-[color-mix(in_oklab,var(--app-card),transparent_2%)]",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cp-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--app-bg)]",
                )}
              >
                <div className="text-sm font-bold text-[var(--app-text)]">Rapports</div>
                <div className="mt-1 text-xs text-[var(--app-text-muted)]">Journal chantier</div>
              </HomeProtectedCardLink>
            </div>

          </div>

          <div className="lg:col-span-5">
            <Card>
              <CardHeader>
                <CardTitle>Démarrage rapide</CardTitle>
                <CardDescription>
                  Crée un chantier, ajoute les membres, puis enregistre calculs, dépenses et rapports.
                </CardDescription>
              </CardHeader>
              <HomePublicCtas variant="quickstart" />
            </Card>
          </div>
        </div>
      </AppShell>
      <MarketingFooter />
    </div>
  );
}

import { MarketingHeader } from "@/components/layout/MarketingHeader";
import { MarketingFooter } from "@/components/layout/MarketingFooter";
import { AppShell } from "@/components/layout/AppShell";
import { HomePublicCtas } from "@/components/home/HomePublicCtas";
import { HomeProtectedCardLink } from "@/components/home/HomeProtectedCardLink";
import { cn } from "@/lib/cn";

export default function Home() {
  return (
    <div className="min-h-full">
      <MarketingHeader />
      <AppShell className="pb-[calc(104px+env(safe-area-inset-bottom))]">
        <div className="grid gap-10">
          <section>
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_12%)] px-3 py-1 text-xs font-semibold text-[var(--app-text-muted)]">
              Chantier Pro
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--cp-accent)]" />
              Application BTP
            </div>
            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-[var(--app-text)] sm:text-4xl">
              Gérez vos chantiers plus simplement.
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-[var(--app-text-muted)]">
              Chantier Pro est une application BTP (logiciel chantier) qui centralise vos projets de construction, vos calculs béton/acier,
              le suivi chantier, les dépenses, le budget et les rapports — pensée pour le Bénin et l’Afrique francophone.
            </p>
            <HomePublicCtas variant="hero" />
          </section>

          <section>
            <div className="text-sm font-bold text-[var(--app-text)]">Ce que vous pouvez faire</div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-4">
                <div className="text-sm font-bold text-[var(--app-text)]">Chantiers</div>
                <div className="mt-1 text-sm text-[var(--app-text-muted)]">Suivez vos projets, dépenses et avancements.</div>
              </div>
              <div className="rounded-2xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-4">
                <div className="text-sm font-bold text-[var(--app-text)]">Calculateurs</div>
                <div className="mt-1 text-sm text-[var(--app-text-muted)]">Calculez béton, acier, fondations, coffrage et plus.</div>
              </div>
              <div className="rounded-2xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-4">
                <div className="text-sm font-bold text-[var(--app-text)]">Dépenses</div>
                <div className="mt-1 text-sm text-[var(--app-text-muted)]">Gardez un budget clair, prévu vs réel.</div>
              </div>
              <div className="rounded-2xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-4">
                <div className="text-sm font-bold text-[var(--app-text)]">Documents</div>
                <div className="mt-1 text-sm text-[var(--app-text-muted)]">Générez et consultez vos rapports de chantier.</div>
              </div>
            </div>
          </section>

          <section>
            <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
              <div>
                <div className="text-sm font-bold text-[var(--app-text)]">Calculateurs</div>
                <div className="mt-1 text-sm text-[var(--app-text-muted)]">Les essentiels pour démarrer rapidement.</div>
              </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
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
                <div className="text-sm font-bold text-[var(--app-text)]">Béton</div>
                <div className="mt-1 text-xs text-[var(--app-text-muted)]">Volumes et dosages</div>
              </HomeProtectedCardLink>

              <HomeProtectedCardLink
                hrefAuthenticated="/dashboard/calculators/steel"
                hrefUnauthenticated="/features/calculs-beton-acier"
                ariaLabelAuthenticated="Ouvrir les calculateurs acier"
                ariaLabelUnauthenticated="Découvrir les calculs acier sur Chantier Pro"
                className={cn(
                  "cp-hover-lift rounded-2xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-4 transition",
                  "cursor-pointer hover:bg-[color-mix(in_oklab,var(--app-card),transparent_2%)]",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cp-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--app-bg)]",
                )}
              >
                <div className="text-sm font-bold text-[var(--app-text)]">Acier / Ferraillage</div>
                <div className="mt-1 text-xs text-[var(--app-text-muted)]">Poids et quantités</div>
              </HomeProtectedCardLink>

              <HomeProtectedCardLink
                hrefAuthenticated="/dashboard/calculators/fondations"
                hrefUnauthenticated="/features/fondations"
                ariaLabelAuthenticated="Ouvrir le module fondations"
                ariaLabelUnauthenticated="Découvrir le module fondations sur Chantier Pro"
                className={cn(
                  "cp-hover-lift rounded-2xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-4 transition",
                  "cursor-pointer hover:bg-[color-mix(in_oklab,var(--app-card),transparent_2%)]",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cp-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--app-bg)]",
                )}
              >
                <div className="text-sm font-bold text-[var(--app-text)]">Fondations</div>
                <div className="mt-1 text-xs text-[var(--app-text-muted)]">Étapes et quantitatifs</div>
              </HomeProtectedCardLink>

              <HomeProtectedCardLink
                hrefAuthenticated="/dashboard/calculators/formwork"
                hrefUnauthenticated="/features"
                ariaLabelAuthenticated="Ouvrir les calculateurs coffrage"
                ariaLabelUnauthenticated="Découvrir les outils coffrage sur Chantier Pro"
                className={cn(
                  "cp-hover-lift rounded-2xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-4 transition",
                  "cursor-pointer hover:bg-[color-mix(in_oklab,var(--app-card),transparent_2%)]",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cp-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--app-bg)]",
                )}
              >
                <div className="text-sm font-bold text-[var(--app-text)]">Coffrage</div>
                <div className="mt-1 text-xs text-[var(--app-text-muted)]">Surfaces et besoins</div>
              </HomeProtectedCardLink>

              <HomeProtectedCardLink
                hrefAuthenticated="/dashboard/calculators"
                hrefUnauthenticated="/register"
                ariaLabelAuthenticated="Voir tous les calculateurs"
                ariaLabelUnauthenticated="Se connecter pour accéder à tous les calculateurs"
                className={cn(
                  "cp-hover-lift rounded-2xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-4 transition",
                  "cursor-pointer hover:bg-[color-mix(in_oklab,var(--app-card),transparent_2%)]",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cp-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--app-bg)]",
                )}
              >
                <div className="text-sm font-bold text-[var(--app-text)]">Voir tout</div>
                <div className="mt-1 text-xs text-[var(--app-text-muted)]">Tous les calculateurs</div>
              </HomeProtectedCardLink>
            </div>
          </section>

          <section className="rounded-2xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-5">
            <div className="text-sm font-bold text-[var(--app-text)]">Plans</div>
            <div className="mt-2 text-sm text-[var(--app-text-muted)]">Gratuit pour démarrer, puis Pro ou Entreprise selon vos besoins.</div>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_6%)] p-4">
                <div className="text-sm font-bold text-[var(--app-text)]">Gratuit</div>
                <div className="mt-1 text-xs text-[var(--app-text-muted)]">Pour démarrer et tester l’essentiel.</div>
              </div>
              <div className="rounded-2xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_6%)] p-4">
                <div className="text-sm font-bold text-[var(--app-text)]">Pro</div>
                <div className="mt-1 text-xs text-[var(--app-text-muted)]">Suivi complet, dépenses et documents.</div>
              </div>
              <div className="rounded-2xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_6%)] p-4">
                <div className="text-sm font-bold text-[var(--app-text)]">Entreprise</div>
                <div className="mt-1 text-xs text-[var(--app-text-muted)]">Collaboration et projets plus avancés.</div>
              </div>
            </div>
            <div className="mt-4">
              <HomeProtectedCardLink
                hrefAuthenticated="/pricing"
                hrefUnauthenticated="/pricing"
                ariaLabelAuthenticated="Voir les tarifs"
                ariaLabelUnauthenticated="Voir les tarifs"
                className={cn(
                  "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold",
                  "bg-[color-mix(in_oklab,var(--app-card),transparent_6%)] text-[var(--app-text)] ring-1 ring-[var(--app-card-border)]",
                  "hover:bg-[color-mix(in_oklab,var(--app-card),transparent_2%)]",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cp-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--app-bg)]",
                )}
              >
                Voir les tarifs
              </HomeProtectedCardLink>
            </div>
          </section>

          <section className="rounded-2xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-5">
            <div className="text-sm font-bold text-[var(--app-text)]">Prêt à organiser vos chantiers ?</div>
            <div className="mt-2 text-sm text-[var(--app-text-muted)]">
              Démarrez en quelques minutes et centralisez vos projets, calculs et documents.
            </div>
            <div className="mt-4">
              <HomePublicCtas variant="pair" />
            </div>
          </section>
        </div>
      </AppShell>
      <MarketingFooter />
    </div>
  );
}

import { MarketingHeader } from "@/components/layout/MarketingHeader";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { PlanBadge } from "@/components/ui/PlanBadge";
import { SubscribeButton } from "@/components/billing/SubscribeButton";
import { BillingHealthCheck } from "@/components/billing/BillingHealthCheck";
import { getSession } from "@/lib/auth/session";

export default async function PricingPage() {
  const session = await getSession();
  const canSeeBillingHealth = process.env.NODE_ENV !== "production" || session?.role === "ADMIN";

  return (
    <div className="min-h-full">
      <MarketingHeader />
      <AppShell className="pb-16">
        <div className="mx-auto w-full max-w-3xl">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">Tarifs</h1>
            <p className="mt-2 text-sm text-white/60">Choisis un plan pour accéder aux calculateurs Premium et Entreprise.</p>
          </div>

          <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="text-lg font-extrabold tracking-tight text-white">
              Passe au niveau pro pour mieux gérer tes chantiers
            </div>
            <div className="mt-2 text-sm text-white/65">
              Gagne du temps, réduis les erreurs de calcul et transforme tes quantités en devis, rapports et suivis chantier.
            </div>
            <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-3 text-sm text-white/70">
              Un seul mauvais calcul peut coûter plus cher qu’un abonnement Premium.
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between gap-3">
                  <CardTitle>Premium</CardTitle>
                  <PlanBadge variant="premium" />
                </div>
                <CardDescription>
                  Calculateurs avancés + fonctionnalités réservées.
                </CardDescription>
              </CardHeader>
              <div className="grid gap-3">
                <div className="text-2xl font-extrabold tracking-tight text-white">15 000 FCFA</div>
                <div className="text-sm text-white/60">par mois</div>
                <SubscribeButton plan="PREMIUM">S&apos;abonner</SubscribeButton>
              </div>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between gap-3">
                  <CardTitle>Entreprise</CardTitle>
                  <PlanBadge variant="premium" />
                </div>
                <CardDescription>
                  Modules complets + besoins d&apos;équipe.
                </CardDescription>
              </CardHeader>
              <div className="grid gap-3">
                <div className="text-2xl font-extrabold tracking-tight text-white">25 000 FCFA</div>
                <div className="text-sm text-white/60">par mois</div>
                <SubscribeButton plan="ENTERPRISE">S&apos;abonner</SubscribeButton>
              </div>
            </Card>
          </div>

          <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-4">
            <div className="text-sm font-bold text-white">Comparatif rapide</div>
            <div className="mt-3 overflow-x-auto">
              <div className="min-w-[680px]">
                <div className="grid grid-cols-[1.4fr_1fr_1fr_1fr] gap-2 text-xs font-bold text-white/60">
                  <div />
                  <div className="text-center">Gratuit</div>
                  <div className="text-center">Premium</div>
                  <div className="text-center">Entreprise</div>
                </div>
                <div className="mt-2 grid gap-2 text-sm">
                  <div className="grid grid-cols-[1.4fr_1fr_1fr_1fr] items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                    <div className="text-white/80">Calculateurs de base</div>
                    <div className="text-center text-white/70">Oui</div>
                    <div className="text-center text-white/70">Oui</div>
                    <div className="text-center text-white/70">Oui</div>
                  </div>
                  <div className="grid grid-cols-[1.4fr_1fr_1fr_1fr] items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                    <div className="text-white/80">Calculateurs avancés</div>
                    <div className="text-center text-white/70">Limité</div>
                    <div className="text-center text-white/70">Oui</div>
                    <div className="text-center text-white/70">Oui</div>
                  </div>
                  <div className="grid grid-cols-[1.4fr_1fr_1fr_1fr] items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                    <div className="text-white/80">Sauvegarde des calculs par chantier</div>
                    <div className="text-center text-white/70">Limité</div>
                    <div className="text-center text-white/70">Oui</div>
                    <div className="text-center text-white/70">Oui</div>
                  </div>
                  <div className="grid grid-cols-[1.4fr_1fr_1fr_1fr] items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                    <div className="text-white/80">Export PDF</div>
                    <div className="text-center text-white/70">Non</div>
                    <div className="text-center text-white/70">Oui (bientôt)</div>
                    <div className="text-center text-white/70">Oui (bientôt)</div>
                  </div>
                  <div className="grid grid-cols-[1.4fr_1fr_1fr_1fr] items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                    <div className="text-white/80">Devis depuis les calculs</div>
                    <div className="text-center text-white/70">Non</div>
                    <div className="text-center text-white/70">Oui (bientôt)</div>
                    <div className="text-center text-white/70">Oui (bientôt)</div>
                  </div>
                  <div className="grid grid-cols-[1.4fr_1fr_1fr_1fr] items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                    <div className="text-white/80">Rapports journaliers</div>
                    <div className="text-center text-white/70">Non</div>
                    <div className="text-center text-white/70">Oui</div>
                    <div className="text-center text-white/70">Oui</div>
                  </div>
                  <div className="grid grid-cols-[1.4fr_1fr_1fr_1fr] items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                    <div className="text-white/80">Suivi budget / dépenses</div>
                    <div className="text-center text-white/70">Limité</div>
                    <div className="text-center text-white/70">Oui</div>
                    <div className="text-center text-white/70">Oui</div>
                  </div>
                  <div className="grid grid-cols-[1.4fr_1fr_1fr_1fr] items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                    <div className="text-white/80">Multi-utilisateurs</div>
                    <div className="text-center text-white/70">Non</div>
                    <div className="text-center text-white/70">Non</div>
                    <div className="text-center text-white/70">Oui</div>
                  </div>
                  <div className="grid grid-cols-[1.4fr_1fr_1fr_1fr] items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                    <div className="text-white/80">Export Excel</div>
                    <div className="text-center text-white/70">Non</div>
                    <div className="text-center text-white/70">Bientôt</div>
                    <div className="text-center text-white/70">Oui</div>
                  </div>
                  <div className="grid grid-cols-[1.4fr_1fr_1fr_1fr] items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                    <div className="text-white/80">Support prioritaire</div>
                    <div className="text-center text-white/70">Non</div>
                    <div className="text-center text-white/70">Oui</div>
                    <div className="text-center text-white/70">Oui</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-2 text-xs text-white/55">Fais glisser horizontalement si besoin.</div>
          </div>

          <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/60">
            Après paiement, ton plan est activé automatiquement.
          </div>

          <div className="mt-6">
            <div className="text-lg font-extrabold tracking-tight text-white">Pourquoi passer à Premium ?</div>
            <div className="mt-2 text-sm text-white/60">
              Des bénéfices concrets pour les hommes de terrain et les bureaux.
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="text-sm font-bold text-white">Réduire les erreurs de commande</div>
                <div className="mt-1 text-sm text-white/60">
                  Quantités plus fiables, marge de perte maîtrisée, moins d&apos;allers-retours.
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="text-sm font-bold text-white">Gagner du temps sur les quantités</div>
                <div className="mt-1 text-sm text-white/60">
                  Calculateurs avancés et historiques pour répéter un calcul en quelques secondes.
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="text-sm font-bold text-white">Partager plus vite</div>
                <div className="mt-1 text-sm text-white/60">
                  Export PDF (bientôt) et partage WhatsApp pour envoyer au patron, au client ou au fournisseur.
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="text-sm font-bold text-white">Suivi chantier (budget + rapports)</div>
                <div className="mt-1 text-sm text-white/60">
                  Dépenses, budget prévu vs réel et rapports journaliers pour mieux piloter.
                </div>
              </div>
            </div>
          </div>

          {canSeeBillingHealth ? <BillingHealthCheck /> : null}
        </div>
      </AppShell>
    </div>
  );
}

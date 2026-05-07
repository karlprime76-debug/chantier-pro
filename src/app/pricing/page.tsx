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

import { MarketingHeader } from "@/components/layout/MarketingHeader";
import { MarketingFooter } from "@/components/layout/MarketingFooter";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { getSession } from "@/lib/auth/session";

export default async function FeatureFormulationBetonPage() {
  const session = await getSession();

  return (
    <div className="min-h-full">
      <MarketingHeader />
      <AppShell className="pb-16">
        <div className="mx-auto w-full max-w-3xl">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-[var(--app-text)]">
              Formulation de béton — Dosage, quantités et corrections chantier
            </h1>
            <p className="mt-2 text-sm text-[var(--app-text-muted)]">
              Un module indicatif pour estimer une formulation de béton : ciment, eau, sable, gravier, adjuvant, correction d’humidité et
              quantités par volume.
            </p>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Données nécessaires</CardTitle>
                <CardDescription>
                  <div className="mt-2 grid gap-1 text-sm text-[var(--app-text-muted)]">
                    <div>Volume à produire (m³)</div>
                    <div>Classe visée + ouvrabilité</div>
                    <div>Granulométrie max</div>
                    <div>Densités et prix (optionnels)</div>
                    <div>Humidité / absorption sable & gravier</div>
                    <div>Adjuvant (optionnel)</div>
                  </div>
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Résultats fournis</CardTitle>
                <CardDescription>
                  <div className="mt-2 grid gap-1 text-sm text-[var(--app-text-muted)]">
                    <div>Ciment (kg/m³) + sacs 50 kg</div>
                    <div>Eau théorique et eau corrigée (L/m³)</div>
                    <div>Sable / gravier (kg/m³) + volumes approx</div>
                    <div>Adjuvant (si activé)</div>
                    <div>Totaux pour le volume du chantier</div>
                    <div>Coût estimatif (si prix renseignés)</div>
                  </div>
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cas d’usage</CardTitle>
                <CardDescription>
                  Préparer une commande béton, estimer les quantités à approvisionner et ajuster l’eau de gâchage selon l’humidité des
                  granulats.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Accès</CardTitle>
                <CardDescription>Module inclus dans l’offre Entreprise.</CardDescription>
              </CardHeader>
              <div className="px-6 pb-6 flex flex-col gap-3 sm:flex-row">
                <Button href="/dashboard/calculators/formulation-beton" variant="secondary" size="lg">
                  Accéder au calculateur
                </Button>
                <Button href="/pricing" variant="ghost" size="lg">
                  Voir l’offre Entreprise
                </Button>
              </div>
            </Card>

            <Card className="sm:col-span-2">
              <CardHeader>
                <CardTitle>Avertissement technique</CardTitle>
                <CardDescription>
                  Les dosages proposés sont indicatifs et doivent être validés par des essais de laboratoire, des essais de convenance et les
                  normes applicables avant toute utilisation sur ouvrage.
                </CardDescription>
              </CardHeader>
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
        </div>
      </AppShell>
      <MarketingFooter />
    </div>
  );
}

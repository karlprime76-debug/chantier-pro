import { MarketingHeader } from "@/components/layout/MarketingHeader";
import { MarketingFooter } from "@/components/layout/MarketingFooter";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";

export default function RemboursementPage() {
  return (
    <div className="min-h-full">
      <MarketingHeader />
      <AppShell className="pb-16">
        <div className="mx-auto w-full max-w-3xl">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-[var(--app-text)]">Politique de remboursement</h1>
            <p className="mt-2 text-sm text-[var(--app-text-muted)]">Règles de remboursement liées aux abonnements Chantier Pro.</p>
          </div>

          <div className="mt-6 grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Principe</CardTitle>
                <CardDescription>
                  Les abonnements donnent accès à des fonctionnalités numériques immédiatement. Sauf obligation légale contraire, les paiements
                  déjà effectués ne sont généralement pas remboursables.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cas de dysfonctionnement</CardTitle>
                <CardDescription>
                  En cas de problème technique empêchant l’accès au service, contacte le support avec ton email de compte et les informations
                  de paiement. Nous analyserons la situation et proposerons une solution (correction, extension, geste commercial) selon le cas.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact</CardTitle>
                <CardDescription>Pour toute demande, écris à chantierprobj@gmail.com en précisant la date et la référence de paiement.</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </AppShell>
      <MarketingFooter />
    </div>
  );
}

import { MarketingHeader } from "@/components/layout/MarketingHeader";
import { MarketingFooter } from "@/components/layout/MarketingFooter";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";

export default function CookiesPage() {
  return (
    <div className="min-h-full">
      <MarketingHeader />
      <AppShell className="pb-16">
        <div className="mx-auto w-full max-w-3xl">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-[var(--app-text)]">Politique cookies</h1>
            <p className="mt-2 text-sm text-[var(--app-text-muted)]">Informations sur l’utilisation des cookies et technologies similaires.</p>
          </div>

          <div className="mt-6 grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Cookies essentiels</CardTitle>
                <CardDescription>
                  Nécessaires au fonctionnement du service (session, sécurité, préférences). Ces cookies ne peuvent pas être désactivés.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Mesure et amélioration</CardTitle>
                <CardDescription>
                  Nous pouvons utiliser des données techniques et des logs pour diagnostiquer des erreurs et améliorer la stabilité.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Gestion</CardTitle>
                <CardDescription>
                  Vous pouvez limiter certains cookies via les réglages de votre navigateur. Des restrictions peuvent impacter l’expérience.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </AppShell>
      <MarketingFooter />
    </div>
  );
}

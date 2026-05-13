import { MarketingHeader } from "@/components/layout/MarketingHeader";
import { MarketingFooter } from "@/components/layout/MarketingFooter";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";

export default function LegalPage() {
  return (
    <div className="min-h-full">
      <MarketingHeader />
      <AppShell>
        <div className="grid gap-6">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-[var(--cp-text)]">Mentions légales</h1>
            <p className="mt-1 text-sm text-[color-mix(in_oklab,var(--cp-text),transparent_45%)]">Version provisoire.</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Informations</CardTitle>
              <CardDescription>Les informations légales seront complétées lors de l’enregistrement officiel de la structure.</CardDescription>
            </CardHeader>

            <div className="grid gap-3 text-sm text-[color-mix(in_oklab,var(--cp-text),transparent_25%)]">
              <div>
                <span className="font-bold text-[var(--cp-text)]">Éditeur :</span> Chantier Pro
              </div>
              <div>
                <span className="font-bold text-[var(--cp-text)]">Statut :</span> Projet numérique en cours de développement
              </div>
              <div>
                <span className="font-bold text-[var(--cp-text)]">Contact :</span> chantierprobj@gmail.com
              </div>
              <div>
                <span className="font-bold text-[var(--cp-text)]">Pays :</span> Bénin
              </div>
            </div>
          </Card>
        </div>
      </AppShell>
      <MarketingFooter />
    </div>
  );
}

import { AppShell } from "@/components/layout/AppShell";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";

export default function TermsPage() {
  return (
    <AppShell>
      <div className="grid gap-6">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[var(--cp-text)]">Conditions d’utilisation</h1>
          <p className="mt-1 text-sm text-[color-mix(in_oklab,var(--cp-text),transparent_45%)]">
            Document informatif — version provisoire.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Conditions</CardTitle>
            <CardDescription>En utilisant Chantier Pro, vous acceptez ces conditions.</CardDescription>
          </CardHeader>

          <div className="grid gap-4 text-sm text-[color-mix(in_oklab,var(--cp-text),transparent_25%)]">
            <div>
              <div className="font-bold text-[var(--cp-text)]">Acceptation</div>
              <div className="mt-1">
                En accédant à la plateforme Chantier Pro, vous acceptez de respecter les présentes conditions.
              </div>
            </div>

            <div>
              <div className="font-bold text-[var(--cp-text)]">Comptes utilisateurs</div>
              <div className="mt-1">
                Vous êtes responsable des informations de votre compte et de la confidentialité de vos accès.
              </div>
            </div>

            <div>
              <div className="font-bold text-[var(--cp-text)]">Abonnements</div>
              <div className="mt-1">
                Certaines fonctionnalités peuvent être accessibles via des offres Premium/Entreprise. Les modalités peuvent
                évoluer.
              </div>
            </div>

            <div>
              <div className="font-bold text-[var(--cp-text)]">Outils de calcul</div>
              <div className="mt-1">
                Les calculateurs fournis par Chantier Pro sont des outils d’aide à l’estimation. Ils ne remplacent pas
                l’expertise d’un ingénieur, d’un architecte, d’un bureau d’études ou d’un professionnel qualifié.
              </div>
            </div>

            <div>
              <div className="font-bold text-[var(--cp-text)]">Limitation de responsabilité</div>
              <div className="mt-1">
                Chantier Pro fournit des informations à titre indicatif. Vous restez seul responsable des décisions prises sur
                vos chantiers.
              </div>
            </div>

            <div>
              <div className="font-bold text-[var(--cp-text)]">Disponibilité & suspension</div>
              <div className="mt-1">
                Le service peut être interrompu temporairement (maintenance, incidents). En cas d’abus, un compte peut être
                suspendu.
              </div>
            </div>

            <div>
              <div className="font-bold text-[var(--cp-text)]">Contact</div>
              <div className="mt-1">chantierprobj@gmail.com</div>
            </div>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}

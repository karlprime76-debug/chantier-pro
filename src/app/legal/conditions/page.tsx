import { AppShell } from "@/components/layout/AppShell";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";

export default function ConditionsPage() {
  return (
    <AppShell>
      <div className="grid gap-6">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[var(--app-text)]">Conditions d’utilisation</h1>
          <p className="mt-1 text-sm text-[var(--app-text-muted)]">Document provisoire — à compléter.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Conditions</CardTitle>
            <CardDescription>En utilisant Chantier Pro, vous acceptez ces conditions.</CardDescription>
          </CardHeader>
          <div className="grid gap-3 text-sm text-[var(--app-text-muted)]">
            <div>
              <div className="font-bold text-[var(--app-text)]">Usage des calculateurs</div>
              <div className="mt-1">
                Les calculateurs sont des outils d’aide à l’estimation. Vous restez responsable des décisions de chantier.
              </div>
            </div>
            <div>
              <div className="font-bold text-[var(--app-text)]">Comptes</div>
              <div className="mt-1">Vous êtes responsable de la confidentialité de vos accès.</div>
            </div>
            <div>
              <div className="font-bold text-[var(--app-text)]">Disponibilité</div>
              <div className="mt-1">Le service peut être interrompu temporairement (maintenance, incident).</div>
            </div>
            <div>
              <div className="font-bold text-[var(--app-text)]">Contact</div>
              <div className="mt-1">chantierprobj@gmail.com</div>
            </div>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}

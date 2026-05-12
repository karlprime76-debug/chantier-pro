import { AppShell } from "@/components/layout/AppShell";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";

export default function MentionsLegalesPage() {
  return (
    <AppShell>
      <div className="grid gap-6">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[var(--app-text)]">Mentions légales</h1>
          <p className="mt-1 text-sm text-[var(--app-text-muted)]">Document provisoire — à compléter avant lancement commercial.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Éditeur</CardTitle>
            <CardDescription>Informations de base (MVP).</CardDescription>
          </CardHeader>

          <div className="grid gap-3 text-sm text-[var(--app-text-muted)]">
            <div>
              <span className="font-bold text-[var(--app-text)]">Nom du service :</span> Chantier Pro
            </div>
            <div>
              <span className="font-bold text-[var(--app-text)]">Contact :</span> chantierprobj@gmail.com
            </div>
            <div>
              <span className="font-bold text-[var(--app-text)]">Pays :</span> Bénin
            </div>
            <div>
              <span className="font-bold text-[var(--app-text)]">Hébergement :</span> Vercel (États‑Unis / UE selon région)
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Responsabilité</CardTitle>
            <CardDescription>Cadre de transparence.</CardDescription>
          </CardHeader>
          <div className="grid gap-2 text-sm text-[var(--app-text-muted)]">
            <div>
              Les informations fournies par Chantier Pro (calculateurs, estimations, rapports) sont indicatives et ne remplacent
              pas l’expertise d’un professionnel qualifié.
            </div>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}

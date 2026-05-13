import { AppShell } from "@/components/layout/AppShell";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { SITE_CONFIG } from "@/lib/site-config";

export default function MentionsLegalesPage() {
  return (
    <AppShell>
      <div className="grid gap-6">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[var(--app-text)]">Mentions légales</h1>
          <p className="mt-1 text-sm text-[var(--app-text-muted)]">Informations légales relatives au service Chantier Pro.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Éditeur</CardTitle>
            <CardDescription>Informations d’identification du service.</CardDescription>
          </CardHeader>

          <div className="grid gap-3 text-sm text-[var(--app-text-muted)]">
            <div>
              <span className="font-bold text-[var(--app-text)]">Nom du service :</span> Chantier Pro
            </div>
            <div>
              <span className="font-bold text-[var(--app-text)]">Éditeur / responsable du service :</span> {SITE_CONFIG.editor}
            </div>
            <div>
              <span className="font-bold text-[var(--app-text)]">Contact :</span> {SITE_CONFIG.email}
            </div>
            <div>
              <span className="font-bold text-[var(--app-text)]">WhatsApp :</span> {SITE_CONFIG.whatsappDisplay}
            </div>
            <div>
              <span className="font-bold text-[var(--app-text)]">Localisation :</span> {SITE_CONFIG.city}, {SITE_CONFIG.country}
            </div>
            <div>
              <span className="font-bold text-[var(--app-text)]">Pays :</span> {SITE_CONFIG.country}
            </div>
            <div>
              <span className="font-bold text-[var(--app-text)]">Hébergement :</span> Vercel (États‑Unis / UE selon région)
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Informations complémentaires</CardTitle>
            <CardDescription>Transparence sur l’activité.</CardDescription>
          </CardHeader>
          <div className="grid gap-2 text-sm text-[var(--app-text-muted)]">
            <div>
              Chantier Pro est un service en cours d’évolution. Les informations juridiques pourront être complétées après formalisation
              de l’activité.
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Responsabilité</CardTitle>
            <CardDescription>Cadre d’utilisation et limites.</CardDescription>
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

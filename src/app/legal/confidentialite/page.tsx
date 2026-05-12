import { AppShell } from "@/components/layout/AppShell";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { SITE_CONFIG } from "@/lib/site-config";

export default function ConfidentialitePage() {
  return (
    <AppShell>
      <div className="grid gap-6">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[var(--app-text)]">Politique de confidentialité</h1>
          <p className="mt-1 text-sm text-[var(--app-text-muted)]">Cette page décrit comment Chantier Pro traite vos données.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Données traitées</CardTitle>
            <CardDescription>Ce que nous collectons pour fournir le service.</CardDescription>
          </CardHeader>
          <div className="grid gap-3 text-sm text-[var(--app-text-muted)]">
            <div>
              <span className="font-bold text-[var(--app-text)]">Compte :</span> email, informations d’authentification.
            </div>
            <div>
              <span className="font-bold text-[var(--app-text)]">Chantiers :</span> projets, dépenses, rapports, calculs.
            </div>
            <div>
              <span className="font-bold text-[var(--app-text)]">Techniques :</span> données de diagnostic (logs) pour la sécurité et la maintenance.
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Utilisation</CardTitle>
            <CardDescription>Pourquoi ces données sont nécessaires.</CardDescription>
          </CardHeader>
          <div className="grid gap-2 text-sm text-[var(--app-text-muted)]">
            <div>Fournir l’application, sécuriser l’accès, améliorer l’expérience et prévenir les abus.</div>
            <div>
              Les calculateurs et estimations fournis dans l’application sont des outils d’aide et ne remplacent pas l’expertise
              d’un professionnel qualifié.
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact</CardTitle>
            <CardDescription>Exercer vos droits (accès / rectification / suppression).</CardDescription>
          </CardHeader>
          <div className="grid gap-1 text-sm text-[var(--app-text-muted)]">
            <div>{SITE_CONFIG.email}</div>
            <div>WhatsApp : {SITE_CONFIG.whatsappDisplay}</div>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}

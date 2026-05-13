import { MarketingHeader } from "@/components/layout/MarketingHeader";
import { MarketingFooter } from "@/components/layout/MarketingFooter";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { SITE_CONFIG } from "@/lib/site-config";

export default function ConfidentialitePage() {
  return (
    <div className="min-h-full">
      <MarketingHeader />
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
                <span className="font-bold text-[var(--app-text)]">Compte :</span> nom, email, société (si fournie), informations d’authentification.
              </div>
              <div>
                <span className="font-bold text-[var(--app-text)]">Chantiers :</span> projets, dépenses, rapports, calculs.
              </div>
              <div>
                <span className="font-bold text-[var(--app-text)]">Techniques :</span> logs et données de diagnostic pour la sécurité et la maintenance.
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Utilisation</CardTitle>
              <CardDescription>Pourquoi ces données sont nécessaires.</CardDescription>
            </CardHeader>
            <div className="grid gap-2 text-sm text-[var(--app-text-muted)]">
              <div>
                Finalités principales : création de compte, gestion de chantier, suivi budget/dépenses, génération et consultation des
                rapports, amélioration du service et sécurité.
              </div>
              <div>
                Les calculateurs et estimations fournis dans l’application sont des outils d’aide et ne remplacent pas l’expertise
                d’un professionnel qualifié.
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Durée de conservation</CardTitle>
              <CardDescription>Combien de temps nous conservons les données.</CardDescription>
            </CardHeader>
            <div className="text-sm text-[var(--app-text-muted)]">
              Les données sont conservées tant que le compte est actif, sauf demande de suppression ou obligations légales spécifiques.
            </div>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Suppression de compte</CardTitle>
              <CardDescription>Exercer vos droits.</CardDescription>
            </CardHeader>
            <div className="text-sm text-[var(--app-text-muted)]">
              Vous pouvez demander la suppression de votre compte et de vos données par email. Nous répondrons dans un délai raisonnable.
            </div>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sécurité</CardTitle>
              <CardDescription>Protection des données.</CardDescription>
            </CardHeader>
            <div className="text-sm text-[var(--app-text-muted)]">
              Nous mettons en place des mesures raisonnables pour protéger les données (contrôle d’accès, sécurité applicative, surveillance
              et maintenance).
            </div>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Prestataires techniques</CardTitle>
              <CardDescription>Services utilisés pour fournir l’application.</CardDescription>
            </CardHeader>
            <div className="grid gap-2 text-sm text-[var(--app-text-muted)]">
              <div>Hébergement (ex: Vercel), base de données, email, et paiement si activé.</div>
              <div>Ces prestataires traitent uniquement les données nécessaires à l’exécution du service.</div>
            </div>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cookies / stockage local</CardTitle>
              <CardDescription>Fonctionnement du site.</CardDescription>
            </CardHeader>
            <div className="text-sm text-[var(--app-text-muted)]">
              Le site peut utiliser des cookies ou un stockage local pour la session, la sécurité et l’amélioration de l’expérience.
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
      <MarketingFooter />
    </div>
  );
}

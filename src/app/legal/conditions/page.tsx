import { MarketingHeader } from "@/components/layout/MarketingHeader";
import { MarketingFooter } from "@/components/layout/MarketingFooter";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { SITE_CONFIG } from "@/lib/site-config";

export default function ConditionsPage() {
  return (
    <div className="min-h-full">
      <MarketingHeader />
      <AppShell>
        <div className="grid gap-6">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-[var(--app-text)]">Conditions d’utilisation</h1>
            <p className="mt-1 text-sm text-[var(--app-text-muted)]">Conditions générales d’utilisation du service Chantier Pro.</p>
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
                  Les calculateurs et contenus fournis par Chantier Pro sont des outils d’aide à l’estimation. Ils ne remplacent pas
                  l’expertise d’un professionnel qualifié (ingénieur, technicien, conducteur de travaux). Vous restez responsable des
                  décisions de chantier, des quantités commandées et de l’exécution.
                </div>
              </div>
              <div>
                <div className="font-bold text-[var(--app-text)]">Responsabilité limitée</div>
                <div className="mt-1">
                  Chantier Pro fournit un service logiciel &quot;en l’état&quot;. Dans la limite permise par la loi, la responsabilité de Chantier Pro
                  ne pourra être engagée pour des pertes indirectes liées à l’usage de l’application.
                </div>
              </div>
              <div>
                <div className="font-bold text-[var(--app-text)]">Comptes</div>
                <div className="mt-1">Vous êtes responsable de la confidentialité de vos accès.</div>
              </div>
              <div>
                <div className="font-bold text-[var(--app-text)]">Abonnements</div>
                <div className="mt-1">
                  Le service propose des offres Gratuit, Premium et Entreprise. Certaines fonctionnalités peuvent être réservées aux offres
                  payantes.
                </div>
                <div className="mt-1">
                  Activation / suspension / annulation : l’accès peut être activé après paiement, suspendu en cas d’incident de paiement,
                  d’abus ou de maintenance, et annulé à votre demande selon les modalités proposées.
                </div>
              </div>
              <div>
                <div className="font-bold text-[var(--app-text)]">Paiement</div>
                <div className="mt-1">Les moyens de paiement et prestataires peuvent évoluer afin d’améliorer la disponibilité et la sécurité.</div>
              </div>
              <div>
                <div className="font-bold text-[var(--app-text)]">Disponibilité</div>
                <div className="mt-1">Le service peut être interrompu temporairement (maintenance, incident).</div>
              </div>
              <div>
                <div className="font-bold text-[var(--app-text)]">Utilisation correcte</div>
                <div className="mt-1">
                  Vous vous engagez à ne pas détourner le service (fraude, tentative d’intrusion, surcharge, contenu illégal). En cas d’abus,
                  le compte peut être suspendu ou supprimé.
                </div>
              </div>
              <div>
                <div className="font-bold text-[var(--app-text)]">Contact</div>
                <div className="mt-1">{SITE_CONFIG.email}</div>
                <div className="mt-1">WhatsApp : {SITE_CONFIG.whatsappDisplay}</div>
              </div>
            </div>
          </Card>
        </div>
      </AppShell>
      <MarketingFooter />
    </div>
  );
}

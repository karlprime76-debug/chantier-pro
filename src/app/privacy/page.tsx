import { AppShell } from "@/components/layout/AppShell";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";

export default function PrivacyPage() {
  return (
    <AppShell>
      <div className="grid gap-6">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[var(--cp-text)]">Politique de confidentialité</h1>
          <p className="mt-1 text-sm text-[color-mix(in_oklab,var(--cp-text),transparent_45%)]">
            Document informatif — version provisoire.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Résumé</CardTitle>
            <CardDescription>Chantier Pro est une plateforme numérique en cours de développement/édition.</CardDescription>
          </CardHeader>

          <div className="grid gap-4 text-sm text-[color-mix(in_oklab,var(--cp-text),transparent_25%)]">
            <div>
              <div className="font-bold text-[var(--cp-text)]">Données collectées</div>
              <div className="mt-1">
                Données de compte (ex: email), données liées aux chantiers (ex: projets, rapports, dépenses) et données
                techniques (ex: journaux, informations de navigateur) nécessaires au fonctionnement.
              </div>
            </div>

            <div>
              <div className="font-bold text-[var(--cp-text)]">Utilisation des données</div>
              <div className="mt-1">
                Les données sont utilisées pour fournir le service, améliorer l’expérience utilisateur, sécuriser l’accès et
                assurer la continuité du service.
              </div>
            </div>

            <div>
              <div className="font-bold text-[var(--cp-text)]">Paiements</div>
              <div className="mt-1">
                Si vous souscrivez à une offre payante, le paiement est traité par des prestataires externes. Chantier Pro ne
                stocke pas vos informations de carte bancaire.
              </div>
            </div>

            <div>
              <div className="font-bold text-[var(--cp-text)]">Sécurité & conservation</div>
              <div className="mt-1">
                Nous mettons en œuvre des mesures raisonnables pour protéger les données. Les données sont conservées le temps
                nécessaire au fonctionnement du service, puis supprimées/archivées selon les besoins.
              </div>
            </div>

            <div>
              <div className="font-bold text-[var(--cp-text)]">Vos droits</div>
              <div className="mt-1">
                Vous pouvez demander l’accès, la rectification ou la suppression de vos données dans la limite des obligations
                légales et techniques.
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

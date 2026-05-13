import Link from "next/link";

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
            <h1 className="text-2xl font-extrabold tracking-tight text-[var(--app-text)]">Informations légales</h1>
            <p className="mt-1 text-sm text-[var(--app-text-muted)]">
              Retrouvez ici les pages légales et les informations de contact de Chantier Pro.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>À propos</CardTitle>
              <CardDescription>Éléments essentiels pour identifier le service et contacter le responsable.</CardDescription>
            </CardHeader>

            <div className="grid gap-3 text-sm text-[var(--app-text-muted)]">
              <div>
                <span className="font-bold text-[var(--app-text)]">Service :</span> Chantier Pro
              </div>
              <div>
                <span className="font-bold text-[var(--app-text)]">Responsable :</span> TCHONAN Rodolphe Karl
              </div>
              <div>
                <span className="font-bold text-[var(--app-text)]">Email :</span> chantierprobj@gmail.com
              </div>
              <div>
                <span className="font-bold text-[var(--app-text)]">WhatsApp :</span> +229 01 58 68 45 48
              </div>
              <div>
                <span className="font-bold text-[var(--app-text)]">Localisation :</span> Cotonou, Bénin
              </div>
            </div>
          </Card>

          <div className="grid gap-4 sm:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Mentions légales</CardTitle>
                <CardDescription>Informations sur l’éditeur et le service.</CardDescription>
              </CardHeader>
              <div className="px-6 pb-6">
                <Link className="text-sm font-semibold text-[var(--app-primary)] underline" href="/legal/mentions-legales">
                  Ouvrir
                </Link>
              </div>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Confidentialité</CardTitle>
                <CardDescription>Comment nous traitons les données et la confidentialité.</CardDescription>
              </CardHeader>
              <div className="px-6 pb-6">
                <Link className="text-sm font-semibold text-[var(--app-primary)] underline" href="/legal/confidentialite">
                  Ouvrir
                </Link>
              </div>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Conditions d’utilisation</CardTitle>
                <CardDescription>Règles d’utilisation du service.</CardDescription>
              </CardHeader>
              <div className="px-6 pb-6">
                <Link className="text-sm font-semibold text-[var(--app-primary)] underline" href="/legal/conditions">
                  Ouvrir
                </Link>
              </div>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cookies</CardTitle>
                <CardDescription>Informations liées aux cookies et technologies similaires.</CardDescription>
              </CardHeader>
              <div className="px-6 pb-6">
                <Link className="text-sm font-semibold text-[var(--app-primary)] underline" href="/legal/cookies">
                  Ouvrir
                </Link>
              </div>
            </Card>

            <Card className="sm:col-span-2">
              <CardHeader>
                <CardTitle>Remboursement</CardTitle>
                <CardDescription>Politique de remboursement et support abonnement.</CardDescription>
              </CardHeader>
              <div className="px-6 pb-6">
                <Link className="text-sm font-semibold text-[var(--app-primary)] underline" href="/legal/remboursement">
                  Ouvrir
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </AppShell>
      <MarketingFooter />
    </div>
  );
}

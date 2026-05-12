import Link from "next/link";

import { AppShell } from "@/components/layout/AppShell";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";

const CONTACT_EMAIL = "chantierprobj@gmail.com";
const CONTACT_WHATSAPP = null as string | null;

export default function ContactPage() {
  return (
    <AppShell>
      <div className="grid gap-6">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[var(--app-text)]">Contact</h1>
          <p className="mt-1 text-sm text-[var(--app-text-muted)]">
            Une question sur Chantier Pro ? Notre équipe répond aux demandes de support technique et d’abonnement.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Nous contacter</CardTitle>
            <CardDescription>Réponse sous 24–72h ouvrées.</CardDescription>
          </CardHeader>

          <div className="grid gap-4">
            <div className="rounded-2xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-4">
              <div className="text-sm font-semibold text-[color-mix(in_oklab,var(--app-text),transparent_45%)]">Email</div>
              <div className="mt-1 text-sm font-bold text-[var(--app-text)]">
                <a className="text-[var(--app-primary)] underline" href={`mailto:${CONTACT_EMAIL}`}>
                  {CONTACT_EMAIL}
                </a>
              </div>
              <div className="mt-2 text-sm text-[var(--app-text-muted)]">
                Téléphone / WhatsApp : {CONTACT_WHATSAPP ? CONTACT_WHATSAPP : "À définir"}
              </div>
              <div className="mt-2 text-sm text-[var(--app-text-muted)]">Ville : Cotonou, Bénin</div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-4">
                <div className="text-sm font-semibold text-[color-mix(in_oklab,var(--app-text),transparent_45%)]">Support technique</div>
                <div className="mt-2 text-sm text-[var(--app-text-muted)]">
                  Indique ton email de compte, la page concernée et une description du problème (captures si possible).
                </div>
              </div>
              <div className="rounded-2xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-4">
                <div className="text-sm font-semibold text-[color-mix(in_oklab,var(--app-text),transparent_45%)]">Support abonnement</div>
                <div className="mt-2 text-sm text-[var(--app-text-muted)]">
                  Questions sur les plans, la facturation, l’activation Premium/Entreprise et l’accès aux fonctionnalités.
                </div>
              </div>
              <div className="rounded-2xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-4 sm:col-span-2">
                <div className="text-sm font-semibold text-[color-mix(in_oklab,var(--app-text),transparent_45%)]">Activation Premium / Entreprise</div>
                <div className="mt-2 text-sm text-[var(--app-text-muted)]">
                  Si ton paiement est passé mais que le plan n’est pas activé, envoie-nous ton email de compte et la date du paiement.
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-4">
              <div className="text-sm font-semibold text-[color-mix(in_oklab,var(--app-text),transparent_45%)]">Liens utiles</div>
              <div className="mt-2 grid gap-2 text-sm">
                <Link className="text-[var(--app-primary)] underline" href="/support">
                  Support
                </Link>
                <Link className="text-[var(--app-primary)] underline" href="/pricing">
                  Tarifs
                </Link>
                <Link className="text-[var(--app-primary)] underline" href="/legal">
                  Mentions légales
                </Link>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}

import Link from "next/link";

import { AppShell } from "@/components/layout/AppShell";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";

const CONTACT_EMAIL = "chantierprobj@gmail.com";

export default function ContactPage() {
  return (
    <AppShell>
      <div className="grid gap-6">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[var(--app-text)]">Contact</h1>
          <p className="mt-1 text-sm text-[var(--app-text-muted)]">
            Une question sur Chantier Pro ? Besoin d’aide pour un chantier ou un abonnement ?
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Nous contacter</CardTitle>
            <CardDescription>Réponse sous 24–72h ouvrées (MVP).</CardDescription>
          </CardHeader>

          <div className="grid gap-4">
            <div className="rounded-2xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-4">
              <div className="text-sm font-semibold text-[color-mix(in_oklab,var(--app-text),transparent_45%)]">Email</div>
              <div className="mt-1 text-sm font-bold text-[var(--app-text)]">{CONTACT_EMAIL}</div>
              <div className="mt-2 text-sm text-[var(--app-text-muted)]">
                Pour les demandes de support technique, merci d’indiquer votre email de compte et une description du problème.
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

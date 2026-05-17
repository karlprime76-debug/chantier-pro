import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/Button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { SITE_CONFIG } from "@/lib/site-config";

export default function SupportPage() {
  return (
    <AppShell>
      <div className="grid gap-6">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[var(--cp-text)]">Contacter le support</h1>
          <p className="mt-1 text-sm text-[color-mix(in_oklab,var(--cp-text),transparent_45%)]">
            Pour toute question, assistance ou problème technique, contactez l’équipe Chantier Pro.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Support</CardTitle>
            <CardDescription>Nous répondons dès que possible.</CardDescription>
          </CardHeader>

          <div className="grid gap-4">
            <div className="rounded-2xl border border-[var(--cp-border)] bg-[color-mix(in_oklab,var(--cp-card),transparent_8%)] p-4">
              <div className="text-sm font-semibold text-[color-mix(in_oklab,var(--cp-text),transparent_45%)]">Email</div>
              <div className="mt-1 text-sm font-bold text-[var(--cp-text)]">{SITE_CONFIG.supportEmail}</div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
              <Button href={`mailto:${SITE_CONFIG.supportEmail}`} size="lg">
                Envoyer un email
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}

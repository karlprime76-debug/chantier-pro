import { ResponsiveButton } from "@/components/ui/ResponsiveButton";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";

export function HelpSupportCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Aide & Support</CardTitle>
        <CardDescription>Besoin d’assistance ou d’informations ?</CardDescription>
      </CardHeader>

      <div className="grid gap-3 sm:grid-cols-2">
        <ResponsiveButton href="/help" prefetch loadingText="Ouverture…" variant="secondary" className="justify-start">
          Centre d’aide
        </ResponsiveButton>
        <ResponsiveButton href="/support" prefetch loadingText="Ouverture…" variant="secondary" className="justify-start">
          Contacter le support
        </ResponsiveButton>
        <ResponsiveButton href="/install" prefetch loadingText="Ouverture…" variant="secondary" className="justify-start">
          Guide d’installation
        </ResponsiveButton>
        <ResponsiveButton href="/privacy" prefetch loadingText="Ouverture…" variant="secondary" className="justify-start">
          Politique de confidentialité
        </ResponsiveButton>
        <ResponsiveButton href="/terms" prefetch loadingText="Ouverture…" variant="secondary" className="justify-start">
          Conditions d’utilisation
        </ResponsiveButton>
        <ResponsiveButton href="/legal" prefetch loadingText="Ouverture…" variant="secondary" className="justify-start">
          Mentions légales
        </ResponsiveButton>
      </div>
    </Card>
  );
}

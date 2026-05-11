import { Button } from "@/components/ui/Button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";

export function HelpSupportCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Aide & Support</CardTitle>
        <CardDescription>Besoin d’assistance ou d’informations ?</CardDescription>
      </CardHeader>

      <div className="grid gap-3 sm:grid-cols-2">
        <Button href="/help" variant="secondary" className="justify-start">
          Centre d’aide
        </Button>
        <Button href="/support" variant="secondary" className="justify-start">
          Contacter le support
        </Button>
        <Button href="/install" variant="secondary" className="justify-start">
          Guide d’installation
        </Button>
        <Button href="/privacy" variant="secondary" className="justify-start">
          Politique de confidentialité
        </Button>
        <Button href="/terms" variant="secondary" className="justify-start">
          Conditions d’utilisation
        </Button>
        <Button href="/legal" variant="secondary" className="justify-start">
          Mentions légales
        </Button>
      </div>
    </Card>
  );
}

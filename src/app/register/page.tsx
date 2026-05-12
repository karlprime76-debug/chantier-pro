import { MarketingHeader } from "@/components/layout/MarketingHeader";
import { MarketingFooter } from "@/components/layout/MarketingFooter";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { RegisterForm } from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="min-h-full">
      <MarketingHeader />
      <AppShell className="pb-16">
        <div className="mx-auto w-full max-w-md">
          <Card>
            <CardHeader>
              <CardTitle>Créer un compte</CardTitle>
              <CardDescription>Crée ton compte pour accéder au dashboard et commencer un chantier.</CardDescription>
            </CardHeader>

            <RegisterForm />
          </Card>
        </div>
      </AppShell>
      <MarketingFooter />
    </div>
  );
}

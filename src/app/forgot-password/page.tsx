import { MarketingHeader } from "@/components/layout/MarketingHeader";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-full">
      <MarketingHeader />
      <AppShell className="pb-16">
        <div className="mx-auto w-full max-w-md">
          <Card>
            <CardHeader>
              <CardTitle>Réinitialiser mon mot de passe</CardTitle>
              <CardDescription>
                Saisis ton email. Si un compte existe, tu recevras un lien de réinitialisation.
              </CardDescription>
            </CardHeader>

            <div className="px-6 pb-6">
              <ForgotPasswordForm />
            </div>
          </Card>
        </div>
      </AppShell>
    </div>
  );
}

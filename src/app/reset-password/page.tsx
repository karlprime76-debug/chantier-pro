import { MarketingHeader } from "@/components/layout/MarketingHeader";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";

export default function ResetPasswordPage({
  searchParams,
}: {
  searchParams?: { token?: string | string[] };
}) {
  const token = typeof searchParams?.token === "string" ? searchParams.token : "";

  return (
    <div className="min-h-full">
      <MarketingHeader />
      <AppShell className="pb-16">
        <div className="mx-auto w-full max-w-md">
          <Card>
            <CardHeader>
              <CardTitle>Choisir un nouveau mot de passe</CardTitle>
              <CardDescription>
                Choisis un nouveau mot de passe sécurisé. Le lien expire rapidement.
              </CardDescription>
            </CardHeader>

            <div className="px-6 pb-6">
              <ResetPasswordForm token={token} />
            </div>
          </Card>
        </div>
      </AppShell>
    </div>
  );
}

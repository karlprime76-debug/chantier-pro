import { MarketingHeader } from "@/components/layout/MarketingHeader";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage({
  searchParams,
}: {
  searchParams?: { next?: string | string[] };
}) {
  const nextUrl = typeof searchParams?.next === "string" ? searchParams.next : undefined;

  return (
    <div className="min-h-full">
      <MarketingHeader />
      <AppShell className="pb-16">
        <div className="mx-auto w-full max-w-md">
          <Card>
            <CardHeader>
              <CardTitle>Connexion</CardTitle>
              <CardDescription>Accède à ton dashboard Chantier Pro.</CardDescription>
            </CardHeader>

            <LoginForm nextUrl={nextUrl} />
          </Card>
        </div>
      </AppShell>
    </div>
  );
}

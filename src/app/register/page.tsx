import { MarketingHeader } from "@/components/layout/MarketingHeader";
import { MarketingFooter } from "@/components/layout/MarketingFooter";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { getSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";

export default async function RegisterPage({
  searchParams,
}: {
  searchParams?: { next?: string | string[] };
}) {
  const session = await getSession();
  if (session) redirect("/dashboard");

  const nextUrl = typeof searchParams?.next === "string" ? searchParams.next : undefined;

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

            <RegisterForm nextUrl={nextUrl} />
          </Card>
        </div>
      </AppShell>
      <MarketingFooter />
    </div>
  );
}

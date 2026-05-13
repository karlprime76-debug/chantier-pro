import { MarketingHeader } from "@/components/layout/MarketingHeader";
import { MarketingFooter } from "@/components/layout/MarketingFooter";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { LoginForm } from "@/components/auth/LoginForm";
import { getSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";

export default async function LoginPage({
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
              <CardTitle>Connexion</CardTitle>
              <CardDescription>Connecte-toi pour retrouver tes chantiers, calculs, dépenses et rapports.</CardDescription>
            </CardHeader>

            <LoginForm nextUrl={nextUrl} />
          </Card>
        </div>
      </AppShell>
      <MarketingFooter />
    </div>
  );
}

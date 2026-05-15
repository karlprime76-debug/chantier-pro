import { Button } from "@/components/ui/Button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { SubscriptionCard } from "@/components/settings/SubscriptionCard";
import { InstallAppCard } from "@/components/settings/InstallAppCard";
import { HelpSupportCard } from "@/components/settings/HelpSupportCard";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { requireSession } from "@/lib/auth/guards";
import { getEffectiveUserPlan } from "@/lib/subscription/server";

export default async function SettingsPage() {
  const session = await requireSession();
  const plan = session ? await getEffectiveUserPlan(session) : "FREE";

  return (
    <div className="grid gap-6 pb-[calc(104px+env(safe-area-inset-bottom))] sm:pb-10">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-[var(--cp-text)]">Réglages</h1>
        <p className="mt-1 text-sm text-[color-mix(in_oklab,var(--cp-text),transparent_45%)]">
          Profil, société, application et support.
        </p>
      </div>

      <SubscriptionCard plan={plan} />

      <Card>
        <CardHeader>
          <CardTitle>Profil</CardTitle>
          <CardDescription>Infos de base.</CardDescription>
        </CardHeader>

        <form className="grid gap-4">
          <Input label="Nom" name="name" placeholder="Ex: Karim Dossou" />
          <Input label="Email" name="email" type="email" placeholder="pro@entreprise.com" />
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
            <Button type="submit" variant="secondary">
              Enregistrer
            </Button>
          </div>
        </form>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Société</CardTitle>
          <CardDescription>Nom + options.</CardDescription>
        </CardHeader>

        <form className="grid gap-4">
          <Input label="Nom de la société" name="companyName" placeholder="Ex: Dossou Construction" />
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
            <Button type="submit" variant="secondary">
              Mettre à jour
            </Button>
          </div>
        </form>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Apparence</CardTitle>
          <CardDescription>Automatique, clair ou sombre.</CardDescription>
        </CardHeader>
        <ThemeToggle />
      </Card>

      <InstallAppCard />

      <HelpSupportCard />

      <Card>
        <CardHeader>
          <CardTitle>Session</CardTitle>
          <CardDescription>Gérez votre session actuelle sur Chantier Pro.</CardDescription>
        </CardHeader>

        <div className="px-6 pb-6">
          <SignOutButton className="w-full justify-center sm:w-auto" />
        </div>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sécurité</CardTitle>
          <CardDescription>Mot de passe.</CardDescription>
        </CardHeader>

        <form className="grid gap-4">
          <Input label="Nouveau mot de passe" name="newPassword" type="password" />
          <Input label="Confirmer" name="confirmPassword" type="password" />
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
            <Button type="submit" variant="secondary">
              Changer
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

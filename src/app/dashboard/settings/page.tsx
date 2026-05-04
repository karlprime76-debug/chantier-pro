import { Button } from "@/components/ui/Button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";

export default function SettingsPage() {
  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-white">Réglages</h1>
        <p className="mt-1 text-sm text-white/60">Profil, société et préférences.</p>
      </div>

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

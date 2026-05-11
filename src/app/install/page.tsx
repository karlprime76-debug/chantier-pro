import { AppShell } from "@/components/layout/AppShell";
import { ResponsiveButton } from "@/components/ui/ResponsiveButton";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";

export default function InstallPage() {
  return (
    <AppShell>
      <div className="grid gap-6">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[var(--cp-text)]">Installer Chantier Pro</h1>
          <p className="mt-1 text-sm text-[color-mix(in_oklab,var(--cp-text),transparent_45%)]">
            Utilisez Chantier Pro comme une vraie application sur votre téléphone.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>iPhone / Safari</CardTitle>
            <CardDescription>Ajout à l’écran d’accueil (PWA).</CardDescription>
          </CardHeader>
          <ol className="list-decimal space-y-2 pl-5 text-sm text-[color-mix(in_oklab,var(--cp-text),transparent_25%)]">
            <li>Ouvrez Chantier Pro dans Safari</li>
            <li>Appuyez sur l’icône Partager</li>
            <li>Choisissez “Sur l’écran d’accueil”</li>
            <li>Appuyez sur “Ajouter”</li>
            <li>L’icône Chantier Pro apparaîtra sur votre écran d’accueil</li>
          </ol>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Android / Chrome</CardTitle>
            <CardDescription>Installation depuis le menu navigateur.</CardDescription>
          </CardHeader>
          <ol className="list-decimal space-y-2 pl-5 text-sm text-[color-mix(in_oklab,var(--cp-text),transparent_25%)]">
            <li>Ouvrez Chantier Pro dans Chrome</li>
            <li>Appuyez sur les trois points en haut à droite</li>
            <li>Choisissez “Installer l’application” ou “Ajouter à l’écran d’accueil”</li>
            <li>Validez l’installation</li>
            <li>L’icône Chantier Pro apparaîtra avec vos applications</li>
          </ol>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ordinateur</CardTitle>
            <CardDescription>Chrome/Edge proposent aussi l’installation.</CardDescription>
          </CardHeader>
          <ol className="list-decimal space-y-2 pl-5 text-sm text-[color-mix(in_oklab,var(--cp-text),transparent_25%)]">
            <li>Ouvrez Chantier Pro dans Chrome ou Edge</li>
            <li>Cliquez sur l’icône d’installation dans la barre d’adresse si disponible</li>
            <li>Validez l’installation</li>
          </ol>
        </Card>

        <div className="flex justify-start">
          <ResponsiveButton href="/" prefetch loadingText="Retour…" variant="secondary" size="lg">
            Retour à l’accueil
          </ResponsiveButton>
        </div>
      </div>
    </AppShell>
  );
}

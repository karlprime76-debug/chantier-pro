import { AppShell } from "@/components/layout/AppShell";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";

export default function InstallPage() {
  return (
    <AppShell>
      <div className="grid gap-6">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[var(--cp-text)]">Installer Chantier Pro</h1>
          <p className="mt-1 text-sm text-[color-mix(in_oklab,var(--cp-text),transparent_45%)]">
            Installe Chantier Pro sur ton téléphone pour l’utiliser comme une vraie application.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>iPhone / Safari</CardTitle>
            <CardDescription>Ajout à l’écran d’accueil (PWA).</CardDescription>
          </CardHeader>
          <ol className="list-decimal space-y-2 pl-5 text-sm text-[color-mix(in_oklab,var(--cp-text),transparent_25%)]">
            <li>Ouvre Chantier Pro dans Safari.</li>
            <li>Appuie sur le bouton Partager.</li>
            <li>Sélectionne “Sur l’écran d’accueil”.</li>
            <li>Valide avec “Ajouter”.</li>
          </ol>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Android / Chrome</CardTitle>
            <CardDescription>Installation depuis le menu navigateur.</CardDescription>
          </CardHeader>
          <ol className="list-decimal space-y-2 pl-5 text-sm text-[color-mix(in_oklab,var(--cp-text),transparent_25%)]">
            <li>Ouvre Chantier Pro dans Chrome.</li>
            <li>Appuie sur les trois points en haut.</li>
            <li>Choisis “Installer l’application” ou “Ajouter à l’écran d’accueil”.</li>
            <li>Valide l’installation.</li>
          </ol>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ordinateur</CardTitle>
            <CardDescription>Chrome/Edge proposent aussi l’installation.</CardDescription>
          </CardHeader>
          <ol className="list-decimal space-y-2 pl-5 text-sm text-[color-mix(in_oklab,var(--cp-text),transparent_25%)]">
            <li>Ouvre Chantier Pro dans Chrome ou Edge.</li>
            <li>Clique sur l’icône “Installer” dans la barre d’adresse (si disponible).</li>
            <li>Valide l’installation.</li>
          </ol>
        </Card>
      </div>
    </AppShell>
  );
}

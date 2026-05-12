import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { NewProjectForm } from "@/components/projects/NewProjectForm";

export default function NewProjectPage() {
  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-[var(--app-text)]">Nouveau chantier</h1>
        <p className="mt-1 text-sm text-[var(--app-text-muted)]">Crée un projet et commence le suivi.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informations chantier</CardTitle>
          <CardDescription>Champs MVP, extensible ensuite.</CardDescription>
        </CardHeader>

        <NewProjectForm />
      </Card>
    </div>
  );
}

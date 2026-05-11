"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/Button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { MvpToolShell } from "@/components/calculs/MvpToolShell";
import { readLocalStorageJson, writeLocalStorageJson } from "@/lib/storage/localStorage";

type MemberStatus = "ok" | "absent" | "late";

type TeamMember = {
  id: string;
  name: string;
  role: string;
  task: string;
  status: MemberStatus;
  present: boolean;
};

const STORAGE_KEY = "cp_team_tracking_v1";

function uid() {
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

export default function SuiviEquipeClient() {
  const [members, setMembers] = useState<TeamMember[]>(() => {
    return readLocalStorageJson<TeamMember[]>(STORAGE_KEY, [
      {
        id: uid(),
        name: "Chef chantier",
        role: "Chef",
        task: "Coordination",
        status: "ok",
        present: true,
      },
    ]);
  });
  const [name, setName] = useState("");
  const [role, setRole] = useState("Ouvrier");
  const [task, setTask] = useState("");

  function persist(next: TeamMember[]) {
    setMembers(next);
    writeLocalStorageJson(STORAGE_KEY, next);
  }

  const summary = useMemo(() => {
    const present = members.filter((m) => m.present).length;
    const absent = members.filter((m) => !m.present).length;
    return { present, absent, total: members.length };
  }, [members]);

  return (
    <MvpToolShell title="Suivi équipe" subtitle="MVP: présence, rôles et tâches (localStorage).">
      <div className="grid gap-3 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total</CardTitle>
            <CardDescription>Membres</CardDescription>
          </CardHeader>
          <div className="px-6 pb-6 text-2xl font-extrabold tracking-tight text-[var(--cp-text)]">{summary.total}</div>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Présents</CardTitle>
            <CardDescription>Aujourd’hui</CardDescription>
          </CardHeader>
          <div className="px-6 pb-6 text-2xl font-extrabold tracking-tight text-[var(--cp-text)]">{summary.present}</div>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Absents</CardTitle>
            <CardDescription>Aujourd’hui</CardDescription>
          </CardHeader>
          <div className="px-6 pb-6 text-2xl font-extrabold tracking-tight text-[var(--cp-text)]">{summary.absent}</div>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ajouter un membre</CardTitle>
          <CardDescription>Ajoute un membre et affecte une tâche.</CardDescription>
        </CardHeader>
        <div className="grid gap-3 px-6 pb-6 sm:grid-cols-3">
          <Input label="Nom" name="name" value={name} onChange={(e) => setName(e.target.value)} />
          <Input label="Rôle" name="role" value={role} onChange={(e) => setRole(e.target.value)} />
          <Input label="Tâche" name="task" value={task} onChange={(e) => setTask(e.target.value)} />

          <div className="sm:col-span-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
            <Button
              type="button"
              size="lg"
              onClick={() => {
                if (!name.trim()) return;
                const next: TeamMember[] = [
                  {
                    id: uid(),
                    name: name.trim(),
                    role: role.trim() || "Ouvrier",
                    task: task.trim(),
                    status: "ok",
                    present: true,
                  },
                  ...members,
                ];
                persist(next);
                setName("");
                setTask("");
              }}
            >
              Ajouter
            </Button>
            <Button type="button" size="lg" variant="secondary" onClick={() => persist([])}>
              Vider
            </Button>
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Équipe du jour</CardTitle>
          <CardDescription>Présence et tâches.</CardDescription>
        </CardHeader>
        <div className="grid gap-2 px-6 pb-6">
          {members.length === 0 ? (
            <div className="text-sm text-[color-mix(in_oklab,var(--cp-text),transparent_35%)]">Aucun membre.</div>
          ) : (
            members.map((m) => (
              <div
                key={m.id}
                className="rounded-2xl border border-[var(--cp-border)] bg-[color-mix(in_oklab,var(--cp-card),transparent_8%)] p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-[var(--cp-text)]">{m.name}</div>
                    <div className="mt-1 text-sm text-[color-mix(in_oklab,var(--cp-text),transparent_35%)]">
                      {m.role}{m.task ? ` · ${m.task}` : ""}
                    </div>
                    <div className="mt-2 text-xs font-bold text-[color-mix(in_oklab,var(--cp-text),transparent_45%)]">
                      {m.present ? "Présent" : "Absent"}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant={m.present ? "ghost" : "secondary"}
                      onClick={() => {
                        persist(members.map((x) => (x.id === m.id ? { ...x, present: true } : x)));
                      }}
                    >
                      Présent
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant={!m.present ? "ghost" : "secondary"}
                      onClick={() => {
                        persist(members.map((x) => (x.id === m.id ? { ...x, present: false } : x)));
                      }}
                    >
                      Absent
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        persist(members.filter((x) => x.id !== m.id));
                      }}
                    >
                      Supprimer
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </MvpToolShell>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/Button";
import { ResponsiveButton } from "@/components/ui/ResponsiveButton";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

export function InstallAppCard() {
  const [deferredPrompt, setDeferredPrompt] = useState<InstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const onBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as InstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);

    const onAppInstalled = () => {
      setInstalled(true);
      setDeferredPrompt(null);
    };
    window.addEventListener("appinstalled", onAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      window.removeEventListener("appinstalled", onAppInstalled);
    };
  }, []);

  const canPrompt = Boolean(deferredPrompt);

  const instructions = useMemo(() => {
    return {
      ios: [
        "Ouvrez Chantier Pro dans Safari",
        "Appuyez sur le bouton Partager",
        "Sélectionnez “Sur l’écran d’accueil”",
        "Validez avec “Ajouter”",
      ],
      android: [
        "Ouvrez Chantier Pro dans Chrome",
        "Appuyez sur les trois points en haut",
        "Choisissez “Installer l’application” ou “Ajouter à l’écran d’accueil”",
        "Validez l’installation",
      ],
    };
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Installer l’application</CardTitle>
        <CardDescription>
          Ajoutez Chantier Pro à votre écran d’accueil pour l’utiliser comme une vraie application mobile.
        </CardDescription>
      </CardHeader>

      <div className="grid gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
          <Button
            type="button"
            size="lg"
            disabled={installed}
            onClick={async () => {
              if (!deferredPrompt) return;
              await deferredPrompt.prompt();
              await deferredPrompt.userChoice.catch(() => null);
              setDeferredPrompt(null);
            }}
          >
            {installed ? "Déjà installée" : canPrompt ? "Installer Chantier Pro" : "Installer Chantier Pro"}
          </Button>
          <ResponsiveButton href="/install" prefetch loadingText="Ouverture…" variant="secondary" size="lg">
            Voir le guide d’installation
          </ResponsiveButton>
        </div>

        {!canPrompt && !installed ? (
          <div className="grid gap-3 rounded-2xl border border-[var(--cp-border)] bg-[color-mix(in_oklab,var(--cp-card),transparent_8%)] p-4 text-sm text-[color-mix(in_oklab,var(--cp-text),transparent_25%)]">
            <div className="font-semibold text-[var(--cp-text)]">Installation manuelle</div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wide text-[color-mix(in_oklab,var(--cp-text),transparent_45%)]">
                iPhone / Safari
              </div>
              <ol className="mt-2 list-decimal pl-5">
                {instructions.ios.map((s) => (
                  <li key={s} className="mt-1">
                    {s}
                  </li>
                ))}
              </ol>
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wide text-[color-mix(in_oklab,var(--cp-text),transparent_45%)]">
                Android / Chrome
              </div>
              <ol className="mt-2 list-decimal pl-5">
                {instructions.android.map((s) => (
                  <li key={s} className="mt-1">
                    {s}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        ) : null}
      </div>
    </Card>
  );
}

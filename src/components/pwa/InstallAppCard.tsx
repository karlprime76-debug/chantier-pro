"use client";

import { useEffect, useMemo, useState } from "react";

import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";
import { ResponsiveButton } from "@/components/ui/ResponsiveButton";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

function isIOS() {
  if (typeof window === "undefined") return false;
  const ua = window.navigator.userAgent.toLowerCase();
  return /iphone|ipad|ipod/.test(ua);
}

function isAppInstalled() {
  if (typeof window === "undefined") return false;
  const nav = navigator as Navigator & { standalone?: boolean };
  const standalone = Boolean(nav.standalone);
  const displayModeStandalone = window.matchMedia?.("(display-mode: standalone)")?.matches ?? false;
  return standalone || displayModeStandalone;
}

const DISMISS_KEY = "chantier-pro-install-card-dismissed";

type InstallAppCardProps = {
  className?: string;
  hideWhenInstalled?: boolean;
};

export function InstallAppCard({ className, hideWhenInstalled = true }: InstallAppCardProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<InstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(() => isAppInstalled());
  const [dismissed, setDismissed] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      return window.localStorage.getItem(DISMISS_KEY) === "true";
    } catch {
      return false;
    }
  });
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const onBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as InstallPromptEvent);
    };

    const onAppInstalled = () => {
      setInstalled(true);
      setDeferredPrompt(null);
      setStatusMessage("Chantier Pro a été ajouté à votre écran d’accueil.");
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    window.addEventListener("appinstalled", onAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      window.removeEventListener("appinstalled", onAppInstalled);
    };
  }, []);

  const canPrompt = Boolean(deferredPrompt);
  const ios = useMemo(() => isIOS(), []);

  const instructions = useMemo(() => {
    return {
      ios: "Sur iPhone : appuyez sur Partager, puis sélectionnez Sur l’écran d’accueil.",
      generic:
        "Votre navigateur ne permet pas l’installation automatique. Vous pouvez ajouter Chantier Pro à l’écran d’accueil via le menu du navigateur.",
    };
  }, []);

  if (dismissed) return null;
  if (installed && hideWhenInstalled) return null;

  return (
    <Card
      className={cn(
        "relative overflow-hidden border border-[color-mix(in_oklab,var(--cp-border),white_10%)] bg-[color-mix(in_oklab,var(--cp-card),transparent_12%)]",
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_10%,color-mix(in_oklab,var(--cp-accent),transparent_78%),transparent_55%)]" />
      <div className="relative">
        <CardHeader className="mb-3">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <CardTitle className="flex items-center gap-2">
                <span
                  className="grid h-10 w-10 place-items-center rounded-2xl bg-[color-mix(in_oklab,var(--cp-accent),transparent_82%)] text-[var(--cp-accent)] ring-1 ring-[var(--cp-border)]"
                  aria-hidden="true"
                >
                  <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                    <path
                      d="M12 18h.01M7 3h10a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                Installer Chantier Pro
              </CardTitle>
              <CardDescription>
                Ajoutez Chantier Pro à votre écran d’accueil pour l’utiliser comme une vraie application mobile, sans passer par le
                navigateur.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <div className="grid gap-4">
          {installed && !hideWhenInstalled ? (
            <div className="rounded-2xl border border-[var(--cp-border)] bg-[color-mix(in_oklab,var(--cp-card),transparent_8%)] p-4 text-sm text-[color-mix(in_oklab,var(--cp-text),transparent_25%)]">
              <div className="font-semibold text-[var(--cp-text)]">Application installée</div>
            </div>
          ) : null}

          {statusMessage ? (
            <div className="rounded-2xl border border-[var(--cp-border)] bg-[color-mix(in_oklab,var(--cp-accent),transparent_88%)] p-4 text-sm text-[var(--app-text)]">
              {statusMessage}
            </div>
          ) : null}

          {ios && !installed ? (
            <div className="rounded-2xl border border-[var(--cp-border)] bg-[color-mix(in_oklab,var(--cp-card),transparent_8%)] p-4 text-sm text-[color-mix(in_oklab,var(--cp-text),transparent_25%)]">
              <div className="font-semibold text-[var(--cp-text)]">Installation sur iPhone</div>
              <div className="mt-1">{instructions.ios}</div>
              <div className="mt-3">
                <ResponsiveButton href="/install" prefetch loadingText="Ouverture…" variant="secondary" size="md">
                  Voir le guide complet
                </ResponsiveButton>
              </div>
            </div>
          ) : null}

          {!ios && !canPrompt && !installed ? (
            <div className="rounded-2xl border border-[var(--cp-border)] bg-[color-mix(in_oklab,var(--cp-card),transparent_8%)] p-4 text-sm text-[color-mix(in_oklab,var(--cp-text),transparent_25%)]">
              <div className="font-semibold text-[var(--cp-text)]">Installation manuelle</div>
              <div className="mt-1">{instructions.generic}</div>
            </div>
          ) : null}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
            <Button
              type="button"
              size="lg"
              disabled={busy || installed || ios || !canPrompt}
              onClick={async () => {
                if (!deferredPrompt) return;
                setBusy(true);
                setStatusMessage(null);
                try {
                  await deferredPrompt.prompt();
                  const choice = await deferredPrompt.userChoice.catch(() => null);
                  if (choice?.outcome === "accepted") {
                    setStatusMessage("Chantier Pro a été ajouté à votre écran d’accueil.");
                  }
                } finally {
                  setDeferredPrompt(null);
                  setBusy(false);
                }
              }}
            >
              {busy ? "Installation…" : "Installer l’application"}
            </Button>

            <ResponsiveButton href="/install" prefetch loadingText="Ouverture…" variant="secondary" size="lg">
              Voir le guide
            </ResponsiveButton>

            <Button
              type="button"
              variant="ghost"
              size="lg"
              onClick={() => {
                setDismissed(true);
                try {
                  window.localStorage.setItem(DISMISS_KEY, "true");
                } catch {
                  // ignore
                }
              }}
            >
              Plus tard
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

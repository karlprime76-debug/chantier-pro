"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/Button";

type PasswordSuggestionProps = {
  onUse: (password: string) => void;
};

type Strength = "Faible" | "Moyen" | "Fort";

function generatePassword() {
  const length = 14 + Math.floor(Math.random() * 5);

  const lower = "abcdefghijklmnopqrstuvwxyz";
  const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const digits = "0123456789";
  const special = "!@#$%^&*()-_=+[]{};:,.?";

  const required = [
    lower[Math.floor(Math.random() * lower.length)],
    upper[Math.floor(Math.random() * upper.length)],
    digits[Math.floor(Math.random() * digits.length)],
    special[Math.floor(Math.random() * special.length)],
  ];

  const all = lower + upper + digits + special;

  const remainingLength = Math.max(0, length - required.length);
  const bytes = new Uint8Array(remainingLength);
  crypto.getRandomValues(bytes);

  const chars = [...required];
  for (let i = 0; i < remainingLength; i += 1) {
    chars.push(all[bytes[i] % all.length]);
  }

  const shuffleBytes = new Uint8Array(chars.length);
  crypto.getRandomValues(shuffleBytes);
  for (let i = chars.length - 1; i > 0; i -= 1) {
    const j = shuffleBytes[i] % (i + 1);
    const tmp = chars[i];
    chars[i] = chars[j];
    chars[j] = tmp;
  }

  return chars.join("");
}

function getStrength(password: string): Strength {
  let score = 0;
  if (password.length >= 14) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^a-zA-Z\d]/.test(password)) score += 1;

  if (score <= 2) return "Faible";
  if (score <= 4) return "Moyen";
  return "Fort";
}

export function PasswordSuggestion({ onUse }: PasswordSuggestionProps) {
  const [suggestion, setSuggestion] = useState<string>("");
  const [copied, setCopied] = useState(false);

  const strength = useMemo(() => (suggestion ? getStrength(suggestion) : null), [suggestion]);

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="text-sm font-bold text-white">Suggestion de mot de passe</div>
      <div className="mt-1 text-xs text-white/60">Optionnel. Tu peux garder ton mot de passe actuel.</div>

      {suggestion ? (
        <div className="mt-3 rounded-xl border border-white/10 bg-black/20 px-3 py-2">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="break-all font-mono text-sm text-white">{suggestion}</div>
              {strength ? <div className="mt-1 text-xs text-white/55">Force : {strength}</div> : null}
            </div>

            <div className="shrink-0">
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(suggestion);
                    setCopied(true);
                    window.setTimeout(() => setCopied(false), 1200);
                  } catch {
                    setCopied(false);
                  }
                }}
              >
                {copied ? "Copié" : "Copier"}
              </Button>
            </div>
          </div>

          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={() => {
                onUse(suggestion);
              }}
            >
              Utiliser ce mot de passe
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => {
                setSuggestion(generatePassword());
              }}
            >
              Regénérer
            </Button>
          </div>
        </div>
      ) : (
        <div className="mt-3">
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={() => {
              setSuggestion(generatePassword());
            }}
          >
            Suggérer un mot de passe fort
          </Button>
        </div>
      )}
    </div>
  );
}

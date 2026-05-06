"use client";

import { useState } from "react";

import { Button } from "@/components/ui/Button";

type SubscribeButtonProps = {
  plan: "PREMIUM" | "ENTERPRISE";
  children: string;
};

export function SubscribeButton({ plan, children }: SubscribeButtonProps) {
  const [loading, setLoading] = useState(false);

  return (
    <Button
      type="button"
      size="lg"
      disabled={loading}
      onClick={async () => {
        setLoading(true);
        const res = await fetch("/api/billing/checkout", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ plan }),
        });

        const data = (await res.json().catch(() => null)) as { ok: true; redirectUrl: string } | { ok: false; error: string } | null;

        if (!res.ok || !data || data.ok !== true) {
          setLoading(false);
          return;
        }

        window.location.href = data.redirectUrl;
      }}
    >
      {loading ? "Redirection..." : children}
    </Button>
  );
}

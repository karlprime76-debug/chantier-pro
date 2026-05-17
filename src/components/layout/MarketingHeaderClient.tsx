"use client";

import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { MarketingHeaderAuth } from "@/components/layout/MarketingHeaderAuth";

type MarketingHeaderClientProps = {
  className?: string;
};

export function MarketingHeaderClient({ className }: MarketingHeaderClientProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className={className}>
      <div className="flex shrink-0 items-center gap-2">
        <div className="sm:hidden">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="whitespace-nowrap"
            aria-expanded={isMobileMenuOpen}
            aria-controls="marketing-mobile-menu"
            onClick={() => {
              setIsMobileMenuOpen((v) => !v);
            }}
          >
            Menu
          </Button>
        </div>
        <div className="hidden sm:block">
          <MarketingHeaderAuth />
        </div>
        <div className="sm:hidden">
          <MarketingHeaderAuth compact />
        </div>
      </div>

      {isMobileMenuOpen && (
        <div id="marketing-mobile-menu" className="border-t border-[var(--app-card-border)] sm:hidden">
          <div className="mx-auto w-full max-w-6xl px-4 py-3">
            <div className="grid gap-2">
              <Button
                href="/"
                variant="ghost"
                size="sm"
                className="justify-start"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                }}
              >
                Accueil
              </Button>
              <Button
                href="/features"
                variant="ghost"
                size="sm"
                className="justify-start"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                }}
              >
                Fonctionnalités
              </Button>
              <Button
                href="/pricing"
                variant="ghost"
                size="sm"
                className="justify-start"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                }}
              >
                Tarifs
              </Button>
              <Button
                href="/contact"
                variant="ghost"
                size="sm"
                className="justify-start"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                }}
              >
                Contact
              </Button>

              <div className="pt-2">
                <MarketingHeaderAuth
                  variant="mobile_menu"
                  onAction={() => {
                    setIsMobileMenuOpen(false);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

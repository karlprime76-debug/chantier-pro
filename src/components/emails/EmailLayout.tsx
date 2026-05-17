import type { ReactElement, ReactNode } from "react";
import { Body, Head, Html, Img, Preview } from "@react-email/components";

const BRAND = {
  name: "Chantier Pro",
  tagline: "L’outil BTP pour calculer, suivre et organiser vos chantiers.",
  location: "Cotonou, Bénin",
  websiteLabel: "chantierpro.xyz",
  whatsappLabel: "+229 01 58 68 45 48",
  whatsappUrl: "https://wa.me/2290158684548",
  instagramUrl: "https://www.instagram.com/chantierprobj",
  tiktokUrl: "https://www.tiktok.com/@chantier.pro.app?_r=1&_t=ZN-96KVDaOpPIk",
  publisher: "TCHONAN Rodolphe Karl",
} as const;

const colors = {
  navy: "#061B3A",
  orange: "#FF6A00",
  text: "#0F172A",
  muted: "#475569",
  light: "#F8FAFC",
  border: "rgba(2,6,23,0.10)",
} as const;

function normalizeBaseUrl(appUrl: string) {
  return (appUrl || "https://chantierpro.xyz").replace(/\/$/, "");
}

export function EmailLayout({
  title,
  preview,
  appUrl,
  supportEmail,
  children,
}: {
  title: string;
  preview: string;
  appUrl: string;
  supportEmail: string;
  children: ReactNode;
}): ReactElement {
  const baseUrl = normalizeBaseUrl(appUrl);
  const logoUrl = `${baseUrl}/logo.png`;

  return (
    <Html lang="fr">
      <Head>
        <title>{title}</title>
      </Head>
      <Preview>{preview}</Preview>
      <Body style={{ margin: 0, padding: 0, backgroundColor: colors.light, fontFamily: "system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif" }}>
        <div style={{ padding: "24px 12px" }}>
          <div style={{ maxWidth: 600, margin: "0 auto", backgroundColor: "#ffffff", border: `1px solid ${colors.border}`, borderRadius: 24, overflow: "hidden" }}>
            <div style={{ padding: "22px 24px", backgroundColor: colors.navy, color: "#ffffff" }}>
              <div style={{ display: "table", width: "100%" }}>
                <div style={{ display: "table-cell", verticalAlign: "middle", width: 48 }}>
                  <Img src={logoUrl} width="40" height="40" alt="Logo Chantier Pro" style={{ display: "block", width: 40, height: 40, borderRadius: 12, backgroundColor: "#ffffff" }} />
                </div>
                <div style={{ display: "table-cell", verticalAlign: "middle", paddingLeft: 12 }}>
                  <div style={{ fontSize: 18, lineHeight: 1.2, fontWeight: 900, letterSpacing: "-0.02em" }}>{BRAND.name}</div>
                  <div style={{ marginTop: 4, fontSize: 13, lineHeight: 1.4, color: "rgba(255,255,255,0.84)", fontWeight: 600 }}>{BRAND.tagline}</div>
                </div>
              </div>
            </div>

            <main style={{ padding: "26px 24px 8px 24px", color: colors.text }}>
              <h1 style={{ margin: "0 0 14px 0", fontSize: 22, lineHeight: 1.25, fontWeight: 850, color: colors.navy }}>{title}</h1>
              {children}
              <div style={{ height: 18 }} />
            </main>

            <EmailFooter appUrl={baseUrl} supportEmail={supportEmail} />
          </div>
        </div>
      </Body>
    </Html>
  );
}

export function EmailButton({ href, children }: { href: string; children: ReactNode }): ReactElement {
  return (
    <div style={{ margin: "20px 0 12px 0" }}>
      <a href={href} style={{ display: "inline-block", backgroundColor: colors.orange, color: colors.navy, textDecoration: "none", fontWeight: 900, fontSize: 15, lineHeight: 1.3, padding: "14px 20px", borderRadius: 14 }}>
        {children}
      </a>
    </div>
  );
}

export function EmailInfoBox({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "security" }): ReactElement {
  const isSecurity = tone === "security";

  return (
    <div style={{ margin: "16px 0", padding: "14px 16px", borderRadius: 16, backgroundColor: isSecurity ? "#FFF7ED" : "#F8FAFC", border: `1px solid ${isSecurity ? "rgba(255,106,0,0.24)" : colors.border}` }}>
      <div style={{ fontSize: 14, lineHeight: 1.6, color: isSecurity ? "#7C2D12" : colors.muted }}>{children}</div>
    </div>
  );
}

export function EmailText({ children }: { children: ReactNode }): ReactElement {
  return <p style={{ margin: "0 0 13px 0", fontSize: 15, lineHeight: 1.65, color: colors.text }}>{children}</p>;
}

export function EmailMutedText({ children }: { children: ReactNode }): ReactElement {
  return <p style={{ margin: "0 0 13px 0", fontSize: 13, lineHeight: 1.6, color: colors.muted }}>{children}</p>;
}

export function EmailLink({ href, children }: { href: string; children: ReactNode }): ReactElement {
  return <a href={href} style={{ color: colors.navy, textDecoration: "underline", fontWeight: 700 }}>{children}</a>;
}

export function EmailFooter({ appUrl, supportEmail }: { appUrl: string; supportEmail: string }): ReactElement {
  return (
    <footer style={{ padding: "18px 24px 24px 24px", borderTop: `1px solid ${colors.border}`, fontSize: 12, lineHeight: 1.65, color: "#64748B" }}>
      <div><strong style={{ color: colors.navy }}>{BRAND.name}</strong> — {BRAND.tagline}</div>
      <div>{BRAND.location}</div>
      <div style={{ marginTop: 8 }}>
        Support : <EmailLink href={`mailto:${supportEmail}`}>{supportEmail}</EmailLink>
        <span> · </span>
        <EmailLink href={BRAND.whatsappUrl}>WhatsApp {BRAND.whatsappLabel}</EmailLink>
      </div>
      <div>
        Site officiel : <EmailLink href={appUrl}>{BRAND.websiteLabel}</EmailLink>
      </div>
      <div style={{ marginTop: 8 }}>
        <EmailLink href={BRAND.instagramUrl}>Instagram</EmailLink>
        <span> · </span>
        <EmailLink href={BRAND.tiktokUrl}>TikTok</EmailLink>
      </div>
      <div style={{ marginTop: 10 }}>Éditeur : {BRAND.publisher}</div>
    </footer>
  );
}

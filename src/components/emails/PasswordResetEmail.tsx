import type { ReactElement } from "react";

export function PasswordResetEmail({ resetUrl, supportEmail }: { resetUrl: string; supportEmail: string }): ReactElement {
  return (
    <html lang="fr">
      <body style={{ margin: 0, padding: 0, backgroundColor: "#F8FAFC", fontFamily: "system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial" }}>
        <div style={{ padding: "24px 12px" }}>
          <div
            style={{
              maxWidth: 560,
              margin: "0 auto",
              background: "#ffffff",
              border: "1px solid rgba(2,6,23,0.10)",
              borderRadius: 24,
              overflow: "hidden",
            }}
          >
            <div style={{ padding: "18px 22px", background: "#061B3A", color: "#ffffff" }}>
              <div style={{ fontWeight: 900, fontSize: 16, letterSpacing: "-0.02em" }}>Chantier Pro</div>
              <div style={{ marginTop: 2, fontSize: 12, color: "rgba(255,255,255,0.82)", fontWeight: 600 }}>
                Outils professionnels pour le chantier
              </div>
            </div>

            <div style={{ padding: "22px 22px 10px 22px", color: "#0f172a" }}>
              <h1 style={{ margin: "0 0 10px 0", fontSize: 18, lineHeight: 1.3, fontWeight: 800 }}>
                Réinitialiser votre mot de passe
              </h1>

              <p style={{ margin: "0 0 12px 0", fontSize: 14, lineHeight: 1.6 }}>Bonjour,</p>
              <p style={{ margin: "0 0 12px 0", fontSize: 14, lineHeight: 1.6 }}>
                Nous avons reçu une demande de réinitialisation de mot de passe pour votre compte <b>Chantier Pro</b>.
              </p>

              <div style={{ margin: "16px 0 8px 0" }}>
                <a
                  href={resetUrl}
                  style={{
                    display: "inline-block",
                    background: "#FF6A00",
                    color: "#061B3A",
                    textDecoration: "none",
                    fontWeight: 900,
                    padding: "12px 18px",
                    borderRadius: 14,
                  }}
                >
                  Réinitialiser mon mot de passe
                </a>
              </div>

              <p style={{ margin: "0 0 12px 0", fontSize: 13, lineHeight: 1.6, color: "rgba(15,23,42,0.75)" }}>
                Ce lien expire dans <b>30 minutes</b>.
              </p>

              <p style={{ margin: "0 0 12px 0", fontSize: 13, lineHeight: 1.6, color: "rgba(15,23,42,0.78)" }}>
                Si le bouton ne fonctionne pas, copiez/collez ce lien :<br />
                {resetUrl}
              </p>

              <div
                style={{
                  marginTop: 10,
                  padding: "12px 14px",
                  borderRadius: 16,
                  background: "rgba(2,6,23,0.04)",
                  border: "1px solid rgba(2,6,23,0.08)",
                }}
              >
                <div style={{ fontSize: 12, lineHeight: 1.6, color: "rgba(15,23,42,0.78)" }}>
                  Sécurité : si vous n’êtes pas à l’origine de cette demande, ignorez cet email ou contactez le support.
                </div>
              </div>

              <div style={{ height: 18 }} />
            </div>

            <div
              style={{
                padding: "16px 22px 22px 22px",
                borderTop: "1px solid rgba(2,6,23,0.08)",
                fontSize: 12,
                lineHeight: 1.6,
                color: "rgba(15,23,42,0.70)",
              }}
            >
              <div>
                <b style={{ color: "#061B3A" }}>Chantier Pro</b> — Outils professionnels pour le chantier
              </div>
              <div style={{ marginTop: 8 }}>
                Contact : <a href={`mailto:${supportEmail}`} style={{ color: "#061B3A", textDecoration: "underline", fontWeight: 700 }}>
                  {supportEmail}
                </a>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}

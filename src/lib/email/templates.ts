type EmailTemplate = {
  subject: string;
  text: string;
  html: string;
};

const BRAND = {
  name: "Chantier Pro",
  tagline: "Outils professionnels pour le chantier",
  siteUrl: "https://chantierpro.xyz",
  supportEmail: "chantierprobj@gmail.com",
  fromEmail: "no-reply@chantierpro.xyz",
  whatsappLabel: "+229 01 58 68 45 48",
  whatsappUrl: "https://wa.me/2290158684548",
  location: "Cotonou, Bénin",
  publisher: "TCHONAN Rodolphe Karl",
} as const;

function getPublicBaseUrl() {
  const fromAppUrl = (process.env.APP_URL ?? "").trim();
  if (fromAppUrl) return fromAppUrl;

  const fromNextAuthUrl = (process.env.NEXTAUTH_URL ?? "").trim();
  if (fromNextAuthUrl) return fromNextAuthUrl;

  return BRAND.siteUrl;
}

function escapeHtml(input: string) {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function layout({ title, preview, contentHtml }: { title: string; preview: string; contentHtml: string }) {
  const safeTitle = escapeHtml(title);
  const safePreview = escapeHtml(preview);

  const baseUrl = getPublicBaseUrl().replace(/\/$/, "");
  const logoUrl = `${baseUrl}/icon.png`;

  const styles = {
    body: "margin:0;padding:0;background:#F8FAFC;font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial;",
    container:
      "max-width:560px;margin:0 auto;background:#ffffff;border:1px solid rgba(2,6,23,0.10);border-radius:24px;overflow:hidden;",
    header: "padding:18px 22px;background:#061B3A;color:#ffffff;",
    brandRow: "display:flex;align-items:center;gap:12px;",
    logo: "display:block;width:36px;height:36px;border-radius:10px;background:#ffffff;",
    brand: "font-weight:900;letter-spacing:-0.02em;font-size:16px;line-height:1.2;",
    tagline: "margin-top:2px;font-size:12px;line-height:1.4;color:rgba(255,255,255,0.82);font-weight:600;",
    main: "padding:22px 22px 10px 22px;color:#0f172a;",
    h1: "margin:0 0 10px 0;font-size:18px;line-height:1.3;font-weight:800;",
    p: "margin:0 0 12px 0;font-size:14px;line-height:1.6;color:#0f172a;",
    footer:
      "padding:16px 22px 22px 22px;border-top:1px solid rgba(2,6,23,0.08);font-size:12px;line-height:1.6;color:rgba(15,23,42,0.70);",
    smallBrand: "font-weight:800;color:#061B3A;",
    footerLinks: "margin-top:8px;",
    footerLink: "color:#061B3A;text-decoration:underline;font-weight:700;",
    spacer: "height:18px;",
  };

  return `<!doctype html>
<html lang="fr">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${safeTitle}</title>
  </head>
  <body style="${styles.body}">
    <span style="display:none!important;opacity:0;color:transparent;height:0;width:0;overflow:hidden;">${safePreview}</span>
    <div style="padding:24px 12px;">
      <div style="${styles.container}">
        <div style="${styles.header}">
          <div style="${styles.brandRow}">
            <img src="${logoUrl}" alt="Logo Chantier Pro" style="${styles.logo}" />
            <div>
              <div style="${styles.brand}">${escapeHtml(BRAND.name)}</div>
              <div style="${styles.tagline}">${escapeHtml(BRAND.tagline)}</div>
            </div>
          </div>
        </div>
        <div style="${styles.main}">
          <h1 style="${styles.h1}">${safeTitle}</h1>
          ${contentHtml}
          <div style="${styles.spacer}"></div>
        </div>
        <div style="${styles.footer}">
          <div><span style="${styles.smallBrand}">${escapeHtml(BRAND.name)}</span> — ${escapeHtml(BRAND.tagline)}</div>
          <div>${escapeHtml(BRAND.location)}</div>
          <div style="${styles.footerLinks}">
            Contact :
            <a href="mailto:${encodeURIComponent(BRAND.supportEmail)}" style="${styles.footerLink}">${escapeHtml(BRAND.supportEmail)}</a>
            <span> · </span>
            <a href="${BRAND.whatsappUrl}" style="${styles.footerLink}">${escapeHtml(BRAND.whatsappLabel)}</a>
          </div>
          <div>
            Site : <a href="${BRAND.siteUrl}" style="${styles.footerLink}">chantierpro.xyz</a>
          </div>
          <div style="margin-top:8px;">Éditeur : ${escapeHtml(BRAND.publisher)}</div>
          <div style="margin-top:10px;">
            Sécurité : si vous n’êtes pas à l’origine de cette action, ignorez cet email ou contactez le support.
          </div>
        </div>
      </div>
    </div>
  </body>
</html>`;
}

function button({ href, label }: { href: string; label: string }) {
  const safeHref = href.replace(/"/g, "%22");
  const safeLabel = escapeHtml(label);

  return `
    <div style="margin:16px 0 8px 0;">
      <a href="${safeHref}" style="display:inline-block;background:#FF6A00;color:#061B3A;text-decoration:none;font-weight:900;padding:12px 18px;border-radius:14px;">
        ${safeLabel}
      </a>
    </div>
  `;
}

export function buildWelcomeEmail({ name, dashboardUrl }: { name: string; dashboardUrl: string }): EmailTemplate {
  const displayName = name.trim() || "";

  const subject = "Bienvenue sur Chantier Pro";
  const text = `Bonjour${displayName ? ` ${displayName}` : ""},\n\nVotre compte a bien été créé avec succès.\n\nVous pouvez maintenant accéder à votre espace personnel pour gérer vos chantiers, vos calculs et vos documents.\n\nAccéder à mon espace :\n${dashboardUrl}\n\nVous recevez cet email car un compte a été créé avec cette adresse sur Chantier Pro.\n\nChantier Pro — Outils professionnels pour le chantier\nSite : ${BRAND.siteUrl}\nContact : ${BRAND.supportEmail}`;

  const contentHtml = `
    <p style="margin:0 0 12px 0;font-size:14px;line-height:1.6;color:#0f172a;">Bonjour${displayName ? ` ${escapeHtml(displayName)}` : ""},</p>
    <p style="margin:0 0 12px 0;font-size:14px;line-height:1.6;color:#0f172a;">Votre compte a bien été créé avec succès.</p>
    <p style="margin:0 0 12px 0;font-size:14px;line-height:1.6;color:#0f172a;">Vous pouvez maintenant accéder à votre espace personnel pour gérer vos chantiers, vos calculs et vos documents.</p>
    ${button({ href: dashboardUrl, label: "Accéder à mon espace" })}
    <p style="margin:0 0 10px 0;font-size:13px;line-height:1.6;color:rgba(15,23,42,0.78);">Si le bouton ne fonctionne pas, utilisez ce lien :<br/>${escapeHtml(
      dashboardUrl,
    )}</p>
    <div style="margin-top:10px;padding:12px 14px;border-radius:16px;background:rgba(2,6,23,0.04);border:1px solid rgba(2,6,23,0.08);">
      <div style="font-size:12px;line-height:1.6;color:rgba(15,23,42,0.78);">
        Vous recevez cet email car un compte a été créé avec cette adresse sur <b>Chantier Pro</b>.
      </div>
    </div>
  `;

  return {
    subject,
    text,
    html: layout({
      title: "Bienvenue !",
      preview: "Votre compte Chantier Pro est prêt.",
      contentHtml,
    }),
  };
}

export function buildPasswordResetEmail({ resetUrl }: { resetUrl: string }): EmailTemplate {
  const subject = "Réinitialisation de votre mot de passe";
  const text = `Bonjour,\n\nNous avons reçu une demande de réinitialisation de mot de passe pour votre compte Chantier Pro.\n\nRéinitialiser mon mot de passe :\n${resetUrl}\n\nCe lien expire dans 30 minutes.\n\nSi vous n’êtes pas à l’origine de cette demande, vous pouvez ignorer cet email.\n\nChantier Pro — Outils professionnels pour le chantier\nContact : ${BRAND.supportEmail}`;

  const contentHtml = `
    <p style="margin:0 0 12px 0;font-size:14px;line-height:1.6;color:#0f172a;">Bonjour,</p>
    <p style="margin:0 0 12px 0;font-size:14px;line-height:1.6;color:#0f172a;">Nous avons reçu une demande de réinitialisation de mot de passe pour votre compte <b>Chantier Pro</b>.</p>
    ${button({ href: resetUrl, label: "Réinitialiser mon mot de passe" })}
    <p style="margin:0 0 12px 0;font-size:13px;line-height:1.6;color:rgba(15,23,42,0.75);">Ce lien expire dans <b>30 minutes</b>.</p>
    <p style="margin:0 0 12px 0;font-size:13px;line-height:1.6;color:rgba(15,23,42,0.78);">Si le bouton ne fonctionne pas, copiez/collez ce lien :<br/>${escapeHtml(
      resetUrl,
    )}</p>
    <div style="margin-top:10px;padding:12px 14px;border-radius:16px;background:rgba(2,6,23,0.04);border:1px solid rgba(2,6,23,0.08);">
      <div style="font-size:12px;line-height:1.6;color:rgba(15,23,42,0.78);">
        Sécurité : si vous n’êtes pas à l’origine de cette demande, vous pouvez ignorer cet email.
      </div>
    </div>
  `;

  return {
    subject,
    text,
    html: layout({
      title: "Réinitialiser votre mot de passe",
      preview: "Lien de réinitialisation (valable 30 min).",
      contentHtml,
    }),
  };
}

export function buildPasswordChangedEmail(): EmailTemplate {
  const subject = "Votre mot de passe Chantier Pro a été modifié";
  const text = `Bonjour,\n\nVotre mot de passe a bien été modifié.\n\nSi vous n’êtes pas à l’origine de cette action, contactez rapidement le support.\n\nContact : ${BRAND.supportEmail}\nWhatsApp : ${BRAND.whatsappUrl}\n\nChantier Pro — Outils professionnels pour le chantier`;

  const contentHtml = `
    <p style="margin:0 0 12px 0;font-size:14px;line-height:1.6;color:#0f172a;">Bonjour,</p>
    <p style="margin:0 0 12px 0;font-size:14px;line-height:1.6;color:#0f172a;">Votre mot de passe a bien été modifié.</p>
    <p style="margin:0 0 12px 0;font-size:13px;line-height:1.6;color:rgba(15,23,42,0.75);">Si vous n’êtes pas à l’origine de cette action, contactez rapidement le support.</p>
    <p style="margin:0 0 12px 0;font-size:13px;line-height:1.6;color:rgba(15,23,42,0.78);">Contact : <a href="mailto:${encodeURIComponent(
      BRAND.supportEmail,
    )}" style="color:#061B3A;text-decoration:underline;font-weight:700;">${escapeHtml(BRAND.supportEmail)}</a> · <a href="${
      BRAND.whatsappUrl
    }" style="color:#061B3A;text-decoration:underline;font-weight:700;">WhatsApp</a></p>
  `;

  return {
    subject,
    text,
    html: layout({
      title: "Mot de passe modifié",
      preview: "Votre mot de passe a été mis à jour.",
      contentHtml,
    }),
  };
}

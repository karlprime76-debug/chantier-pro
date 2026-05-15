type EmailTemplate = {
  subject: string;
  text: string;
  html: string;
};

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

  const styles = {
    body: "margin:0;padding:0;background:#F8FAFC;font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial;",
    container:
      "max-width:560px;margin:0 auto;background:#ffffff;border:1px solid rgba(2,6,23,0.10);border-radius:24px;overflow:hidden;",
    header:
      "padding:20px 22px;background:#061B3A;color:#ffffff;",
    brand: "font-weight:800;letter-spacing:-0.02em;font-size:16px;",
    main: "padding:22px 22px 10px 22px;color:#0f172a;",
    h1: "margin:0 0 10px 0;font-size:18px;line-height:1.3;font-weight:800;",
    p: "margin:0 0 12px 0;font-size:14px;line-height:1.6;color:#0f172a;",
    footer:
      "padding:16px 22px 22px 22px;border-top:1px solid rgba(2,6,23,0.08);font-size:12px;line-height:1.6;color:rgba(15,23,42,0.70);",
    smallBrand: "font-weight:800;color:#061B3A;",
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
          <div style="${styles.brand}">Chantier Pro</div>
        </div>
        <div style="${styles.main}">
          <h1 style="${styles.h1}">${safeTitle}</h1>
          ${contentHtml}
          <div style="${styles.spacer}"></div>
        </div>
        <div style="${styles.footer}">
          <div><span style="${styles.smallBrand}">Chantier Pro</span> — Outils professionnels pour le chantier</div>
          <div style="margin-top:8px;">
            Si vous n’êtes pas à l’origine de cette action, ignorez cet email ou contactez le support.
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
      <a href="${safeHref}" style="display:inline-block;background:#FF6A00;color:#061B3A;text-decoration:none;font-weight:900;padding:12px 16px;border-radius:14px;">
        ${safeLabel}
      </a>
    </div>
  `;
}

export function buildWelcomeEmail({ name, dashboardUrl }: { name: string; dashboardUrl: string }): EmailTemplate {
  const displayName = name.trim() || "";

  const subject = "Bienvenue sur Chantier Pro";
  const text = `Bonjour${displayName ? ` ${displayName}` : ""},\n\nBienvenue sur Chantier Pro. Votre compte a été créé avec succès.\n\nAccéder à mon espace :\n${dashboardUrl}\n\nChantier Pro — Outils professionnels pour le chantier\n\nSi vous n’êtes pas à l’origine de cette action, ignorez cet email ou contactez le support.`;

  const contentHtml = `
    <p style="margin:0 0 12px 0;font-size:14px;line-height:1.6;color:#0f172a;">Bonjour${displayName ? ` ${escapeHtml(displayName)}` : ""},</p>
    <p style="margin:0 0 12px 0;font-size:14px;line-height:1.6;color:#0f172a;">Bienvenue sur <b>Chantier Pro</b>. Votre compte a été créé avec succès.</p>
    <p style="margin:0 0 12px 0;font-size:14px;line-height:1.6;color:#0f172a;">Vous pouvez maintenant accéder à votre espace personnel et gérer vos chantiers.</p>
    ${button({ href: dashboardUrl, label: "Accéder à mon espace" })}
    <p style="margin:0 0 12px 0;font-size:13px;line-height:1.6;color:rgba(15,23,42,0.75);">Si le bouton ne fonctionne pas, copiez/collez ce lien dans votre navigateur :<br/>${escapeHtml(
      dashboardUrl,
    )}</p>
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
  const subject = "Réinitialisation de votre mot de passe Chantier Pro";
  const text = `Bonjour,\n\nVous avez demandé à réinitialiser votre mot de passe.\n\nRéinitialiser mon mot de passe :\n${resetUrl}\n\nCe lien expire dans 30 minutes.\n\nSi vous n’êtes pas à l’origine de cette demande, ignorez cet email ou contactez le support.`;

  const contentHtml = `
    <p style="margin:0 0 12px 0;font-size:14px;line-height:1.6;color:#0f172a;">Bonjour,</p>
    <p style="margin:0 0 12px 0;font-size:14px;line-height:1.6;color:#0f172a;">Vous avez demandé à réinitialiser votre mot de passe.</p>
    ${button({ href: resetUrl, label: "Réinitialiser mon mot de passe" })}
    <p style="margin:0 0 12px 0;font-size:13px;line-height:1.6;color:rgba(15,23,42,0.75);">Ce lien expire dans <b>30 minutes</b>.</p>
    <p style="margin:0 0 12px 0;font-size:13px;line-height:1.6;color:rgba(15,23,42,0.75);">Si le bouton ne fonctionne pas, copiez/collez ce lien :<br/>${escapeHtml(
      resetUrl,
    )}</p>
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
  const text = `Bonjour,\n\nVotre mot de passe a bien été modifié.\n\nSi vous n’êtes pas à l’origine de cette action, contactez rapidement le support.\n\nChantier Pro — Outils professionnels pour le chantier`;

  const contentHtml = `
    <p style="margin:0 0 12px 0;font-size:14px;line-height:1.6;color:#0f172a;">Bonjour,</p>
    <p style="margin:0 0 12px 0;font-size:14px;line-height:1.6;color:#0f172a;">Votre mot de passe a bien été modifié.</p>
    <p style="margin:0 0 12px 0;font-size:13px;line-height:1.6;color:rgba(15,23,42,0.75);">Si vous n’êtes pas à l’origine de cette action, contactez rapidement le support.</p>
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

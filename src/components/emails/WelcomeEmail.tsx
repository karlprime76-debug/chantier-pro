import type { ReactElement } from "react";

import { EmailButton, EmailInfoBox, EmailLayout, EmailLink, EmailMutedText, EmailText } from "./EmailLayout";

export function WelcomeEmail({
  name,
  dashboardUrl,
  appUrl,
  supportEmail,
}: {
  name: string;
  dashboardUrl: string;
  appUrl: string;
  supportEmail: string;
}): ReactElement {
  const displayName = name.trim();

  return (
    <EmailLayout
      title="Bienvenue sur Chantier Pro"
      preview="Votre espace Chantier Pro est prêt."
      appUrl={appUrl}
      supportEmail={supportEmail}
    >
      <EmailText>Bonjour{displayName ? ` ${displayName}` : ""},</EmailText>
      <EmailText><strong>Bienvenue sur Chantier Pro.</strong></EmailText>
      <EmailText>
        Chantier Pro aide les professionnels du BTP à gagner du temps sur les calculs, le suivi et l’organisation des projets de construction.
      </EmailText>

      <div style={{ margin: "16px 0", padding: "0 0 0 18px", color: "#0F172A", fontSize: 14, lineHeight: 1.7 }}>
        <div>Calculateurs BTP</div>
        <div>Suivi de projets</div>
        <div>Rapports et exports</div>
        <div>Modules Pro et Entreprise</div>
        <div>Outils pour béton, acier, fondations et laboratoire</div>
      </div>

      <EmailButton href={dashboardUrl}>Accéder à mon tableau de bord</EmailButton>

      <EmailMutedText>
        Si le bouton ne fonctionne pas, utilisez ce lien :<br />
        <EmailLink href={dashboardUrl}>{dashboardUrl}</EmailLink>
      </EmailMutedText>

      <EmailInfoBox>
        Conseil : commencez par créer votre premier projet ou tester un calculateur gratuit.
      </EmailInfoBox>

      <EmailInfoBox>
        Besoin d’aide ? Écrivez-nous à <EmailLink href={`mailto:${supportEmail}`}>{supportEmail}</EmailLink> ou contactez-nous via WhatsApp.
      </EmailInfoBox>
    </EmailLayout>
  );
}

import type { ReactElement } from "react";

import { EmailButton, EmailInfoBox, EmailLayout, EmailLink, EmailMutedText, EmailText } from "./EmailLayout";

export function PasswordChangedEmail({ appUrl, supportEmail }: { appUrl: string; supportEmail: string }): ReactElement {
  return (
    <EmailLayout
      title="Votre mot de passe a été modifié"
      preview="Votre mot de passe Chantier Pro vient d’être mis à jour."
      appUrl={appUrl}
      supportEmail={supportEmail}
    >
      <EmailText>Bonjour,</EmailText>
      <EmailText>Votre mot de passe <strong>Chantier Pro</strong> vient d’être mis à jour.</EmailText>

      <EmailInfoBox tone="security">
        Si vous n’avez pas effectué cette action, contactez immédiatement le support à <EmailLink href={`mailto:${supportEmail}`}>{supportEmail}</EmailLink> ou via WhatsApp.
      </EmailInfoBox>

      <EmailButton href={appUrl}>Ouvrir Chantier Pro</EmailButton>

      <EmailMutedText>
        Cet email est une notification de sécurité envoyée automatiquement par Chantier Pro.
      </EmailMutedText>
    </EmailLayout>
  );
}

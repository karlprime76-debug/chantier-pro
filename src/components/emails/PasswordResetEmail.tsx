import type { ReactElement } from "react";

import { EmailButton, EmailInfoBox, EmailLayout, EmailLink, EmailMutedText, EmailText } from "./EmailLayout";

export function PasswordResetEmail({
  resetUrl,
  appUrl,
  supportEmail,
}: {
  resetUrl: string;
  appUrl: string;
  supportEmail: string;
}): ReactElement {
  return (
    <EmailLayout
      title="Réinitialisation de votre mot de passe"
      preview="Lien de réinitialisation Chantier Pro valable 30 minutes."
      appUrl={appUrl}
      supportEmail={supportEmail}
    >
      <EmailText>Bonjour,</EmailText>
      <EmailText>Nous avons reçu une demande de réinitialisation pour votre compte <strong>Chantier Pro</strong>.</EmailText>

      <EmailButton href={resetUrl}>Réinitialiser mon mot de passe</EmailButton>

      <EmailMutedText>Ce lien expire dans <strong>30 minutes</strong>.</EmailMutedText>
      <EmailMutedText>
        Si le bouton ne fonctionne pas, copiez/collez ce lien dans votre navigateur :<br />
        <EmailLink href={resetUrl}>{resetUrl}</EmailLink>
      </EmailMutedText>

      <EmailInfoBox tone="security">
        Si vous n’êtes pas à l’origine de cette demande, vous pouvez ignorer cet email. Aucun changement ne sera effectué sans action de votre part.
      </EmailInfoBox>

      <EmailInfoBox>
        Besoin d’aide ? Contactez-nous à <EmailLink href={`mailto:${supportEmail}`}>{supportEmail}</EmailLink> ou via WhatsApp.
      </EmailInfoBox>
    </EmailLayout>
  );
}

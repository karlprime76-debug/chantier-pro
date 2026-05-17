import type { ReactElement } from "react";

import { EmailButton, EmailInfoBox, EmailLayout, EmailLink, EmailMutedText, EmailText } from "./EmailLayout";

export function PaymentFailedEmail({
  userName,
  planName,
  amount,
  currency,
  retryUrl,
  appUrl,
  supportEmail,
}: {
  userName?: string;
  planName: string;
  amount?: string;
  currency?: string;
  retryUrl: string;
  appUrl: string;
  supportEmail: string;
}): ReactElement {
  const displayName = userName?.trim();

  return (
    <EmailLayout title="Votre paiement n’a pas abouti" preview="Votre paiement Chantier Pro n’a pas pu être validé." appUrl={appUrl} supportEmail={supportEmail}>
      <EmailText>Bonjour{displayName ? ` ${displayName}` : ""},</EmailText>
      <EmailText>Votre paiement <strong>Chantier Pro</strong> n’a pas pu être validé.</EmailText>

      <EmailInfoBox tone="security">
        Il peut s’agir d’un solde insuffisant, d’une interruption temporaire ou d’une validation non finalisée par le moyen de paiement.
      </EmailInfoBox>

      <EmailInfoBox>
        Offre : <strong>{planName}</strong>{amount && currency ? <span> · Montant : <strong>{amount} {currency}</strong></span> : null}
      </EmailInfoBox>

      <EmailButton href={retryUrl}>Réessayer le paiement</EmailButton>

      <EmailMutedText>
        Si le bouton ne fonctionne pas, utilisez ce lien :<br />
        <EmailLink href={retryUrl}>{retryUrl}</EmailLink>
      </EmailMutedText>

      <EmailInfoBox>
        Si le problème persiste, contactez le support à <EmailLink href={`mailto:${supportEmail}`}>{supportEmail}</EmailLink>.
      </EmailInfoBox>
    </EmailLayout>
  );
}

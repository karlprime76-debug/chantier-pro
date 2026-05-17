import type { ReactElement } from "react";

import { EmailButton, EmailDivider, EmailInfoBox, EmailLayout, EmailLink, EmailMutedText, EmailText } from "./EmailLayout";

export function PaymentReceiptEmail({
  userName,
  planName,
  amount,
  currency,
  paymentReference,
  paidAt,
  dashboardUrl,
  appUrl,
  supportEmail,
}: {
  userName?: string;
  planName: string;
  amount: string;
  currency: string;
  paymentReference?: string;
  paidAt?: string;
  dashboardUrl: string;
  appUrl: string;
  supportEmail: string;
}): ReactElement {
  const displayName = userName?.trim();

  return (
    <EmailLayout title="Reçu de paiement Chantier Pro" preview="Votre paiement Chantier Pro a bien été reçu." appUrl={appUrl} supportEmail={supportEmail}>
      <EmailText>Bonjour{displayName ? ` ${displayName}` : ""},</EmailText>
      <EmailText>Votre paiement <strong>Chantier Pro</strong> a bien été reçu.</EmailText>

      <EmailInfoBox>
        <div>Offre : <strong>{planName}</strong></div>
        <div>Montant : <strong>{amount} {currency}</strong></div>
        {paymentReference ? <div>Référence : <strong>{paymentReference}</strong></div> : null}
        {paidAt ? <div>Date : <strong>{paidAt}</strong></div> : null}
      </EmailInfoBox>

      <EmailButton href={dashboardUrl}>Accéder à mon tableau de bord</EmailButton>

      <EmailMutedText>
        Si le bouton ne fonctionne pas, utilisez ce lien :<br />
        <EmailLink href={dashboardUrl}>{dashboardUrl}</EmailLink>
      </EmailMutedText>

      <EmailDivider />
      <EmailMutedText>Conservez cet email comme justificatif de paiement.</EmailMutedText>
    </EmailLayout>
  );
}

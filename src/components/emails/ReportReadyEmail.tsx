import type { ReactElement } from "react";

import { EmailButton, EmailInfoBox, EmailLayout, EmailLink, EmailMutedText, EmailText } from "./EmailLayout";

export function ReportReadyEmail({
  userName,
  projectName,
  reportType,
  generatedAt,
  downloadUrl,
  dashboardUrl,
  appUrl,
  supportEmail,
}: {
  userName?: string;
  projectName?: string;
  reportType: string;
  generatedAt?: string;
  downloadUrl: string;
  dashboardUrl: string;
  appUrl: string;
  supportEmail: string;
}): ReactElement {
  const displayName = userName?.trim();

  return (
    <EmailLayout title="Votre rapport Chantier Pro est prêt" preview="Votre rapport ou export Chantier Pro est disponible." appUrl={appUrl} supportEmail={supportEmail}>
      <EmailText>Bonjour{displayName ? ` ${displayName}` : ""},</EmailText>
      <EmailText>Votre rapport <strong>Chantier Pro</strong> a été généré avec succès.</EmailText>

      <EmailInfoBox>
        <div>Type : <strong>{reportType}</strong></div>
        {projectName ? <div>Projet : <strong>{projectName}</strong></div> : null}
        {generatedAt ? <div>Généré le : <strong>{generatedAt}</strong></div> : null}
      </EmailInfoBox>

      <EmailButton href={downloadUrl}>Télécharger le rapport</EmailButton>

      <EmailMutedText>
        Si le bouton ne fonctionne pas, utilisez ce lien :<br />
        <EmailLink href={downloadUrl}>{downloadUrl}</EmailLink>
      </EmailMutedText>

      <EmailMutedText>
        Vous pouvez aussi retrouver vos éléments depuis votre tableau de bord : <EmailLink href={dashboardUrl}>{dashboardUrl}</EmailLink>
      </EmailMutedText>
    </EmailLayout>
  );
}

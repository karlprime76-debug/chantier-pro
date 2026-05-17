import type { ReactElement } from "react";

import { EmailButton, EmailInfoBox, EmailLayout, EmailLink, EmailMutedText, EmailText } from "./EmailLayout";

export function ProjectInvitationEmail({
  invitedName,
  inviterName,
  projectName,
  roleName,
  inviteUrl,
  appUrl,
  supportEmail,
}: {
  invitedName?: string;
  inviterName?: string;
  projectName: string;
  roleName?: string;
  inviteUrl: string;
  appUrl: string;
  supportEmail: string;
}): ReactElement {
  const displayName = invitedName?.trim();

  return (
    <EmailLayout title="Invitation à rejoindre un projet" preview="Vous êtes invité à rejoindre un projet sur Chantier Pro." appUrl={appUrl} supportEmail={supportEmail}>
      <EmailText>Bonjour{displayName ? ` ${displayName}` : ""},</EmailText>
      <EmailText>
        {inviterName ? <strong>{inviterName}</strong> : "Un membre de Chantier Pro"} vous invite à rejoindre un projet sur <strong>Chantier Pro</strong>.
      </EmailText>

      <EmailInfoBox>
        <div>Projet : <strong>{projectName}</strong></div>
        {roleName ? <div>Rôle : <strong>{roleName}</strong></div> : null}
      </EmailInfoBox>

      <EmailButton href={inviteUrl}>Accepter l’invitation</EmailButton>

      <EmailMutedText>
        Si le bouton ne fonctionne pas, utilisez ce lien :<br />
        <EmailLink href={inviteUrl}>{inviteUrl}</EmailLink>
      </EmailMutedText>
    </EmailLayout>
  );
}

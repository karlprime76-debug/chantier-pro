import type { ReactElement } from "react";

import { EmailButton, EmailFeatureList, EmailInfoBox, EmailLayout, EmailLink, EmailMutedText, EmailText } from "./EmailLayout";

export type SubscriptionPlanKind = "pro" | "enterprise";

const proFeatures = [
  "Calculateurs avancés",
  "Projets et suivi chantier selon votre offre",
  "Rapports et exports si inclus dans votre plan",
  "Outils de suivi pour mieux organiser vos travaux",
];

const enterpriseFeatures = [
  "Fondations",
  "Formulation béton",
  "Laboratoire",
  "Dalle post-tension",
  "Rapports et exports",
  "Checklists chantier",
  "Accompagnement projet",
];

export function SubscriptionActivatedEmail({
  userName,
  planName,
  planKind,
  activatedAt,
  dashboardUrl,
  appUrl,
  supportEmail,
}: {
  userName?: string;
  planName: string;
  planKind: SubscriptionPlanKind;
  activatedAt?: string;
  dashboardUrl: string;
  appUrl: string;
  supportEmail: string;
}): ReactElement {
  const displayName = userName?.trim();
  const isEnterprise = planKind === "enterprise";

  return (
    <EmailLayout
      title={isEnterprise ? "Votre accès Entreprise est activé" : "Votre abonnement Pro est activé"}
      preview={isEnterprise ? "Votre accès Entreprise Chantier Pro est maintenant disponible." : "Votre abonnement Pro Chantier Pro est maintenant actif."}
      appUrl={appUrl}
      supportEmail={supportEmail}
    >
      <EmailText>Bonjour{displayName ? ` ${displayName}` : ""},</EmailText>
      <EmailText>
        {isEnterprise ? "Votre accès Entreprise" : "Votre abonnement Pro"} <strong>Chantier Pro</strong> est activé.
      </EmailText>
      <EmailInfoBox>
        Offre : <strong>{planName}</strong>{activatedAt ? <span> · Activée le {activatedAt}</span> : null}
      </EmailInfoBox>

      <EmailFeatureList items={isEnterprise ? enterpriseFeatures : proFeatures} />

      <EmailButton href={dashboardUrl}>{isEnterprise ? "Accéder à l’espace Entreprise" : "Accéder à mon tableau de bord"}</EmailButton>

      <EmailMutedText>
        Si le bouton ne fonctionne pas, utilisez ce lien :<br />
        <EmailLink href={dashboardUrl}>{dashboardUrl}</EmailLink>
      </EmailMutedText>

      <EmailInfoBox>
        Une question sur votre offre ? Contactez le support à <EmailLink href={`mailto:${supportEmail}`}>{supportEmail}</EmailLink>.
      </EmailInfoBox>
    </EmailLayout>
  );
}

import "server-only";

import { createElement } from "react";

import { PasswordChangedEmail } from "@/components/emails/PasswordChangedEmail";
import { PasswordResetEmail } from "@/components/emails/PasswordResetEmail";
import { PaymentFailedEmail } from "@/components/emails/PaymentFailedEmail";
import { PaymentReceiptEmail } from "@/components/emails/PaymentReceiptEmail";
import { ProjectInvitationEmail } from "@/components/emails/ProjectInvitationEmail";
import { ReportReadyEmail } from "@/components/emails/ReportReadyEmail";
import { SubscriptionActivatedEmail, type SubscriptionPlanKind } from "@/components/emails/SubscriptionActivatedEmail";
import { WelcomeEmail } from "@/components/emails/WelcomeEmail";
import { SITE_CONFIG } from "@/lib/site-config";
import { getPublicAppUrl, sendTransactionalEmail } from "@/lib/email/resend";

export const EMAIL_SUBJECTS = {
  welcome: "Bienvenue sur Chantier Pro",
  passwordReset: "Réinitialisation de votre mot de passe Chantier Pro",
  passwordChanged: "Votre mot de passe Chantier Pro a été modifié",
  subscriptionProActivated: "Votre abonnement Pro Chantier Pro est activé",
  subscriptionEnterpriseActivated: "Votre accès Entreprise Chantier Pro est activé",
  paymentReceipt: "Reçu de paiement Chantier Pro",
  paymentFailed: "Votre paiement Chantier Pro n’a pas abouti",
  projectInvitation: "Vous êtes invité à rejoindre un projet sur Chantier Pro",
  reportReady: "Votre rapport Chantier Pro est prêt",
} as const;

function appUrl() {
  return getPublicAppUrl();
}

function dashboardUrl() {
  return `${appUrl().replace(/\/$/, "")}/dashboard`;
}

function supportEmail() {
  return SITE_CONFIG.supportEmail;
}

export function sendWelcomeEmail(input: { to: string; userName: string; dashboardUrl?: string }) {
  const currentAppUrl = appUrl();
  const currentDashboardUrl = input.dashboardUrl ?? `${currentAppUrl.replace(/\/$/, "")}/dashboard`;

  return sendTransactionalEmail({
    to: input.to,
    subject: EMAIL_SUBJECTS.welcome,
    react: createElement(WelcomeEmail, {
      name: input.userName,
      dashboardUrl: currentDashboardUrl,
      appUrl: currentAppUrl,
      supportEmail: supportEmail(),
    }),
    text: `Bonjour${input.userName ? ` ${input.userName}` : ""},\n\nBienvenue sur Chantier Pro.\n\nChantier Pro vous aide à gagner du temps sur les calculs, le suivi et l’organisation de vos projets BTP.\n\nAccéder à mon tableau de bord :\n${currentDashboardUrl}\n\nSupport : ${supportEmail()}\nWhatsApp : ${SITE_CONFIG.whatsappDisplay}`,
  });
}

export function sendPasswordResetEmail(input: { to: string; resetUrl: string }) {
  const currentAppUrl = appUrl();

  return sendTransactionalEmail({
    to: input.to,
    subject: EMAIL_SUBJECTS.passwordReset,
    react: createElement(PasswordResetEmail, { resetUrl: input.resetUrl, appUrl: currentAppUrl, supportEmail: supportEmail() }),
    text: `Bonjour,\n\nNous avons reçu une demande de réinitialisation pour votre compte Chantier Pro.\n\nRéinitialiser mon mot de passe :\n${input.resetUrl}\n\nCe lien expire dans 30 minutes.\n\nSi vous n’êtes pas à l’origine de cette demande, vous pouvez ignorer cet email.\n\nSupport : ${supportEmail()}`,
  });
}

export function sendPasswordChangedEmail(input: { to: string }) {
  const currentAppUrl = appUrl();

  return sendTransactionalEmail({
    to: input.to,
    subject: EMAIL_SUBJECTS.passwordChanged,
    react: createElement(PasswordChangedEmail, { appUrl: currentAppUrl, supportEmail: supportEmail() }),
    text: `Bonjour,\n\nVotre mot de passe Chantier Pro vient d’être mis à jour.\n\nSi vous n’avez pas effectué cette action, contactez immédiatement le support : ${supportEmail()}\n\nOuvrir Chantier Pro :\n${currentAppUrl}`,
  });
}

export function sendSubscriptionActivatedEmail(input: {
  to: string;
  userName?: string;
  planName: string;
  planKind: SubscriptionPlanKind;
  activatedAt?: string;
  dashboardUrl?: string;
}) {
  const currentAppUrl = appUrl();
  const currentDashboardUrl = input.dashboardUrl ?? dashboardUrl();

  return sendTransactionalEmail({
    to: input.to,
    subject: input.planKind === "enterprise" ? EMAIL_SUBJECTS.subscriptionEnterpriseActivated : EMAIL_SUBJECTS.subscriptionProActivated,
    react: createElement(SubscriptionActivatedEmail, {
      userName: input.userName,
      planName: input.planName,
      planKind: input.planKind,
      activatedAt: input.activatedAt,
      dashboardUrl: currentDashboardUrl,
      appUrl: currentAppUrl,
      supportEmail: supportEmail(),
    }),
    text: `Bonjour${input.userName ? ` ${input.userName}` : ""},\n\nVotre accès ${input.planName} Chantier Pro est activé.\n\nAccéder à mon tableau de bord :\n${currentDashboardUrl}\n\nSupport : ${supportEmail()}`,
  });
}

export function sendPaymentReceiptEmail(input: {
  to: string;
  userName?: string;
  planName: string;
  amount: string;
  currency: string;
  paymentReference?: string;
  paidAt?: string;
  dashboardUrl?: string;
}) {
  const currentAppUrl = appUrl();
  const currentDashboardUrl = input.dashboardUrl ?? dashboardUrl();

  return sendTransactionalEmail({
    to: input.to,
    subject: EMAIL_SUBJECTS.paymentReceipt,
    react: createElement(PaymentReceiptEmail, {
      userName: input.userName,
      planName: input.planName,
      amount: input.amount,
      currency: input.currency,
      paymentReference: input.paymentReference,
      paidAt: input.paidAt,
      dashboardUrl: currentDashboardUrl,
      appUrl: currentAppUrl,
      supportEmail: supportEmail(),
    }),
    text: `Bonjour${input.userName ? ` ${input.userName}` : ""},\n\nVotre paiement Chantier Pro a bien été reçu.\n\nOffre : ${input.planName}\nMontant : ${input.amount} ${input.currency}\n${input.paymentReference ? `Référence : ${input.paymentReference}\n` : ""}${input.paidAt ? `Date : ${input.paidAt}\n` : ""}\nConservez cet email comme justificatif de paiement.\n\nTableau de bord :\n${currentDashboardUrl}`,
  });
}

export function sendPaymentFailedEmail(input: {
  to: string;
  userName?: string;
  planName: string;
  amount?: string;
  currency?: string;
  retryUrl: string;
}) {
  const currentAppUrl = appUrl();

  return sendTransactionalEmail({
    to: input.to,
    subject: EMAIL_SUBJECTS.paymentFailed,
    react: createElement(PaymentFailedEmail, {
      userName: input.userName,
      planName: input.planName,
      amount: input.amount,
      currency: input.currency,
      retryUrl: input.retryUrl,
      appUrl: currentAppUrl,
      supportEmail: supportEmail(),
    }),
    text: `Bonjour${input.userName ? ` ${input.userName}` : ""},\n\nVotre paiement Chantier Pro n’a pas pu être validé.\n\nOffre : ${input.planName}\n\nRéessayer le paiement :\n${input.retryUrl}\n\nSupport : ${supportEmail()}`,
  });
}

export function sendProjectInvitationEmail(input: {
  to: string;
  invitedName?: string;
  inviterName?: string;
  projectName: string;
  roleName?: string;
  inviteUrl: string;
}) {
  const currentAppUrl = appUrl();

  return sendTransactionalEmail({
    to: input.to,
    subject: EMAIL_SUBJECTS.projectInvitation,
    react: createElement(ProjectInvitationEmail, {
      invitedName: input.invitedName,
      inviterName: input.inviterName,
      projectName: input.projectName,
      roleName: input.roleName,
      inviteUrl: input.inviteUrl,
      appUrl: currentAppUrl,
      supportEmail: supportEmail(),
    }),
    text: `Bonjour${input.invitedName ? ` ${input.invitedName}` : ""},\n\nVous êtes invité à rejoindre un projet sur Chantier Pro.\n\nProjet : ${input.projectName}\n${input.inviterName ? `Invitant : ${input.inviterName}\n` : ""}${input.roleName ? `Rôle : ${input.roleName}\n` : ""}\nAccepter l’invitation :\n${input.inviteUrl}`,
  });
}

export function sendReportReadyEmail(input: {
  to: string;
  userName?: string;
  projectName?: string;
  reportType: string;
  generatedAt?: string;
  downloadUrl: string;
  dashboardUrl?: string;
}) {
  const currentAppUrl = appUrl();
  const currentDashboardUrl = input.dashboardUrl ?? dashboardUrl();

  return sendTransactionalEmail({
    to: input.to,
    subject: EMAIL_SUBJECTS.reportReady,
    react: createElement(ReportReadyEmail, {
      userName: input.userName,
      projectName: input.projectName,
      reportType: input.reportType,
      generatedAt: input.generatedAt,
      downloadUrl: input.downloadUrl,
      dashboardUrl: currentDashboardUrl,
      appUrl: currentAppUrl,
      supportEmail: supportEmail(),
    }),
    text: `Bonjour${input.userName ? ` ${input.userName}` : ""},\n\nVotre rapport Chantier Pro est prêt.\n\nType : ${input.reportType}\n${input.projectName ? `Projet : ${input.projectName}\n` : ""}${input.generatedAt ? `Généré le : ${input.generatedAt}\n` : ""}\nTélécharger le rapport :\n${input.downloadUrl}\n\nTableau de bord :\n${currentDashboardUrl}`,
  });
}

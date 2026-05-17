import { NextResponse } from "next/server";
import { z } from "zod";

import { requireApiAdmin } from "@/lib/auth/api";
import {
  sendPasswordChangedEmail,
  sendPasswordResetEmail,
  sendPaymentFailedEmail,
  sendPaymentReceiptEmail,
  sendProjectInvitationEmail,
  sendReportReadyEmail,
  sendSubscriptionActivatedEmail,
  sendWelcomeEmail,
} from "@/lib/email/transactional";
import { getPublicAppUrl, sendTransactionalEmail } from "@/lib/email/resend";
import { getRequestId, withRequestIdHeaders } from "@/lib/observability/requestId";

const TemplateSchema = z.enum([
  "basic",
  "welcome",
  "password-reset",
  "password-changed",
  "subscription-pro",
  "subscription-enterprise",
  "payment-receipt",
  "payment-failed",
  "project-invitation",
  "report-ready",
]);

const Schema = z.object({
  to: z.string().email().optional(),
  template: TemplateSchema.optional(),
});

export async function POST(req: Request) {
  const requestId = getRequestId(req);

  let session;
  try {
    session = await requireApiAdmin();
  } catch (e) {
    if (e instanceof Response) return withRequestIdHeaders(e, requestId);
    return withRequestIdHeaders(NextResponse.json({ ok: false, error: "forbidden", requestId }, { status: 403 }), requestId);
  }

  const json = await req.json().catch(() => null);
  const parsed = Schema.safeParse(json ?? {});
  if (!parsed.success) {
    return withRequestIdHeaders(
      NextResponse.json({ ok: false, error: "invalid_payload", issues: parsed.error.issues, requestId }, { status: 400 }),
      requestId,
    );
  }

  const to = (parsed.data.to ?? session.email ?? "").trim().toLowerCase();
  if (!to) {
    return withRequestIdHeaders(
      NextResponse.json({ ok: false, error: "missing_to", message: "Aucun email destinataire.", requestId }, { status: 400 }),
      requestId,
    );
  }

  const template = parsed.data.template ?? "basic";
  const appUrl = getPublicAppUrl().replace(/\/$/, "");
  const dashboardUrl = `${appUrl}/dashboard`;
  const now = new Date().toLocaleString("fr-FR", { dateStyle: "medium", timeStyle: "short" });
  const result =
    template === "welcome"
      ? await sendWelcomeEmail({ to, userName: "Utilisateur Test", dashboardUrl })
      : template === "password-reset"
        ? await sendPasswordResetEmail({ to, resetUrl: `${appUrl}/reset-password?token=test-preview-token` })
        : template === "password-changed"
          ? await sendPasswordChangedEmail({ to })
          : template === "subscription-pro"
            ? await sendSubscriptionActivatedEmail({ to, userName: "Utilisateur Test", planName: "Pro", planKind: "pro", activatedAt: now, dashboardUrl })
            : template === "subscription-enterprise"
              ? await sendSubscriptionActivatedEmail({ to, userName: "Utilisateur Test", planName: "Entreprise", planKind: "enterprise", activatedAt: now, dashboardUrl })
              : template === "payment-receipt"
                ? await sendPaymentReceiptEmail({ to, userName: "Utilisateur Test", planName: "Pro", amount: "15000", currency: "XOF", paymentReference: "TEST-CP-001", paidAt: now, dashboardUrl })
                : template === "payment-failed"
                  ? await sendPaymentFailedEmail({ to, userName: "Utilisateur Test", planName: "Pro", amount: "15000", currency: "XOF", retryUrl: `${appUrl}/pricing` })
                  : template === "project-invitation"
                    ? await sendProjectInvitationEmail({ to, invitedName: "Utilisateur Test", inviterName: "Chef Chantier Test", projectName: "Projet Démo Chantier Pro", roleName: "Collaborateur", inviteUrl: `${appUrl}/dashboard/projects` })
                    : template === "report-ready"
                      ? await sendReportReadyEmail({ to, userName: "Utilisateur Test", projectName: "Projet Démo Chantier Pro", reportType: "Rapport journalier", generatedAt: now, downloadUrl: `${appUrl}/dashboard/reports`, dashboardUrl })
                      : await sendTransactionalEmail({
                          to,
                          subject: "Test email Chantier Pro",
                          text: "Ceci est un email de test (admin) depuis Chantier Pro.",
                          html: "<p>Ceci est un email de test (admin) depuis <strong>Chantier Pro</strong>.</p>",
                        });

  if (!result.ok) {
    return withRequestIdHeaders(
      NextResponse.json({ ok: false, error: "send_failed", details: result.error, requestId }, { status: 502 }),
      requestId,
    );
  }

  return withRequestIdHeaders(
    NextResponse.json({ ok: true, provider: result.provider, id: result.id, to, template, requestId }, { status: 200 }),
    requestId,
  );
}

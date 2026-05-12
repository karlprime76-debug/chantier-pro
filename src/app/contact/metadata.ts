import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contactez l’équipe Chantier Pro (support, questions, abonnement).",
  alternates: {
    canonical: "/contact",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Contact | Chantier Pro",
    description: "Contactez l’équipe Chantier Pro.",
    url: "/contact",
  },
  twitter: {
    title: "Contact | Chantier Pro",
    description: "Contactez l’équipe Chantier Pro (support technique et abonnement).",
  },
};

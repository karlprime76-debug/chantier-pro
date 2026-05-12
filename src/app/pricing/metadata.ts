import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tarifs",
  description:
    "Découvrez les plans Chantier Pro (Gratuit, Premium, Entreprise) pour gérer vos chantiers, calculs BTP, dépenses et rapports.",
  alternates: {
    canonical: "/pricing",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Tarifs | Chantier Pro",
    description:
      "Plans Gratuit, Premium et Entreprise pour gagner du temps sur les quantités, le suivi chantier et les rapports.",
    url: "/pricing",
  },
  twitter: {
    title: "Tarifs | Chantier Pro",
    description:
      "Comparez les plans Chantier Pro pour accéder aux calculateurs premium, au suivi des dépenses et aux rapports.",
  },
};

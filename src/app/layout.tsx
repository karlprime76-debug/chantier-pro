import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/components/auth/Providers";
import { AppSplashScreen } from "@/components/branding/AppSplashScreen";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { getSiteUrl } from "@/lib/config/site";
import { SITE_CONFIG } from "@/lib/site-config";
import "./globals.css";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Chantier Pro",
    template: "%s | Chantier Pro",
  },
  applicationName: "Chantier Pro",
  description: "Application mobile-first pour gérer les chantiers BTP : calculs béton/acier, dépenses, rapports et documents.",
  keywords: [
    "chantier",
    "BTP",
    "gestion de chantier",
    "calcul béton",
    "calcul acier",
    "devis",
    "rapport journalier",
    "Bénin",
  ],
  authors: [{ name: "Chantier Pro" }],
  creator: "Chantier Pro",
  metadataBase: new URL(getSiteUrl()),
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    title: "Chantier Pro",
    description: "Application mobile-first pour gérer les chantiers BTP : calculs béton/acier, dépenses, rapports et documents.",
    url: getSiteUrl(),
    siteName: "Chantier Pro",
    locale: "fr_FR",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Chantier Pro",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Chantier Pro",
    description: "Application mobile-first pour gérer les chantiers BTP : calculs béton/acier, dépenses, rapports et documents.",
    images: ["/twitter-image"],
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#ff6a00",
  colorScheme: "light dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const siteUrl = getSiteUrl();
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_CONFIG.name,
    url: siteUrl,
    logo: `${siteUrl}${SITE_CONFIG.logoPath}`,
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: SITE_CONFIG.supportEmail,
        availableLanguage: ["fr"],
      },
    ],
    sameAs: [SITE_CONFIG.instagramUrl, SITE_CONFIG.tiktokUrl],
  };

  const webSiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_CONFIG.name,
    url: siteUrl,
    inLanguage: "fr-FR",
  };

  const softwareAppJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: SITE_CONFIG.name,
    description:
      "Application BTP mobile-first pour calculs (béton/acier/fondations), suivi chantier, gestion de projets de construction, budget/dépenses et rapports.",
    url: siteUrl,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    inLanguage: "fr-FR",
    offers: [
      {
        "@type": "Offer",
        name: "Gratuit",
        price: "0",
        priceCurrency: "XOF",
        url: `${siteUrl}/pricing`,
      },
      {
        "@type": "Offer",
        name: "Pro",
        price: "15000",
        priceCurrency: "XOF",
        url: `${siteUrl}/pricing`,
      },
      {
        "@type": "Offer",
        name: "Entreprise",
        price: "25000",
        priceCurrency: "XOF",
        url: `${siteUrl}/pricing`,
      },
    ],
  };

  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppJsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <Providers>
          <ThemeProvider>
            <div className="relative flex min-h-full flex-1 flex-col">
              <AppSplashScreen />
              <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute -top-48 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,var(--app-hero-glow-1),transparent_62%)] blur-2xl sm:h-[680px] sm:w-[680px] sm:blur-3xl" />
                <div className="absolute -bottom-72 right-[-180px] h-[560px] w-[560px] rounded-full bg-[radial-gradient(circle,var(--app-hero-glow-2),transparent_60%)] blur-2xl sm:h-[720px] sm:w-[720px] sm:blur-3xl" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,var(--app-hero-glow-3),transparent_55%)]" />
              </div>
              {children}
            </div>
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}

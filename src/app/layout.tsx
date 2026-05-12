import type { Metadata } from "next";
import { Providers } from "@/components/auth/Providers";
import { AppSplashScreen } from "@/components/branding/AppSplashScreen";
import { HomeButton } from "@/components/navigation/HomeButton";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import "./globals.css";

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
  metadataBase: new URL("https://chantier-pro-snowy.vercel.app"),
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
    url: "https://chantier-pro-snowy.vercel.app",
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
  themeColor: "#0f172a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col">
        <Providers>
          <ThemeProvider>
            <div className="relative flex min-h-full flex-1 flex-col">
              <AppSplashScreen />
              <HomeButton />
              <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute -top-48 left-1/2 h-[680px] w-[680px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,var(--app-hero-glow-1),transparent_62%)] blur-3xl" />
                <div className="absolute -bottom-72 right-[-180px] h-[720px] w-[720px] rounded-full bg-[radial-gradient(circle,var(--app-hero-glow-2),transparent_60%)] blur-3xl" />
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

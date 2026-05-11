import type { Metadata } from "next";
import { Providers } from "@/components/auth/Providers";
import { AppSplashScreen } from "@/components/branding/AppSplashScreen";
import { HomeButton } from "@/components/navigation/HomeButton";
import { AutoTheme } from "@/components/theme/AutoTheme";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chantier Pro",
  description: "Application de gestion de chantiers, calculs BTP et documents professionnels.",
  metadataBase: new URL("https://chantier-pro-snowy.vercel.app"),
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
    description: "Application de gestion de chantiers, calculs BTP et documents professionnels.",
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
    description: "Application de gestion de chantiers, calculs BTP et documents professionnels.",
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
          <AutoTheme />
          <div className="relative flex min-h-full flex-1 flex-col">
            <AppSplashScreen />
            <HomeButton />
            <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
              <div className="absolute -top-48 left-1/2 h-[680px] w-[680px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(249,115,22,0.22),transparent_62%)] blur-3xl" />
              <div className="absolute -bottom-72 right-[-180px] h-[720px] w-[720px] rounded-full bg-[radial-gradient(circle,rgba(11,42,82,0.34),transparent_60%)] blur-3xl" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_55%)]" />
            </div>
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}

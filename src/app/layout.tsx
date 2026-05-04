import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/components/auth/Providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Chantier Pro",
  description:
    "Chantier Pro aide les professionnels du BTP à calculer, suivre les dépenses, créer des rapports et gérer leurs chantiers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>
          <div className="relative flex min-h-full flex-1 flex-col">
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

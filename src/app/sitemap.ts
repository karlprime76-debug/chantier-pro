import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const routes: Array<{ path: string; changeFrequency?: MetadataRoute.Sitemap[number]["changeFrequency"]; priority?: number }> = [
    { path: "/", changeFrequency: "weekly", priority: 1 },
    { path: "/pricing", changeFrequency: "weekly", priority: 0.9 },
    { path: "/contact", changeFrequency: "yearly", priority: 0.4 },
    { path: "/features", changeFrequency: "monthly", priority: 0.7 },
    { path: "/features/calculs-beton-acier", changeFrequency: "monthly", priority: 0.6 },
    { path: "/features/suivi-budget", changeFrequency: "monthly", priority: 0.6 },
    { path: "/features/rapports-journaliers", changeFrequency: "monthly", priority: 0.6 },
    { path: "/legal", changeFrequency: "yearly", priority: 0.3 },
    { path: "/legal/mentions-legales", changeFrequency: "yearly", priority: 0.3 },
    { path: "/legal/confidentialite", changeFrequency: "yearly", priority: 0.3 },
    { path: "/legal/conditions", changeFrequency: "yearly", priority: 0.3 },
    { path: "/legal/cookies", changeFrequency: "yearly", priority: 0.2 },
    { path: "/legal/remboursement", changeFrequency: "yearly", priority: 0.2 },
  ];

  return routes.map((r) => ({
    url: absoluteUrl(r.path),
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
}

import type { MetadataRoute } from "next";

const BASE_URL = "https://chantier-pro-snowy.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const routes: Array<{ path: string; changeFrequency?: MetadataRoute.Sitemap[number]["changeFrequency"]; priority?: number }> = [
    { path: "/", changeFrequency: "weekly", priority: 1 },
    { path: "/pricing", changeFrequency: "weekly", priority: 0.9 },
    { path: "/calculs", changeFrequency: "weekly", priority: 0.9 },
    { path: "/install", changeFrequency: "monthly", priority: 0.6 },
    { path: "/help", changeFrequency: "monthly", priority: 0.5 },
    { path: "/support", changeFrequency: "monthly", priority: 0.5 },
    { path: "/legal", changeFrequency: "yearly", priority: 0.3 },
    { path: "/privacy", changeFrequency: "yearly", priority: 0.3 },
    { path: "/terms", changeFrequency: "yearly", priority: 0.3 },
    { path: "/contact", changeFrequency: "yearly", priority: 0.4 },
    { path: "/legal/mentions-legales", changeFrequency: "yearly", priority: 0.3 },
    { path: "/legal/confidentialite", changeFrequency: "yearly", priority: 0.3 },
    { path: "/legal/conditions", changeFrequency: "yearly", priority: 0.3 },
  ];

  return routes.map((r) => ({
    url: `${BASE_URL}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
}

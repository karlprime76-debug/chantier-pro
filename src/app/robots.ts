import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/dashboard/",
        "/login",
        "/register",
        "/forgot-password",
        "/reset-password",
      ],
    },
    sitemap: "https://chantier-pro-snowy.vercel.app/sitemap.xml",
    host: "https://chantier-pro-snowy.vercel.app",
  };
}

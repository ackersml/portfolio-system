import type { MetadataRoute } from "next";
import { getProjects } from "@/lib/projects";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const routes: MetadataRoute.Sitemap = [
    "",
    "/projects",
    "/services",
    "/about",
    "/contact",
  ].map((path) => ({ url: `${baseUrl}${path}`, lastModified: new Date() }));

  const projectRoutes = getProjects().map((p) => ({
    url: `${baseUrl}/projects/${p.slug}`,
    lastModified: new Date(),
  }));

  return [...routes, ...projectRoutes];
}



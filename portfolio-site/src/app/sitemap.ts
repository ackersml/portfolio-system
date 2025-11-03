import type { MetadataRoute } from "next";
import { getProjects } from "@/lib/projects";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://michelle-portfolio-system.vercel.app";
  const routes: MetadataRoute.Sitemap = [
    "",
    "/projects",
    "/services",
    "/about",
    "/contact",
  ].map((path) => ({ url: `${baseUrl}${path}`, lastModified: new Date() }));

  const projects = await getProjects();
  const projectRoutes: MetadataRoute.Sitemap = projects.map((p) => ({
    url: `${baseUrl}/projects/${p.slug}`,
    lastModified: new Date(),
  }));

  return [...routes, ...projectRoutes];
}



import projectsData from "@/content/projects.json";
import { headers } from "next/headers";

export type Project = {
  slug: string;
  title: string;
  description: string;
  pdf?: string;
  thumbnail?: string | null;
  tags?: string[];
  year?: number;
  body?: string; // optional HTML string for richer content
  diagramPath?: string; // optional path under public/ for a Mermaid .mmd file
};

const staticProjects: Project[] = projectsData as Project[];

export async function getProjects(): Promise<Project[]> {
  try {
    const h = headers();
    const host = h.get("x-forwarded-host") || h.get("host");
    const proto = h.get("x-forwarded-proto") || "https";
    const base = process.env.NEXT_PUBLIC_SITE_URL || (host ? `${proto}://${host}` : undefined);
    if (base) {
      const res = await fetch(`${base}/projects.json`, { cache: "no-store" });
      if (res.ok) return (await res.json()) as Project[];
    }
  } catch {}
  return staticProjects;
}

export async function getProjectBySlug(slug: string): Promise<Project | undefined> {
  const list = await getProjects();
  return list.find((p) => p.slug === slug);
}



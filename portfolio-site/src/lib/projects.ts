import projectsData from "@/content/projects.json";

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
  const base = process.env.NEXT_PUBLIC_SITE_URL;
  try {
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



import { getProjects } from "@/actions/projects";
import { getTechnologies } from "@/actions/technologies";
import { ProjectsCMS } from "@/components/admin/projects-cms";

export const metadata = {
  title: "Projects CMS",
};

export default async function AdminProjectsPage() {
  const [projects, technologies] = await Promise.all([
    getProjects(),
    getTechnologies(),
  ]);

  return <ProjectsCMS initialProjects={projects} allTechnologies={technologies} />;
}

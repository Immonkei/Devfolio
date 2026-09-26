import { getExperiences } from "@/actions/experience";
import { ExperienceCMS } from "@/components/admin/experience-cms";

export const metadata = {
  title: "Experience CMS",
};

export default async function AdminExperiencePage() {
  const experiences = await getExperiences();
  return <ExperienceCMS initialExperiences={experiences} />;
}

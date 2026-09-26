import { getEducation } from "@/actions/education";
import { EducationCMS } from "@/components/admin/education-cms";

export const metadata = {
  title: "Education CMS",
};

export default async function AdminEducationPage() {
  const education = await getEducation();
  return <EducationCMS initialEducation={education} />;
}

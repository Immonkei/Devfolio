import { getTechnologies } from "@/actions/technologies";
import { TechnologiesCMS } from "@/components/admin/technologies-cms";

export const metadata = {
  title: "Technologies CMS",
};

export default async function AdminTechnologiesPage() {
  const technologies = await getTechnologies();
  return <TechnologiesCMS initialTechnologies={technologies} />;
}

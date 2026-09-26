import { getProfile } from "@/actions/settings";
import { SettingsCMS } from "@/components/admin/settings-cms";

export const metadata = {
  title: "Profile & Settings CMS",
};

export default async function AdminSettingsPage() {
  const profile = await getProfile();
  return <SettingsCMS initialProfile={profile} />;
}

import { getProfile } from "@/actions/settings";
import { getKeepAliveStatus } from "@/actions/keep-alive";
import { SettingsCMS } from "@/components/admin/settings-cms";

export const metadata = {
  title: "Profile & System Settings",
};

export default async function AdminSettingsPage() {
  const [profile, keepAliveStatus] = await Promise.all([
    getProfile(),
    getKeepAliveStatus(),
  ]);

  return (
    <SettingsCMS
      initialProfile={profile}
      initialKeepAliveStatus={keepAliveStatus}
    />
  );
}

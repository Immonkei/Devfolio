import { PublicNavbar } from "@/components/public/navbar";
import { PublicFooter } from "@/components/public/footer";
import { TelemetryTracker } from "@/components/public/telemetry-tracker";
import { ThemeProvider } from "@/components/public/theme-provider";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <div className="flex min-h-screen flex-col bg-background">
        <TelemetryTracker />
        <PublicNavbar />
        <main className="flex-1">{children}</main>
        <PublicFooter />
      </div>
    </ThemeProvider>
  );
}

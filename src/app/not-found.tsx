import Link from "next/link";
import { Terminal, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center p-6 text-center">
      <div className="mx-auto max-w-md rounded-xl border border-border bg-card p-8">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-primary">
          <Terminal className="h-6 w-6" />
        </div>
        <div className="mb-2 font-mono text-sm tracking-widest text-primary uppercase">
          404 Error
        </div>
        <h1 className="mb-2 text-2xl font-bold tracking-tight text-foreground">
          Resource Not Found
        </h1>
        <p className="mb-6 text-sm text-muted-foreground">
          The requested endpoint or resource does not exist in this deployment.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 font-mono text-xs font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Return to Terminal Home
        </Link>
      </div>
    </div>
  );
}

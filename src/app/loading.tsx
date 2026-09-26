export default function RootLoading() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <span className="font-mono text-xs tracking-wider text-muted-foreground uppercase">
          Initializing Runtime...
        </span>
      </div>
    </div>
  );
}

export default function AdminLoading() {
  return (
    <div className="flex h-64 w-full items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-7 w-7 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <span className="font-mono text-xs text-muted-foreground">
          Querying Database...
        </span>
      </div>
    </div>
  );
}

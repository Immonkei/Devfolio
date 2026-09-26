"use client";

import { useState } from "react";
import { uploadMediaFile, deleteMediaItem } from "@/actions/media";
import { MediaItem } from "@/types";
import { Upload, Trash2, Copy, Check, File } from "lucide-react";

export function MediaCMS({ initialMedia }: { initialMedia: MediaItem[] }) {
  const [mediaList, setMediaList] = useState(initialMedia);
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", files[0]);

    try {
      const res = await uploadMediaFile(formData);
      if (!res.success) {
        setError(res.error || "File upload rejected.");
      } else if (res.data) {
        const newItem: MediaItem = {
          id: res.data.id || String(Date.now()),
          file_name: res.data.fileName,
          storage_path: res.data.url,
          file_type: files[0].type,
          file_size: files[0].size,
          bucket: "portfolio",
          created_at: new Date().toISOString(),
        };
        setMediaList([newItem, ...mediaList]);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Upload exception.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleCopy = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (id: string, storagePath: string) => {
    if (!confirm("Confirm deleting this asset permanently?")) return;
    const res = await deleteMediaItem(id, storagePath);
    if (res.success) {
      setMediaList(mediaList.filter((m) => m.id !== id));
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-mono text-2xl font-bold tracking-tight text-foreground">
            Media Asset Manager
          </h1>
          <p className="text-xs text-muted-foreground font-mono">
            Direct integration with Supabase Storage bucket: portfolio.
          </p>
        </div>

        <div>
          <label className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 font-mono text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer shadow-md">
            <Upload className="h-3.5 w-3.5" />
            <span>{uploading ? "Transmitting..." : "Upload Asset"}</span>
            <input
              type="file"
              onChange={handleFileUpload}
              disabled={uploading}
              className="hidden"
              accept="image/*,application/pdf"
            />
          </label>
        </div>
      </div>

      {error && (
        <div className="p-3 text-xs font-mono text-destructive bg-destructive/10 border border-destructive/30 rounded-lg">
          {error}
        </div>
      )}

      {/* Asset Grid */}
      {mediaList.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-16 text-center text-xs font-mono text-muted-foreground">
          No media assets uploaded yet. Upload images or resume PDFs above.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {mediaList.map((item) => {
            const isImage = item.file_type.startsWith("image/");
            return (
              <div
                key={item.id}
                className="group rounded-xl border border-border bg-card overflow-hidden flex flex-col justify-between"
              >
                {/* Preview Box */}
                <div className="h-40 bg-secondary/30 flex items-center justify-center overflow-hidden relative">
                  {isImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.storage_path}
                      alt={item.file_name}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <File className="h-10 w-10 text-primary" />
                      <span className="font-mono text-[10px]">Document / PDF</span>
                    </div>
                  )}
                </div>

                {/* Details & Actions */}
                <div className="p-4 space-y-3">
                  <div>
                    <div className="font-mono text-xs font-semibold text-foreground truncate" title={item.file_name}>
                      {item.file_name}
                    </div>
                    <div className="font-mono text-[10px] text-muted-foreground">
                      {(item.file_size / 1024).toFixed(1)} KB • {item.file_type.split("/")[1]?.toUpperCase()}
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-border/60 pt-2">
                    <button
                      onClick={() => handleCopy(item.id, item.storage_path)}
                      className="inline-flex items-center gap-1 font-mono text-[11px] text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                      title="Copy Public URL"
                    >
                      {copiedId === item.id ? (
                        <>
                          <Check className="h-3 w-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" />
                          <span>Copy URL</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleDelete(item.id, item.storage_path)}
                      className="text-muted-foreground hover:text-destructive transition-colors p-1"
                      title="Delete Asset"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

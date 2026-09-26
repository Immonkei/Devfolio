"use client";

import { useState } from "react";
import { updateMessageStatus, deleteContactMessage } from "@/actions/messages";
import { ContactMessage, MessageStatus } from "@/types";
import { Mail, Archive, Trash2, Calendar, User } from "lucide-react";
import { formatFullDate } from "@/lib/utils";

export function MessagesCMS({ initialMessages }: { initialMessages: ContactMessage[] }) {
  const [messages, setMessages] = useState(initialMessages);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(
    initialMessages[0] || null
  );

  const handleStatusChange = async (id: string, status: MessageStatus) => {
    const res = await updateMessageStatus(id, status);
    if (res.success) {
      setMessages(
        messages.map((m) => (m.id === id ? { ...m, status } : m))
      );
      if (selectedMessage?.id === id) {
        setSelectedMessage({ ...selectedMessage, status });
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Permanently delete this inquiry?")) return;
    const res = await deleteContactMessage(id);
    if (res.success) {
      const remaining = messages.filter((m) => m.id !== id);
      setMessages(remaining);
      if (selectedMessage?.id === id) {
        setSelectedMessage(remaining[0] || null);
      }
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-mono text-2xl font-bold tracking-tight text-foreground">
          Inbound Communications
        </h1>
        <p className="text-xs text-muted-foreground font-mono">
          Review, archive, and respond to direct technical consultations and employer inquiries.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Messages List */}
        <div className="rounded-xl border border-border bg-card lg:col-span-5 overflow-hidden">
          <div className="border-b border-border p-4 bg-secondary/30 font-mono text-xs text-muted-foreground">
            Messages ({messages.length})
          </div>

          <div className="divide-y divide-border/60 max-h-[600px] overflow-y-auto">
            {messages.length === 0 ? (
              <div className="p-8 text-center text-xs font-mono text-muted-foreground">
                Zero inbound inquiries logged.
              </div>
            ) : (
              messages.map((msg) => {
                const isSelected = selectedMessage?.id === msg.id;
                return (
                  <div
                    key={msg.id}
                    onClick={() => {
                      setSelectedMessage(msg);
                      if (msg.status === "NEW") {
                        handleStatusChange(msg.id, "READ");
                      }
                    }}
                    className={`p-4 transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-secondary"
                        : "hover:bg-secondary/40"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono font-bold text-xs text-foreground truncate">
                        {msg.name}
                      </span>
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
                          msg.status === "NEW"
                            ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                            : msg.status === "READ"
                            ? "bg-sky-500/10 text-sky-400"
                            : "bg-secondary text-muted-foreground"
                        }`}
                      >
                        {msg.status}
                      </span>
                    </div>
                    <div className="text-xs text-foreground font-medium truncate mb-1">
                      {msg.subject}
                    </div>
                    <div className="text-[11px] font-mono text-muted-foreground">
                      {new Date(msg.created_at).toLocaleDateString()}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Message Viewer */}
        <div className="rounded-xl border border-border bg-card lg:col-span-7 p-6 flex flex-col justify-between">
          {selectedMessage ? (
            <div className="space-y-6">
              <div className="flex items-start justify-between border-b border-border pb-4">
                <div>
                  <h2 className="text-lg font-bold text-foreground">
                    {selectedMessage.subject}
                  </h2>
                  <div className="mt-1 font-mono text-xs text-primary flex items-center gap-2">
                    <User className="h-3.5 w-3.5" />
                    <span>
                      {selectedMessage.name} &lt;{selectedMessage.email}&gt;
                    </span>
                  </div>
                  <div className="mt-1 font-mono text-[11px] text-muted-foreground flex items-center gap-2">
                    <Calendar className="h-3 w-3" />
                    <span>{formatFullDate(selectedMessage.created_at)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      handleStatusChange(
                        selectedMessage.id,
                        selectedMessage.status === "ARCHIVED" ? "READ" : "ARCHIVED"
                      )
                    }
                    className="p-2 rounded border border-border text-muted-foreground hover:text-foreground transition-colors"
                    title="Archive / Unarchive"
                  >
                    <Archive className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(selectedMessage.id)}
                    className="p-2 rounded border border-destructive/20 text-destructive hover:bg-destructive/10 transition-colors"
                    title="Delete Message"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Message Payload */}
              <div className="rounded-lg bg-secondary/30 p-4 font-mono text-xs leading-relaxed text-foreground whitespace-pre-wrap">
                {selectedMessage.message}
              </div>

              <div className="pt-4 border-t border-border">
                <a
                  href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(
                    selectedMessage.subject
                  )}`}
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 font-mono text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  <Mail className="h-3.5 w-3.5" />
                  <span>Reply via Email Client</span>
                </a>
              </div>
            </div>
          ) : (
            <div className="flex h-full items-center justify-center p-12 text-center text-xs font-mono text-muted-foreground">
              Select an inquiry on the left to read full payload.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

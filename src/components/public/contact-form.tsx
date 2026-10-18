"use client";

import { useState } from "react";
import { submitContactMessage } from "@/actions/messages";
import { Send, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    website: "", // Honeypot trap
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus("idle");
    setErrorMessage("");

    try {
      const res = await submitContactMessage(formData);
      if (res.success) {
        setStatus("success");
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
          website: "",
        });
      } else {
        setStatus("error");
        setErrorMessage(res.error || "Failed to send message.");
      }
    } catch {
      setStatus("error");
      setErrorMessage("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-card/70 p-6 sm:p-7 backdrop-blur-md">
      {status === "success" ? (
        <div className="flex flex-col items-center py-6 text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <h3 className="font-mono text-base font-bold text-foreground">
            Message Sent!
          </h3>
          <p className="mt-1.5 text-xs text-muted-foreground max-w-xs">
            Thank you for reaching out. I will get back to you as soon as possible.
          </p>
          <Button
            onClick={() => setStatus("idle")}
            variant="outline"
            size="sm"
            className="mt-5 font-mono text-xs"
          >
            Send Another Message
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {status === "error" && (
            <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span className="font-mono">{errorMessage}</span>
            </div>
          )}

          {/* Honeypot anti-spam field */}
          <div className="hidden" aria-hidden="true">
            <label htmlFor="website">Website</label>
            <input
              id="website"
              name="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label htmlFor="name" className="font-mono text-xs text-foreground font-medium">
                Name <span className="text-primary">*</span>
              </label>
              <Input
                id="name"
                required
                placeholder="Your name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="email" className="font-mono text-xs text-foreground font-medium">
                Email <span className="text-primary">*</span>
              </label>
              <Input
                id="email"
                type="email"
                required
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="subject" className="font-mono text-xs text-foreground font-medium">
              Subject <span className="text-primary">*</span>
            </label>
            <Input
              id="subject"
              required
              placeholder="What is this about?"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="message" className="font-mono text-xs text-foreground font-medium">
              Message <span className="text-primary">*</span>
            </label>
            <Textarea
              id="message"
              required
              rows={4}
              placeholder="Write your message here..."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full gap-2 font-mono text-xs cursor-pointer"
          >
            {loading ? (
              <>
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                <span>Sending...</span>
              </>
            ) : (
              <>
                <Send className="h-3.5 w-3.5" />
                <span>Send Message</span>
              </>
            )}
          </Button>
        </form>
      )}
    </div>
  );
}

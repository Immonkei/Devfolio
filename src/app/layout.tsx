import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "DevForge | Senior Software Engineer Portfolio",
    template: "%s | DevForge",
  },
  description:
    "Production-quality Software Engineer Portfolio showcasing architectural case studies, deep technical writeups, and full-stack systems engineering.",
  keywords: [
    "Software Engineer",
    "Full Stack Developer",
    "Systems Architect",
    "TypeScript",
    "Next.js",
    "Supabase",
    "PostgreSQL",
    "Distributed Systems",
  ],
  authors: [{ name: "Software Engineer" }],
  creator: "DevForge",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "DevForge",
    title: "DevForge | Senior Software Engineer Portfolio",
    description: "Production-grade portfolio, technical deep dives, and system architecture.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} dark`}>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased selection:bg-primary/20 selection:text-primary">
        {children}
      </body>
    </html>
  );
}

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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://devforge.minphanith.dev"),
  title: {
    default: "Min Phanith | Junior Full-Stack Developer · IT Engineering @ RUPP",
    template: "%s | Min Phanith",
  },
  description:
    "Portfolio of Min Phanith (Immonkei) — Junior Full-Stack Developer & IT Engineering student at RUPP. Building clean REST APIs, structured database schemas, and responsive modern web platforms.",
  keywords: [
    "Min Phanith",
    "Immonkei",
    "Full-Stack Developer",
    "Junior Web Developer",
    "IT Engineering",
    "Royal University of Phnom Penh",
    "RUPP",
    "React",
    "Next.js",
    "TypeScript",
    "Node.js",
    "Express.js",
    "PostgreSQL",
    "MongoDB",
    "FastAPI",
    "Cambodia Developer",
  ],
  authors: [{ name: "Min Phanith", url: "https://github.com/Immonkei" }],
  creator: "Min Phanith",
  icons: {
    icon: "/avatar.png",
    shortcut: "/avatar.png",
    apple: "/avatar.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Min Phanith Portfolio",
    title: "Min Phanith | Junior Full-Stack Developer · IT Engineering @ RUPP",
    description:
      "Junior Full-Stack Developer & IT Engineering student at RUPP. Explore interactive case studies, REST APIs, and modern web applications.",
    images: [
      {
        url: "/avatar.png",
        width: 800,
        height: 800,
        alt: "Min Phanith - Full-Stack Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Min Phanith | Junior Full-Stack Developer · IT Engineering @ RUPP",
    description:
      "Junior Full-Stack Developer & IT Engineering student at RUPP. Building clean REST APIs, structured database schemas, and responsive web platforms.",
    images: ["/avatar.png"],
    creator: "@minphanith",
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

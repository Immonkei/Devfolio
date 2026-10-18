import { ProjectWithTechnologies, Technology } from "@/types";
import { STANDARD_TECHNOLOGIES } from "@/lib/tech-icons";

// Helper to look up technology by name
function getTech(name: string): Technology {
  const found = STANDARD_TECHNOLOGIES.find(
    (t) => t.name.toLowerCase() === name.toLowerCase()
  );
  return {
    id: `tech-${name.toLowerCase().replace(/[^a-z0-9]/g, "-")}`,
    name: found?.name || name,
    category: found?.category || "TOOL",
    icon: found?.icon || "code",
    created_at: "2026-01-01T00:00:00Z",
  };
}

export const STANDARD_PROJECTS: ProjectWithTechnologies[] = [
  {
    id: "40000000-0000-0000-0000-000000000001",
    title: "EaseLife - Personal Productivity System",
    slug: "easelife",
    short_description:
      "A personal productivity web app built with Next.js, Tailwind CSS, and Supabase to organize goals, projects, and daily habits.",
    description:
      "EaseLife helps you connect daily tasks directly to your long-term goals. It breaks large milestones down into actionable projects and daily habits with live progress tracking and streak analytics.",
    problem:
      "Most to-do apps keep daily tasks disconnected from long-term goals, making it hard to track meaningful progress.",
    solution:
      "Built a clear hierarchy connecting Vision, Goals, Projects, and Daily Habits with real-time progress calculations.",
    architecture:
      "Next.js App Router frontend, Tailwind CSS, and Supabase PostgreSQL with Row Level Security (RLS).",
    implementation:
      "Weighted project progress tracking, daily habit checkboxes, streak calculations, and optimistic UI updates.",
    challenges:
      "Handling habit completion dates and streak calculations accurately across multiple time zones.",
    tradeoffs:
      "Calculated completion percentages dynamically on request to guarantee consistent data without sync conflicts.",
    results:
      "Fast, responsive app that keeps goals organized with zero multi-device lag.",
    cover_image_url: "/projects/easelife.svg",
    github_url: "https://github.com/Immonkei/EaseLife",
    live_url: null,
    featured: true,
    status: "PUBLISHED",
    display_order: 1,
    created_at: "2026-09-01T00:00:00Z",
    updated_at: "2026-09-27T00:00:00Z",
    technologies: [
      getTech("Next.js"),
      getTech("TypeScript"),
      getTech("Tailwind CSS"),
      getTech("PostgreSQL"),
      getTech("Docker"),
    ],
  },
  {
    id: "40000000-0000-0000-0000-000000000002",
    title: "Borejak - Blood Donation Platform",
    slug: "borejak",
    short_description:
      "A web platform connecting volunteer blood donors with hospitals, featuring donor screening and appointment booking.",
    description:
      "Borejak simplifies blood donation by connecting donors directly with hospitals in need. Donors can check eligibility through a simple health questionnaire, book appointments, and hospitals can manage urgent requests.",
    problem:
      "Blood donation campaigns suffer from slow manual paperwork and fragmented emergency communication with hospitals.",
    solution:
      "Built an online pre-screening questionnaire and real-time appointment scheduling system for donors and medical staff.",
    architecture:
      "Next.js full-stack architecture with REST API endpoints, PostgreSQL database, and role-based permissions.",
    implementation:
      "Donor appointment scheduling, hospital blood request queues, eligibility verification logic, and admin review interfaces.",
    challenges:
      "Ensuring donor medical questionnaire responses remain private and secure.",
    tradeoffs:
      "Selected PostgreSQL over NoSQL to ensure strict transaction safety for blood requests and appointments.",
    results:
      "Streamlined donor check-ins, less paperwork, and reliable hospital emergency coordination.",
    cover_image_url: "/projects/borejak.svg",
    github_url: "https://github.com/Immonkei/Borejak",
    live_url: null,
    featured: true,
    status: "PUBLISHED",
    display_order: 2,
    created_at: "2026-08-01T00:00:00Z",
    updated_at: "2026-09-27T00:00:00Z",
    technologies: [
      getTech("Next.js"),
      getTech("Node.js"),
      getTech("Express.js"),
      getTech("PostgreSQL"),
      getTech("Tailwind CSS"),
    ],
  },
  {
    id: "40000000-0000-0000-0000-000000000003",
    title: "UNSAID - Anonymous Expression Platform",
    slug: "unsaid",
    short_description:
      "A minimal, safe web space for sharing anonymous thoughts, reflections, and confessions with built-in moderation.",
    description:
      "UNSAID offers a judgment-free space for honest, anonymous expression. Users can submit unspoken thoughts safely with spam protection and an admin moderation queue.",
    problem:
      "People often need a safe space to share personal thoughts without social media pressure, follower counts, or profile visibility.",
    solution:
      "Created an anonymous submission platform with automated spam filters and an admin review workflow.",
    architecture:
      "Next.js frontend with Node.js and Express backend using PostgreSQL and Prisma ORM.",
    implementation:
      "Zod schema validation, admin dashboard with JWT authentication, spam throttling, and Meta Graph API auto-publishing.",
    challenges:
      "Preventing spam and abusive content while strictly never tracking user IP addresses.",
    tradeoffs:
      "Added an admin review step before publishing to keep content safe and constructive.",
    results:
      "Safe, privacy-focused platform that protects user identity with zero tracking.",
    cover_image_url: "/projects/unsaid.svg",
    github_url: "https://github.com/Immonkei/UNSAID",
    live_url: null,
    featured: true,
    status: "PUBLISHED",
    display_order: 3,
    created_at: "2026-07-01T00:00:00Z",
    updated_at: "2026-09-27T00:00:00Z",
    technologies: [
      getTech("Next.js"),
      getTech("TypeScript"),
      getTech("Node.js"),
      getTech("Express.js"),
      getTech("PostgreSQL"),
      getTech("Docker"),
    ],
  },
  {
    id: "40000000-0000-0000-0000-000000000004",
    title: "ReanHub - Academic LMS",
    slug: "reanhub",
    short_description:
      "A learning management portal for course materials, assignments, and student submissions with role-based access.",
    description:
      "ReanHub provides universities and schools with a clean web portal to manage courses, upload homework assignments, and submit student work.",
    problem:
      "Handling courses, assignment files, and grading across emails and chat groups causes confusion and lost files.",
    solution:
      "Designed an intuitive LMS with clear role separation for students, instructors, and administrators.",
    architecture:
      "React frontend with an Express and MongoDB backend using Mongoose models and JWT authentication.",
    implementation:
      "Course creation tools, file uploaders for assignments, and student grade tracking tables with Tailwind CSS.",
    challenges:
      "Enforcing assignment submission deadlines consistently across different client timezones.",
    tradeoffs:
      "Used MongoDB to easily store different course formats and varied homework question types.",
    results:
      "Clean, modular codebase with intuitive workflows for both students and instructors.",
    cover_image_url: "/projects/reanhub.svg",
    github_url: "https://github.com/Immonkei/OOAD-Project-ReanHub-",
    live_url: null,
    featured: true,
    status: "PUBLISHED",
    display_order: 4,
    created_at: "2026-06-01T00:00:00Z",
    updated_at: "2026-09-27T00:00:00Z",
    technologies: [
      getTech("React"),
      getTech("TypeScript"),
      getTech("Node.js"),
      getTech("Express.js"),
      getTech("MongoDB"),
      getTech("Tailwind CSS"),
    ],
  },
  {
    id: "40000000-0000-0000-0000-000000000005",
    title: "Tos-Nham - Restaurant Management API",
    slug: "tos-nham-api",
    short_description:
      "A REST API for multi-branch restaurant management, table reservations, deposit calculations, and QR check-in.",
    description:
      "Tos-Nham powers daily operations for restaurants with multiple branches. It handles menu categories, table bookings with deposit calculations, and QR codes for customer arrival check-in.",
    problem:
      "Multi-branch restaurants struggle with fragmented reservation logs, inconsistent deposits, and slow front-of-house check-ins.",
    solution:
      "Built a centralized REST API with branch-level filtering, automatic deposit calculations, and QR arrival tokens.",
    architecture:
      "Express.js REST API with JWT authentication, role checks, image upload handling, and PostgreSQL database.",
    implementation:
      "Branch-filtered menu endpoints, reservation deposit processing, and QR code verification routes.",
    challenges:
      "Preventing double-booking during peak dining hours across different branches.",
    tradeoffs:
      "Managed all branches in a single database partitioned by branch ID to reduce server costs and complexity.",
    results:
      "Fast, dependable API with response times under 40ms for menu loading and booking verification.",
    cover_image_url: "/projects/tos-nham-api.svg",
    github_url: "https://github.com/Immonkei/Tos-Nham-backend",
    live_url: null,
    featured: false,
    status: "PUBLISHED",
    display_order: 5,
    created_at: "2026-05-01T00:00:00Z",
    updated_at: "2026-09-27T00:00:00Z",
    technologies: [
      getTech("Node.js"),
      getTech("Express.js"),
      getTech("PostgreSQL"),
      getTech("JWT"),
      getTech("Docker"),
      getTech("REST API design"),
    ],
  },
  {
    id: "40000000-0000-0000-0000-000000000006",
    title: "Daymark - Habit & Goal Tracker PWA",
    slug: "daymark",
    short_description:
      "A clean Progressive Web App for tracking daily habits, building streaks, and staying productive offline or online.",
    description:
      "Daymark is a simple, distraction-free habit tracker built to work seamlessly on mobile and desktop. Powered by Next.js and Supabase, it gives you quick daily checkboxes, streak statistics, and monthly progress charts.",
    problem:
      "Many habit apps are bloated, slow to open on mobile, and lose your progress when you lose internet connection.",
    solution:
      "Built a lightweight Progressive Web App with offline caching, instant local state updates, and background sync.",
    architecture:
      "Next.js App Router client architecture, Tailwind CSS, Lucide icons, and Supabase PostgreSQL with Row Level Security.",
    implementation:
      "Service worker offline caching, one-tap habit toggles, streak calculation algorithms, and habit completion charts.",
    challenges:
      "Syncing offline habit timestamps accurately when the device reconnects to the network.",
    tradeoffs:
      "Prioritized instant local UI response over waiting for network calls so checking off habits feels instant.",
    results:
      "Instant startup time and reliable offline capability across mobile and desktop devices.",
    cover_image_url: "/projects/daymark.svg",
    github_url: "https://github.com/Immonkei/Daymark",
    live_url: null,
    featured: false,
    status: "PUBLISHED",
    display_order: 6,
    created_at: "2026-04-01T00:00:00Z",
    updated_at: "2026-09-27T00:00:00Z",
    technologies: [
      getTech("Next.js"),
      getTech("TypeScript"),
      getTech("Tailwind CSS"),
      getTech("PostgreSQL"),
    ],
  },
  {
    id: "40000000-0000-0000-0000-000000000007",
    title: "Recipe Finder - Android App",
    slug: "recipe-finder-android",
    short_description:
      "A native Android app to search food recipes, inspect cooking steps, and save favorite meals offline.",
    description:
      "Recipe Finder helps you discover new meals, read step-by-step cooking instructions, and save favorite recipes locally on your phone using modern Android design.",
    problem:
      "Cooks need fast recipe lookups with offline access when cooking in kitchens with poor Wi-Fi.",
    solution:
      "Engineered a native Android application using MVVM architecture with Room SQLite database for offline caching.",
    architecture:
      "Android Native app with Kotlin, Jetpack Compose declarative UI, MVVM pattern, Retrofit HTTP client, and Room Database.",
    implementation:
      "Composable UI screens, recipe search API integration with Coroutines, and local bookmarks database.",
    challenges:
      "Managing UI states smoothly between network loading, empty search results, and local SQLite data.",
    tradeoffs:
      "Used modern Jetpack Compose instead of legacy XML views to build a faster, cleaner interface.",
    results:
      "Smooth 60fps UI performance and full offline access to saved recipes.",
    cover_image_url: "/projects/campus-mobile-companion.svg",
    github_url: "https://github.com/Immonkei/recipe-app-android-M2-MinPhanith",
    live_url: null,
    featured: false,
    status: "PUBLISHED",
    display_order: 7,
    created_at: "2026-03-01T00:00:00Z",
    updated_at: "2026-09-27T00:00:00Z",
    technologies: [
      getTech("Java"),
      getTech("Git"),
      getTech("GitHub"),
      getTech("REST API design"),
    ],
  },
  {
    id: "40000000-0000-0000-0000-000000000008",
    title: "CipherVerse - Cryptography Explorer",
    slug: "cipherverse",
    short_description:
      "An interactive web visualizer to demonstrate RSA key generation, modular math, and encryption algorithms.",
    description:
      "CipherVerse is an interactive learning tool that breaks down public-key cryptography step-by-step. Users can generate primes, calculate keys, and test encryption in real time.",
    problem:
      "Cryptography concepts like RSA and modular math can feel abstract and difficult to grasp without step-by-step visual examples.",
    solution:
      "Built an interactive visualizer that walks users through prime selection, key pair generation, and message encryption.",
    architecture:
      "Client-side React and TypeScript application using native BigInt for precision math, styled with Tailwind CSS.",
    implementation:
      "Pure TypeScript RSA algorithms, animated step cards, and interactive plaintext-to-ciphertext demos.",
    challenges:
      "Calculating large numbers quickly in the browser without freezing the user interface.",
    tradeoffs:
      "Executed all calculations in the browser using native BigInt to eliminate server costs and network delays.",
    results:
      "Clear, interactive learning tool used by students to understand encryption principles.",
    cover_image_url: "/projects/cipherverse.svg",
    github_url: "https://github.com/Immonkei/RSA-Project-Web",
    live_url: null,
    featured: false,
    status: "PUBLISHED",
    display_order: 8,
    created_at: "2026-02-01T00:00:00Z",
    updated_at: "2026-09-27T00:00:00Z",
    technologies: [
      getTech("React"),
      getTech("TypeScript"),
      getTech("Tailwind CSS"),
      getTech("Vite"),
    ],
  },
];

export function getStandardProjectBySlug(slug: string): ProjectWithTechnologies | undefined {
  return STANDARD_PROJECTS.find((p) => p.slug.toLowerCase() === slug.toLowerCase());
}

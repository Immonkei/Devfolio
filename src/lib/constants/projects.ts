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
    title: "EaseLife - Production Personal Operating System",
    slug: "easelife",
    short_description:
      "A production-grade personal operating system built with Next.js 16, Tailwind CSS v4, and Supabase featuring visible lineage architecture and dynamic pace engines.",
    description:
      "EaseLife grounds daily concrete execution in high-level purpose via an unbroken hierarchy: Vision -> Goal -> Milestone -> Project -> Task/Habit. The application features zero-redundancy mathematically derived progress calculations, real-time pace deltas, and timezone-normalized immutable habit completion tracking.",
    problem:
      "Daily productivity systems suffer from fragmented task tracking where atomic to-dos become disconnected from long-term goals, and arbitrary streak counters fail across timezone shifts.",
    solution:
      "Engineered Visible Lineage Architecture providing an inspectable relational drawer for any task, backed by real-time mathematical progress engines and midday-normalized date logs.",
    architecture:
      "Next.js 16 App Router full-stack architecture with Turbopack, Tailwind CSS v4, and Supabase PostgreSQL with strict Row Level Security (RLS) policies and Task XOR ownership constraints.",
    implementation:
      "Implemented atomic weighted project progress formulas, real-time pace deltas (On Track, At Risk, Off Track), optimistic UI mutations, and immutable habit completion event logs.",
    challenges:
      "Normalizing date-stamped completion logs across midnight and DST boundaries without introducing distributed lock latency.",
    tradeoffs:
      "Computing project completion percentages dynamically on request rather than storing denormalized counts to guarantee absolute data consistency.",
    results:
      "Delivered sub-30ms client interactions with zero desynchronization across multi-device usage.",
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
    title: "Borejak - Blood Donation System",
    slug: "borejak",
    short_description:
      "An integrated blood donation platform featuring automated donor eligibility verification, administrative triage dashboards, and emergency request dispatch.",
    description:
      "Borejak is a production-style healthcare application connecting volunteer blood donors with medical facilities in urgent need. Built using Next.js and Node.js with PostgreSQL, the platform streamlines the donor lifecycle from medical pre-screening questionnaires to appointment confirmation and hospital inventory oversight.",
    problem:
      "Blood donation initiatives encounter high attrition due to confusing manual health eligibility criteria and disconnected hospital emergency dispatch queues.",
    solution:
      "Engineered an automated multi-step clinical evaluation questionnaire that calculates donor eligibility before appointment scheduling, reducing triage overhead.",
    architecture:
      "Next.js modular full-stack architecture with RESTful API handlers, PostgreSQL relational data persistence, and role-based access control.",
    implementation:
      "Implemented donor appointment scheduling, hospital blood request dispatch queues, health eligibility verification logic, and administrative triage interfaces.",
    challenges:
      "Handling edge cases in medical questionnaire expiration and ensuring strict patient data confidentiality.",
    tradeoffs:
      "Selected relational PostgreSQL over NoSQL to maintain strict ACID compliance on critical blood inventory records and hospital request queues.",
    results:
      "Successfully validated donor flows, decreased pre-screening friction, and established structured emergency request protocols.",
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
      "A safe, minimal anonymous emotional expression platform with automated content moderation, report queues, and Meta Graph API auto-publishing.",
    description:
      "UNSAID provides an anonymous outlet where users can safely submit thoughts, confessions, and unspoken reflections. Features two-tier content moderation, rate-limiting security, and automated webhook publishers to social channels.",
    problem:
      "People lack safe, privacy-preserving digital spaces to voice vulnerable emotional thoughts without social algorithmic pressure or toxic feedback.",
    solution:
      "Constructed a minimal anonymous submission platform with automated sentiment checks, admin review workflows, and automated Meta Graph API publishing.",
    architecture:
      "Next.js App Router frontend with React 19 coupled to an Express and TypeScript backend utilizing PostgreSQL and Prisma ORM.",
    implementation:
      "Implemented Zod validation schemas, BCrypt & JWT admin authentication, spam throttling middleware, and Meta Graph API webhook dispatchers.",
    challenges:
      "Filtering malicious content and automated spam while preserving absolute user anonymity with zero IP or tracking log retention.",
    tradeoffs:
      "Implemented queue-based moderation review over instant unmoderated publishing to guarantee community safety and prevent harassment.",
    results:
      "Successfully processed anonymous submissions with zero identifiable user metadata leakage.",
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
      "A full-stack LMS applying Object-Oriented Analysis & Design (OOAD) with role-based access for students, instructors, and administrators.",
    description:
      "ReanHub provides academic institutions with an organized digital portal for managing courses, tracking assignments, and reviewing student submissions. Designed applying Object-Oriented Analysis & Design (OOAD) principles to maximize modularity and maintainability.",
    problem:
      "Educational workflows involve complex hierarchies (instructors, courses, modules, assignments, submissions) that become unmaintainable when built without strict software architecture.",
    solution:
      "Applied Object-Oriented Analysis & Design (OOAD) to define clear entity boundaries, abstract data access layers, and separation of concerns.",
    architecture:
      "React frontend coupled with an Express and MongoDB backend, utilizing Mongoose models and JWT authentication middleware.",
    implementation:
      "Constructed intuitive course creation portals, assignment submission file uploaders, and grade evaluation interfaces with Tailwind CSS.",
    challenges:
      "Enforcing strict submission deadline locks across differing client timezones.",
    tradeoffs:
      "Opted for document-oriented MongoDB schema design to easily store heterogeneous assignment questions and variable course metadata.",
    results:
      "Delivered clean modular codebase with high reusability across student and instructor modules.",
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
      "A resilient Node.js Express backend supporting multi-branch restaurant operations, QR token arrival verification, table reservations, and orders.",
    description:
      "A high-performance restaurant operations backend supporting customer, staff, and admin roles. Features multi-branch isolation, dynamic menu categorization, table booking with deposit calculations, and unique QR token generation for customer arrival verification.",
    problem:
      "Multi-branch restaurants struggle with fragmented reservation systems, inconsistent deposit tracking, and chaotic front-of-house guest check-ins.",
    solution:
      "Engineered a centralized REST API architecture featuring branch-scoped database queries, automated 50% deposit calculations, and QR arrival tokens.",
    architecture:
      "Express.js modular routing layer with middleware interceptors for JWT token validation, role-based access control, Multer image upload handling, and Docker containerization.",
    implementation:
      "Implemented secure JWT authentication, multi-branch query filters, automated reservation deposit computation, and QR code token verification endpoints.",
    challenges:
      "Ensuring transactional consistency during peak-hour simultaneous table reservation attempts across multiple restaurant branches.",
    tradeoffs:
      "Scoped all database operations by branch_id rather than running separate microservices per branch to minimize infrastructure complexity and maintenance costs.",
    results:
      "Achieved reliable sub-40ms response times across branch menu lookups and reservation dispatch.",
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
    title: "Daymark - Habit & Goal Tracking PWA",
    slug: "daymark",
    short_description:
      "A client-driven Progressive Web App for daily habit tracking, streak preservation, and productivity workflows built with Next.js and Supabase.",
    description:
      "Daymark delivers a distraction-free habit and goal tracker designed as an offline-first Progressive Web App. Backed by Supabase and Next.js, it provides instant responsiveness, streak analysis, and visual habit heatmaps.",
    problem:
      "Habit tracker apps often feel bloated, slow to open on mobile devices, and lack reliable offline sync when habits are logged without connectivity.",
    solution:
      "Built a lightweight Progressive Web App utilizing client-side state caching, optimistic UI updates, and background synchronization.",
    architecture:
      "Next.js App Router client-driven architecture with Tailwind CSS, Lucide icons, and Supabase PostgreSQL with Row Level Security.",
    implementation:
      "Implemented service worker offline caching, habit completion toggle logic, streak calculation algorithms, and habit completion history graphs.",
    challenges:
      "Accurate local streak reconciliation when offline client timestamps sync back to the server.",
    tradeoffs:
      "Prioritized ultra-fast client-side state transitions over heavy server-side validation during daily checkbox logging.",
    results:
      "Instant mobile startup time and offline capability across desktop and mobile devices.",
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
    title: "Recipe Finder - Android Native App",
    slug: "recipe-finder-android",
    short_description:
      "A modern Android application developed with Kotlin and Jetpack Compose implementing MVVM architecture, Retrofit REST client, and Room Database.",
    description:
      "A native Android application designed to discover recipes, inspect culinary instructions, and save favorite meals. Developed following modern Android architectural guidelines with Kotlin, Jetpack Compose, Retrofit, Coroutines, and Room local persistence.",
    problem:
      "Users need rapid recipe discovery with offline access to saved ingredients and preparation steps when cooking without stable internet.",
    solution:
      "Engineered a clean Android application using MVVM architecture with Room Database local cache synchronization.",
    architecture:
      "Android Native application utilizing Kotlin, Jetpack Compose declarative UI, MVVM design pattern, Retrofit HTTP client, and Room SQLite database.",
    implementation:
      "Built composable UI layouts, asynchronous recipe search queries with Kotlin Coroutines, and Room Database DAO repositories for favorites persistence.",
    challenges:
      "Managing complex state transitions between network loading, empty search results, and local SQLite database queries.",
    tradeoffs:
      "Adopted Jetpack Compose over legacy Android XML views to accelerate UI development and ensure declarative unidirectional data flow.",
    results:
      "Smooth 60fps UI performance and offline access to saved recipes.",
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
      "An interactive cryptography visualization application demonstrating RSA key pair generation, modular arithmetic, and encryption algorithms.",
    description:
      "An educational web laboratory built with React and TypeScript to deconstruct asymmetric cryptography, RSA key generation, modular exponentiation, and digital signatures.",
    problem:
      "Public-key cryptography concepts can feel abstract without step-by-step mathematical visualization.",
    solution:
      "Engineered an interactive step-by-step visualizer breaking down prime generation, Euler totient calculation, modular inverses, and encryption/decryption mathematics.",
    architecture:
      "Client-side TypeScript application utilizing arbitrary-precision BigInt arithmetic and Tailwind CSS.",
    implementation:
      "Implemented pure TypeScript RSA mathematical functions, key visualization cards, and interactive plaintext-to-ciphertext transformations.",
    challenges:
      "Precision handling of large prime calculations and modular math within the browser JavaScript runtime.",
    tradeoffs:
      "Executed all calculations on the client side using native BigInt to eliminate backend latency.",
    results:
      "Created a comprehensive visual teaching tool for computer network security and cryptography students.",
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

# DevForge — Dynamic Full-Stack Software Engineer Portfolio & CMS

[![CI Pipeline](https://github.com/Immonkei/Devfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/Immonkei/Devfolio/actions/workflows/ci.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL%20%2B%20Auth-3ECF8E?style=flat-square&logo=supabase)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Vitest](https://img.shields.io/badge/Vitest-v5-FCC72B?style=flat-square&logo=vitest)](https://vitest.dev/)

> **DevForge** is a dynamic, high-craft software engineering portfolio platform demonstrating full-stack engineering proficiency.
> 
> Core Principle: **"Portfolio content is data, not code."**
> Zero hardcoded project cards, static work histories, or hardcoded skill lists. All portfolio content is modeled relationally in PostgreSQL, protected with Row-Level Security (RLS), and managed through an authenticated Admin CMS with instant live revalidation.

---

## 🏛 Architecture Overview

```
                                  +-----------------------------+
                                  |     Vercel Edge Network     |
                                  +--------------+--------------+
                                                 |
                       +-------------------------+-------------------------+
                       |                                                   |
              (Public Visitors)                                     (Admin Session)
                       |                                                   |
                       v                                                   v
        +-----------------------------+                     +-----------------------------+
        |  Next.js 16 App Router      |                     |  Admin CMS Dashboard        |
        |  - ISR / Statically Rendered|                     |  - Supabase Auth Cookies    |
        |  - React 19 Server Comps    |                     |  - Server Action Mutations  |
        |  - Tailwind CSS v4 Theme    |                     |  - Storage Upload Pipeline  |
        +--------------+--------------+                     +--------------+--------------+
                       |                                                   |
                       +-------------------------+-------------------------+
                                                 |
                                                 v
                                  +-----------------------------+
                                  |   Supabase Cloud / Local    |
                                  |   - PostgreSQL (13 Tables)  |
                                  |   - Row-Level Security (RLS)|
                                  |   - Storage Bucket: portfolio|
                                  |   - GoTrue Auth             |
                                  +-----------------------------+
```

### Key Engineering Features
- **Next.js 16 App Router & React 19**: Modern Server Components architecture, static generation for public pages, and authenticated dynamic server routes for the CMS.
- **Relational PostgreSQL Schema (13 tables)**: Profiles, projects, technologies, project technologies junction, experiences, education, categories, posts, post categories junction, contact messages, media items, page views, and telemetry events.
- **Strict Row-Level Security (RLS)**: Public read access for published records; write/mutate access strictly locked to authenticated admin users (`auth.uid() = id`).
- **Authenticated Admin CMS**: Full CRUD interfaces for projects, experience history, education records, tech stacks, markdown engineering notes, message inbox, and media uploads.
- **GitHub API Integration**: Live commit and repository telemetry with Next.js revalidation cache and graceful fallback.
- **Privacy-First Analytics Engine**: In-house page view and click telemetry tracking without third-party tracking cookies or external scripts.
- **High-Craft UI/UX**: Dark developer terminal aesthetic with glowing accents, monospace typographic accents, fluid responsive layouts, keyboard accessibility, and micro-interactions.

---

## 📁 Repository Structure

```
├── .github/
│   ├── workflows/ci.yml             # Automated CI pipeline (lint, typecheck, test, build)
│   └── pull_request_template.md     # Standardized PR checklist
├── public/                          # Static assets and favicons
├── src/
│   ├── actions/                     # Next.js Server Actions (CMS CRUD mutations)
│   │   ├── projects.ts
│   │   ├── experience.ts
│   │   ├── education.ts
│   │   ├── technologies.ts
│   │   ├── posts.ts
│   │   ├── messages.ts
│   │   ├── media.ts
│   │   └── settings.ts
│   ├── app/
│   │   ├── (public)/                # Public portfolio routes (Home, About, Projects, Notes, etc.)
│   │   ├── admin/                   # Admin CMS routes (Dashboard, Projects, Experience, Media, etc.)
│   │   ├── api/                     # Server endpoints (/api/contact, /api/github)
│   │   ├── layout.tsx               # Root application shell
│   │   ├── sitemap.ts               # Automated dynamic XML sitemap
│   │   └── robots.ts                # Crawler indexing directives
│   ├── components/
│   │   ├── admin/                   # CMS management components & forms
│   │   ├── public/                  # Public cards, navigation, hero, and feeds
│   │   └── ui/                      # Reusable UI primitives (Button, Card, Badge, etc.)
│   ├── lib/
│   │   ├── supabase/                # SSR client, server client, and session proxy
│   │   ├── validations/             # Zod schemas for all forms and actions
│   │   ├── analytics.ts             # Privacy-first telemetry recorder
│   │   ├── github/client.ts         # GitHub public repository fetcher
│   │   └── utils.ts                 # Utility functions (slugify, readingTime, formatDate, cn)
│   └── types/                       # TypeScript relational definitions and database mapping
├── supabase/
│   ├── migrations/                  # Versioned DDL migration scripts
│   └── seed.sql                     # Senior engineering profile & case study seed data
├── vitest.config.mts                # Vitest test configuration
├── vitest.setup.ts                  # Testing library environment matchers
└── package.json
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: `v20.x` or higher
- **npm**: `v10.x` or higher
- **Supabase Account / CLI**: Local or Cloud Supabase project

### 2. Installation
```bash
git clone https://github.com/Immonkei/Devfolio.git
cd Devfolio
npm install --legacy-peer-deps
```

### 3. Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Fill in your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
GITHUB_ACCESS_TOKEN=your-optional-github-pat
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4. Database Initialization
Run the DDL migration in your Supabase SQL editor or via Supabase CLI:
```bash
# Apply schema
supabase db push
# Or run contents of supabase/migrations/20260926000000_devforge_schema.sql

# Seed data (optional)
# Run contents of supabase/seed.sql
```

### 5. Running Dev Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the public portfolio.
Open [http://localhost:3000/admin/login](http://localhost:3000/admin/login) to log into the Admin CMS.

---

## 🧪 Testing & Quality Gates

DevForge enforces strict code quality and test coverage before any code is merged into `develop` or `main`.

```bash
# Run TypeScript compilation check
npx tsc --noEmit

# Run ESLint check
npm run lint

# Run unit and component test suite (Vitest)
npm test

# Run tests in watch mode
npm run test:watch

# Execute production build verification
npm run build
```

---

## 🔄 Git Branching Model & CI/CD

This repository follows a strict Git Flow model:
- `main`: Production-ready releases only. Every commit represents a stable deployment.
- `develop`: Integration branch where feature branches are merged after passing CI.
- `feat/*`: Feature branches isolated for specific functional deliverables.
- `fix/*`: Bug fixes.

Every Pull Request automatically triggers the GitHub Actions CI pipeline:
1. TypeScript strict typecheck (`tsc --noEmit`)
2. ESLint linting (`npm run lint`)
3. Vitest test runner (`npm test`)
4. Production bundle compilation (`npm run build`)

---

## 📜 License
MIT License. Built with craft and precision.

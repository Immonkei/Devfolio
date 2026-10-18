# DevForge — Dynamic Full-Stack Software Engineer Portfolio & CMS

[![CI Pipeline](https://github.com/Immonkei/Devfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/Immonkei/Devfolio/actions/workflows/ci.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL%20%2B%20Auth-3ECF8E?style=flat-square&logo=supabase)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Vitest](https://img.shields.io/badge/Vitest-v5-FCC72B?style=flat-square&logo=vitest)](https://vitest.dev/)

> **DevForge** is a dynamic, high-craft developer portfolio and content management platform built by **Min Phanith** (IT Engineering student at Royal University of Phnom Penh).
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
        |  - Dark / Light Mode System |                     |  - Split Live Preview CMS   |
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
- **Clean Dark & Light Mode System**: Accessible, flicker-free theme switching with automatic system preference detection and local storage persistence.
- **Reliable CV Download Route (`/api/resume/download`)**: Direct streaming route with proper `Content-Disposition: attachment` headers, local PDF fallback, and HTTP caching headers (`Cache-Control: public, max-age=3600`).
- **Modern Technical Engineering Notes**:
  - Full-featured Markdown renderer with GitHub alert callouts (`[!NOTE]`, `[!TIP]`, `[!WARNING]`, `[!IMPORTANT]`, `[!CAUTION]`), multi-image grids, zoom lightbox modals, 1-click code copying, and tables.
  - Interactive Table of Contents (TOC) with scroll-aware anchor links and reading progress indicator.
  - Searchable notes directory with instant client-side filtering.
- **Authenticated Admin CMS**:
  - Full CRUD interfaces for projects, experience history, education records, tech stacks, and engineering notes.
  - Batch multi-image uploader directly to Supabase Storage with instant Markdown snippet insertion.
  - Split-pane live Markdown preview editor and dynamic tag creation.
- **Privacy-First Analytics Engine**: In-house page view and click telemetry tracking without third-party tracking cookies or external scripts.
- **GitHub API Integration**: Live commit and repository telemetry with Next.js revalidation cache and graceful fallback.

---

## 📁 Repository Structure

```
├── .github/
│   ├── workflows/ci.yml             # Automated CI pipeline (lint, typecheck, test, build)
│   └── pull_request_template.md     # Standardized PR checklist
├── public/                          # Static assets, SVG diagrams, and resume.pdf
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
│   │   ├── (public)/                # Public portfolio routes (Home, About, Projects, Notes, Contact)
│   │   │   ├── notes/[slug]/        # Detailed engineering note with TOC & reading progress
│   │   │   └── notes/               # Searchable engineering notes directory
│   │   ├── admin/                   # Admin CMS routes (Dashboard, Projects, Experience, Media, etc.)
│   │   ├── api/                     # Server endpoints (/api/contact, /api/github, /api/resume/download)
│   │   ├── layout.tsx               # Root application shell with ThemeProvider
│   │   ├── sitemap.ts               # Automated dynamic XML sitemap
│   │   └── robots.ts                # Crawler indexing directives
│   ├── components/
│   │   ├── admin/                   # CMS management components & forms
│   │   ├── public/                  # Public cards, navigation, hero, TOC, and feeds
│   │   └── ui/                      # Reusable UI primitives (Button, Card, Badge, Input, etc.)
│   ├── lib/
│   │   ├── supabase/                # SSR client, server client, and session proxy
│   │   ├── validations/             # Zod schemas for all forms and actions
│   │   ├── analytics.ts             # Privacy-first telemetry recorder
│   │   ├── github/client.ts         # GitHub public repository fetcher
│   │   └── utils.ts                 # Utility functions (readingTime, formatDate, slugify, cn)
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

Fill in your configuration:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
GITHUB_ACCESS_TOKEN=your-optional-github-pat
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4. Database Setup
Apply schema migrations and initial seed data via Supabase CLI or SQL Editor:
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

- Public Portfolio: [http://localhost:3000](http://localhost:3000)
- Admin CMS Dashboard: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

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

This repository follows a clean Git Flow model:
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
MIT License. Built with craft and precision by [Min Phanith](https://github.com/Immonkei).

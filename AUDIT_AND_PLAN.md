# Devfolio Repository Audit & Implementation Plan

## 1. Current Architecture
- **State**: Greenfield Next.js application repository.
- **Git Structure**: Initialized with `main` and `develop` branches.
- **Runtime Environment**:
  - Node.js: `v24.13.0`
  - Package Manager: `npm 11.13.0` / `pnpm 12.3.4`
  - Version Control: `git 2.52.0.windows.1`
- **Existing Files**: Workflow specification (`Devfolio — Development Workflow.md`) and Technical Specification (`Dynamic Software Engineer Portfolio — Claude Code - Antigravity Project Specification.md`).

## 2. Existing Reusable Components
- Greenfield state: zero existing components. All UI and shared library components will be created adhering to the unified technical design system (shadcn/ui primitives, Tailwind CSS, Lucide icons).

## 3. Required Changes & File Structure
Aligning directly with Section 5 of the project specification:
```text
src/
├── app/
│   ├── (public)/
│   │   ├── page.tsx (Dynamic Home: Hero, Experience, Projects, Notes, GitHub, Contact)
│   │   ├── about/page.tsx
│   │   ├── projects/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   ├── experience/page.tsx
│   │   ├── notes/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   └── contact/page.tsx
│   ├── admin/
│   │   ├── login/page.tsx
│   │   ├── dashboard/page.tsx
│   │   ├── projects/page.tsx & [id]/page.tsx
│   │   ├── experience/page.tsx
│   │   ├── education/page.tsx
│   │   ├── technologies/page.tsx
│   │   ├── posts/page.tsx & [id]/page.tsx
│   │   ├── messages/page.tsx
│   │   ├── media/page.tsx
│   │   └── settings/page.tsx
│   ├── api/
│   │   ├── github/route.ts
│   │   └── contact/route.ts
│   ├── sitemap.ts
│   ├── robots.ts
│   └── layout.tsx
├── components/
│   ├── ui/ (Button, Input, Textarea, Dialog, Table, Badge, Card, Dropdown, Skeleton)
│   ├── public/ (Navbar, Footer, ProjectCard, NoteCard, TechBadge, GitHubFeed, ContactForm)
│   └── admin/ (AdminSidebar, AdminHeader, StatsCard, DataTable, ConfirmDialog)
├── features/
├── actions/
│   ├── projects.ts
│   ├── experience.ts
│   ├── education.ts
│   ├── technologies.ts
│   ├── posts.ts
│   ├── messages.ts
│   ├── media.ts
│   └── settings.ts
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── middleware.ts
│   ├── github/client.ts
│   ├── validations/*.ts
│   └── utils.ts
├── types/database.ts & types/index.ts
└── middleware.ts
```

## 4. Dependencies
- Next.js (App Router)
- React & React DOM
- TypeScript
- Tailwind CSS & PostCSS & Autoprefixer
- `@supabase/ssr` & `@supabase/supabase-js`
- `zod` (runtime schema validation)
- `lucide-react` (icons)
- `clsx` & `tailwind-merge` & `class-variance-authority` (shadcn utility foundation)
- Testing: `vitest`, `@testing-library/react`

## 5. Database Requirements
13 PostgreSQL tables configured in Supabase:
1. `profiles`: Admin user bio, headline, avatar, resume URL, contact info
2. `projects`: Technical deep dives with problem, architecture, implementation, trade-offs, live/repo links, status, featured flag
3. `technologies`: Tech stack items with category, icon, skill tags
4. `project_technologies`: Many-to-many junction between projects and technologies
5. `experiences`: Engineering roles, responsibilities, dates, current position flag, display order
6. `education`: Degree, institution, descriptions, display order
7. `categories`: Engineering notes categories
8. `posts`: Technical articles/notes with markdown content, slug, draft/published status
9. `post_categories`: Many-to-many junction between posts and categories
10. `contact_messages`: Inbound messages from public contact form with status (NEW, READ, ARCHIVED)
11. `media`: Uploaded assets metadata linked to Supabase Storage
12. `page_views`: Lightweight privacy-first visitor counts
13. `events`: Project clicks, resume downloads, demo clicks

## 6. Security Considerations
- **No Service Key Leakage**: Service role key is never bundled in frontend code. Client uses public publishable key with authenticated sessions.
- **Row Level Security (RLS)**: Enforced on all 13 tables. Public can only read published content and insert contact messages/analytics. Admin can perform full CRUD.
- **Server-Side Authorization**: Every Server Action validates user session via `createClient()` from `@supabase/ssr` before executing mutations.
- **Input Validation**: Zod schemas on both client and server sides to reject malformed data, excessive payloads, or injection attempts.
- **Spam & Rate Limiting**: Honeypot and timestamp checks on public contact form.

## 7. Implementation Milestones & Status
- [x] 1. Foundation & Scaffolding (`feat/supabase-foundation`)
- [x] 2. Supabase Integration & Admin Auth (`feat/supabase-foundation`)
- [x] 3. Database Schema & RLS Migration SQL (`supabase/migrations/20260926000000_devfolio_schema.sql`)
- [x] 4. Design System & Shared Primitives (`src/components/ui/`)
- [x] 5. Projects CMS & Actions (`src/actions/projects.ts`, `src/components/admin/projects-cms.tsx`)
- [x] 6. Experience & Education CMS (`src/actions/experience.ts`, `src/actions/education.ts`)
- [x] 7. Technologies CMS (`src/actions/technologies.ts`, `src/components/admin/technologies-cms.tsx`)
- [x] 8. Engineering Notes CMS (`src/actions/posts.ts`, `src/components/admin/posts-cms.tsx`)
- [x] 9. Media Management & Storage (`src/actions/media.ts`, `src/components/admin/media-cms.tsx`)
- [x] 10. Dynamic Public Portfolio Pages (`src/app/(public)/`)
- [x] 11. Contact System & Inbox (`src/actions/messages.ts`, `src/components/public/contact-form.tsx`)
- [x] 12. GitHub Integration with Caching & Fallback (`src/lib/github/client.ts`, `src/components/public/github-feed.tsx`)
- [x] 13. Analytics System (`src/lib/analytics.ts`)
- [x] 14. SEO, Sitemap, Metadata & Accessibility (`src/app/sitemap.ts`, `src/app/robots.ts`)
- [x] 15. Testing Suite (`feat/testing` - Vitest, RTL, 36 passing tests)
- [x] 16. Production Verification & CI/CD Workflow (`feat/cicd` - GitHub Actions)
- [x] 17. Production Release Tag: `v1.0.0` merged to `main`


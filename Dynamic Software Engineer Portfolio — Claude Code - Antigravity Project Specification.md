# Dynamic Software Engineer Portfolio

## 1. Project Definition

Build a modern, dynamic **Software Engineer Portfolio Platform** as a **single Next.js application**.

This is not a static portfolio or resume website.

The portfolio must function as a small production-style full-stack application where portfolio content is managed through an authenticated admin dashboard and stored in Supabase.

### Core Principle

> **Portfolio content is data, not code.**

The developer must be able to update projects, experience, technologies, articles, media, resume, and site settings without modifying source code.

---

# 2. Goals

## Primary Goals

- Build a production-quality full-stack portfolio.
- Demonstrate Software Engineering skills rather than only UI skills.
- Use a single Next.js application.
- Use Supabase for authentication, database, storage, and authorization.
- Provide a complete admin CMS.
- Keep the architecture simple and maintainable.
- Demonstrate security, testing, validation, and deployment practices.
- Make the portfolio itself a strong portfolio project.

## Non-Goals

Do not:

- Create a separate Express/NestJS backend.
- Introduce microservices.
- Over-engineer the architecture.
- Hardcode portfolio content into React components.
- Build unnecessary infrastructure.
- Add dependencies without a clear reason.

---

# 3. Technology Stack

## Application

- Next.js
- React
- TypeScript
- App Router

## UI

- Tailwind CSS
- shadcn/ui

## Backend Platform

Supabase:

- Supabase Auth
- PostgreSQL
- Supabase Storage
- Row Level Security

## Deployment

- Vercel
- Supabase

## Testing

Use an appropriate testing stack such as:

- Vitest
- React Testing Library where useful
- Playwright for E2E

Use the project's actual dependency versions and conventions rather than blindly installing packages.

---

# 4. Architecture

```text
                         Visitor
                            │
                            ▼
                    ┌───────────────┐
                    │    Next.js    │
                    │               │
                    │ App Router    │
                    │ Server        │
                    │ Components    │
                    │ Client        │
                    │ Components    │
                    │ Server Actions│
                    │ Route Handlers│
                    └───────┬───────┘
                            │
                     Supabase SSR
                            │
              ┌─────────────┼─────────────┐
              ▼             ▼             ▼
          Supabase       PostgreSQL    Storage
             Auth                        │
              │                          │
          Admin Login              Images / Files
          Sessions                 Resume / Media
              │
              └─────────────┐
                            ▼
                           RLS
                            │
                     Authorized Data
```

### Architectural Rule

Keep the application as:

```text
One Repository
      ↓
One Next.js Application
      ↓
One Vercel Deployment
      ↓
Supabase Backend Platform
```

Do not create a separate API server unless a future requirement genuinely requires one.

---

# 5. Repository Structure

Use feature-oriented organization while keeping Next.js routing inside `app`.

```text
src/
├── app/
│   ├── (public)/
│   │   ├── page.tsx
│   │   ├── about/
│   │   ├── projects/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/
│   │   ├── experience/
│   │   ├── notes/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/
│   │   └── contact/
│   │
│   ├── admin/
│   │   ├── login/
│   │   ├── dashboard/
│   │   ├── projects/
│   │   ├── experience/
│   │   ├── education/
│   │   ├── technologies/
│   │   ├── posts/
│   │   ├── messages/
│   │   ├── media/
│   │   └── settings/
│   │
│   ├── api/
│   │   ├── github/
│   │   └── contact/
│   │
│   ├── sitemap.ts
│   ├── robots.ts
│   └── layout.tsx
│
├── components/
│   ├── ui/
│   ├── public/
│   └── admin/
│
├── features/
│   ├── projects/
│   ├── experience/
│   ├── education/
│   ├── technologies/
│   ├── posts/
│   ├── messages/
│   └── analytics/
│
├── actions/
│   ├── projects.ts
│   ├── experience.ts
│   ├── posts.ts
│   └── messages.ts
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── middleware.ts
│   ├── github/
│   └── validations/
│
├── types/
│
└── middleware.ts
```

### Code Organization Rules

- Do not create huge page components.
- Keep business logic outside presentation components.
- Reuse shared UI components.
- Avoid unnecessary abstractions.
- Avoid `any`.
- Prefer explicit types.
- Keep feature logic close to its domain.
- Follow existing project conventions if they differ from this specification.

---

# 6. Public Application

## Routes

```text
/
/about
/projects
/projects/[slug]
/experience
/notes
/notes/[slug]
/contact
```

## Homepage

The homepage should contain:

1. Hero
2. Introduction
3. Selected projects
4. Engineering experience
5. Technologies
6. Engineering notes
7. GitHub activity
8. Contact CTA

All content must be dynamically loaded.

---

# 7. Project System

## Project Listing

Route:

```text
/projects
```

Support:

- Featured projects
- Technology filtering
- Search
- Category filtering
- Sorting
- Pagination if needed

## Project Detail

Route:

```text
/projects/[slug]
```

Project fields:

```text
Title
Slug
Short Description
Full Description
Problem
Context
Solution
Architecture
Technical Implementation
Challenges
Trade-offs
Results
Cover Image
Gallery
GitHub URL
Live URL
Featured
Status
Created At
Updated At
```

The project page should explain engineering decisions rather than only display screenshots.

Example sections:

```text
Problem
↓
Approach
↓
Architecture
↓
Implementation
↓
Challenges
↓
Trade-offs
↓
Result
```

---

# 8. Experience System

Route:

```text
/experience
```

Fields:

```text
Company
Role
Description
Responsibilities
Technologies
Start Date
End Date
Is Current
Display Order
```

Experience must be manageable from the admin dashboard.

---

# 9. Engineering Notes

Routes:

```text
/notes
/notes/[slug]
```

The notes system acts as a lightweight technical blog.

Possible topics:

- Architecture decisions
- Backend development
- Database design
- API design
- Next.js
- Supabase
- Testing
- Security
- Performance
- Lessons learned from projects

Post fields:

```text
Title
Slug
Excerpt
Content
Cover Image
Status
Published At
Created At
Updated At
```

Statuses:

```text
DRAFT
PUBLISHED
```

Draft posts must not be visible publicly.

---

# 10. Admin Application

## Authentication

Route:

```text
/admin/login
```

Use Supabase Auth.

Only authorized admin users can access the dashboard.

## Dashboard

Route:

```text
/admin/dashboard
```

Display:

```text
Total Projects
Published Posts
Experience Entries
Unread Messages
Portfolio Views
Resume Downloads
```

Keep dashboard metrics useful and simple.

---

# 11. Admin CRUD

## Projects

Admin can:

- Create
- Read
- Update
- Delete
- Publish/unpublish
- Feature/unfeature
- Upload images
- Manage technologies
- Set GitHub URL
- Set live URL

## Experience

Admin can:

- Create
- Update
- Delete
- Reorder
- Mark current position

## Education

Admin can:

- Create
- Update
- Delete
- Reorder

## Technologies

Admin can:

- Create
- Update
- Delete
- Categorize
- Assign icons
- Associate with projects

## Posts

Admin can:

- Create
- Edit
- Delete
- Save draft
- Publish
- Unpublish
- Assign category
- Add tags
- Upload cover image

## Messages

Admin can:

- View
- Mark as read
- Archive
- Delete

## Media

Admin can:

- Upload
- View
- Delete

---

# 12. Database Schema

Initial schema:

```text
profiles

projects
technologies
project_technologies

experiences
education

posts
categories
post_categories

contact_messages

media

page_views
events
```

## profiles

```text
id
name
headline
bio
location
avatar_url
resume_url
role
created_at
updated_at
```

## projects

```text
id
title
slug
short_description
description
problem
solution
architecture
implementation
challenges
tradeoffs
results
cover_image_url
github_url
live_url
featured
status
created_at
updated_at
```

## technologies

```text
id
name
category
icon
created_at
```

## project_technologies

```text
project_id
technology_id
```

## experiences

```text
id
company
role
description
responsibilities
start_date
end_date
is_current
display_order
created_at
updated_at
```

## education

```text
id
institution
degree
description
start_date
end_date
display_order
created_at
updated_at
```

## posts

```text
id
title
slug
excerpt
content
cover_image_url
status
published_at
created_at
updated_at
```

## categories

```text
id
name
slug
```

## post_categories

```text
post_id
category_id
```

## contact_messages

```text
id
name
email
subject
message
status
created_at
updated_at
```

## media

```text
id
file_name
storage_path
file_type
file_size
bucket
created_at
```

## page_views

```text
id
page
visitor_hash
created_at
```

## events

```text
id
event_type
page
resource_id
metadata
created_at
```

---

# 13. Database Relationships

```text
profiles
   │
   └── auth.users

projects
   │
   └──< project_technologies >── technologies

posts
   │
   └──< post_categories >── categories
```

Use foreign keys and appropriate constraints.

Use indexes for commonly queried fields such as:

```text
projects.slug
projects.status
projects.featured
posts.slug
posts.status
posts.published_at
contact_messages.status
events.event_type
```

Do not add indexes without a query/use-case justification.

---

# 14. Supabase Authentication

Use Supabase Auth for:

- Admin login
- Session management
- Logout
- Password reset if required

The application should not implement custom authentication unless necessary.

Use the Supabase SSR integration appropriate for the installed Next.js/Supabase versions.

---

# 15. Authorization

Authentication alone is not enough.

Authorization must exist at multiple levels:

```text
Next.js route protection
        +
Server-side authorization
        +
Supabase RLS
```

The database must remain secure even if a user bypasses the frontend.

---

# 16. RLS Requirements

## Public

Public users may:

```text
SELECT published projects
SELECT published posts
SELECT public experience
SELECT public education
SELECT public technologies
SELECT public profile
INSERT contact messages
```

## Admin

Admin users may:

```text
SELECT projects
INSERT projects
UPDATE projects
DELETE projects

SELECT posts
INSERT posts
UPDATE posts
DELETE posts

SELECT/INSERT/UPDATE/DELETE experience
SELECT/INSERT/UPDATE/DELETE education
SELECT/INSERT/UPDATE/DELETE technologies

SELECT messages
UPDATE messages
DELETE messages

SELECT/INSERT/UPDATE/DELETE media

SELECT analytics
```

Exact SQL policies must be implemented and tested.

Never rely on UI visibility as authorization.

---

# 17. Storage

Use Supabase Storage for:

```text
Profile avatar
Resume
Project cover images
Project gallery images
Post cover images
Other portfolio media
```

Suggested paths:

```text
projects/{project-id}/cover.webp
projects/{project-id}/gallery/{file}
posts/{post-id}/cover.webp
profile/avatar.webp
profile/resume.pdf
```

Requirements:

- Validate file type.
- Validate file size.
- Restrict upload access.
- Use appropriate storage policies.
- Delete orphaned files when appropriate.
- Do not store file binaries in PostgreSQL.

---

# 18. Contact System

Public contact form:

```text
Name
Email
Subject
Message
```

Flow:

```text
Visitor
  ↓
Form
  ↓
Client Validation
  ↓
Server Validation
  ↓
Supabase
  ↓
contact_messages
  ↓
Admin Dashboard
```

Statuses:

```text
NEW
READ
ARCHIVED
```

Server-side validation is mandatory.

Consider rate limiting or spam protection before production launch.

---

# 19. Analytics

Implement lightweight first-party analytics.

Track:

```text
page_view
project_view
resume_download
contact_submit
github_click
live_demo_click
```

Avoid collecting unnecessary personally identifiable information.

Dashboard examples:

```text
Total Views
Project Views
Resume Downloads
Contact Messages
Most Viewed Projects
Popular Pages
```

Analytics should not negatively affect the primary user experience.

---

# 20. GitHub Integration

Provide dynamic GitHub information such as:

```text
Public repositories
Repository descriptions
Languages
Stars
Recent activity
Contribution activity
```

Architecture:

```text
Next.js
   ↓
GitHub API
   ↓
Cached Result
   ↓
Public Portfolio
```

Requirements:

- Do not make GitHub availability a dependency for the entire site.
- Cache external data.
- Handle API errors gracefully.
- Provide fallback UI.
- Do not expose private credentials.

GitHub data is external information.

Supabase remains the source of truth for curated portfolio content.

---

# 21. Rendering Strategy

Use Next.js App Router correctly.

Prefer:

### Server Components

For:

- Project pages
- Blog pages
- Experience pages
- Public profile data
- Server-side Supabase queries

### Client Components

Only when needed for:

- Interactive filters
- Forms
- Dialogs
- Rich editors
- Interactive dashboard components
- Browser-only behavior

### Server Actions

Use for suitable mutations:

```text
Create Project
Update Project
Delete Project
Publish Post
Update Experience
Update Settings
```

### Route Handlers

Use where an API endpoint is appropriate:

```text
/api/github
/api/contact
```

Do not create API endpoints merely to proxy internal database operations that can be handled safely on the server.

---

# 22. Validation

Every mutation must validate input.

Validate:

- Required fields
- String lengths
- URLs
- Slugs
- Dates
- File types
- File sizes
- Email addresses
- Enum/status values

Use one consistent schema validation strategy.

```text
Client validation
        ↓
UX improvement

Server validation
        ↓
Security + correctness
```

Never rely exclusively on client validation.

---

# 23. Error Handling

Every important operation needs:

```text
Loading
Empty
Success
Error
Unauthorized
Forbidden
Not Found
Validation Error
```

Examples:

```text
Project not found.

You do not have permission to perform this action.

No projects have been published yet.

Failed to upload image.

Failed to save project.
```

Errors should be meaningful and should not expose sensitive implementation details.

---

# 24. SEO

Implement:

- Static metadata
- Dynamic project metadata
- Dynamic post metadata
- Open Graph metadata
- Sitemap
- Robots
- Canonical URLs
- Semantic HTML

Dynamic routes must generate appropriate metadata.

---

# 25. Accessibility

Follow basic accessibility standards:

- Semantic HTML
- Keyboard navigation
- Visible focus states
- Proper labels
- Accessible dialogs
- Accessible forms
- Appropriate contrast
- Meaningful alt text
- Reduced-motion consideration

Do not use visual design as a replacement for semantic structure.

---

# 26. UI / Design Direction

The design should be:

- Modern
- Minimal
- Professional
- Clean
- Typography-focused
- Responsive
- Accessible
- Fast

Avoid:

- Excessive gradients
- Excessive glassmorphism
- Excessive animations
- Huge decorative elements
- Generic portfolio-template styling
- Overuse of cards

The design should communicate:

> **Software Engineer first, portfolio website second.**

Use one consistent design system across the public website and admin dashboard.

---

# 27. Performance

Prioritize:

- Server Components
- Next.js image optimization
- Proper caching
- Minimal client JavaScript
- Efficient Supabase queries
- Pagination
- Database indexes
- Avoiding duplicate requests

Do not optimize prematurely.

Measure actual bottlenecks before introducing complex caching or infrastructure.

---

# 28. Testing Strategy

Focus testing on behavior rather than implementation details.

## Unit Tests

Test:

- Validation
- Slug generation
- Utility functions
- Data transformation
- Business rules

## Integration Tests

Test:

- Server Actions
- Database operations
- Authorization
- RLS behavior

## E2E Tests

Critical flows:

```text
Admin Login
    ↓
Create Project
    ↓
Upload Image
    ↓
Publish Project
    ↓
View Public Project
```

Also test:

```text
Contact Form
Draft Post
Publish Post
Unauthorized Admin Access
```

Do not chase 100% coverage without meaningful value.

---

# 29. CI/CD

GitHub Actions should validate pull requests.

```text
Pull Request
     ↓
Install dependencies
     ↓
Lint
     ↓
Type Check
     ↓
Unit Tests
     ↓
Build
     ↓
Merge
     ↓
Vercel Deployment
```

Production deployments should only happen after successful validation.

---

# 30. Environment Variables

Expected configuration:

```text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
GITHUB_TOKEN=
NEXT_PUBLIC_SITE_URL=
```

Rules:

- Never commit `.env.local`.
- Never expose service-role secrets to the client.
- Use Vercel environment variables in production.
- Document required environment variables.

---

# 31. Implementation Phases

## Phase 0 — Project Audit

Before changing code:

1. Inspect the repository.
2. Inspect existing package versions.
3. Inspect existing configuration.
4. Inspect Next.js version.
5. Inspect Tailwind configuration.
6. Inspect existing component/design system.
7. Inspect Supabase setup if already present.
8. Identify existing conventions.
9. Do not overwrite working project configuration without reason.

### Deliverable

Create an implementation plan before major code changes.

---

# Phase 1 — Foundation

Implement:

```text
Next.js
Supabase
Supabase SSR
Authentication
Base layout
Design system
Public navigation
Admin layout
```

Acceptance criteria:

- Application runs locally.
- Supabase connection works.
- Admin can authenticate.
- Unauthorized users cannot access admin pages.

---

# Phase 2 — Database

Implement:

```text
profiles
projects
technologies
project_technologies
experiences
education
posts
categories
post_categories
contact_messages
media
```

Also implement:

- Foreign keys
- Indexes
- Constraints
- RLS
- Storage policies

Acceptance criteria:

- Schema can be created reproducibly.
- RLS prevents unauthorized operations.
- Public read access only exposes intended data.

---

# Phase 3 — Portfolio CMS

Implement admin CRUD for:

```text
Projects
Experience
Education
Technologies
Posts
```

Acceptance criteria:

- Admin can create content.
- Admin can edit content.
- Admin can delete content.
- Admin can publish/unpublish content.
- Public website reflects database changes.

---

# Phase 4 — Media

Implement:

- Supabase Storage
- Image upload
- Image deletion
- Resume upload
- Media management

Acceptance criteria:

- Unauthorized users cannot upload protected media.
- Invalid file types are rejected.
- File size limits are enforced.

---

# Phase 5 — Public Website

Implement:

```text
Home
About
Projects
Project Detail
Experience
Notes
Note Detail
Contact
```

Acceptance criteria:

- No portfolio content is hardcoded.
- Published content appears dynamically.
- Draft content remains private.
- Pages have loading/error/empty states.

---

# Phase 6 — GitHub Integration

Implement:

- Repository data
- Recent activity
- Contribution information where technically appropriate
- Caching
- Fallback states

Acceptance criteria:

- GitHub API failure does not break the portfolio.
- External credentials are not exposed.

---

# Phase 7 — Analytics

Implement:

```text
Page Views
Project Views
Resume Downloads
External Link Clicks
Contact Events
```

Add dashboard metrics.

Acceptance criteria:

- Events are stored safely.
- No unnecessary personal data is collected.
- Analytics failure does not break normal page functionality.

---

# Phase 8 — Production Quality

Implement:

```text
Validation
Error Handling
SEO
Accessibility
Performance
Testing
CI/CD
Security Review
```

Run:

```text
Lint
Type Check
Tests
Production Build
```

before release.

---

# 32. Acceptance Criteria

The project is complete when:

- [ ] Portfolio runs as one Next.js application.
- [ ] Supabase Auth is implemented.
- [ ] Supabase PostgreSQL stores portfolio data.
- [ ] Supabase Storage stores media.
- [ ] RLS protects database resources.
- [ ] Admin authentication works.
- [ ] Admin dashboard works.
- [ ] Projects have full CRUD.
- [ ] Experience has CRUD.
- [ ] Technologies have CRUD.
- [ ] Posts have CRUD.
- [ ] Draft/published state works.
- [ ] Contact form works.
- [ ] Media upload works.
- [ ] Public pages use dynamic database data.
- [ ] GitHub integration works with graceful fallback.
- [ ] Analytics works.
- [ ] SEO is implemented.
- [ ] Accessibility basics are implemented.
- [ ] Important flows are tested.
- [ ] CI checks pass.
- [ ] Production build passes.
- [ ] No secrets are committed.
- [ ] No service-role credentials are exposed to the browser.

---

# 33. Agent Working Rules

Claude Code / Antigravity must follow these rules during implementation.

## Before Coding

Always:

1. Inspect the existing codebase.
2. Understand the current architecture.
3. Check existing dependencies.
4. Check existing design system.
5. Check Supabase configuration.
6. Identify reusable components.
7. Create a concise implementation plan.
8. Implement incrementally.

Do not immediately rewrite the application.

---

## During Coding

Prefer:

- Existing project conventions
- Existing components
- Small focused changes
- Type-safe code
- Server Components where appropriate
- Server Actions for suitable mutations
- Secure server-side Supabase access
- Reusable validation schemas
- Clear separation of concerns

Avoid:

- `any`
- Giant components
- Duplicate logic
- Unnecessary dependencies
- Unnecessary API layers
- Client-side authorization as the only security mechanism
- Hardcoded portfolio content
- Over-engineering

---

# 34. Definition of Done

A feature is not considered complete simply because it works in the browser.

For each feature:

```text
Implementation
    ↓
Type Check
    ↓
Lint
    ↓
Validation
    ↓
Error Handling
    ↓
Security / RLS
    ↓
Responsive UI
    ↓
Tests where appropriate
    ↓
Production Build
```

A feature is complete only when the relevant layers have been considered.

---

# 35. Final Product Vision

The finished application should communicate two things simultaneously:

### Publicly

> A professional Software Engineer with real projects, experience, technical knowledge, and engineering thinking.

### Technically

> A developer who can design, build, secure, test, deploy, and maintain a real full-stack application.

The portfolio itself should therefore be one of the strongest projects shown inside the portfolio.

---

# 36. Recommended Build Order

```text
1. Repository Audit
        ↓
2. Next.js + Supabase Foundation
        ↓
3. Auth + Admin Protection
        ↓
4. Database Schema + RLS
        ↓
5. Public Design System
        ↓
6. Projects CMS
        ↓
7. Experience + Technologies CMS
        ↓
8. Posts CMS
        ↓
9. Storage / Media
        ↓
10. Public Portfolio Pages
        ↓
11. Contact System
        ↓
12. GitHub Integration
        ↓
13. Analytics
        ↓
14. SEO + Accessibility
        ↓
15. Testing
        ↓
16. CI/CD
        ↓
17. Security + Performance Review
        ↓
18. Production Deployment
```

## Final Stack

```text
Next.js
React
TypeScript
Tailwind CSS
shadcn/ui
       +
Supabase
├── Auth
├── PostgreSQL
├── Storage
└── RLS
       +
Vercel
       +
GitHub Actions
```

**Architecture principle: keep it simple, secure, dynamic, and production-oriented.**
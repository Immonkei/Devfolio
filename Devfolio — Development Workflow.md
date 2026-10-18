# Devfolio — Development Workflow

## 1. Workflow Objective

Build Devfolio incrementally as a production-quality dynamic Software Engineer Portfolio Platform.

The workflow must prioritize:

**Understand → Plan → Branch → Implement → Validate → Commit → Review → Merge → Deploy**

Do not build the entire system in one pass.

---

# 2. Git Management Strategy

Git is part of the development workflow from the first implementation phase.

## Branch Structure

Use:

```text
main
├── develop
├── feat/*
├── fix/*
├── refactor/*
├── chore/*
└── docs/*
```

### Branch Rules

**`main`**
- Production-ready code only.
- No direct development commits.
- Protected branch where possible.

**`develop`**
- Integration branch for completed features.
- Used before production release.

**Feature branches**

Examples:

```text
feat/supabase-foundation
feat/admin-auth
feat/database-schema
feat/projects-cms
feat/experience-cms
feat/notes-cms
feat/media-management
feat/github-integration
feat/analytics
```

Bug fixes:

```text
fix/admin-auth-redirect
fix/project-slug-validation
fix/media-upload-error
```

Refactoring:

```text
refactor/project-form
refactor/supabase-server-client
```

---

## Git Workflow

For every feature:

```text
develop
   ↓
Create Branch
   ↓
Implement
   ↓
Test
   ↓
Lint
   ↓
Type Check
   ↓
Commit
   ↓
Push
   ↓
Pull Request
   ↓
Review
   ↓
Merge → develop
   ↓
Release
   ↓
Merge → main
```

Never work directly on `main` for normal feature development.

---

## Commit Convention

Use clear Conventional Commit-style messages:

```text
feat: add project management
feat: implement admin authentication
fix: prevent duplicate project slugs
refactor: simplify project form validation
chore: update dependencies
docs: add database documentation
test: add project action tests
style: improve project dashboard layout
```

Keep commits:

- Small
- Focused
- Descriptive
- Related to one logical change

Avoid:

```text
update stuff
fix
changes
final
test123
```

---

## Commit Timing

Do not wait until an entire phase is finished.

Commit after meaningful completed units:

```text
feat: add supabase server client
feat: add admin login
test: add authentication tests
feat: protect admin routes
```

Each commit should ideally leave the application buildable.

---

## Pull Request Workflow

Before opening a PR:

```text
git pull
↓
Rebase / update branch
↓
Lint
↓
Type Check
↓
Tests
↓
Build
↓
Review Diff
↓
Push
↓
Open PR
```

PR should include:

### Description

- What changed
- Why it changed
- Main implementation details
- Testing performed
- Security considerations
- Screenshots for UI changes when useful

### Example

```text
## Summary

- Added project CRUD management
- Added project validation
- Added Supabase RLS protection
- Added project admin UI

## Testing

- TypeScript ✓
- ESLint ✓
- Unit tests ✓
- Production build ✓

## Security

- Admin authorization enforced server-side
- Supabase RLS enabled
```

---

## Merge Rules

Before merging:

- [ ] CI passes
- [ ] Type check passes
- [ ] Lint passes
- [ ] Tests pass
- [ ] Build passes
- [ ] No unresolved review comments
- [ ] No accidental files/secrets
- [ ] Database/RLS changes reviewed
- [ ] UI changes manually checked

Prefer:

```text
Feature Branch → develop → main
```

Avoid unnecessary direct merges from unfinished feature branches into `main`.

---

# 3. Repository Audit

Before changing code:

1. Inspect the complete repository structure.
2. Check:
   - `package.json`
   - Next.js / React / TypeScript versions
   - Tailwind configuration
   - shadcn/ui setup
   - Supabase configuration
   - existing components
   - routing
   - environment variables
   - linting / formatting
   - testing configuration
3. Identify existing conventions.
4. Identify reusable components.
5. Identify technical risks.
6. Confirm the current design system.

### Output

Create a short implementation plan containing:

- Current architecture
- Existing reusable components
- Required changes
- Missing dependencies
- Database requirements
- Security considerations
- Recommended implementation order

Do not start major implementation before completing the audit.

---

# 4. Foundation Workflow

## Phase 1 — Application Foundation

Set up:

1. Next.js App Router
2. TypeScript
3. Tailwind CSS
4. shadcn/ui
5. Supabase SSR
6. Global layout
7. Design tokens
8. Public navigation
9. Admin layout
10. Loading/error boundaries
11. Responsive structure

### Git checkpoint

```text
feat: initialize application foundation
```

### Validation

- Application starts successfully.
- TypeScript passes.
- Lint passes.
- Supabase connection works.
- Public routes load.
- Admin routes have a protected structure.

---

# 5. Authentication Workflow

## Phase 2 — Admin Authentication

Flow:

```text
Admin Login
    ↓
Supabase Auth
    ↓
Session
    ↓
Middleware / Server Check
    ↓
Admin Dashboard
```

Implement:

- Login
- Logout
- Session persistence
- Unauthorized protection
- Error handling

### Git checkpoint

```text
feat: implement admin authentication
```

Security must be enforced server-side and through RLS.

---

# 6. Database Workflow

## Phase 3 — Database + RLS

Create:

1. Profiles
2. Technologies
3. Projects
4. Project technologies
5. Experience
6. Education
7. Categories
8. Posts
9. Post categories
10. Contact messages
11. Media
12. Page views
13. Events

Then implement:

- Foreign keys
- Constraints
- Useful indexes
- RLS
- Storage policies

### Git checkpoint

```text
feat: add portfolio database schema
feat: add database authorization policies
```

Test:

```text
Authorized admin → allowed
Unauthorized user → denied
Public visitor → intended public data only
```

---

# 7. Design System Workflow

## Phase 4 — Public + Admin UI

Define:

- Typography
- Spacing
- Layout
- Buttons
- Inputs
- Dialogs
- Tables
- Badges
- Navigation
- Loading states
- Empty states
- Error states
- Responsive behavior

Design direction:

**Modern + Minimal + Professional + Technical**

Avoid:

- Excessive gradients
- Excessive glassmorphism
- Large decorative graphics
- Unnecessary animations
- Generic portfolio styling
- Excessive cards

### Git checkpoint

```text
feat: establish portfolio design system
```

---

# 8. CMS Workflow

Implement CMS modules independently.

## Phase 5 — Projects

Flow:

```text
Admin
 ↓
Create Project
 ↓
Validate
 ↓
Save
 ↓
Upload Media
 ↓
Edit
 ↓
Preview
 ↓
Publish
 ↓
Public Project
```

Implement:

- CRUD
- Draft/published
- Featured
- Technologies
- Images
- GitHub URL
- Live URL
- Slugs

### Git checkpoints

```text
feat: add project management
feat: add project publishing
test: add project validation tests
```

---

## Phase 6 — Experience + Education

Implement:

- CRUD
- Ordering
- Current position
- Dates
- Validation
- Public rendering

### Git checkpoint

```text
feat: add experience and education management
```

---

## Phase 7 — Technologies

Implement:

- CRUD
- Categories
- Icons
- Project relationships

### Git checkpoint

```text
feat: add technology management
```

---

## Phase 8 — Engineering Notes

Implement:

- Create
- Edit
- Delete
- Draft
- Publish
- Unpublish
- Categories
- Tags
- Slugs
- Cover images

### Git checkpoints

```text
feat: add engineering notes CMS
feat: add post publishing workflow
```

---

# 9. Media Workflow

## Phase 9 — Storage

Flow:

```text
Select File
 ↓
Validate Type
 ↓
Validate Size
 ↓
Upload
 ↓
Create Media Record
 ↓
Associate Resource
```

Deletion:

```text
Delete Database Reference
 ↓
Delete Storage Object
```

### Git checkpoint

```text
feat: add media storage management
```

---

# 10. Public Website Workflow

## Phase 10 — Public Pages

Build:

1. Home
2. About
3. Projects
4. Project detail
5. Experience
6. Notes
7. Note detail
8. Contact

No portfolio content should be hardcoded.

```text
Supabase
   ↓
Server Component
   ↓
Public UI
```

### Git checkpoint

```text
feat: build dynamic public portfolio
```

---

# 11. Contact Workflow

## Phase 11 — Contact System

Flow:

```text
Visitor
 ↓
Contact Form
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

Admin:

- View
- Read
- Archive
- Delete

### Git checkpoint

```text
feat: add contact messaging system
```

---

# 12. GitHub Integration Workflow

## Phase 12 — GitHub

Flow:

```text
Portfolio
 ↓
GitHub API
 ↓
Cache
 ↓
Public UI
```

Rules:

- Cache responses.
- Handle API failures.
- Provide fallback UI.
- Never expose credentials.
- GitHub failure must not break the portfolio.

### Git checkpoint

```text
feat: integrate github activity
```

---

# 13. Analytics Workflow

## Phase 13 — Analytics

Track:

```text
page_view
project_view
resume_download
contact_submit
github_click
live_demo_click
```

Flow:

```text
User Action
 ↓
Analytics Event
 ↓
Supabase
 ↓
Admin Dashboard
```

### Git checkpoint

```text
feat: add portfolio analytics
```

---

# 14. Quality Workflow

## Phase 14 — Validation + Error Handling

For every feature verify:

### Functional

- Happy path
- Empty state
- Invalid input
- Failed request
- Unauthorized request
- Not found

### Technical

- TypeScript
- Lint
- Validation
- Error handling
- Security
- RLS
- Responsive UI

Then commit only verified changes.

---

# 15. Testing Workflow

## Phase 15 — Testing

### Unit

Test:

- Validation
- Slug generation
- Utilities
- Transformations
- Business rules

### Integration

Test:

- Server Actions
- Database operations
- Authorization
- RLS

### E2E

Critical flows:

```text
Admin Login
 → Create Project
 → Upload Image
 → Publish
 → View Public Project
```

Also:

```text
Contact Form
Draft Post
Publish Post
Unauthorized Admin Access
```

### Git checkpoints

```text
test: add project workflow tests
test: add admin authentication e2e
test: add contact form e2e
```

---

# 16. SEO + Accessibility

## Phase 16

Verify:

- Metadata
- Dynamic metadata
- Open Graph
- Canonical URLs
- Sitemap
- Robots
- Semantic HTML
- Keyboard navigation
- Focus states
- Form labels
- Dialog accessibility
- Alt text
- Contrast
- Reduced motion

### Git checkpoint

```text
feat: improve seo and accessibility
```

---

# 17. Performance Review

## Phase 17

Review:

- Server vs Client Components
- Supabase queries
- Duplicate requests
- Image optimization
- Caching
- Pagination
- Client JavaScript
- Database indexes

Measure first, then optimize.

### Git checkpoint

```text
perf: optimize portfolio rendering
```

---

# 18. Security Review

## Phase 18

Verify:

- RLS
- Server-side authorization
- Input validation
- File validation
- Storage policies
- No service-role key in client
- No secrets in Git
- Safe errors
- Contact spam protection
- Admin protection

Attempt unauthorized operations directly.

### Git checkpoint

```text
security: harden portfolio authorization
```

---

# 19. CI/CD Workflow

## Phase 19

Pull request:

```text
Push
 ↓
Install
 ↓
Lint
 ↓
Type Check
 ↓
Unit Tests
 ↓
Build
 ↓
PR Review
 ↓
Merge → develop
 ↓
Release Validation
 ↓
Merge → main
 ↓
Vercel Deployment
```

Configure GitHub Actions to run automatically.

---

# 20. Release Workflow

Before production release:

```text
develop
 ↓
Full Test
 ↓
Security Review
 ↓
Performance Review
 ↓
Production Build
 ↓
Create Release PR
 ↓
Review
 ↓
Merge → main
 ↓
Vercel Deploy
 ↓
Production Smoke Test
```

After deployment verify:

- Homepage
- Projects
- Notes
- Contact
- Admin login
- Database operations
- Storage
- GitHub integration
- Analytics

---

# 21. Git Hygiene

Never commit:

```text
.env
.env.local
.env.production
node_modules/
.next/
secret keys
service-role keys
personal credentials
temporary debug files
```

Use:

```text
.gitignore
```

Keep migrations and important documentation version-controlled.

Before every PR:

```text
git status
git diff
git diff --cached
```

Review the actual changes before committing.

---

# 22. Feature Completion Workflow

Every feature follows:

```text
Understand
   ↓
Inspect
   ↓
Plan
   ↓
Create Branch
   ↓
Implement
   ↓
Validate
   ↓
Test
   ↓
Security Review
   ↓
Responsive Review
   ↓
Lint
   ↓
Type Check
   ↓
Build
   ↓
Commit
   ↓
Push
   ↓
Pull Request
   ↓
Review
   ↓
Merge
```

---

# 23. Definition of Done

A feature is complete only when:

- [ ] Functionality works
- [ ] Data persists correctly
- [ ] Validation exists
- [ ] Error handling exists
- [ ] Authorization is enforced
- [ ] RLS is correct
- [ ] Responsive UI works
- [ ] Accessibility considered
- [ ] Tests added where valuable
- [ ] TypeScript passes
- [ ] Lint passes
- [ ] Production build passes
- [ ] Git diff reviewed
- [ ] Commit is meaningful
- [ ] PR is reviewed
- [ ] No secrets are exposed
- [ ] No unnecessary dependencies added

---

# 24. Recommended Execution Order

```text
01. Repository Audit
        ↓
02. Git Repository Setup
        ↓
03. Foundation
        ↓
04. Supabase Integration
        ↓
05. Authentication
        ↓
06. Database Schema
        ↓
07. RLS + Storage Policies
        ↓
08. Design System
        ↓
09. Projects CMS
        ↓
10. Experience + Education
        ↓
11. Technologies
        ↓
12. Engineering Notes
        ↓
13. Media Management
        ↓
14. Public Portfolio
        ↓
15. Contact System
        ↓
16. GitHub Integration
        ↓
17. Analytics
        ↓
18. SEO + Accessibility
        ↓
19. Testing
        ↓
20. Performance Review
        ↓
21. Security Review
        ↓
22. CI/CD
        ↓
23. Production Deployment
        ↓
24. Final QA
```

## Final Principle

**Build → Verify → Commit → Review → Merge → Continue.**

Git is not something done after development. It is part of the development process from the first feature to production.

Every meaningful change should be:

**small, testable, reviewable, and reversible.**
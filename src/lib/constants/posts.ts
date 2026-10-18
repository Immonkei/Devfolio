import { PostWithCategories } from "@/types";

export interface StandardPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image_url: string;
  status: "PUBLISHED";
  published_at: string;
  category_slugs: string[];
}

export const STANDARD_POSTS: StandardPost[] = [
  {
    id: "std-post-modular-rest-apis",
    title: "Designing Modular RESTful APIs with JWT Authentication",
    slug: "designing-modular-rest-apis-jwt",
    excerpt: "Architectural patterns for clean separation of concerns, secure stateless session handling, and defensive input validation in Node.js and TypeScript backends.",
    cover_image_url: "/notes/modular-rest-apis.svg",
    status: "PUBLISHED",
    published_at: "2026-03-15T08:00:00Z",
    category_slugs: ["backend", "architecture", "security"],
    content: `# Designing Modular RESTful APIs with JWT Authentication

In modern web systems, building scalable backend services requires decoupling business logic from transport layers and establishing defensible authentication boundaries.

## 1. Clean Controller-Service-Repository Architecture

Separating HTTP routing from data persistence prevents controllers from bloating:

\`\`\`typescript
// src/services/auth.service.ts
export class AuthService {
  constructor(private userRepository: UserRepository) {}

  async authenticate(credentials: LoginCredentials): Promise<AuthTokens> {
    const user = await this.userRepository.findByEmail(credentials.email);
    if (!user || !(await verifyPassword(credentials.password, user.passwordHash))) {
      throw new UnauthorizedException("Invalid credentials.");
    }

    return this.generateTokens(user);
  }
}
\`\`\`

## 2. Stateless JWT Token Pairs (Access + Refresh)

To balance token security with low database lookup overhead:
- **Short-Lived Access Tokens**: 15-minute lifespan stored in memory or secure HTTP-only cookies.
- **Refresh Tokens**: Rotating 7-day tokens securely hashed and stored in database sessions.

> "Stateless access tokens eliminate session storage lookups on high-frequency API endpoints, while rotating refresh tokens enable instant revocation on compromised accounts."

## 3. Defensive Schema Validation with Zod

Never trust client payloads. Validate every request body at the route gateway before passing data to services:

\`\`\`typescript
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
\`\`\`

By standardizing error formats and enforcing strict typing from route entrance to database layer, APIs remain resilient to unexpected payloads and regressions.
`,
  },
  {
    id: "std-post-ooad-domain-modeling",
    title: "Object-Oriented Analysis & Domain Modeling for Web Applications",
    slug: "ooad-domain-modeling-web-applications",
    excerpt: "Translating real-world business constraints into maintainable domain entities, aggregates, and value objects without framework entanglement.",
    cover_image_url: "/notes/ooad-web-apps.svg",
    status: "PUBLISHED",
    published_at: "2026-02-20T10:30:00Z",
    category_slugs: ["software-engineering", "architecture"],
    content: `# Object-Oriented Analysis & Domain Modeling for Web Applications

Software complexity increases not from technical syntax, but from ambiguous business requirements and leaking implementation details across domain boundaries.

## 1. Entities vs Value Objects

In domain-driven engineering:
- **Entities**: Objects defined by identity that persists across state changes (e.g. \`User\`, \`Project\`).
- **Value Objects**: Immutable objects defined solely by their attributes (e.g. \`Money\`, \`EmailAddress\`, \`DateRange\`).

\`\`\`typescript
export class DateRange {
  constructor(readonly startDate: Date, readonly endDate?: Date) {
    if (endDate && endDate < startDate) {
      throw new Error("End date cannot precede start date.");
    }
  }

  isCurrent(): boolean {
    return !this.endDate;
  }
}
\`\`\`

## 2. Inversion of Control & Decoupled Repositories

Avoid tight coupling between your domain logic and database ORMs:
1. Define repository interfaces inside the domain layer.
2. Implement database adapters in the infrastructure layer.
3. Inject repositories into use cases or services.

## Key Takeaway

Writing clean software is about creating explicit mental models. When domain entities encapsulate their own validation and state transitions, refactoring database drivers or frontend frameworks becomes straightforward and risk-free.
`,
  },
];

export function getStandardPostBySlug(slug: string): StandardPost | undefined {
  const normalized = slug.toLowerCase().trim();
  return STANDARD_POSTS.find((p) => p.slug.toLowerCase().trim() === normalized);
}

export function getStandardPostsWithCategories(): PostWithCategories[] {
  return STANDARD_POSTS.map((p) => ({
    ...p,
    categories: p.category_slugs.map((slug) => ({
      id: `cat-${slug}`,
      name: slug.toUpperCase(),
      slug,
    })),
    created_at: p.published_at,
    updated_at: p.published_at,
  }));
}

export function getStandardPostWithCategoriesBySlug(slug: string): PostWithCategories | null {
  const std = getStandardPostBySlug(slug);
  if (!std) return null;
  return {
    ...std,
    categories: std.category_slugs.map((s) => ({
      id: `cat-${s}`,
      name: s.toUpperCase(),
      slug: s,
    })),
    created_at: std.published_at,
    updated_at: std.published_at,
  };
}

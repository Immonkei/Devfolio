-- ==============================================================================
-- DevForge: Initial Seed Data for Senior Software Engineer Portfolio
-- ==============================================================================

-- 1. PROFILE
INSERT INTO public.profiles (
  id,
  name,
  headline,
  bio,
  location,
  avatar_url,
  resume_url,
  github_url,
  linkedin_url,
  twitter_url,
  role
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Phanith Min',
  'Staff Systems & Full-Stack Engineer',
  'Software engineer passionate about high-throughput distributed systems, modern web platforms, database internals, and resilient cloud architectures. 7+ years architecting scalable full-stack applications.',
  'San Francisco, CA & Remote',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  '/resume.pdf',
  'https://github.com/Immonkei',
  'https://linkedin.com',
  'https://x.com',
  'Senior Software Engineer'
) ON CONFLICT (id) DO NOTHING;

-- 2. TECHNOLOGIES
INSERT INTO public.technologies (id, name, category, icon) VALUES
  ('10000000-0000-0000-0000-000000000001', 'TypeScript', 'LANGUAGE', 'typescript'),
  ('10000000-0000-0000-0000-000000000002', 'Go', 'LANGUAGE', 'go'),
  ('10000000-0000-0000-0000-000000000003', 'Rust', 'LANGUAGE', 'rust'),
  ('10000000-0000-0000-0000-000000000004', 'Next.js', 'FRAMEWORK', 'nextjs'),
  ('10000000-0000-0000-0000-000000000005', 'React', 'FRAMEWORK', 'react'),
  ('10000000-0000-0000-0000-000000000006', 'PostgreSQL', 'DATABASE', 'postgresql'),
  ('10000000-0000-0000-0000-000000000007', 'Redis', 'DATABASE', 'redis'),
  ('10000000-0000-0000-0000-000000000008', 'Docker', 'DEVOPS', 'docker'),
  ('10000000-0000-0000-0000-000000000009', 'Kubernetes', 'DEVOPS', 'kubernetes'),
  ('10000000-0000-0000-0000-000000000010', 'Tailwind CSS', 'TOOL', 'tailwindcss')
ON CONFLICT (id) DO NOTHING;

-- 3. PROJECTS
INSERT INTO public.projects (
  id,
  title,
  slug,
  short_description,
  description,
  problem,
  solution,
  architecture,
  implementation,
  challenges,
  tradeoffs,
  results,
  cover_image_url,
  github_url,
  live_url,
  featured,
  status,
  display_order
) VALUES (
  '20000000-0000-0000-0000-000000000001',
  'DevForge: Dynamic Engineering Portfolio Platform',
  'devforge-platform',
  'A small production-style full-stack portfolio platform where all content is data rather than static code.',
  'Architected as a single Next.js application backed by Supabase Auth, PostgreSQL, Storage, and Row-Level Security.',
  'Portfolio websites often fall into two traps: static hardcoded code that cannot be updated without redeploying git commits, or over-engineered distributed microservices with unnecessary complexity.',
  'DevForge treats all portfolio content as dynamic PostgreSQL data governed by Row Level Security and managed via a protected administration control plane.',
  'Next.js App Router for server rendering and actions, Supabase SSR for session handling, PostgreSQL with 13 relational tables, and Supabase Storage for binary media.',
  'Implemented with strict TypeScript, Zod schema validation, server-side authorization guards, responsive accessible shadcn UI tokens, and lightweight privacy-first telemetry.',
  'Enforcing zero service-role leakage to client bundles while providing seamless authentication persistence through cookie middleware.',
  'Chose single application monorepo over independent microservices to reduce deployment surface area, latency, and operational burden.',
  'P99 page load under 120ms with static prerendering and dynamic server revalidation. Zero hardcoded portfolio content.',
  'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
  'https://github.com/Immonkei/Devfolio',
  'https://devforge.local',
  TRUE,
  'PUBLISHED',
  1
), (
  '20000000-0000-0000-0000-000000000002',
  'Aether: High-Throughput Event Streaming Bus',
  'aether-event-bus',
  'Distributed event ingestion pipeline processing 250,000 events/sec with guaranteed at-least-once delivery.',
  'Designed for real-time telemetry processing using Go, Kafka partition consumer groups, and Redis backpressure buffers.',
  'Incoming telemetry spikes caused cascade database connection pool exhaustion and memory bloat across worker nodes.',
  'Constructed a partitioned stream consumer in Go with sliding-window rate limiters and tiered backpressure writes to persistent storage.',
  'L4 load balancer -> Go ingestion gateway -> Kafka broker clusters -> Worker microservices -> Time-series PostgreSQL hypertable.',
  'Zero-allocation JSON parsers, ring buffers for batching inserts, and Prometheus instrumentation for lag visibility.',
  'Rebalancing partition consumers without dropping active TCP connections during auto-scaling events.',
  'Prioritized ingestion availability and eventual consistency over strict linearizability for telemetry data.',
  'Achieved 99.99% ingestion uptime during peak loads while reducing cloud infrastructure footprint by 42%.',
  'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
  'https://github.com/Immonkei',
  NULL,
  TRUE,
  'PUBLISHED',
  2
) ON CONFLICT (id) DO NOTHING;

-- 4. PROJECT_TECHNOLOGIES
INSERT INTO public.project_technologies (project_id, technology_id) VALUES
  ('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001'),
  ('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000004'),
  ('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000006'),
  ('20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000002'),
  ('20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000007'),
  ('20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000008')
ON CONFLICT DO NOTHING;

-- 5. EXPERIENCES
INSERT INTO public.experiences (
  id,
  company,
  role,
  description,
  responsibilities,
  start_date,
  end_date,
  is_current,
  display_order
) VALUES (
  '30000000-0000-0000-0000-000000000001',
  'Apex Systems',
  'Lead Full-Stack Engineer',
  'Spearheaded architecture of cloud infrastructure and core platform engineering across distributed development teams.',
  ARRAY[
    'Architected core microservices handling millions of API requests daily with 99.99% uptime',
    'Designed database schemas, migration pipelines, and automated performance profiling with PostgreSQL',
    'Mentored 8 mid-level engineers across system design, code review standards, and CI/CD best practices'
  ],
  '2023-01-01',
  NULL,
  TRUE,
  1
), (
  '30000000-0000-0000-0000-000000000002',
  'Nexus Cloud Technologies',
  'Senior Software Engineer',
  'Built high-performance APIs and distributed caching tiers for enterprise analytics customers.',
  ARRAY[
    'Optimized SQL query performance reducing critical endpoint latency from 450ms to 42ms',
    'Implemented event-driven ingestion queues using Redis streams and Go worker consumers',
    'Authored comprehensive integration test suites and automated deployment workflows'
  ],
  '2021-03-01',
  '2022-12-31',
  FALSE,
  2
) ON CONFLICT (id) DO NOTHING;

-- 6. EDUCATION
INSERT INTO public.education (
  id,
  institution,
  degree,
  description,
  start_date,
  end_date,
  display_order
) VALUES (
  '40000000-0000-0000-0000-000000000001',
  'State University of Technology',
  'B.S. in Computer Science',
  'Focus on Distributed Systems, Algorithms, and Database Management Systems. Magna Cum Laude.',
  '2017-09-01',
  '2021-05-31',
  1
) ON CONFLICT (id) DO NOTHING;

-- 7. CATEGORIES
INSERT INTO public.categories (id, name, slug) VALUES
  ('50000000-0000-0000-0000-000000000001', 'System Architecture', 'system-architecture'),
  ('50000000-0000-0000-0000-000000000002', 'Database Internals', 'database-internals'),
  ('50000000-0000-0000-0000-000000000003', 'Performance Engineering', 'performance-engineering')
ON CONFLICT (id) DO NOTHING;

-- 8. POSTS
INSERT INTO public.posts (
  id,
  title,
  slug,
  excerpt,
  content,
  status,
  published_at
) VALUES (
  '60000000-0000-0000-0000-000000000001',
  'Designing Production RLS Policies in PostgreSQL: Lessons Learned',
  'postgresql-rls-production-guide',
  'A deep technical examination into Row Level Security overhead, execution plan caching, and avoiding security bypasses.',
  '# Designing Production RLS Policies in PostgreSQL

Row Level Security (RLS) is one of PostgreSQL''s most formidable security primitives, enabling authorization rules to live directly alongside data storage rather than relying strictly on application-tier logic.

## The Core Pitfalls

1. **Subquery Execution In Overhead**: Avoid unbounded subqueries inside `USING` clauses. Instead, leverage session claims (`auth.uid()`) or materialized role mappings.
2. **Bypassing Indexes**: Ensure policy predicate columns are properly indexed. When filtering on `status = ''PUBLISHED''`, lack of partial indexes will force sequential table scans.
3. **Security Definer Function Escapes**: When writing stored helper functions, always lock down the search path: `SET search_path = public`.

## Architecture Recommendation

Structure policies with explicit separation between public reads and authenticated mutations. Always test policies under both unauthenticated and authenticated roles directly.',
  'PUBLISHED',
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- 9. POST_CATEGORIES
INSERT INTO public.post_categories (post_id, category_id) VALUES
  ('60000000-0000-0000-0000-000000000001', '50000000-0000-0000-0000-000000000002')
ON CONFLICT DO NOTHING;

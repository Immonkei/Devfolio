-- ==============================================================================
-- DevForge: Authentic Seed Data for Min Phanith (Immonkei)
-- Junior Full-Stack Developer & IT Engineering Student @ RUPP
-- 100% Idempotent Upserts using natural UNIQUE constraints (name, slug)
-- ==============================================================================

-- 1. PROFILE
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM public.profiles LIMIT 1) THEN
    UPDATE public.profiles SET
      name = 'Min Phanith',
      headline = 'Junior Full-Stack Developer · IT Engineering @ RUPP',
      bio = 'I am a dedicated IT Engineering student at the Royal University of Phnom Penh (RUPP) with hands-on experience as a junior developer. My practice centers on building clean REST APIs, structured database schemas, reliable authentication flows, and seamless frontend integrations. I approach software development with a focus on code readability, maintainability, and team collaboration through Git, code reviews, and Agile workflows.',
      location = 'Phnom Penh, Cambodia',
      avatar_url = '/avatar.png',
      resume_url = '/resume.pdf',
      github_url = 'https://github.com/Immonkei',
      linkedin_url = 'https://www.linkedin.com/in/min-phanith-5a57ba33b/',
      twitter_url = 'https://t.me/minphanith',
      role = 'Junior Full-Stack Developer',
      updated_at = NOW();
  ELSE
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
      'Min Phanith',
      'Junior Full-Stack Developer · IT Engineering @ RUPP',
      'I am a dedicated IT Engineering student at the Royal University of Phnom Penh (RUPP) with hands-on experience as a junior developer. My practice centers on building clean REST APIs, structured database schemas, reliable authentication flows, and seamless frontend integrations. I approach software development with a focus on code readability, maintainability, and team collaboration through Git, code reviews, and Agile workflows.',
      'Phnom Penh, Cambodia',
      '/avatar.png',
      '/resume.pdf',
      'https://github.com/Immonkei',
      'https://www.linkedin.com/in/min-phanith-5a57ba33b/',
      'https://t.me/minphanith',
      'Junior Full-Stack Developer'
    );
  END IF;
END $$;

-- 2. TECHNOLOGIES
-- Idempotent upsert matching the UNIQUE constraint on (name)
INSERT INTO public.technologies (name, category, icon) VALUES
  ('JavaScript', 'LANGUAGE', 'javascript'),
  ('TypeScript', 'LANGUAGE', 'typescript'),
  ('PHP', 'LANGUAGE', 'php'),
  ('Python', 'LANGUAGE', 'python'),
  ('Java', 'LANGUAGE', 'java'),
  ('C/C++', 'LANGUAGE', 'cplusplus'),
  ('React', 'FRAMEWORK', 'react'),
  ('Next.js', 'FRAMEWORK', 'nextjs'),
  ('Tailwind CSS', 'TOOL', 'tailwindcss'),
  ('Node.js', 'FRAMEWORK', 'nodejs'),
  ('Express.js', 'FRAMEWORK', 'express'),
  ('Laravel', 'FRAMEWORK', 'laravel'),
  ('FastAPI', 'FRAMEWORK', 'fastapi'),
  ('PostgreSQL', 'DATABASE', 'postgresql'),
  ('MongoDB', 'DATABASE', 'mongodb'),
  ('MySQL', 'DATABASE', 'mysql'),
  ('Firebase', 'DATABASE', 'firebase'),
  ('Amazon DynamoDB', 'DATABASE', 'dynamodb'),
  ('Docker', 'DEVOPS', 'docker'),
  ('AWS Lambda', 'DEVOPS', 'awslambda'),
  ('Git', 'TOOL', 'git'),
  ('Flutter', 'FRAMEWORK', 'flutter'),
  ('NestJS', 'FRAMEWORK', 'nestjs'),
  ('GitHub', 'TOOL', 'github'),
  ('JWT', 'TOOL', 'jwt'),
  ('POSTMAN', 'TOOL', 'postman'),
  ('Swagger', 'TOOL', 'swagger'),
  ('VS code', 'TOOL', 'vscode'),
  ('Redis', 'DATABASE', 'redis'),
  ('shadcn/ui', 'OTHER', 'shadcn'),
  ('GraphQL', 'TOOL', 'graphql'),
  ('REST API design', 'TOOL', 'restapi'),
  ('OpenAPI', 'TOOL', 'openapi'),
  ('Vite', 'TOOL', 'vite'),
  ('Redux', 'TOOL', 'redux'),
  ('Zustand', 'TOOL', 'zustand'),
  ('TanStack Query', 'TOOL', 'tanstack'),
  ('Zod', 'TOOL', 'zod'),
  ('Bruno', 'TOOL', 'bruno'),
  ('Curl', 'TOOL', 'curl'),
  ('Meilisearch', 'DATABASE', 'meilisearch')
ON CONFLICT (name) DO UPDATE SET
  category = EXCLUDED.category,
  icon = EXCLUDED.icon;

-- 3. WORK EXPERIENCE
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
) VALUES
  (
    '20000000-0000-0000-0000-000000000001',
    'ALLWEB Co., Ltd.',
    'Web Developer',
    'Built responsive frontend user interfaces, structured modular component architectures, and maintained existing backend services using NestJS and GraphQL.',
    ARRAY[
      'Crafted responsive, accessible UIs utilizing React.js, Next.js, Tailwind CSS, and shadcn/ui primitives.',
      'Developed reusable component libraries following Atomic Design methodology for enterprise client platforms.',
      'Maintained and extended existing backend microservices using NestJS, TypeScript, and GraphQL APIs.',
      'Contributed to code reviews, sprint planning, and UI/UX design enhancements in an Agile workflow.'
    ],
    '2026-07-01',
    NULL,
    TRUE,
    1
  ),
  (
    '20000000-0000-0000-0000-000000000002',
    'AIML Technologies Co., Ltd.',
    'Back End Developer',
    'Engineered and maintained cloud-connected backend services using Node.js, designing high-throughput REST APIs and serverless components.',
    ARRAY[
      'Developed and maintained backend services using Node.js and modern JavaScript standards.',
      'Designed, tested, and documented robust RESTful API endpoints for client mobile and web applications.',
      'Integrated AWS Lambda serverless functions and external third-party API service pipelines.',
      'Managed schema structures and document queries using Amazon DynamoDB.',
      'Participated actively in pull requests, peer code reviews, and cross-functional Agile team sprints.',
      'Delivered scalable, maintainable, and reliable backend features adhering to security best practices.'
    ],
    '2026-03-01',
    '2026-05-31',
    FALSE,
    2
  )
ON CONFLICT (id) DO UPDATE SET
  company = EXCLUDED.company,
  role = EXCLUDED.role,
  description = EXCLUDED.description,
  responsibilities = EXCLUDED.responsibilities,
  start_date = EXCLUDED.start_date,
  end_date = EXCLUDED.end_date,
  is_current = EXCLUDED.is_current,
  display_order = EXCLUDED.display_order;

-- 4. EDUCATION
INSERT INTO public.education (
  id,
  institution,
  degree,
  description,
  start_date,
  end_date,
  display_order
) VALUES (
  '30000000-0000-0000-0000-000000000001',
  'Faculty of Engineering, Royal University of Phnom Penh (RUPP)',
  'Bachelor of Information Technology Engineering (ITE)',
  'Accredited 4-year engineering program emphasizing software engineering, computer organization, and practical system development. Core curriculum and practicum include Advanced Programming, Data Structures & Algorithms, Object-Oriented Analysis & Design (OOAD), Web Technologies & Cloud Computing, Database Systems II, Operating Systems, Mobile Application Development, Information Security, and Capstone Final Project.',
  '2023-10-01',
  '2027-07-31',
  1
) ON CONFLICT (id) DO UPDATE SET
  institution = EXCLUDED.institution,
  degree = EXCLUDED.degree,
  description = EXCLUDED.description,
  start_date = EXCLUDED.start_date,
  end_date = EXCLUDED.end_date,
  display_order = EXCLUDED.display_order;

-- 5. PROJECTS
-- Idempotent upsert matching the UNIQUE constraint on (slug)
INSERT INTO public.projects (
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
) VALUES
  (
    'EaseLife - Production Personal Operating System',
    'easelife',
    'A production-grade personal operating system built with Next.js 16, Tailwind CSS v4, and Supabase featuring visible lineage architecture and dynamic pace engines.',
    'EaseLife grounds daily concrete execution in high-level purpose via an unbroken hierarchy: Vision -> Goal -> Milestone -> Project -> Task/Habit. The application features zero-redundancy mathematically derived progress calculations, real-time pace deltas, and timezone-normalized immutable habit completion tracking.',
    'Daily productivity systems suffer from fragmented task tracking where atomic to-dos become disconnected from long-term goals, and arbitrary streak counters fail across timezone shifts.',
    'Engineered Visible Lineage Architecture providing an inspectable relational drawer for any task, backed by real-time mathematical progress engines and midday-normalized date logs.',
    'Next.js 16 App Router full-stack architecture with Turbopack, Tailwind CSS v4, and Supabase PostgreSQL with strict Row Level Security (RLS) policies and Task XOR ownership constraints.',
    'Implemented atomic weighted project progress formulas, real-time pace deltas (On Track, At Risk, Off Track), optimistic UI mutations, and immutable habit completion event logs.',
    'Normalizing date-stamped completion logs across midnight and DST boundaries without introducing distributed lock latency.',
    'Computing project completion percentages dynamically on request rather than storing denormalized counts to guarantee absolute data consistency.',
    'Delivered sub-30ms client interactions with zero desynchronization across multi-device usage.',
    '/projects/easelife.svg',
    'https://github.com/Immonkei/EaseLife',
    NULL,
    TRUE,
    'PUBLISHED',
    1
  ),
  (
    'Borejak - Blood Donation System',
    'borejak',
    'An integrated blood donation platform featuring automated donor eligibility verification, administrative triage dashboards, and emergency request dispatch.',
    'Borejak is a production-style healthcare application connecting volunteer blood donors with medical facilities in urgent need. Built using Next.js and Node.js with PostgreSQL, the platform streamlines the donor lifecycle from medical pre-screening questionnaires to appointment confirmation and hospital inventory oversight.',
    'Blood donation initiatives encounter high attrition due to confusing manual health eligibility criteria and disconnected hospital emergency dispatch queues.',
    'Engineered an automated multi-step clinical evaluation questionnaire that calculates donor eligibility before appointment scheduling, reducing triage overhead.',
    'Next.js modular full-stack architecture with RESTful API handlers, PostgreSQL relational data persistence, and role-based access control.',
    'Implemented donor appointment scheduling, hospital blood request dispatch queues, health eligibility verification logic, and administrative triage interfaces.',
    'Handling edge cases in medical questionnaire expiration and ensuring strict patient data confidentiality.',
    'Selected relational PostgreSQL over NoSQL to maintain strict ACID compliance on critical blood inventory records and hospital request queues.',
    'Successfully validated donor flows, decreased pre-screening friction, and established structured emergency request protocols.',
    '/projects/borejak.svg',
    'https://github.com/Immonkei/Borejak',
    NULL,
    TRUE,
    'PUBLISHED',
    2
  ),
  (
    'UNSAID - Anonymous Expression Platform',
    'unsaid',
    'A safe, minimal anonymous emotional expression platform with automated content moderation, report queues, and Meta Graph API auto-publishing.',
    'UNSAID provides an anonymous outlet where users can safely submit thoughts, confessions, and unspoken reflections. Features two-tier content moderation, rate-limiting security, and automated webhook publishers to social channels.',
    'People lack safe, privacy-preserving digital spaces to voice vulnerable emotional thoughts without social algorithmic pressure or toxic feedback.',
    'Constructed a minimal anonymous submission platform with automated sentiment checks, admin review workflows, and automated Meta Graph API publishing.',
    'Next.js App Router frontend with React 19 coupled to an Express and TypeScript backend utilizing PostgreSQL and Prisma ORM.',
    'Implemented Zod validation schemas, BCrypt & JWT admin authentication, spam throttling middleware, and Meta Graph API webhook dispatchers.',
    'Filtering malicious content and automated spam while preserving absolute user anonymity with zero IP or tracking log retention.',
    'Implemented queue-based moderation review over instant unmoderated publishing to guarantee community safety and prevent harassment.',
    'Successfully processed anonymous submissions with zero identifiable user metadata leakage.',
    '/projects/unsaid.svg',
    'https://github.com/Immonkei/UNSAID',
    NULL,
    TRUE,
    'PUBLISHED',
    3
  ),
  (
    'ReanHub - Academic LMS',
    'reanhub',
    'A full-stack LMS applying Object-Oriented Analysis & Design (OOAD) with role-based access for students, instructors, and administrators.',
    'ReanHub provides academic institutions with an organized digital portal for managing courses, tracking assignments, and reviewing student submissions. Designed applying Object-Oriented Analysis & Design (OOAD) principles to maximize modularity and maintainability.',
    'Educational workflows involve complex hierarchies (instructors, courses, modules, assignments, submissions) that become unmaintainable when built without strict software architecture.',
    'Applied Object-Oriented Analysis & Design (OOAD) to define clear entity boundaries, abstract data access layers, and separation of concerns.',
    'React frontend coupled with an Express and MongoDB backend, utilizing Mongoose models and JWT authentication middleware.',
    'Constructed intuitive course creation portals, assignment submission file uploaders, and grade evaluation interfaces with Tailwind CSS.',
    'Enforcing strict submission deadline locks across differing client timezones.',
    'Opted for document-oriented MongoDB schema design to easily store heterogeneous assignment questions and variable course metadata.',
    'Delivered clean modular codebase with high reusability across student and instructor modules.',
    '/projects/reanhub.svg',
    'https://github.com/Immonkei/OOAD-Project-ReanHub-',
    NULL,
    TRUE,
    'PUBLISHED',
    4
  ),
  (
    'Tos-Nham - Restaurant Management API',
    'tos-nham-api',
    'A resilient Node.js Express backend supporting multi-branch restaurant operations, QR token arrival verification, table reservations, and orders.',
    'A high-performance restaurant operations backend supporting customer, staff, and admin roles. Features multi-branch isolation, dynamic menu categorization, table booking with deposit calculations, and unique QR token generation for customer arrival verification.',
    'Multi-branch restaurants struggle with fragmented reservation systems, inconsistent deposit tracking, and chaotic front-of-house guest check-ins.',
    'Engineered a centralized REST API architecture featuring branch-scoped database queries, automated 50% deposit calculations, and QR arrival tokens.',
    'Express.js modular routing layer with middleware interceptors for JWT token validation, role-based access control, Multer image upload handling, and Docker containerization.',
    'Implemented secure JWT authentication, multi-branch query filters, automated reservation deposit computation, and QR code token verification endpoints.',
    'Ensuring transactional consistency during peak-hour simultaneous table reservation attempts across multiple restaurant branches.',
    'Scoped all database operations by branch_id rather than running separate microservices per branch to minimize infrastructure complexity and maintenance costs.',
    'Achieved reliable sub-40ms response times across branch menu lookups and reservation dispatch.',
    '/projects/tos-nham-api.svg',
    'https://github.com/Immonkei/Tos-Nham-backend',
    NULL,
    FALSE,
    'PUBLISHED',
    5
  ),
  (
    'Daymark - Habit & Goal Tracking PWA',
    'daymark',
    'A client-driven Progressive Web App for daily habit tracking, streak preservation, and productivity workflows built with Next.js and Supabase.',
    'Daymark delivers a distraction-free habit and goal tracker designed as an offline-first Progressive Web App. Backed by Supabase and Next.js, it provides instant responsiveness, streak analysis, and visual habit heatmaps.',
    'Habit tracker apps often feel bloated, slow to open on mobile devices, and lack reliable offline sync when habits are logged without connectivity.',
    'Built a lightweight Progressive Web App utilizing client-side state caching, optimistic UI updates, and background synchronization.',
    'Next.js App Router client-driven architecture with Tailwind CSS, Lucide icons, and Supabase PostgreSQL with Row Level Security.',
    'Implemented service worker offline caching, habit completion toggle logic, streak calculation algorithms, and habit completion history graphs.',
    'Accurate local streak reconciliation when offline client timestamps sync back to the server.',
    'Prioritized ultra-fast client-side state transitions over heavy server-side validation during daily checkbox logging.',
    'Instant mobile startup time and offline capability across desktop and mobile devices.',
    '/projects/daymark.svg',
    'https://github.com/Immonkei/Daymark',
    NULL,
    FALSE,
    'PUBLISHED',
    6
  ),
  (
    'Recipe Finder - Android Native App',
    'recipe-finder-android',
    'A modern Android application developed with Kotlin and Jetpack Compose implementing MVVM architecture, Retrofit REST client, and Room Database.',
    'A native Android application designed to discover recipes, inspect culinary instructions, and save favorite meals. Developed following modern Android architectural guidelines with Kotlin, Jetpack Compose, Retrofit, Coroutines, and Room local persistence.',
    'Users need rapid recipe discovery with offline access to saved ingredients and preparation steps when cooking without stable internet.',
    'Engineered a clean Android application using MVVM architecture with Room Database local cache synchronization.',
    'Android Native application utilizing Kotlin, Jetpack Compose declarative UI, MVVM design pattern, Retrofit HTTP client, and Room SQLite database.',
    'Built composable UI layouts, asynchronous recipe search queries with Kotlin Coroutines, and Room Database DAO repositories for favorites persistence.',
    'Managing complex state transitions between network loading, empty search results, and local SQLite database queries.',
    'Adopted Jetpack Compose over legacy Android XML views to accelerate UI development and ensure declarative unidirectional data flow.',
    'Smooth 60fps UI performance and offline access to saved recipes.',
    '/projects/campus-mobile-companion.svg',
    'https://github.com/Immonkei/recipe-app-android-M2-MinPhanith',
    NULL,
    FALSE,
    'PUBLISHED',
    7
  ),
  (
    'CipherVerse - Cryptography Explorer',
    'cipherverse',
    'An interactive cryptography visualization application demonstrating RSA key pair generation, modular arithmetic, and encryption algorithms.',
    'An educational web laboratory built with React and TypeScript to deconstruct asymmetric cryptography, RSA key generation, modular exponentiation, and digital signatures.',
    'Public-key cryptography concepts can feel abstract without step-by-step mathematical visualization.',
    'Engineered an interactive step-by-step visualizer breaking down prime generation, Euler totient calculation, modular inverses, and encryption/decryption mathematics.',
    'Client-side TypeScript application utilizing arbitrary-precision BigInt arithmetic and Tailwind CSS.',
    'Implemented pure TypeScript RSA mathematical functions, key visualization cards, and interactive plaintext-to-ciphertext transformations.',
    'Precision handling of large prime calculations and modular math within the browser JavaScript runtime.',
    'Executed all calculations on the client side using native BigInt to eliminate backend latency.',
    'Created a comprehensive visual teaching tool for computer network security and cryptography students.',
    '/projects/cipherverse.svg',
    'https://github.com/Immonkei/RSA-Project-Web',
    NULL,
    FALSE,
    'PUBLISHED',
    8
  )
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  short_description = EXCLUDED.short_description,
  description = EXCLUDED.description,
  problem = EXCLUDED.problem,
  solution = EXCLUDED.solution,
  architecture = EXCLUDED.architecture,
  implementation = EXCLUDED.implementation,
  challenges = EXCLUDED.challenges,
  tradeoffs = EXCLUDED.tradeoffs,
  results = EXCLUDED.results,
  cover_image_url = EXCLUDED.cover_image_url,
  github_url = EXCLUDED.github_url,
  live_url = EXCLUDED.live_url,
  featured = EXCLUDED.featured,
  status = EXCLUDED.status,
  display_order = EXCLUDED.display_order;

-- 6. PROJECT TECHNOLOGIES JUNCTION
-- Dynamic resolution using (slug, tech_name) join so UUID differences never fail
INSERT INTO public.project_technologies (project_id, technology_id)
SELECT p.id, t.id
FROM (VALUES
  -- EaseLife
  ('easelife', 'Next.js'),
  ('easelife', 'TypeScript'),
  ('easelife', 'Tailwind CSS'),
  ('easelife', 'PostgreSQL'),
  ('easelife', 'Docker'),

  -- Borejak
  ('borejak', 'Next.js'),
  ('borejak', 'Node.js'),
  ('borejak', 'Express.js'),
  ('borejak', 'PostgreSQL'),
  ('borejak', 'Tailwind CSS'),

  -- UNSAID
  ('unsaid', 'Next.js'),
  ('unsaid', 'TypeScript'),
  ('unsaid', 'Node.js'),
  ('unsaid', 'Express.js'),
  ('unsaid', 'PostgreSQL'),
  ('unsaid', 'Docker'),

  -- ReanHub
  ('reanhub', 'React'),
  ('reanhub', 'TypeScript'),
  ('reanhub', 'Node.js'),
  ('reanhub', 'Express.js'),
  ('reanhub', 'MongoDB'),
  ('reanhub', 'Tailwind CSS'),
  ('reanhub', 'JWT'),

  -- Tos-Nham API
  ('tos-nham-api', 'Node.js'),
  ('tos-nham-api', 'Express.js'),
  ('tos-nham-api', 'PostgreSQL'),
  ('tos-nham-api', 'JWT'),
  ('tos-nham-api', 'Docker'),
  ('tos-nham-api', 'Git'),

  -- Daymark
  ('daymark', 'Next.js'),
  ('daymark', 'TypeScript'),
  ('daymark', 'Tailwind CSS'),
  ('daymark', 'PostgreSQL'),
  ('daymark', 'Git'),

  -- Recipe Finder Android
  ('recipe-finder-android', 'Git'),
  ('recipe-finder-android', 'REST API design'),

  -- CipherVerse
  ('cipherverse', 'React'),
  ('cipherverse', 'TypeScript'),
  ('cipherverse', 'Tailwind CSS'),
  ('cipherverse', 'Git')
) AS v(project_slug, tech_name)
JOIN public.projects p ON p.slug = v.project_slug
JOIN public.technologies t ON t.name = v.tech_name
ON CONFLICT (project_id, technology_id) DO NOTHING;

-- 7. CATEGORIES FOR POSTS
INSERT INTO public.categories (name, slug) VALUES
  ('Backend Architecture', 'backend-architecture'),
  ('Software Design', 'software-design'),
  ('Database Engineering', 'database-engineering')
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name;

-- 8. POSTS (ENGINEERING NOTES)
INSERT INTO public.posts (
  title,
  slug,
  excerpt,
  content,
  cover_image_url,
  status,
  published_at
) VALUES
  (
    'Architecting Modular REST APIs with Express.js and Role-Based JWT Auth',
    'architecting-modular-rest-apis-express-jwt',
    'A guide to building maintainable, secure RESTful backends using Express route controllers, custom middleware, and stateless JSON Web Tokens.',
    '# Architecting Modular REST APIs with Express.js and Role-Based JWT Auth

As web platforms scale, backend codebases quickly become difficult to maintain if controllers, validation logic, and authentication middleware are tightly coupled. In this note, we examine how to design clean REST APIs with structured controller segregation and stateless token authorization.

## 1. Directory Structure and Separation of Concerns

Organizing an API into distinct layers prevents leaky abstractions:
- **Routes Layer**: Pure route mappings and middleware chains.
- **Controllers Layer**: Request validation, status code resolution, and response serialization.
- **Services Layer**: Core business logic decoupled from HTTP transport.
- **Data Access Layer**: Direct database queries or ORM models.

## 2. Stateless JWT Authorization

By keeping tokens stateless, your API servers remain horizontally scalable without server-side session memory locks.',
    '/notes/modular-rest-apis.svg',
    'PUBLISHED',
    NOW() - INTERVAL '10 days'
  ),
  (
    'Applying Object-Oriented Analysis & Design (OOAD) in Academic and Real-World Web Apps',
    'applying-ooad-in-web-applications',
    'How conceptual class modeling, encapsulation, and SOLID principles improve codebase clarity in complex platforms like Learning Management Systems.',
    '# Applying Object-Oriented Analysis & Design (OOAD) in Web Applications

During the development of **ReanHub**, our academic Learning Management System, applying Object-Oriented Analysis and Design (OOAD) fundamentally changed how we structured complex relationship models between teachers, courses, assignments, and student submissions.

## The Problem: Tight Coupling
Without prior design modeling, web developers often jump straight into writing controller code. This leads to monolithic routes where authorization, business validations, and database writes bleed together.

## The Solution: Domain Modeling
1. **Identify Entities**: Classify core business entities (e.g., `Course`, `Module`, `Assignment`, `Submission`).
2. **Encapsulate Domain Rules**: Methods like `assignment.isPastDueDate()` should belong to the model domain, not scattered across multiple route controllers.
3. **Single Responsibility**: Route controllers only parse HTTP input and invoke domain service methods.

Applying these concepts ensures that as application requirements grow, individual modules can be tested and updated without unintended side effects.',
    '/notes/ooad-web-apps.svg',
    'PUBLISHED',
    NOW() - INTERVAL '5 days'
  )
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  cover_image_url = EXCLUDED.cover_image_url,
  status = EXCLUDED.status,
  published_at = EXCLUDED.published_at;

-- 9. POST CATEGORIES JUNCTION
INSERT INTO public.post_categories (post_id, category_id)
SELECT p.id, c.id
FROM (VALUES
  ('architecting-modular-rest-apis-express-jwt', 'backend-architecture'),
  ('applying-ooad-in-web-applications', 'software-design')
) AS v(post_slug, cat_slug)
JOIN public.posts p ON p.slug = v.post_slug
JOIN public.categories c ON c.slug = v.cat_slug
ON CONFLICT (post_id, category_id) DO NOTHING;

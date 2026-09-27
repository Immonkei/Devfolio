-- ==============================================================================
-- DevForge: Authentic Seed Data for Min Phanith (Immonkei)
-- Junior Full-Stack Developer & IT Engineering Student @ RUPP
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
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  headline = EXCLUDED.headline,
  bio = EXCLUDED.bio,
  location = EXCLUDED.location,
  avatar_url = EXCLUDED.avatar_url,
  resume_url = EXCLUDED.resume_url,
  github_url = EXCLUDED.github_url,
  linkedin_url = EXCLUDED.linkedin_url,
  twitter_url = EXCLUDED.twitter_url,
  role = EXCLUDED.role;

-- 2. TECHNOLOGIES
INSERT INTO public.technologies (id, name, category, icon) VALUES
  ('10000000-0000-0000-0000-000000000001', 'JavaScript', 'LANGUAGE', 'javascript'),
  ('10000000-0000-0000-0000-000000000002', 'TypeScript', 'LANGUAGE', 'typescript'),
  ('10000000-0000-0000-0000-000000000003', 'PHP', 'LANGUAGE', 'php'),
  ('10000000-0000-0000-0000-000000000004', 'Python', 'LANGUAGE', 'python'),
  ('10000000-0000-0000-0000-000000000005', 'Java', 'LANGUAGE', 'java'),
  ('10000000-0000-0000-0000-000000000006', 'C/C++', 'LANGUAGE', 'cplusplus'),
  ('10000000-0000-0000-0000-000000000007', 'React', 'FRAMEWORK', 'react'),
  ('10000000-0000-0000-0000-000000000008', 'Next.js', 'FRAMEWORK', 'nextjs'),
  ('10000000-0000-0000-0000-000000000009', 'Tailwind CSS', 'TOOL', 'tailwindcss'),
  ('10000000-0000-0000-0000-000000000010', 'Node.js', 'FRAMEWORK', 'nodejs'),
  ('10000000-0000-0000-0000-000000000011', 'Express.js', 'FRAMEWORK', 'express'),
  ('10000000-0000-0000-0000-000000000012', 'Laravel', 'FRAMEWORK', 'laravel'),
  ('10000000-0000-0000-0000-000000000013', 'FastAPI', 'FRAMEWORK', 'fastapi'),
  ('10000000-0000-0000-0000-000000000014', 'PostgreSQL', 'DATABASE', 'postgresql'),
  ('10000000-0000-0000-0000-000000000015', 'MongoDB', 'DATABASE', 'mongodb'),
  ('10000000-0000-0000-0000-000000000016', 'MySQL', 'DATABASE', 'mysql'),
  ('10000000-0000-0000-0000-000000000017', 'Firebase', 'DATABASE', 'firebase'),
  ('10000000-0000-0000-0000-000000000018', 'Amazon DynamoDB', 'DATABASE', 'dynamodb'),
  ('10000000-0000-0000-0000-000000000019', 'Docker', 'DEVOPS', 'docker'),
  ('10000000-0000-0000-0000-000000000020', 'AWS Lambda', 'DEVOPS', 'awslambda'),
  ('10000000-0000-0000-0000-000000000021', 'Git', 'TOOL', 'git'),
  ('10000000-0000-0000-0000-000000000022', 'Flutter', 'FRAMEWORK', 'flutter'),
  ('10000000-0000-0000-0000-000000000023', 'NestJS', 'FRAMEWORK', 'nestjs'),
  ('10000000-0000-0000-0000-000000000024', 'GitHub', 'TOOL', 'github'),
  ('10000000-0000-0000-0000-000000000025', 'JWT', 'TOOL', 'jwt'),
  ('10000000-0000-0000-0000-000000000026', 'POSTMAN', 'TOOL', 'postman'),
  ('10000000-0000-0000-0000-000000000027', 'Swagger', 'TOOL', 'swagger'),
  ('10000000-0000-0000-0000-000000000028', 'VS code', 'TOOL', 'vscode'),
  ('10000000-0000-0000-0000-000000000029', 'Redis', 'DATABASE', 'redis'),
  ('10000000-0000-0000-0000-000000000030', 'shadcn/ui', 'OTHER', 'shadcn'),
  ('10000000-0000-0000-0000-000000000031', 'GraphQL', 'TOOL', 'graphql'),
  ('10000000-0000-0000-0000-000000000032', 'REST API design', 'TOOL', 'restapi'),
  ('10000000-0000-0000-0000-000000000033', 'OpenAPI', 'TOOL', 'openapi'),
  ('10000000-0000-0000-0000-000000000034', 'Vite', 'TOOL', 'vite'),
  ('10000000-0000-0000-0000-000000000035', 'Redux', 'TOOL', 'redux'),
  ('10000000-0000-0000-0000-000000000036', 'Zustand', 'TOOL', 'zustand'),
  ('10000000-0000-0000-0000-000000000037', 'TanStack Query', 'TOOL', 'tanstack'),
  ('10000000-0000-0000-0000-000000000038', 'Zod', 'TOOL', 'zod'),
  ('10000000-0000-0000-0000-000000000039', 'Bruno', 'TOOL', 'bruno'),
  ('10000000-0000-0000-0000-000000000040', 'Curl', 'TOOL', 'curl'),
  ('10000000-0000-0000-0000-000000000041', 'Meilisearch', 'DATABASE', 'meilisearch')
ON CONFLICT (id) DO NOTHING;

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
ON CONFLICT (id) DO NOTHING;

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
) VALUES
  (
    '40000000-0000-0000-0000-000000000001',
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
    '40000000-0000-0000-0000-000000000002',
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
    '40000000-0000-0000-0000-000000000003',
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
    '40000000-0000-0000-0000-000000000004',
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
    '40000000-0000-0000-0000-000000000005',
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
    '40000000-0000-0000-0000-000000000006',
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
    '40000000-0000-0000-0000-000000000007',
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
    '40000000-0000-0000-0000-000000000008',
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
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  slug = EXCLUDED.slug,
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
INSERT INTO public.project_technologies (project_id, technology_id) VALUES
  -- EaseLife
  ('40000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000008'), -- Next.js
  ('40000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002'), -- TypeScript
  ('40000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000009'), -- Tailwind CSS
  ('40000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000014'), -- PostgreSQL
  ('40000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000019'), -- Docker

  -- Borejak
  ('40000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000008'), -- Next.js
  ('40000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000010'), -- Node.js
  ('40000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000011'), -- Express.js
  ('40000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000014'), -- PostgreSQL
  ('40000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000009'), -- Tailwind CSS

  -- UNSAID
  ('40000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000008'), -- Next.js
  ('40000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000002'), -- TypeScript
  ('40000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000010'), -- Node.js
  ('40000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000011'), -- Express.js
  ('40000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000014'), -- PostgreSQL
  ('40000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000009'), -- Tailwind CSS
  ('40000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000019'), -- Docker

  -- ReanHub
  ('40000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000007'), -- React
  ('40000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000002'), -- TypeScript
  ('40000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000010'), -- Node.js
  ('40000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000011'), -- Express.js
  ('40000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000015'), -- MongoDB
  ('40000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000009'), -- Tailwind CSS
  ('40000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000025'), -- JWT

  -- Tos-Nham API
  ('40000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000010'), -- Node.js
  ('40000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000011'), -- Express.js
  ('40000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000014'), -- PostgreSQL
  ('40000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000025'), -- JWT
  ('40000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000019'), -- Docker
  ('40000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000021'), -- Git

  -- Daymark
  ('40000000-0000-0000-0000-000000000006', '10000000-0000-0000-0000-000000000008'), -- Next.js
  ('40000000-0000-0000-0000-000000000006', '10000000-0000-0000-0000-000000000002'), -- TypeScript
  ('40000000-0000-0000-0000-000000000006', '10000000-0000-0000-0000-000000000009'), -- Tailwind CSS
  ('40000000-0000-0000-0000-000000000006', '10000000-0000-0000-0000-000000000014'), -- PostgreSQL
  ('40000000-0000-0000-0000-000000000006', '10000000-0000-0000-0000-000000000021'), -- Git

  -- Recipe Finder Android
  ('40000000-0000-0000-0000-000000000007', '10000000-0000-0000-0000-000000000021'), -- Git
  ('40000000-0000-0000-0000-000000000007', '10000000-0000-0000-0000-000000000032'), -- REST API

  -- CipherVerse
  ('40000000-0000-0000-0000-000000000008', '10000000-0000-0000-0000-000000000007'), -- React
  ('40000000-0000-0000-0000-000000000008', '10000000-0000-0000-0000-000000000002'), -- TypeScript
  ('40000000-0000-0000-0000-000000000008', '10000000-0000-0000-0000-000000000009'), -- Tailwind CSS
  ('40000000-0000-0000-0000-000000000008', '10000000-0000-0000-0000-000000000021')  -- Git
ON CONFLICT (project_id, technology_id) DO NOTHING;

-- 7. CATEGORIES FOR POSTS
INSERT INTO public.categories (id, name, slug) VALUES
  ('50000000-0000-0000-0000-000000000001', 'Backend Architecture', 'backend-architecture'),
  ('50000000-0000-0000-0000-000000000002', 'Software Design', 'software-design'),
  ('50000000-0000-0000-0000-000000000003', 'Database Engineering', 'database-engineering')
ON CONFLICT (id) DO NOTHING;

-- 8. POSTS (ENGINEERING NOTES)
INSERT INTO public.posts (
  id,
  title,
  slug,
  excerpt,
  content,
  cover_image_url,
  status,
  published_at
) VALUES
  (
    '60000000-0000-0000-0000-000000000001',
    'Architecting Modular REST APIs with Express.js and Role-Based JWT Auth',
    'architecting-modular-rest-apis-express-jwt',
    'A guide to building maintainable, secure RESTful backends using Express route controllers, custom middleware, and stateless JSON Web Tokens.',
    '# Architecting Modular REST APIs with Express.js and Role-Based JWT Auth

As web platforms scale, backend codebases quickly become difficult to maintain if controllers, validation logic, and authentication middleware are tightly coupled. In this note, we examine how to design clean REST APIs with structured controller segregation and stateless token authorization.

## 1. Directory Structure and Separation of Concerns

Organizing an API into distinct layers prevents leaky abstractions:
- **Routes**: Define HTTP verbs and endpoints, binding middleware chains.
- **Controllers**: Handle request payload extraction, invoke business services, and format response payloads.
- **Middleware**: Intercept requests for authentication, validation, rate limiting, and error handling.
- **Services/Models**: Encapsulate data access and business rules.

## 2. Stateless JWT Authorization

By issuing signed JWT tokens with claims (e.g. `userId`, `role`), our API servers remain stateless:

```javascript
const jwt = require("jsonwebtoken");

function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Missing authorization token" });
    }

    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (!allowedRoles.includes(decoded.role)) {
        return res.status(403).json({ error: "Insufficient permissions" });
      }
      req.user = decoded;
      next();
    } catch (err) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }
  };
}
```

## 3. Key Takeaways
- Always validate incoming payload bodies using schemas before touching the database.
- Centralize error handling middleware to avoid inconsistent error response formats.
- Never store sensitive credentials or long-lived secrets inside JWT claims.',
    '/notes/modular-rest-apis.svg',
    'PUBLISHED',
    NOW() - INTERVAL '10 days'
  ),
  (
    '60000000-0000-0000-0000-000000000002',
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
ON CONFLICT (id) DO NOTHING;

-- 9. POST CATEGORIES JUNCTION
INSERT INTO public.post_categories (post_id, category_id) VALUES
  ('60000000-0000-0000-0000-000000000001', '50000000-0000-0000-0000-000000000001'),
  ('60000000-0000-0000-0000-000000000002', '50000000-0000-0000-0000-000000000002')
ON CONFLICT (post_id, category_id) DO NOTHING;

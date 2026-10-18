-- ==============================================================================
-- Devfolio: Authentic Seed Data for Min Phanith (Immonkei)
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
    'Finora - Personal Finance Tracker',
    'finora',
    'An offline-first personal finance PWA with dynamic daily spending allowance, dual USD/KHR currency conversion, and AI receipt OCR.',
    'Finora helps you stay in control of daily expenses with real-time daily allowance calculations, dual currency support (USD and KHR), offline mode, and quick logging through keypad, voice, or receipt OCR with Google Gemini.',
    'Most finance apps require an internet connection, lack dual USD/KHR currency support for Cambodia, and fail to calculate dynamic daily spending allowances that adjust throughout the month.',
    'Engineered an offline-first PWA using Next.js 16, Supabase PostgreSQL, and Google Gemini AI that calculates dynamic daily allowances, handles real-time USD/KHR exchange rates, and allows instant expense logging via keypad, voice, or receipt OCR.',
    'Next.js App Router, React 19, TypeScript, Tailwind CSS v4, Supabase Auth & PostgreSQL with Row Level Security (RLS) and report RPC functions, service worker offline queue, and Google Gemini multimodal API.',
    'Real-time daily allowance formula, integer-based money math (cents/riel) to prevent float rounding errors, Recharts spending heatmaps, and background offline sync.',
    'Synchronizing offline transaction queues with Supabase without race conditions, and parsing multi-format receipt slips accurately using Google Gemini AI.',
    'Used integer minor units (cents/riel) rather than decimals to eliminate precision errors; chose client-side queue with server validation over heavy CRDTs for simplicity and speed.',
    'Sub-5-second entry time, 100% offline logging reliability with background sync, zero floating-point arithmetic errors, and seamless dual-currency cash flow tracking.',
    '/projects/finora.svg',
    'https://github.com/Immonkei/Finora',
    NULL,
    TRUE,
    'PUBLISHED',
    1
  ),
  (
    'EaseLife - Personal Productivity System',
    'easelife',
    'A personal productivity web app built with Next.js, Tailwind CSS, and Supabase to organize goals, projects, and daily habits.',
    'EaseLife helps you connect daily tasks directly to your long-term goals. It breaks large milestones down into actionable projects and daily habits with live progress tracking and streak analytics.',
    'Most to-do apps keep daily tasks disconnected from long-term goals, making it hard to track meaningful progress.',
    'Built a clear hierarchy connecting Vision, Goals, Projects, and Daily Habits with real-time progress calculations.',
    'Next.js App Router frontend, Tailwind CSS, and Supabase PostgreSQL with Row Level Security (RLS).',
    'Weighted project progress tracking, daily habit checkboxes, streak calculations, and optimistic UI updates.',
    'Handling habit completion dates and streak calculations accurately across multiple time zones.',
    'Calculated completion percentages dynamically on request to guarantee consistent data without sync conflicts.',
    'Fast, responsive app that keeps goals organized with zero multi-device lag.',
    '/projects/easelife.svg',
    'https://github.com/Immonkei/EaseLife',
    NULL,
    TRUE,
    'PUBLISHED',
    2
  ),
  (
    'Borejak - Blood Donation Platform',
    'borejak',
    'A web platform connecting volunteer blood donors with hospitals, featuring donor screening and appointment booking.',
    'Borejak simplifies blood donation by connecting donors directly with hospitals in need. Donors can check eligibility through a simple health questionnaire, book appointments, and hospitals can manage urgent requests.',
    'Blood donation campaigns suffer from slow manual paperwork and fragmented emergency communication with hospitals.',
    'Built an online pre-screening questionnaire and real-time appointment scheduling system for donors and medical staff.',
    'Next.js full-stack architecture with REST API endpoints, PostgreSQL database, and role-based permissions.',
    'Donor appointment scheduling, hospital blood request queues, eligibility verification logic, and admin review interfaces.',
    'Ensuring donor medical questionnaire responses remain private and secure.',
    'Selected PostgreSQL over NoSQL to ensure strict transaction safety for blood requests and appointments.',
    'Streamlined donor check-ins, less paperwork, and reliable hospital emergency coordination.',
    '/projects/borejak.svg',
    'https://github.com/Immonkei/Borejak',
    NULL,
    TRUE,
    'PUBLISHED',
    3
  ),
  (
    'UNSAID - Anonymous Expression Platform',
    'unsaid',
    'A minimal, safe web space for sharing anonymous thoughts, reflections, and confessions with built-in moderation.',
    'UNSAID offers a judgment-free space for honest, anonymous expression. Users can submit unspoken thoughts safely with spam protection and an admin moderation queue.',
    'People often need a safe space to share personal thoughts without social media pressure, follower counts, or profile visibility.',
    'Created an anonymous submission platform with automated spam filters and an admin review workflow.',
    'Next.js frontend with Node.js and Express backend using PostgreSQL and Prisma ORM.',
    'Zod schema validation, admin dashboard with JWT authentication, spam throttling, and Meta Graph API auto-publishing.',
    'Preventing spam and abusive content while strictly never tracking user IP addresses.',
    'Added an admin review step before publishing to keep content safe and constructive.',
    'Safe, privacy-focused platform that protects user identity with zero tracking.',
    '/projects/unsaid.svg',
    'https://github.com/Immonkei/UNSAID',
    NULL,
    TRUE,
    'PUBLISHED',
    4
  ),
  (
    'ReanHub - Academic LMS',
    'reanhub',
    'A learning management portal for course materials, assignments, and student submissions with role-based access.',
    'ReanHub provides universities and schools with a clean web portal to manage courses, upload homework assignments, and submit student work.',
    'Handling courses, assignment files, and grading across emails and chat groups causes confusion and lost files.',
    'Designed an intuitive LMS with clear role separation for students, instructors, and administrators.',
    'React frontend with an Express and MongoDB backend using Mongoose models and JWT authentication.',
    'Course creation tools, file uploaders for assignments, and student grade tracking tables with Tailwind CSS.',
    'Enforcing assignment submission deadlines consistently across different client timezones.',
    'Used MongoDB to easily store different course formats and varied homework question types.',
    'Clean, modular codebase with intuitive workflows for both students and instructors.',
    '/projects/reanhub.svg',
    'https://github.com/Immonkei/OOAD-Project-ReanHub-',
    NULL,
    TRUE,
    'PUBLISHED',
    5
  ),
  (
    'Tos-Nham - Restaurant Management API',
    'tos-nham-api',
    'A REST API for multi-branch restaurant management, table reservations, deposit calculations, and QR check-in.',
    'Tos-Nham powers daily operations for restaurants with multiple branches. It handles menu categories, table bookings with deposit calculations, and QR codes for customer arrival check-in.',
    'Multi-branch restaurants struggle with fragmented reservation logs, inconsistent deposits, and slow front-of-house check-ins.',
    'Built a centralized REST API with branch-level filtering, automatic deposit calculations, and QR arrival tokens.',
    'Express.js REST API with JWT authentication, role checks, image upload handling, and PostgreSQL database.',
    'Branch-filtered menu endpoints, reservation deposit processing, and QR code verification routes.',
    'Preventing double-booking during peak dining hours across different branches.',
    'Managed all branches in a single database partitioned by branch ID to reduce server costs and complexity.',
    'Fast, dependable API with response times under 40ms for menu loading and booking verification.',
    '/projects/tos-nham-api.svg',
    'https://github.com/Immonkei/Tos-Nham-backend',
    NULL,
    FALSE,
    'PUBLISHED',
    6
  ),
  (
    'Daymark - Habit & Goal Tracker PWA',
    'daymark',
    'A clean Progressive Web App for tracking daily habits, building streaks, and staying productive offline or online.',
    'Daymark is a simple, distraction-free habit tracker built to work seamlessly on mobile and desktop. Powered by Next.js and Supabase, it gives you quick daily checkboxes, streak statistics, and monthly progress charts.',
    'Many habit apps are bloated, slow to open on mobile, and lose your progress when you lose internet connection.',
    'Built a lightweight Progressive Web App with offline caching, instant local state updates, and background sync.',
    'Next.js App Router client architecture, Tailwind CSS, Lucide icons, and Supabase PostgreSQL with Row Level Security.',
    'Service worker offline caching, one-tap habit toggles, streak calculation algorithms, and habit completion charts.',
    'Syncing offline habit timestamps accurately when the device reconnects to the network.',
    'Prioritized instant local UI response over waiting for network calls so checking off habits feels instant.',
    'Instant startup time and reliable offline capability across mobile and desktop devices.',
    '/projects/daymark.svg',
    'https://github.com/Immonkei/Daymark',
    NULL,
    FALSE,
    'PUBLISHED',
    7
  ),
  (
    'Recipe Finder - Android App',
    'recipe-finder-android',
    'A native Android app to search food recipes, inspect cooking steps, and save favorite meals offline.',
    'Recipe Finder helps you discover new meals, read step-by-step cooking instructions, and save favorite recipes locally on your phone using modern Android design.',
    'Cooks need fast recipe lookups with offline access when cooking in kitchens with poor Wi-Fi.',
    'Engineered a native Android application using MVVM architecture with Room SQLite database for offline caching.',
    'Android Native app with Kotlin, Jetpack Compose declarative UI, MVVM pattern, Retrofit HTTP client, and Room Database.',
    'Composable UI screens, recipe search API integration with Coroutines, and local bookmarks database.',
    'Managing UI states smoothly between network loading, empty search results, and local SQLite data.',
    'Used modern Jetpack Compose instead of legacy XML views to build a faster, cleaner interface.',
    'Smooth 60fps UI performance and full offline access to saved recipes.',
    '/projects/campus-mobile-companion.svg',
    'https://github.com/Immonkei/recipe-app-android-M2-MinPhanith',
    NULL,
    FALSE,
    'PUBLISHED',
    8
  ),
  (
    'CipherVerse - Cryptography Explorer',
    'cipherverse',
    'An interactive web visualizer to demonstrate RSA key generation, modular math, and encryption algorithms.',
    'CipherVerse is an interactive learning tool that breaks down public-key cryptography step-by-step. Users can generate primes, calculate keys, and test encryption in real time.',
    'Cryptography concepts like RSA and modular math can feel abstract and difficult to grasp without step-by-step visual examples.',
    'Built an interactive visualizer that walks users through prime selection, key pair generation, and message encryption.',
    'Client-side React and TypeScript application using native BigInt for precision math, styled with Tailwind CSS.',
    'Pure TypeScript RSA algorithms, animated step cards, and interactive plaintext-to-ciphertext demos.',
    'Calculating large numbers quickly in the browser without freezing the user interface.',
    'Executed all calculations in the browser using native BigInt to eliminate server costs and network delays.',
    'Clear, interactive learning tool used by students to understand encryption principles.',
    '/projects/cipherverse.svg',
    'https://github.com/Immonkei/RSA-Project-Web',
    NULL,
    FALSE,
    'PUBLISHED',
    9
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
  -- Finora
  ('finora', 'Next.js'),
  ('finora', 'TypeScript'),
  ('finora', 'Tailwind CSS'),
  ('finora', 'PostgreSQL'),
  ('finora', 'React'),
  ('finora', 'Zod'),

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

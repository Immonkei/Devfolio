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
  'Royal University of Phnom Penh (RUPP)',
  'B.Sc. in IT Engineering',
  'Rigorous 4-year engineering curriculum covering data structures, software architecture, database design, computer networks, algorithms, and object-oriented analysis & design (OOAD).',
  '2023-10-01',
  '2027-07-31',
  1
) ON CONFLICT (id) DO NOTHING;

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
    'Borejak - Blood Donation System',
    'borejak',
    'An integrated blood donation management platform featuring real-time donor eligibility verification, administrative dashboards, and emergency blood request APIs.',
    'Borejak is a comprehensive healthcare platform connecting volunteer blood donors with medical facilities in urgent need. Built using Next.js and Node.js with PostgreSQL, the platform streamlines the donor lifecycle from health screening questionnaires to appointment confirmation and administrative inventory oversight.',
    'Blood donation initiatives frequently encounter high attrition due to confusing manual health eligibility criteria and disconnected hospital emergency queues.',
    'Engineered an automated multi-step health evaluation questionnaire that immediately determines donor eligibility according to clinical parameters before scheduling, reducing clinic administrative triage overhead.',
    'Next.js 16 full-stack architecture with modular RESTful API route handlers, PostgreSQL relational data persistence, and Firebase Authentication with role-based access control.',
    'Implemented donor appointment scheduling, hospital blood request dispatch queues, health eligibility verification logic, and administrative triage interfaces.',
    'Handling edge cases in medical questionnaire expiration and ensuring patient data confidentiality across public and administrative views.',
    'Selected relational PostgreSQL over NoSQL to maintain strict ACID compliance on critical blood inventory records and hospital request queues.',
    'Successfully validated donor flows, decreased pre-screening friction, and established structured emergency request protocols.',
    '/projects/borejak.svg',
    'https://github.com/Immonkei/Borejak',
    NULL,
    TRUE,
    'PUBLISHED',
    1
  ),
  (
    '40000000-0000-0000-0000-000000000002',
    'Job Portal REST API',
    'job-portal-api',
    'A resilient backend service designed for job searching, candidate application tracking, authentication security, and administrative moderation.',
    'A high-performance backend application serving recruitment and career management workflows. Engineered with Node.js and Express, the API provides role-separated capabilities for candidates, recruiters, and platform administrators.',
    'Online job platforms suffer from fragmented candidate tracking and insecure document upload pipelines.',
    'Constructed a REST API architecture featuring JWT authentication, role authorization middleware, parameterized query filters, and multipart resume upload processors.',
    'Express.js modular routing layer with middleware interceptors for JWT token validation, rate limiting, and structured error responses.',
    'Implemented JWT token generation and refresh rotations, multipart/form-data resume upload handlers, and paginated query endpoints.',
    'Ensuring zero unauthorized file access for candidate resumes while maintaining fast response latencies across heavy query filtering.',
    'Employed stateless JWT authentication to facilitate horizontal backend scalability without distributed session storage.',
    'Delivered consistent sub-50ms API response times across core job search and candidate application endpoints.',
    '/projects/job-portal-api.svg',
    'https://github.com/Immonkei',
    NULL,
    TRUE,
    'PUBLISHED',
    2
  ),
  (
    '40000000-0000-0000-0000-000000000003',
    'ReanHub - Academic LMS',
    'reanhub',
    'A scalable learning management system engineered to facilitate virtual classroom courses, student assignment submissions, and instructor assessments.',
    'ReanHub provides academic institutions with an organized digital portal for managing courses, tracking assignments, and reviewing student submissions. Designed applying Object-Oriented Analysis & Design (OOAD) principles to maximize modularity and maintainability.',
    'Educational workflows involve complex hierarchies (instructors, courses, modules, assignments, submissions) that become unmaintainable when built without strict software architecture.',
    'Applied Object-Oriented Analysis & Design (OOAD) to define clear entity boundaries, abstract data access layers, and separation of concerns.',
    'React frontend coupled with an Express and MongoDB backend, utilizing Mongoose models and JWT authentication middleware.',
    'Constructed intuitive course creation portals, assignment submission file uploaders, and grade evaluation interfaces with Tailwind CSS.',
    'Enforcing strict submission deadline locks across differing client timezones.',
    'Opted for document-oriented MongoDB schema design to easily store heterogeneous assignment questions and variable course metadata.',
    'Delivered clean modular codebase with high reusability across student and instructor modules.',
    '/projects/reanhub.svg',
    'https://github.com/Immonkei/OOAD-Project-ReanHub-.git',
    NULL,
    TRUE,
    'PUBLISHED',
    3
  ),
  (
    '40000000-0000-0000-0000-000000000004',
    'Thrive - AI Job Recommender',
    'thrive-ai',
    'An intelligent job recommendation platform that analyzes student profile data and aligns them with suitable tech opportunities using matching algorithms.',
    'Thrive bridges the gap between academic education and industry requirements by analyzing student skills and calculating compatibility indices against open job positions.',
    'Undergraduate computer science and IT engineering students struggle to identify entry-level tech roles matching their exact coursework and technical stack.',
    'Implemented skill-similarity calculation logic that evaluates student skill profiles against industry job specifications, producing ranked candidate matches.',
    'FastAPI asynchronous Python backend connected to MySQL, communicating with a responsive React user interface.',
    'Constructed asynchronous REST API endpoints in Python with Pydantic schema validation, and structured relational queries in MySQL.',
    'Optimizing similarity calculation throughput without introducing heavy machine learning dependency overhead.',
    'FastAPI was chosen over Flask for native async request handling and automatic OpenAPI specification documentation.',
    'Enabled instant student profile matching with sub-second recommendation feedback.',
    '/projects/thrive-ai.svg',
    'https://github.com/immonkei/ProjectPracticumYear2',
    NULL,
    TRUE,
    'PUBLISHED',
    4
  ),
  (
    '40000000-0000-0000-0000-000000000005',
    'CipherVerse - Cryptography Explorer',
    'cipherverse',
    'An interactive cryptography visualization application demonstrating RSA key pair generation, modular arithmetic, padding mechanisms, and mathematical encryption.',
    'An educational web laboratory built with React and TypeScript to deconstruct asymmetric cryptography, RSA key generation, modular exponentiation, and digital signatures.',
    'Public-key cryptography concepts can feel abstract without step-by-step mathematical visualization.',
    'Engineered an interactive step-by-step visualizer breaking down prime generation, Euler totient calculation, modular inverses, and encryption/decryption mathematics.',
    'Client-side TypeScript application utilizing arbitrary-precision BigInt arithmetic and Tailwind CSS.',
    'Implemented pure TypeScript RSA mathematical functions, key visualization cards, and interactive plaintext-to-ciphertext transformations.',
    'Precision handling of large prime calculations and modular math within the browser JavaScript runtime.',
    'Executed all calculations on the client side using native BigInt to eliminate backend latency.',
    'Created a comprehensive visual teaching tool for computer network security and cryptography students.',
    '/projects/cipherverse.svg',
    'https://github.com/Immonkei',
    NULL,
    FALSE,
    'PUBLISHED',
    5
  ),
  (
    '40000000-0000-0000-0000-000000000006',
    'Campus Mobile Companion',
    'campus-mobile-companion',
    'A cross-platform mobile application supporting college students with real-time class timetables, campus announcements, and academic resources.',
    'Mobile student utility application engineered using Flutter and Firebase to give university students offline-capable access to campus schedules, grade tracking, and urgent announcements.',
    'Students miss timetable updates and department notifications due to fragmented communication channels.',
    'Centralized campus utility application with real-time Firestore synchronization and local cached offline storage.',
    'Flutter cross-platform application utilizing BLoC state management and Firebase Cloud Firestore.',
    'Built responsive mobile screens, notification listeners, and offline caching network adapters.',
    'Managing offline state transitions when students navigate campus areas with intermittent network coverage.',
    'Flutter enabled a single codebase deployment across both Android and iOS devices.',
    'Streamlined campus timetable accessibility with full offline availability.',
    '/projects/campus-mobile-companion.svg',
    'https://github.com/Immonkei',
    NULL,
    FALSE,
    'PUBLISHED',
    6
  )
ON CONFLICT (id) DO NOTHING;

-- 6. PROJECT TECHNOLOGIES JUNCTION
INSERT INTO public.project_technologies (project_id, technology_id) VALUES
  -- Borejak
  ('40000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000008'), -- Next.js
  ('40000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000010'), -- Node.js
  ('40000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000014'), -- PostgreSQL
  ('40000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000009'), -- Tailwind
  -- Job Portal API
  ('40000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000010'), -- Node.js
  ('40000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000011'), -- Express.js
  ('40000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000017'), -- Firebase
  -- ReanHub
  ('40000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000007'), -- React
  ('40000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000010'), -- Node.js
  ('40000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000015'), -- MongoDB
  -- Thrive AI
  ('40000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000004'), -- Python
  ('40000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000013'), -- FastAPI
  ('40000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000016'), -- MySQL
  -- CipherVerse
  ('40000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000007'), -- React
  ('40000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000002'), -- TypeScript
  -- Campus Mobile Companion
  ('40000000-0000-0000-0000-000000000006', '10000000-0000-0000-0000-000000000022')  -- Flutter
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

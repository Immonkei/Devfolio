import { TechCategory } from "@/types";

export interface StandardTechnology {
  name: string;
  category: TechCategory;
  icon: string;
}

export const STANDARD_TECHNOLOGIES: StandardTechnology[] = [
  // 1. Languages
  { name: "C/C++", category: "LANGUAGE", icon: "cplusplus" },
  { name: "Java", category: "LANGUAGE", icon: "java" },
  { name: "JavaScript", category: "LANGUAGE", icon: "javascript" },
  { name: "PHP", category: "LANGUAGE", icon: "php" },
  { name: "Python", category: "LANGUAGE", icon: "python" },
  { name: "TypeScript", category: "LANGUAGE", icon: "typescript" },

  // 2. Frameworks & Libraries
  { name: "Express.js", category: "FRAMEWORK", icon: "express" },
  { name: "FastAPI", category: "FRAMEWORK", icon: "fastapi" },
  { name: "Flutter", category: "FRAMEWORK", icon: "flutter" },
  { name: "Laravel", category: "FRAMEWORK", icon: "laravel" },
  { name: "NestJS", category: "FRAMEWORK", icon: "nestjs" },
  { name: "Next.js", category: "FRAMEWORK", icon: "nextjs" },
  { name: "Node.js", category: "FRAMEWORK", icon: "nodejs" },
  { name: "React", category: "FRAMEWORK", icon: "react" },

  // 3. Databases & Storage
  { name: "Amazon DynamoDB", category: "DATABASE", icon: "dynamodb" },
  { name: "Firebase", category: "DATABASE", icon: "firebase" },
  { name: "Meilisearch", category: "DATABASE", icon: "meilisearch" },
  { name: "MongoDB", category: "DATABASE", icon: "mongodb" },
  { name: "MySQL", category: "DATABASE", icon: "mysql" },
  { name: "PostgreSQL", category: "DATABASE", icon: "postgresql" },
  { name: "Redis", category: "DATABASE", icon: "redis" },

  // 4. DevOps & Cloud
  { name: "AWS Lambda", category: "DEVOPS", icon: "awslambda" },
  { name: "Docker", category: "DEVOPS", icon: "docker" },

  // 5. Tools & Ecosystem
  { name: "Bruno", category: "TOOL", icon: "bruno" },
  { name: "Curl", category: "TOOL", icon: "curl" },
  { name: "Git", category: "TOOL", icon: "git" },
  { name: "GitHub", category: "TOOL", icon: "github" },
  { name: "GraphQL", category: "TOOL", icon: "graphql" },
  { name: "JWT", category: "TOOL", icon: "jwt" },
  { name: "OpenAPI", category: "TOOL", icon: "openapi" },
  { name: "POSTMAN", category: "TOOL", icon: "postman" },
  { name: "Redux", category: "TOOL", icon: "redux" },
  { name: "REST API design", category: "TOOL", icon: "restapi" },
  { name: "Swagger", category: "TOOL", icon: "swagger" },
  { name: "Tailwind CSS", category: "TOOL", icon: "tailwindcss" },
  { name: "TanStack Query", category: "TOOL", icon: "tanstack" },
  { name: "Vite", category: "TOOL", icon: "vite" },
  { name: "VS code", category: "TOOL", icon: "vscode" },
  { name: "Zod", category: "TOOL", icon: "zod" },
  { name: "Zustand", category: "TOOL", icon: "zustand" },

  // 6. UI / Other
  { name: "shadcn/ui", category: "OTHER", icon: "shadcn" },
];

export const TECH_ICON_MAP: Record<string, string> = {
  // Languages
  javascript: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
  js: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
  typescript: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
  ts: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
  php: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg",
  python: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
  py: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
  java: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg",
  cplusplus: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg",
  "c/c++": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg",
  "c++": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg",
  cpp: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg",
  c: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg",
  csharp: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg",
  "c#": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg",
  rust: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/rust/rust-original.svg",
  go: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original.svg",
  golang: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original.svg",
  ruby: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ruby/ruby-original.svg",
  kotlin: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kotlin/kotlin-original.svg",
  swift: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/swift/swift-original.svg",
  dart: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dart/dart-original.svg",
  html: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
  html5: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
  css: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg",
  css3: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg",

  // Frameworks & Libraries
  react: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
  "react.js": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
  reactjs: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
  nextjs: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg",
  "next.js": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg",
  nodejs: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
  "node.js": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
  node: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
  express: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg",
  "express.js": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg",
  expressjs: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg",
  nestjs: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nestjs/nestjs-original.svg",
  "nest.js": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nestjs/nestjs-original.svg",
  fastapi: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg",
  laravel: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/laravel/laravel-original.svg",
  flutter: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg",
  vue: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg",
  vuejs: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg",
  "vue.js": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg",
  svelte: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/svelte/svelte-original.svg",
  angular: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg",
  django: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-plain.svg",
  flask: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flask/flask-original.svg",
  spring: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg",
  springboot: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg",

  // Databases & Storage
  postgresql: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg",
  postgres: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg",
  mysql: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",
  mongodb: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg",
  mongo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg",
  redis: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg",
  firebase: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg",
  firestore: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg",
  dynamodb: "https://www.vectorlogo.zone/logos/amazon_dynamodb/amazon_dynamodb-icon.svg",
  "amazon dynamodb": "https://www.vectorlogo.zone/logos/amazon_dynamodb/amazon_dynamodb-icon.svg",
  amazondynamodb: "https://www.vectorlogo.zone/logos/amazon_dynamodb/amazon_dynamodb-icon.svg",
  meilisearch: "https://cdn.jsdelivr.net/npm/simple-icons@v14/icons/meilisearch.svg",
  sqlite: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sqlite/sqlite-original.svg",
  supabase: "https://cdn.jsdelivr.net/npm/simple-icons@v14/icons/supabase.svg",
  prisma: "https://cdn.jsdelivr.net/npm/simple-icons@v14/icons/prisma.svg",
  drizzle: "https://cdn.jsdelivr.net/npm/simple-icons@v14/icons/drizzle.svg",

  // DevOps & Cloud
  docker: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg",
  awslambda: "https://cdn.jsdelivr.net/npm/simple-icons@v14/icons/awslambda.svg",
  "aws lambda": "https://cdn.jsdelivr.net/npm/simple-icons@v14/icons/awslambda.svg",
  lambda: "https://cdn.jsdelivr.net/npm/simple-icons@v14/icons/awslambda.svg",
  aws: "https://cdn.jsdelivr.net/npm/simple-icons@v14/icons/awslambda.svg",
  kubernetes: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg",
  terraform: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/terraform/terraform-original.svg",
  nginx: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nginx/nginx-original.svg",
  linux: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg",
  vercel: "https://cdn.jsdelivr.net/npm/simple-icons@v14/icons/vercel.svg",
  cloudflare: "https://cdn.jsdelivr.net/npm/simple-icons@v14/icons/cloudflare.svg",

  // Tools, Ecosystem & Architecture
  git: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg",
  github: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg",
  vscode: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg",
  "vs code": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg",
  postman: "https://www.vectorlogo.zone/logos/getpostman/getpostman-icon.svg",
  swagger: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/swagger/swagger-original.svg",
  tailwindcss: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg",
  "tailwind css": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg",
  tailwind: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg",
  jwt: "https://cdn.jsdelivr.net/npm/simple-icons@v14/icons/jsonwebtokens.svg",
  jsonwebtokens: "https://cdn.jsdelivr.net/npm/simple-icons@v14/icons/jsonwebtokens.svg",
  shadcn: "https://cdn.jsdelivr.net/npm/simple-icons@v14/icons/shadcnui.svg",
  shadcnui: "https://cdn.jsdelivr.net/npm/simple-icons@v14/icons/shadcnui.svg",
  "shadcn/ui": "https://cdn.jsdelivr.net/npm/simple-icons@v14/icons/shadcnui.svg",
  graphql: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/graphql/graphql-plain.svg",
  qraphql: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/graphql/graphql-plain.svg",
  restapi: "https://cdn.jsdelivr.net/npm/simple-icons@v14/icons/openapiinitiative.svg",
  "rest api": "https://cdn.jsdelivr.net/npm/simple-icons@v14/icons/openapiinitiative.svg",
  "rest api design": "https://cdn.jsdelivr.net/npm/simple-icons@v14/icons/openapiinitiative.svg",
  restapidesign: "https://cdn.jsdelivr.net/npm/simple-icons@v14/icons/openapiinitiative.svg",
  openapi: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/openapi/openapi-original.svg",
  "open api": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/openapi/openapi-original.svg",
  vite: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vitejs/vitejs-original.svg",
  vitejs: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vitejs/vitejs-original.svg",
  redux: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redux/redux-original.svg",
  zustand: "https://raw.githubusercontent.com/pmndrs/zustand/main/docs/favicon.ico",
  tanstack: "https://cdn.jsdelivr.net/npm/simple-icons@v14/icons/reactquery.svg",
  "tanstack query": "https://cdn.jsdelivr.net/npm/simple-icons@v14/icons/reactquery.svg",
  tanstackquery: "https://cdn.jsdelivr.net/npm/simple-icons@v14/icons/reactquery.svg",
  reactquery: "https://cdn.jsdelivr.net/npm/simple-icons@v14/icons/reactquery.svg",
  zod: "https://cdn.jsdelivr.net/npm/simple-icons@v14/icons/zod.svg",
  bruno: "https://cdn.jsdelivr.net/npm/simple-icons@v14/icons/bruno.svg",
  curl: "https://cdn.jsdelivr.net/npm/simple-icons@v14/icons/curl.svg",
  trpc: "https://cdn.jsdelivr.net/npm/simple-icons@v14/icons/trpc.svg",
  astro: "https://cdn.jsdelivr.net/npm/simple-icons@v14/icons/astro.svg",
  bun: "https://cdn.jsdelivr.net/npm/simple-icons@v14/icons/bun.svg",
  deno: "https://cdn.jsdelivr.net/npm/simple-icons@v14/icons/deno.svg",
};

/**
 * Normalizes input text into a clean alphanumeric slug
 */
export function normalizeTechSlug(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/\+/g, "plus")
    .replace(/#/g, "sharp")
    .replace(/[^a-z0-9]/g, "");
}

/**
 * Resolves the icon image URL for any technology name or icon key.
 * Automatically looks up explicit mappings, aliases, and CDN fallbacks.
 */
export function getTechIconUrl(icon?: string | null, name?: string | null): string | null {
  // 1. Direct URL check
  if (icon && (icon.startsWith("http://") || icon.startsWith("https://") || icon.startsWith("data:"))) {
    return icon;
  }

  // 2. Direct key lookup in map
  if (icon) {
    const rawIcon = icon.toLowerCase().trim();
    if (TECH_ICON_MAP[rawIcon]) return TECH_ICON_MAP[rawIcon];
    const slugIcon = normalizeTechSlug(rawIcon);
    if (TECH_ICON_MAP[slugIcon]) return TECH_ICON_MAP[slugIcon];
  }

  // 3. Match from technology name
  if (name) {
    const rawName = name.toLowerCase().trim();
    if (TECH_ICON_MAP[rawName]) return TECH_ICON_MAP[rawName];
    const slugName = normalizeTechSlug(rawName);
    if (TECH_ICON_MAP[slugName]) return TECH_ICON_MAP[slugName];
  }

  // 4. Normalized Devicon fallback for standard keys
  const targetKey = icon ? normalizeTechSlug(icon) : name ? normalizeTechSlug(name) : "";
  if (targetKey && /^[a-z0-9_-]+$/.test(targetKey)) {
    return `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${targetKey}/${targetKey}-original.svg`;
  }

  return null;
}

/**
 * Suggests an icon key given a technology name.
 */
export function suggestTechIcon(name: string): string {
  const normalized = normalizeTechSlug(name);
  const found = STANDARD_TECHNOLOGIES.find(
    (t) => normalizeTechSlug(t.name) === normalized || normalizeTechSlug(t.icon) === normalized
  );
  if (found) return found.icon;
  return normalized;
}

/**
 * Suggests an appropriate category given a technology name.
 */
export function suggestTechCategory(name: string): TechCategory {
  const normalized = normalizeTechSlug(name);
  const found = STANDARD_TECHNOLOGIES.find(
    (t) => normalizeTechSlug(t.name) === normalized || normalizeTechSlug(t.icon) === normalized
  );
  if (found) return found.category;

  if (["js", "ts", "python", "py", "java", "c", "cpp", "cplusplus", "csharp", "ruby", "rust", "go", "php", "swift", "kotlin", "dart", "html", "css"].includes(normalized)) {
    return "LANGUAGE";
  }
  if (["react", "next", "nextjs", "vue", "vuejs", "svelte", "angular", "node", "nodejs", "express", "nestjs", "fastapi", "laravel", "django", "flask", "spring", "flutter"].includes(normalized)) {
    return "FRAMEWORK";
  }
  if (["postgres", "postgresql", "mysql", "mongodb", "mongo", "redis", "firebase", "dynamodb", "meilisearch", "sqlite", "supabase"].includes(normalized)) {
    return "DATABASE";
  }
  if (["docker", "kubernetes", "aws", "awslambda", "lambda", "terraform", "nginx", "linux", "vercel", "cloudflare"].includes(normalized)) {
    return "DEVOPS";
  }
  return "TOOL";
}


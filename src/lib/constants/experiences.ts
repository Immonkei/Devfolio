import { Experience } from "@/types";

export const STANDARD_EXPERIENCES: Experience[] = [
  {
    id: "std-exp-allweb",
    company: "ALLWEB Co., Ltd.",
    role: "Web Developer",
    description:
      "Building responsive frontend user interfaces, structuring modular component architectures, and maintaining scalable backend microservices using Next.js, React, NestJS, and GraphQL.",
    responsibilities: [
      "Craft responsive, accessible UIs utilizing React.js, Next.js, Tailwind CSS, and modern component primitives.",
      "Develop reusable component libraries following Atomic Design methodology for enterprise client platforms.",
      "Maintain and extend existing backend microservices using NestJS, TypeScript, and GraphQL APIs.",
      "Contribute to code reviews, sprint planning, and UI/UX design enhancements in an Agile workflow.",
    ],
    start_date: "2026-07-01",
    end_date: null,
    is_current: true,
    display_order: 1,
    created_at: "",
    updated_at: "",
  },
  {
    id: "std-exp-aiml",
    company: "AIML Technologies Co., Ltd.",
    role: "Back End Developer",
    description:
      "Engineered and maintained cloud-connected backend services using Node.js, designing high-throughput REST APIs and serverless components.",
    responsibilities: [
      "Developed and maintained backend services using Node.js and modern JavaScript standards.",
      "Designed, tested, and documented robust RESTful API endpoints for client mobile and web applications.",
      "Integrated AWS Lambda serverless functions and external third-party API service pipelines.",
      "Managed schema structures and document queries using Amazon DynamoDB.",
      "Participated actively in pull requests, peer code reviews, and cross-functional Agile team sprints.",
    ],
    start_date: "2026-03-01",
    end_date: "2026-05-31",
    is_current: false,
    display_order: 2,
    created_at: "",
    updated_at: "",
  },
];

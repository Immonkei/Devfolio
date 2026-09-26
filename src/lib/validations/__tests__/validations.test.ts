import { describe, it, expect } from 'vitest';
import { contactSchema } from '../contact';
import { projectSchema } from '../project';
import { experienceSchema } from '../experience';
import { educationSchema } from '../education';
import { postSchema } from '../post';
import { technologySchema } from '../technology';

describe('Validation Schemas (Zod)', () => {
  describe('contactSchema', () => {
    it('accepts valid contact form submissions', () => {
      const valid = {
        name: 'Jane Developer',
        email: 'jane@example.com',
        subject: 'Engineering Opportunity',
        message: 'I would like to discuss an engineering role with your team.',
      };
      const result = contactSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it('rejects invalid email formats', () => {
      const invalid = {
        name: 'Jane Developer',
        email: 'not-an-email',
        subject: 'Hello',
        message: 'Hello there, let us connect!',
      };
      const result = contactSchema.safeParse(invalid);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('email');
      }
    });

    it('rejects short messages and names', () => {
      const invalid = {
        name: 'A',
        email: 'jane@example.com',
        subject: 'Hi',
        message: 'Hi',
      };
      const result = contactSchema.safeParse(invalid);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.length).toBeGreaterThanOrEqual(2);
      }
    });

    it('rejects submissions where honeypot website field is filled by spam bots', () => {
      const botSubmission = {
        name: 'Spam Bot',
        email: 'bot@spam.com',
        subject: 'Spam Subject',
        message: 'Spam marketing blast message here.',
        website: 'https://spamlink.com',
      };
      const result = contactSchema.safeParse(botSubmission);
      expect(result.success).toBe(false);
    });
  });

  describe('projectSchema', () => {
    it('validates a complete project definition', () => {
      const project = {
        title: 'Distributed Event Bus',
        slug: 'distributed-event-bus',
        short_description: 'High-throughput Kafka-compatible event streamer',
        description: 'Detailed architecture with Go and Raft consensus implementation.',
        live_url: 'https://eventbus.example.com',
        github_url: 'https://github.com/example/eventbus',
        featured: true,
        status: 'PUBLISHED' as const,
        display_order: 1,
        technology_ids: ['a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'],
      };
      const result = projectSchema.safeParse(project);
      expect(result.success).toBe(true);
    });

    it('rejects invalid slugs (uppercase, spaces, special chars)', () => {
      const invalid = {
        title: 'Bad Slug Project',
        slug: 'Bad Slug With Spaces!',
        short_description: 'Short description for testing bad slug validation.',
        description: 'Detailed description long enough for project validation.',
      };
      const result = projectSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it('rejects non-URL formats in live_url or github_url', () => {
      const invalid = {
        title: 'Project Without Valid URLs',
        slug: 'project-without-valid-urls',
        short_description: 'Valid short description for testing url validation.',
        description: 'Valid long description for testing url validation in projects.',
        live_url: 'not-a-valid-url',
        github_url: 'not-a-valid-url',
      };
      const result = projectSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });

  describe('experienceSchema', () => {
    it('validates current employment without end date', () => {
      const currentJob = {
        company: 'Stripe',
        role: 'Staff Infrastructure Engineer',
        description: 'Designing distributed consensus mechanisms.',
        responsibilities: ['Reduced latency by 40%', 'Scaled to 100k rps'],
        start_date: '2024-01-01',
        is_current: true,
      };
      const result = experienceSchema.safeParse(currentJob);
      expect(result.success).toBe(true);
    });

    it('requires company and role', () => {
      const missing = {
        start_date: '2024-01-01',
      };
      const result = experienceSchema.safeParse(missing);
      expect(result.success).toBe(false);
    });
  });

  describe('educationSchema', () => {
    it('validates valid degree entry with ISO dates', () => {
      const edu = {
        institution: 'University of California, Berkeley',
        degree: 'B.S. Computer Science',
        start_date: '2018-09-01',
        end_date: '2022-05-15',
        description: 'Focus on distributed algorithms and operating systems.',
      };
      const result = educationSchema.safeParse(edu);
      expect(result.success).toBe(true);
    });
  });

  describe('postSchema', () => {
    it('validates technical blog post attributes', () => {
      const post = {
        title: 'Zero-Downtime Database Migrations in PostgreSQL',
        slug: 'zero-downtime-database-migrations-postgresql',
        content: '# Deep Dive\n\nHow to alter tables without exclusive locks...',
        excerpt: 'Strategies for safe schema migration under heavy write traffic.',
        published: true,
      };
      const result = postSchema.safeParse(post);
      expect(result.success).toBe(true);
    });
  });

  describe('technologySchema', () => {
    it('validates technology name and category enum', () => {
      const tech = {
        name: 'TypeScript',
        category: 'LANGUAGE' as const,
        icon: 'typescript',
      };
      const result = technologySchema.safeParse(tech);
      expect(result.success).toBe(true);
    });

    it('rejects unknown category values', () => {
      const invalid = {
        name: 'Rust',
        category: 'UNKNOWN_CATEGORY',
      };
      const result = technologySchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });
});

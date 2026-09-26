import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { TechBadge } from '../tech-badge';
import { ProjectCard } from '../project-card';
import { ExperienceCard } from '../experience-card';
import { NoteCard } from '../note-card';
import { ProjectWithTechnologies, Experience, PostWithCategories, Technology } from '@/types';

describe('Public UI Components', () => {
  describe('TechBadge', () => {
    const mockTech: Technology = {
      id: 't1',
      name: 'TypeScript',
      category: 'LANGUAGE',
      icon: 'typescript',
      created_at: '2026-01-01T00:00:00Z',
    };

    it('renders the technology name correctly', () => {
      render(<TechBadge tech={mockTech} />);
      expect(screen.getByText('TypeScript')).toBeInTheDocument();
    });

    it('renders technology badge styling', () => {
      render(<TechBadge tech={{ ...mockTech, name: 'Docker', category: 'DEVOPS' }} />);
      expect(screen.getByText('Docker')).toBeInTheDocument();
    });
  });

  describe('ProjectCard', () => {
    const mockProject: ProjectWithTechnologies = {
      id: 'proj-1',
      title: 'DevForge Engine',
      slug: 'devforge-engine',
      short_description: 'High performance event processor and telemetry pipeline',
      description: 'Distributed event processing system built in Rust.',
      problem: 'High memory usage in high-volume streaming',
      solution: 'Custom zero-copy ring buffer with Raft consensus',
      architecture: 'Distributed peer-to-peer actor mesh',
      implementation: 'Written in idiomatic safe Rust',
      challenges: 'Network partition handling and split-brain resolution',
      tradeoffs: 'Higher memory allocation overhead vs latency guarantees',
      results: 'P99 latency sub-1ms under 50k requests per second',
      cover_image_url: null,
      live_url: 'https://devforge.example.com',
      github_url: 'https://github.com/developer/devforge',
      featured: true,
      status: 'PUBLISHED',
      display_order: 1,
      created_at: '2026-01-01T00:00:00Z',
      updated_at: '2026-01-01T00:00:00Z',
      technologies: [
        { id: 'tech-1', name: 'Rust', category: 'LANGUAGE', icon: 'rust', created_at: '2026-01-01T00:00:00Z' },
        { id: 'tech-2', name: 'Tokio', category: 'FRAMEWORK', icon: 'tokio', created_at: '2026-01-01T00:00:00Z' },
      ],
    };

    it('renders project title and short description', () => {
      render(<ProjectCard project={mockProject} />);
      expect(screen.getByText('DevForge Engine')).toBeInTheDocument();
      expect(screen.getByText('High performance event processor and telemetry pipeline')).toBeInTheDocument();
    });

    it('renders technology tags', () => {
      render(<ProjectCard project={mockProject} />);
      expect(screen.getByText('Rust')).toBeInTheDocument();
      expect(screen.getByText('Tokio')).toBeInTheDocument();
    });

    it('renders links with correct destinations', () => {
      render(<ProjectCard project={mockProject} />);
      const liveLink = screen.getByTitle('Launch Live Application');
      expect(liveLink).toHaveAttribute('href', 'https://devforge.example.com');
      const ghLink = screen.getByTitle('Inspect Repository Source');
      expect(ghLink).toHaveAttribute('href', 'https://github.com/developer/devforge');
    });
  });

  describe('ExperienceCard', () => {
    const mockExperience: Experience = {
      id: 'exp-1',
      company: 'TechCorp Global',
      role: 'Senior Distributed Systems Engineer',
      start_date: '2023-01-01',
      end_date: null,
      is_current: true,
      description: 'Architecting high-scale distributed data pipelines.',
      responsibilities: [
        'Reduced 99th percentile query latency from 250ms to 12ms',
        'Designed idempotent message consumption pipeline',
      ],
      display_order: 1,
      created_at: '2026-01-01T00:00:00Z',
      updated_at: '2026-01-01T00:00:00Z',
    };

    it('renders company name and role', () => {
      render(<ExperienceCard experience={mockExperience} />);
      expect(screen.getByText('Senior Distributed Systems Engineer')).toBeInTheDocument();
      expect(screen.getByText('TechCorp Global')).toBeInTheDocument();
    });

    it('indicates current employment status', () => {
      render(<ExperienceCard experience={mockExperience} />);
      expect(screen.getByText(/Present/i)).toBeInTheDocument();
      expect(screen.getByText(/Current/i)).toBeInTheDocument();
    });

    it('renders responsibilities list', () => {
      render(<ExperienceCard experience={mockExperience} />);
      expect(screen.getByText('Reduced 99th percentile query latency from 250ms to 12ms')).toBeInTheDocument();
      expect(screen.getByText('Designed idempotent message consumption pipeline')).toBeInTheDocument();
    });
  });

  describe('NoteCard', () => {
    const mockNote: PostWithCategories = {
      id: 'post-1',
      title: 'Architecting Resilient Multi-Region Microservices',
      slug: 'architecting-resilient-multi-region-microservices',
      excerpt: 'Lessons learned implementing consensus patterns across distributed clusters.',
      content: 'Detailed article content here...',
      cover_image_url: null,
      status: 'PUBLISHED',
      published_at: '2026-02-15T00:00:00Z',
      created_at: '2026-02-15T00:00:00Z',
      updated_at: '2026-02-15T00:00:00Z',
      categories: [{ id: 'cat-1', name: 'Architecture', slug: 'architecture' }],
    };

    it('renders note title, excerpt, and reading time', () => {
      render(<NoteCard post={mockNote} />);
      expect(screen.getByText('Architecting Resilient Multi-Region Microservices')).toBeInTheDocument();
      expect(screen.getByText('Lessons learned implementing consensus patterns across distributed clusters.')).toBeInTheDocument();
      expect(screen.getByText(/1 min read/i)).toBeInTheDocument();
    });

    it('links to the note detail route', () => {
      render(<NoteCard post={mockNote} />);
      const link = screen.getByRole('link', { name: /Architecting Resilient Multi-Region Microservices/i });
      expect(link).toHaveAttribute('href', '/notes/architecting-resilient-multi-region-microservices');
    });
  });
});

import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { TechBadge } from '../tech-badge';
import { ProjectCard } from '../project-card';
import { ExperienceCard } from '../experience-card';
import { NoteCard } from '../note-card';
import { GitHubActivityGraph } from '../github-activity-graph';
import { MarkdownRenderer } from '../markdown-renderer';
import { NotesDirectory } from '../notes-directory';
import { DownloadCvButton } from '../download-cv-button';
import { ProjectImageGallery } from '../project-image-gallery';
import { ProjectWithTechnologies, Experience, PostWithCategories, Technology, GitHubActivityData } from '@/types';

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
      title: 'Devfolio Engine',
      slug: 'devfolio-engine',
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
      live_url: 'https://devfolio.example.com',
      github_url: 'https://github.com/developer/devfolio',
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
      expect(screen.getByText('Devfolio Engine')).toBeInTheDocument();
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
      expect(liveLink).toHaveAttribute('href', 'https://devfolio.example.com');
      const ghLink = screen.getByTitle('Inspect Repository Source');
      expect(ghLink).toHaveAttribute('href', 'https://github.com/developer/devfolio');
    });

    it('renders project cover image when cover_image_url is provided', () => {
      render(<ProjectCard project={{ ...mockProject, cover_image_url: '/projects/borejak.svg' }} />);
      const img = screen.getByRole('img', { name: 'Devfolio Engine' });
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('src', expect.stringContaining('borejak.svg'));
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
      const links = screen.getAllByRole('link', { name: /Architecting Resilient Multi-Region Microservices/i });
      expect(links.length).toBeGreaterThanOrEqual(1);
      expect(links[0]).toHaveAttribute('href', '/notes/architecting-resilient-multi-region-microservices');
    });

    it('renders note cover image when cover_image_url is provided', () => {
      render(<NoteCard post={{ ...mockNote, cover_image_url: '/notes/modular-rest-apis.svg' }} />);
      const img = screen.getByRole('img', { name: 'Architecting Resilient Multi-Region Microservices' });
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('src', expect.stringContaining('modular-rest-apis.svg'));
    });
  });

  describe('GitHubActivityGraph', () => {
    const mockActivity: GitHubActivityData = {
      totalContributions: 264,
      activeDays: 64,
      currentStreak: 3,
      longestStreak: 6,
      contributions: [
        { date: '2026-09-24', count: 4, level: 2 },
        { date: '2026-09-25', count: 1, level: 1 },
        { date: '2026-09-26', count: 34, level: 4 },
      ],
    };

    it('renders fallback state when activity is null', () => {
      render(<GitHubActivityGraph activity={null} username="Immonkei" />);
      expect(screen.getByText(/Live GitHub activity stream currently offline/i)).toBeInTheDocument();
    });

    it('renders stats and user link when activity data is provided', () => {
      render(<GitHubActivityGraph activity={mockActivity} username="Immonkei" />);
      expect(screen.getByText('264')).toBeInTheDocument();
      expect(screen.getByText('64')).toBeInTheDocument();
      expect(screen.getByText(/3 days/i)).toBeInTheDocument();
      expect(screen.getByText(/6 days/i)).toBeInTheDocument();
      expect(screen.getByText('@Immonkei')).toBeInTheDocument();
    });
  });

  describe('MarkdownRenderer', () => {
    it('renders code block with language and copy button', () => {
      const content = "```typescript\nconst a: number = 42;\n```";
      render(<MarkdownRenderer content={content} />);
      expect(screen.getByText(/typescript/i)).toBeInTheDocument();
      expect(screen.getByText('Copy Code')).toBeInTheDocument();
      expect(screen.getByText('const a: number = 42;')).toBeInTheDocument();
    });

    it('renders GitHub-style callouts properly', () => {
      const content = "> [!NOTE]\n> Critical database insight here.";
      render(<MarkdownRenderer content={content} />);
      expect(screen.getByText('Note')).toBeInTheDocument();
      expect(screen.getByText('Critical database insight here.')).toBeInTheDocument();
    });

    it('renders markdown images with captions', () => {
      const content = "![System Architecture Diagram](/notes/modular-rest-apis.svg)";
      render(<MarkdownRenderer content={content} />);
      const img = screen.getByRole('img', { name: 'System Architecture Diagram' });
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('src', '/notes/modular-rest-apis.svg');
    });

    it('renders markdown tables with headers and rows', () => {
      const content = "| Param | Type |\n| --- | --- |\n| userId | string |";
      render(<MarkdownRenderer content={content} />);
      expect(screen.getByText('Param')).toBeInTheDocument();
      expect(screen.getByText('Type')).toBeInTheDocument();
      expect(screen.getByText('userId')).toBeInTheDocument();
      expect(screen.getByText('string')).toBeInTheDocument();
    });
  });

  describe('NotesDirectory', () => {
    const mockPosts: PostWithCategories[] = [
      {
        id: 'p1',
        title: 'PostgreSQL Connection Pooling Guide',
        slug: 'postgresql-connection-pooling-guide',
        excerpt: 'Benchmarking PgBouncer under 10k concurrent connections.',
        content: 'Article content about database connections...',
        cover_image_url: null,
        status: 'PUBLISHED',
        published_at: '2026-03-01T00:00:00Z',
        created_at: '2026-03-01T00:00:00Z',
        updated_at: '2026-03-01T00:00:00Z',
        categories: [{ id: 'c1', name: 'Database', slug: 'database' }],
      },
      {
        id: 'p2',
        title: 'Building Resilient Microservices',
        slug: 'building-resilient-microservices',
        excerpt: 'Distributed sagas and idempotent APIs.',
        content: 'Article content about architecture...',
        cover_image_url: null,
        status: 'PUBLISHED',
        published_at: '2026-02-15T00:00:00Z',
        created_at: '2026-02-15T00:00:00Z',
        updated_at: '2026-02-15T00:00:00Z',
        categories: [{ id: 'c2', name: 'Architecture', slug: 'architecture' }],
      },
    ];

    it('renders all notes initially with count', () => {
      render(<NotesDirectory initialPosts={mockPosts} />);
      expect(screen.getByText('PostgreSQL Connection Pooling Guide')).toBeInTheDocument();
      expect(screen.getByText('Building Resilient Microservices')).toBeInTheDocument();
      expect(screen.getByText(/2 notes/i)).toBeInTheDocument();
    });

    it('filters notes dynamically by search query', () => {
      render(<NotesDirectory initialPosts={mockPosts} />);
      const searchInput = screen.getByPlaceholderText(/Search notes/i);

      fireEvent.change(searchInput, { target: { value: 'PostgreSQL' } });

      expect(screen.getByText('PostgreSQL Connection Pooling Guide')).toBeInTheDocument();
      expect(screen.queryByText('Building Resilient Microservices')).not.toBeInTheDocument();
    });

    it('shows empty state when no notes match search query and allows reset', () => {
      render(<NotesDirectory initialPosts={mockPosts} />);
      const searchInput = screen.getByPlaceholderText(/Search notes/i);

      fireEvent.change(searchInput, { target: { value: 'NonExistentTopicXYZ' } });

      expect(screen.getByText(/No matching notes found/i)).toBeInTheDocument();

      const clearBtn = screen.getByText('Clear Search');
      fireEvent.click(clearBtn);

      expect(screen.getByText('PostgreSQL Connection Pooling Guide')).toBeInTheDocument();
      expect(screen.getByText('Building Resilient Microservices')).toBeInTheDocument();
    });
  });

  describe('DownloadCvButton', () => {
    it('renders Download CV initially', () => {
      render(<DownloadCvButton />);
      expect(screen.getByRole('button', { name: /Download CV/i })).toBeInTheDocument();
      expect(screen.getByText('Download CV')).toBeInTheDocument();
    });

    it('changes to Coming Soon and shows notification when clicked', () => {
      render(<DownloadCvButton />);
      const btn = screen.getByRole('button', { name: /Download CV/i });
      fireEvent.click(btn);

      expect(screen.getByText('Coming Soon')).toBeInTheDocument();
      expect(screen.getByText('CV Coming Soon')).toBeInTheDocument();
      expect(screen.getByText(/My updated CV is currently being refreshed/i)).toBeInTheDocument();
    });

    it('dismisses toast when close button is clicked', () => {
      render(<DownloadCvButton />);
      const btn = screen.getByRole('button', { name: /Download CV/i });
      fireEvent.click(btn);

      const closeBtn = screen.getByRole('button', { name: /Close notification/i });
      fireEvent.click(closeBtn);

      expect(screen.queryByText('CV Coming Soon')).not.toBeInTheDocument();
    });
  });

  describe('ProjectImageGallery', () => {
    const mockImages = [
      { url: 'https://example.com/shot-1.webp', alt: 'Finora Dashboard', isCover: true },
      { url: 'https://example.com/shot-2.webp', alt: 'Finora Expense Flow', isCover: false },
      { url: 'https://example.com/shot-3.webp', alt: 'Finora Receipt OCR', isCover: false },
    ];

    it('renders single image properly without navigation arrows', () => {
      render(
        <ProjectImageGallery
          images={[{ url: 'https://example.com/shot-1.webp', alt: 'Finora Dashboard', isCover: true }]}
          projectTitle="Finora"
        />
      );

      expect(screen.getByText('1 visual asset')).toBeInTheDocument();
      expect(screen.getByText('Cover Feature')).toBeInTheDocument();
      expect(screen.queryByLabelText('Next image')).not.toBeInTheDocument();
    });

    it('renders multiple images with screenshot counter and navigation controls', () => {
      render(
        <ProjectImageGallery
          images={mockImages}
          projectTitle="Finora"
        />
      );

      expect(screen.getByText('3 screenshots')).toBeInTheDocument();
      expect(screen.getByText('1 / 3')).toBeInTheDocument();
      expect(screen.getByLabelText('Next image')).toBeInTheDocument();
      expect(screen.getByLabelText('Previous image')).toBeInTheDocument();
    });

    it('cycles through images on next button click', () => {
      render(
        <ProjectImageGallery
          images={mockImages}
          projectTitle="Finora"
        />
      );

      const nextBtn = screen.getByLabelText('Next image');
      fireEvent.click(nextBtn);

      expect(screen.getByText('2 / 3')).toBeInTheDocument();
      expect(screen.getByText('Finora Expense Flow')).toBeInTheDocument();
    });

    it('toggles to multi-screenshot grid view', () => {
      render(
        <ProjectImageGallery
          images={mockImages}
          projectTitle="Finora"
        />
      );

      const gridBtn = screen.getByTitle('Multi-Screenshot Grid view');
      fireEvent.click(gridBtn);

      expect(screen.getByText('#1')).toBeInTheDocument();
      expect(screen.getByText('#2')).toBeInTheDocument();
      expect(screen.getByText('#3')).toBeInTheDocument();
    });

    it('opens and closes fullscreen lightbox', () => {
      render(
        <ProjectImageGallery
          images={mockImages}
          projectTitle="Finora"
        />
      );

      const enlargeBtn = screen.getByTitle('Expand to Fullscreen Lightbox');
      fireEvent.click(enlargeBtn);

      const dialog = screen.getByRole('dialog');
      expect(dialog).toBeInTheDocument();

      const closeBtn = screen.getByTitle(/Close Lightbox/i);
      fireEvent.click(closeBtn);

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });
});



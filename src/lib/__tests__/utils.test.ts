import { describe, it, expect } from 'vitest';
import { cn, slugify, readingTime, formatDate, truncate } from '../utils';

describe('Utility Functions', () => {
  describe('cn (classNames)', () => {
    it('merges class names correctly', () => {
      expect(cn('px-2', 'py-1')).toBe('px-2 py-1');
    });

    it('resolves conflicting tailwind classes', () => {
      expect(cn('p-4', 'p-2')).toBe('p-2');
    });

    it('ignores falsy values', () => {
      expect(cn('base', false && 'hidden', null, undefined, 'active')).toBe('base active');
    });
  });

  describe('slugify', () => {
    it('converts titles into clean url slugs', () => {
      expect(slugify('Devfolio Portfolio Platform')).toBe('devfolio-portfolio-platform');
    });

    it('removes punctuation and special characters', () => {
      expect(slugify('High-Performance, Real-Time: Microservices! (v2.0)')).toBe('high-performance-real-time-microservices-v20');
    });

    it('collapses multiple hyphens and trims leading/trailing hyphens', () => {
      expect(slugify('  -- distributed --- caching  system --  ')).toBe('distributed-caching-system');
    });
  });

  describe('readingTime', () => {
    it('returns at least 1 min read for short texts', () => {
      expect(readingTime('Hello world! This is a brief note.')).toBe('1 min read');
    });

    it('returns empty fallback if content is empty', () => {
      expect(readingTime('')).toBe('1 min read');
    });

    it('calculates reading time for longer articles', () => {
      const longText = Array(600).fill('word').join(' ');
      expect(readingTime(longText)).toBe('3 min read');
    });
  });

  describe('formatDate', () => {
    it('formats valid ISO date strings to human-readable month and year', () => {
      const formatted = formatDate('2026-03-15');
      expect(formatted).toContain('2026');
      expect(formatted).toMatch(/Mar/);
    });

    it('handles invalid date strings gracefully', () => {
      expect(formatDate('invalid-date')).toBe('invalid-date');
    });
  });

  describe('truncate', () => {
    it('truncates strings longer than maxLength and appends ellipsis', () => {
      expect(truncate('Supercalifragilisticexpialidocious', 10)).toBe('Supercalif...');
    });

    it('returns original string when length is within limit', () => {
      expect(truncate('Hello world', 20)).toBe('Hello world');
    });
  });
});

import {
  getTechIconUrl,
  suggestTechIcon,
  suggestTechCategory,
  STANDARD_TECHNOLOGIES,
} from '../tech-icons';

describe('Technology Icon & Category Auto-Resolution', () => {
  it('contains exactly 41 standard technologies', () => {
    expect(STANDARD_TECHNOLOGIES).toHaveLength(41);
  });

  it('resolves an icon URL for every one of the 41 standard technologies by name', () => {
    for (const tech of STANDARD_TECHNOLOGIES) {
      const url = getTechIconUrl(null, tech.name);
      expect(url, `Expected icon URL for ${tech.name}`).toBeTruthy();
      expect(typeof url).toBe('string');
      expect(url!.length).toBeGreaterThan(10);
    }
  });

  it('resolves direct URLs, known keys, and normalized aliases', () => {
    expect(getTechIconUrl('https://example.com/icon.svg')).toBe('https://example.com/icon.svg');
    expect(getTechIconUrl('cplusplus')).toContain('cplusplus');
    expect(getTechIconUrl(null, 'C/C++')).toContain('cplusplus');
    expect(getTechIconUrl(null, 'Next.js')).toContain('nextjs');
    expect(getTechIconUrl(null, 'VS code')).toContain('vscode');
    expect(getTechIconUrl(null, 'REST API design')).toContain('openapiinitiative');
  });

  it('auto-suggests category and icon key from name', () => {
    expect(suggestTechCategory('TypeScript')).toBe('LANGUAGE');
    expect(suggestTechCategory('React')).toBe('FRAMEWORK');
    expect(suggestTechCategory('PostgreSQL')).toBe('DATABASE');
    expect(suggestTechCategory('Docker')).toBe('DEVOPS');
    expect(suggestTechCategory('Git')).toBe('TOOL');

    expect(suggestTechIcon('TypeScript')).toBe('typescript');
    expect(suggestTechIcon('C/C++')).toBe('cplusplus');
  });
});


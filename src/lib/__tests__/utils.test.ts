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
      expect(slugify('DevForge Portfolio Platform')).toBe('devforge-portfolio-platform');
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

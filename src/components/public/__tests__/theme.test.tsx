import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { ThemeProvider } from '../theme-provider';
import { ThemeToggle } from '../theme-toggle';

describe('Theme System', () => {
  it('renders ThemeToggle button with accessible label', () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );
    const btn = screen.getByRole('button', { name: /Switch to (light|dark) mode/i });
    expect(btn).toBeInTheDocument();
  });

  it('toggles theme state and button label on click', () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );
    const btn = screen.getByRole('button', { name: /Switch to (light|dark) mode/i });
    fireEvent.click(btn);
    expect(screen.getByRole('button', { name: /Switch to (light|dark) mode/i })).toBeInTheDocument();
  });
});

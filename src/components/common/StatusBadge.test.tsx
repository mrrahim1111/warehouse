import React from 'react';
import { render, screen } from '@testing-library/react';
import { expect, test, describe } from 'vitest';
import { StatusBadge } from './StatusBadge';

describe('StatusBadge Component', () => {
  test('renders priority badge correctly', () => {
    render(<StatusBadge type="priority" value="Critical" />);
    const badge = screen.getByText('Critical');
    expect(badge).toBeInTheDocument();
    // Testing if critical color class is applied
    expect(badge.className).toContain('text-red-400');
  });

  test('renders stock badge correctly', () => {
    render(<StatusBadge type="stock" value="Healthy" />);
    const badge = screen.getByText('Healthy');
    expect(badge).toBeInTheDocument();
    expect(badge.className).toContain('text-emerald-400');
  });

  test('applies custom size classes', () => {
    render(<StatusBadge type="priority" value="Low" size="lg" />);
    const badge = screen.getByText('Low');
    expect(badge).toBeInTheDocument();
    expect(badge.className).toContain('px-3');
    expect(badge.className).toContain('text-sm');
  });
});

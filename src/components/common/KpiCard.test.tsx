import React from 'react';
import { render, screen } from '@testing-library/react';
import { expect, test, describe, vi } from 'vitest';
import { KpiCard } from './KpiCard';
import { Activity } from 'lucide-react';
import userEvent from '@testing-library/user-event';

describe('KpiCard Component', () => {
  test('renders title and value correctly', () => {
    render(<KpiCard title="Total Orders" value="1,234" icon={Activity} color="cyan" />);
    expect(screen.getByText('Total Orders')).toBeInTheDocument();
    expect(screen.getByText('1,234')).toBeInTheDocument();
  });

  test('renders change text with correct styling', () => {
    render(<KpiCard title="Revenue" value="$50K" icon={Activity} color="emerald" changeText="+12% from yesterday" changeType="increase" />);
    const changeText = screen.getByText('+12% from yesterday');
    expect(changeText).toBeInTheDocument();
    expect(changeText.className).toContain('text-emerald-400');
  });

  test('handles click events', async () => {
    const handleClick = vi.fn();
    render(<KpiCard title="Clickable" value="10" icon={Activity} color="cyan" onClick={handleClick} />);
    
    const card = screen.getByText('Clickable').closest('div')?.parentElement;
    if (card) {
      await userEvent.click(card);
      expect(handleClick).toHaveBeenCalledTimes(1);
    }
  });
});

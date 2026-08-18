import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ThemeToggle from '../components/ThemeToggle';

describe('ThemeToggle', () => {
  test('shows a prompt to switch to dark mode when currently light', () => {
    render(<ThemeToggle theme="light" onToggle={jest.fn()} />);
    expect(screen.getByText(/Dark mode/)).toBeInTheDocument();
  });

  test('shows a prompt to switch to light mode when currently dark', () => {
    render(<ThemeToggle theme="dark" onToggle={jest.fn()} />);
    expect(screen.getByText(/Light mode/)).toBeInTheDocument();
  });

  test('calls onToggle when clicked', async () => {
    const user = userEvent.setup();
    const onToggle = jest.fn();

    render(<ThemeToggle theme="light" onToggle={onToggle} />);
    await user.click(screen.getByRole('button', { name: /toggle dark mode/i }));

    expect(onToggle).toHaveBeenCalledTimes(1);
  });
});

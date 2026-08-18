import React from 'react';
import { render, screen } from '@testing-library/react';
import TaskList from '../components/TaskList';

describe('TaskList', () => {
  test('renders an item for each task', () => {
    const tasks = [
      { id: 1, title: 'Task A', description: '', completed: false },
      { id: 2, title: 'Task B', description: '', completed: false },
    ];

    render(<TaskList tasks={tasks} onToggleComplete={jest.fn()} onUpdate={jest.fn()} onDelete={jest.fn()} />);

    expect(screen.getByText('Task A')).toBeInTheDocument();
    expect(screen.getByText('Task B')).toBeInTheDocument();
  });

  test('shows an empty state message when there are no tasks', () => {
    render(<TaskList tasks={[]} onToggleComplete={jest.fn()} onUpdate={jest.fn()} onDelete={jest.fn()} />);

    expect(screen.getByText('No tasks found. Add one above!')).toBeInTheDocument();
  });
});

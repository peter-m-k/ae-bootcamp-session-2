import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TaskItem from '../components/TaskItem';

const baseTask = { id: 1, title: 'Buy milk', description: 'Whole milk', completed: false };

describe('TaskItem', () => {
  test('renders title and description', () => {
    render(
      <TaskItem task={baseTask} onToggleComplete={jest.fn()} onUpdate={jest.fn()} onDelete={jest.fn()} />
    );

    expect(screen.getByText('Buy milk')).toBeInTheDocument();
    expect(screen.getByText('Whole milk')).toBeInTheDocument();
  });

  test('calls onToggleComplete when checkbox is clicked', async () => {
    const user = userEvent.setup();
    const onToggleComplete = jest.fn();

    render(
      <TaskItem task={baseTask} onToggleComplete={onToggleComplete} onUpdate={jest.fn()} onDelete={jest.fn()} />
    );

    await user.click(screen.getByRole('checkbox'));
    expect(onToggleComplete).toHaveBeenCalledWith(baseTask);
  });

  test('calls onDelete with task id', async () => {
    const user = userEvent.setup();
    const onDelete = jest.fn();

    render(
      <TaskItem task={baseTask} onToggleComplete={jest.fn()} onUpdate={jest.fn()} onDelete={onDelete} />
    );

    await user.click(screen.getByText('Delete'));
    expect(onDelete).toHaveBeenCalledWith(1);
  });

  test('edits and saves a task', async () => {
    const user = userEvent.setup();
    const onUpdate = jest.fn().mockResolvedValue();

    render(
      <TaskItem task={baseTask} onToggleComplete={jest.fn()} onUpdate={onUpdate} onDelete={jest.fn()} />
    );

    await user.click(screen.getByText('Edit'));
    const titleInput = screen.getByLabelText('Edit task title');
    await user.clear(titleInput);
    await user.type(titleInput, 'Buy oat milk');
    await user.click(screen.getByText('Save'));

    expect(onUpdate).toHaveBeenCalledWith(1, { title: 'Buy oat milk', description: 'Whole milk' });
  });

  test('renders a strikethrough style for completed tasks', () => {
    render(
      <TaskItem
        task={{ ...baseTask, completed: true }}
        onToggleComplete={jest.fn()}
        onUpdate={jest.fn()}
        onDelete={jest.fn()}
      />
    );

    expect(screen.getByText('Buy milk')).toHaveClass('text-decoration-line-through');
  });
});

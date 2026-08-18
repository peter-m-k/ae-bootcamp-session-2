import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TaskForm from '../components/TaskForm';

describe('TaskForm', () => {
  test('calls onCreate with title and description, then clears the form', async () => {
    const user = userEvent.setup();
    const handleCreate = jest.fn().mockResolvedValue();

    render(<TaskForm onCreate={handleCreate} />);

    await user.type(screen.getByPlaceholderText('What needs to be done?'), 'Write tests');
    await user.type(screen.getByPlaceholderText('Details (optional)'), 'Cover TaskForm');
    await user.click(screen.getByText('Add Task'));

    expect(handleCreate).toHaveBeenCalledWith({ title: 'Write tests', description: 'Cover TaskForm' });
    expect(screen.getByPlaceholderText('What needs to be done?')).toHaveValue('');
    expect(screen.getByPlaceholderText('Details (optional)')).toHaveValue('');
  });

  test('does not call onCreate when title is blank', async () => {
    const user = userEvent.setup();
    const handleCreate = jest.fn();

    render(<TaskForm onCreate={handleCreate} />);
    await user.click(screen.getByText('Add Task'));

    expect(handleCreate).not.toHaveBeenCalled();
  });
});

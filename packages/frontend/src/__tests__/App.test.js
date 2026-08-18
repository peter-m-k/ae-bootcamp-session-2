import React from 'react';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import App from '../App';

const sampleTasks = [
  { id: 1, title: 'Test Task 1', description: 'First task', completed: false, created_at: '2023-01-01T00:00:00.000Z' },
  { id: 2, title: 'Test Task 2', description: 'Second task', completed: true, created_at: '2023-01-02T00:00:00.000Z' },
];

// Mock server to intercept API requests
const server = setupServer(
  rest.get('/api/tasks', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(sampleTasks));
  }),

  rest.post('/api/tasks', (req, res, ctx) => {
    const { title } = req.body;

    if (!title || title.trim() === '') {
      return res(ctx.status(400), ctx.json({ error: 'Task title is required' }));
    }

    return res(
      ctx.status(201),
      ctx.json({
        id: 3,
        title,
        description: req.body.description || '',
        completed: false,
        created_at: new Date().toISOString(),
      })
    );
  }),

  rest.put('/api/tasks/:id', (req, res, ctx) => {
    const { id } = req.params;
    const task = sampleTasks.find((t) => String(t.id) === id);
    return res(ctx.status(200), ctx.json({ ...task, ...req.body }));
  }),

  rest.delete('/api/tasks/:id', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ message: 'Task deleted successfully', id: Number(req.params.id) }));
  })
);

// Setup and teardown for the mock server
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('App Component', () => {
  test('renders the header', async () => {
    render(<App />);

    expect(screen.getByText('To Do App')).toBeInTheDocument();
    expect(screen.getByText('Keep track of your tasks')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText('Loading tasks...')).not.toBeInTheDocument();
    });
  });

  test('loads and displays tasks', async () => {
    render(<App />);

    // Initially shows loading state
    expect(screen.getByText('Loading tasks...')).toBeInTheDocument();

    // Wait for tasks to load
    await waitFor(() => {
      expect(screen.getByText('Test Task 1')).toBeInTheDocument();
    });
    expect(screen.getByText('Test Task 2')).toBeInTheDocument();
  });

  test('adds a new task', async () => {
    const user = userEvent.setup();

    render(<App />);

    await waitFor(() => {
      expect(screen.queryByText('Loading tasks...')).not.toBeInTheDocument();
    });

    const input = screen.getByPlaceholderText('What needs to be done?');
    await user.type(input, 'New Test Task');

    const submitButton = screen.getByText('Add Task');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('New Test Task')).toBeInTheDocument();
    });
  });

  test('toggles a task as completed', async () => {
    const user = userEvent.setup();

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Test Task 1')).toBeInTheDocument();
    });

    const checkbox = screen.getByLabelText('Mark "Test Task 1" as completed');
    await user.click(checkbox);

    await waitFor(() => {
      expect(screen.getByText('Test Task 1')).toHaveClass('text-decoration-line-through');
    });
  });

  test('deletes a task', async () => {
    const user = userEvent.setup();

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Test Task 1')).toBeInTheDocument();
    });

    const taskItem = screen.getByRole('listitem', { name: 'Task: Test Task 1' });
    const deleteButton = within(taskItem).getByText('Delete');
    await user.click(deleteButton);

    await waitFor(() => {
      expect(screen.queryByText('Test Task 1')).not.toBeInTheDocument();
    });
  });

  test('handles API error', async () => {
    // Override the default handler to simulate an error
    server.use(
      rest.get('/api/tasks', (req, res, ctx) => {
        return res(ctx.status(500));
      })
    );

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/Failed to fetch tasks/)).toBeInTheDocument();
    });
  });

  test('shows empty state when no tasks', async () => {
    // Override the default handler to return empty array
    server.use(
      rest.get('/api/tasks', (req, res, ctx) => {
        return res(ctx.status(200), ctx.json([]));
      })
    );

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('No tasks found. Add one above!')).toBeInTheDocument();
    });
  });
});

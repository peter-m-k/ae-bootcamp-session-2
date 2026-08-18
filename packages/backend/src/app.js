const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const Database = require('better-sqlite3');

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Initialize in-memory SQLite database
const db = new Database(':memory:');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT DEFAULT '',
    completed INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`);

// Insert some initial data
const initialTasks = [
  { title: 'Set up project', description: 'Scaffold the frontend and backend', completed: 1 },
  { title: 'Design task schema', description: 'Define fields for tasks', completed: 1 },
  { title: 'Build task list UI', description: 'Add search, filter, and sort controls', completed: 0 },
];
const insertStmt = db.prepare(
  'INSERT INTO tasks (title, description, completed) VALUES (?, ?, ?)'
);

initialTasks.forEach((task) => {
  insertStmt.run(task.title, task.description, task.completed);
});

console.log('In-memory database initialized with sample data');

// Allow-lists to prevent SQL injection via sort parameters
const SORTABLE_COLUMNS = ['title', 'completed', 'created_at', 'updated_at'];
const SORT_ORDERS = ['asc', 'desc'];

const serializeTask = (row) => ({
  ...row,
  completed: Boolean(row.completed),
});

// Health check endpoint
app.get('/', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Backend server is running' });
});

// API Routes
app.get('/api/tasks', (req, res) => {
  try {
    const { q, status, sortBy, sortOrder } = req.query;

    const clauses = [];
    const params = [];

    if (q && q.trim() !== '') {
      clauses.push('(title LIKE ? OR description LIKE ?)');
      const like = `%${q.trim()}%`;
      params.push(like, like);
    }

    if (status === 'active') {
      clauses.push('completed = 0');
    } else if (status === 'completed') {
      clauses.push('completed = 1');
    }

    const column = SORTABLE_COLUMNS.includes(sortBy) ? sortBy : 'created_at';
    const order = SORT_ORDERS.includes((sortOrder || '').toLowerCase())
      ? sortOrder.toLowerCase()
      : 'desc';

    const where = clauses.length > 0 ? `WHERE ${clauses.join(' AND ')}` : '';
    const query = `SELECT * FROM tasks ${where} ORDER BY ${column} ${order}`;

    const tasks = db.prepare(query).all(...params);
    res.json(tasks.map(serializeTask));
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

app.get('/api/tasks/:id', (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({ error: 'Valid task ID is required' });
    }

    const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json(serializeTask(task));
  } catch (error) {
    console.error('Error fetching task:', error);
    res.status(500).json({ error: 'Failed to fetch task' });
  }
});

app.post('/api/tasks', (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({ error: 'Task title is required' });
    }

    const result = insertStmt.run(title.trim(), description || '', 0);
    const id = result.lastInsertRowid;

    const newTask = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
    res.status(201).json(serializeTask(newTask));
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

app.put('/api/tasks/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, completed } = req.body;

    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({ error: 'Valid task ID is required' });
    }

    const existingTask = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
    if (!existingTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    if (title !== undefined && (typeof title !== 'string' || title.trim() === '')) {
      return res.status(400).json({ error: 'Task title is required' });
    }

    const updatedTitle = title !== undefined ? title.trim() : existingTask.title;
    const updatedDescription = description !== undefined ? description : existingTask.description;
    const updatedCompleted =
      completed !== undefined ? (completed ? 1 : 0) : existingTask.completed;

    db.prepare(
      `UPDATE tasks
       SET title = ?, description = ?, completed = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`
    ).run(updatedTitle, updatedDescription, updatedCompleted, id);

    const updatedTask = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
    res.json(serializeTask(updatedTask));
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

app.delete('/api/tasks/:id', (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({ error: 'Valid task ID is required' });
    }

    const existingTask = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
    if (!existingTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const deleteStmt = db.prepare('DELETE FROM tasks WHERE id = ?');
    const result = deleteStmt.run(id);

    if (result.changes > 0) {
      res.json({ message: 'Task deleted successfully', id: parseInt(id) });
    } else {
      res.status(404).json({ error: 'Task not found' });
    }
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

module.exports = { app, db, insertStmt };
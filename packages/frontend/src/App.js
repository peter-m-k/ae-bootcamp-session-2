import React, { useEffect, useState } from 'react';
import './App.css';
import { createTask, deleteTask, fetchTasks, updateTask } from './api/tasksApi';
import FilterSortControls from './components/FilterSortControls';
import SearchBar from './components/SearchBar';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import ThemeToggle from './components/ThemeToggle';
import useTheme from './hooks/useTheme';

function App() {
  const { theme, toggleTheme } = useTheme();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    let isCancelled = false;

    const loadTasks = async () => {
      try {
        setLoading(true);
        const result = await fetchTasks({ q: search, status, sortBy, sortOrder });
        if (!isCancelled) {
          setTasks(result);
          setError(null);
        }
      } catch (err) {
        if (!isCancelled) {
          setError('Failed to fetch tasks: ' + err.message);
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    // Debounce so full-text search doesn't fire a request per keystroke.
    const timeoutId = setTimeout(loadTasks, 300);
    return () => {
      isCancelled = true;
      clearTimeout(timeoutId);
    };
  }, [search, status, sortBy, sortOrder]);

  const handleCreate = async ({ title, description }) => {
    try {
      const newTask = await createTask({ title, description });
      setTasks((current) => [newTask, ...current]);
      setError(null);
    } catch (err) {
      setError('Error adding task: ' + err.message);
    }
  };

  const handleUpdate = async (id, updates) => {
    try {
      const updatedTask = await updateTask(id, updates);
      setTasks((current) => current.map((task) => (task.id === id ? updatedTask : task)));
      setError(null);
    } catch (err) {
      setError('Error updating task: ' + err.message);
    }
  };

  const handleToggleComplete = (task) => handleUpdate(task.id, { completed: !task.completed });

  const handleDelete = async (id) => {
    try {
      await deleteTask(id);
      setTasks((current) => current.filter((task) => task.id !== id));
      setError(null);
    } catch (err) {
      setError('Error deleting task: ' + err.message);
    }
  };

  const handleSortChange = ({ sortBy: newSortBy, sortOrder: newSortOrder }) => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
  };

  return (
    <div className="App">
      <header className="App-header d-flex justify-content-between align-items-center flex-wrap gap-2">
        <div>
          <h1>To Do App</h1>
          <p className="mb-0">Keep track of your tasks</p>
        </div>
        <ThemeToggle theme={theme} onToggle={toggleTheme} />
      </header>

      <main className="container">
        <section className="add-task-section mb-4">
          <h2 className="h5">Add New Task</h2>
          <TaskForm onCreate={handleCreate} />
        </section>

        <section className="tasks-section">
          <h2 className="h5">Tasks</h2>
          <SearchBar value={search} onChange={setSearch} />
          <FilterSortControls
            status={status}
            onStatusChange={setStatus}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSortChange={handleSortChange}
          />
          {loading && <p>Loading tasks...</p>}
          {error && <p className="error">{error}</p>}
          {!loading && !error && (
            <TaskList
              tasks={tasks}
              onToggleComplete={handleToggleComplete}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
            />
          )}
        </section>
      </main>
    </div>
  );
}

export default App;

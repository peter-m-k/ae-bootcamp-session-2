import React, { useState } from 'react';

const TaskForm = ({ onCreate }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    await onCreate({ title, description });
    setTitle('');
    setDescription('');
  };

  return (
    <form onSubmit={handleSubmit} className="row g-2 align-items-start">
      <div className="col-12 col-md-4">
        <label htmlFor="task-title" className="visually-hidden">
          Task title
        </label>
        <input
          id="task-title"
          type="text"
          className="form-control"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs to be done?"
        />
      </div>
      <div className="col-12 col-md-6">
        <label htmlFor="task-description" className="visually-hidden">
          Task description
        </label>
        <input
          id="task-description"
          type="text"
          className="form-control"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Details (optional)"
        />
      </div>
      <div className="col-12 col-md-2 d-grid">
        <button type="submit" className="btn btn-primary">
          Add Task
        </button>
      </div>
    </form>
  );
};

export default TaskForm;

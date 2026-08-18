import React, { useState } from 'react';

const TaskItem = ({ task, onToggleComplete, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);

  const handleSave = async () => {
    if (!title.trim()) return;
    await onUpdate(task.id, { title, description });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTitle(task.title);
    setDescription(task.description);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <li className="list-group-item" data-task-title={task.title}>
        <div className="row g-2">
          <div className="col-12 col-md-5">
            <input
              type="text"
              className="form-control"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              aria-label="Edit task title"
            />
          </div>
          <div className="col-12 col-md-4">
            <input
              type="text"
              className="form-control"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              aria-label="Edit task description"
            />
          </div>
          <div className="col-6 col-md-1 d-grid">
            <button type="button" className="btn btn-success btn-sm" onClick={handleSave}>
              Save
            </button>
          </div>
          <div className="col-6 col-md-2 d-grid">
            <button type="button" className="btn btn-outline-secondary btn-sm" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </div>
      </li>
    );
  }

  return (
    <li
      className="list-group-item d-flex align-items-center justify-content-between flex-wrap gap-2"
      data-task-title={task.title}
      aria-label={`Task: ${task.title}`}
    >
      <div className="form-check d-flex align-items-center gap-2 flex-grow-1">
        <input
          type="checkbox"
          className="form-check-input"
          checked={task.completed}
          onChange={() => onToggleComplete(task)}
          aria-label={`Mark "${task.title}" as ${task.completed ? 'active' : 'completed'}`}
        />
        <div>
          <span className={task.completed ? 'text-decoration-line-through text-muted' : ''}>
            {task.title}
          </span>
          {task.description && (
            <div className="small text-muted">{task.description}</div>
          )}
        </div>
      </div>
      <div className="d-flex gap-2">
        <button
          type="button"
          className="btn btn-outline-primary btn-sm"
          onClick={() => setIsEditing(true)}
        >
          Edit
        </button>
        <button
          type="button"
          className="btn btn-outline-danger btn-sm"
          onClick={() => onDelete(task.id)}
        >
          Delete
        </button>
      </div>
    </li>
  );
};

export default TaskItem;

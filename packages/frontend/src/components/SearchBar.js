import React from 'react';

const SearchBar = ({ value, onChange }) => (
  <div className="mb-3">
    <label htmlFor="task-search" className="visually-hidden">
      Search tasks
    </label>
    <input
      id="task-search"
      type="search"
      className="form-control"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Search tasks by title or description..."
    />
  </div>
);

export default SearchBar;

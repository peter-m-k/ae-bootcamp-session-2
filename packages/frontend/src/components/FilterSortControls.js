import React from 'react';

const STATUS_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
];

const SORT_OPTIONS = [
  { value: 'created_at', label: 'Date created' },
  { value: 'title', label: 'Title' },
  { value: 'completed', label: 'Status' },
];

const FilterSortControls = ({ status, onStatusChange, sortBy, sortOrder, onSortChange }) => {
  const handleSortByChange = (e) => onSortChange({ sortBy: e.target.value, sortOrder });
  const toggleSortOrder = () => onSortChange({ sortBy, sortOrder: sortOrder === 'asc' ? 'desc' : 'asc' });

  return (
    <div className="row g-2 mb-3">
      <div className="col-12 col-md-4">
        <label htmlFor="status-filter" className="form-label small mb-1">
          Status
        </label>
        <select
          id="status-filter"
          className="form-select"
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
        >
          {STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <div className="col-8 col-md-5">
        <label htmlFor="sort-by" className="form-label small mb-1">
          Sort by
        </label>
        <select id="sort-by" className="form-select" value={sortBy} onChange={handleSortByChange}>
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <div className="col-4 col-md-3 d-flex align-items-end">
        <button
          type="button"
          className="btn btn-outline-secondary w-100"
          onClick={toggleSortOrder}
          aria-label="Toggle sort order"
        >
          {sortOrder === 'asc' ? '↑ Asc' : '↓ Desc'}
        </button>
      </div>
    </div>
  );
};

export default FilterSortControls;

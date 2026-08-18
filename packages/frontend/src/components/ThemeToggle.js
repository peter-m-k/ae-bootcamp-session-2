import React from 'react';

const ThemeToggle = ({ theme, onToggle }) => {
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      className="btn btn-outline-light btn-sm"
      onClick={onToggle}
      aria-label="Toggle dark mode"
    >
      {isDark ? '☀️ Light mode' : '🌙 Dark mode'}
    </button>
  );
};

export default ThemeToggle;

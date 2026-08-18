import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchBar from '../components/SearchBar';

describe('SearchBar', () => {
  test('calls onChange as the user types', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();

    render(<SearchBar value="" onChange={onChange} />);
    await user.type(screen.getByPlaceholderText('Search tasks by title or description...'), 'milk');

    expect(onChange).toHaveBeenCalled();
  });

  test('reflects the current value', () => {
    render(<SearchBar value="groceries" onChange={jest.fn()} />);
    expect(screen.getByDisplayValue('groceries')).toBeInTheDocument();
  });
});

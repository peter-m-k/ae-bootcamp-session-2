import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FilterSortControls from '../components/FilterSortControls';

describe('FilterSortControls', () => {
  test('calls onStatusChange when status is changed', async () => {
    const user = userEvent.setup();
    const onStatusChange = jest.fn();

    render(
      <FilterSortControls
        status="all"
        onStatusChange={onStatusChange}
        sortBy="created_at"
        sortOrder="desc"
        onSortChange={jest.fn()}
      />
    );

    await user.selectOptions(screen.getByLabelText('Status'), 'active');
    expect(onStatusChange).toHaveBeenCalledWith('active');
  });

  test('calls onSortChange when sort field is changed', async () => {
    const user = userEvent.setup();
    const onSortChange = jest.fn();

    render(
      <FilterSortControls
        status="all"
        onStatusChange={jest.fn()}
        sortBy="created_at"
        sortOrder="desc"
        onSortChange={onSortChange}
      />
    );

    await user.selectOptions(screen.getByLabelText('Sort by'), 'title');
    expect(onSortChange).toHaveBeenCalledWith({ sortBy: 'title', sortOrder: 'desc' });
  });

  test('toggles sort order when the direction button is clicked', async () => {
    const user = userEvent.setup();
    const onSortChange = jest.fn();

    render(
      <FilterSortControls
        status="all"
        onStatusChange={jest.fn()}
        sortBy="title"
        sortOrder="asc"
        onSortChange={onSortChange}
      />
    );

    await user.click(screen.getByLabelText('Toggle sort order'));
    expect(onSortChange).toHaveBeenCalledWith({ sortBy: 'title', sortOrder: 'desc' });
  });
});

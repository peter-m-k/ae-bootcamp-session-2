const API_BASE = '/api/tasks';

const handleResponse = async (response) => {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || 'Request failed');
  }
  return data;
};

export const fetchTasks = async ({ q, status, sortBy, sortOrder } = {}) => {
  const params = new URLSearchParams();
  if (q) params.set('q', q);
  if (status && status !== 'all') params.set('status', status);
  if (sortBy) params.set('sortBy', sortBy);
  if (sortOrder) params.set('sortOrder', sortOrder);

  const query = params.toString();
  const response = await fetch(query ? `${API_BASE}?${query}` : API_BASE);
  return handleResponse(response);
};

export const createTask = async ({ title, description }) => {
  const response = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, description }),
  });
  return handleResponse(response);
};

export const updateTask = async (id, updates) => {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  return handleResponse(response);
};

export const deleteTask = async (id) => {
  const response = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
  return handleResponse(response);
};

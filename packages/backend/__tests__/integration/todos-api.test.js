const request = require('supertest');
const { app, db } = require('../../src/app');

afterAll(() => {
  if (db) {
    db.close();
  }
});

const createTask = async (title, description = '') => {
  const response = await request(app)
    .post('/api/tasks')
    .send({ title, description })
    .set('Accept', 'application/json');

  expect(response.status).toBe(201);
  return response.body;
};

const completeTask = async (id) => {
  const response = await request(app).put(`/api/tasks/${id}`).send({ completed: true });
  expect(response.status).toBe(200);
  return response.body;
};

describe('Tasks API - search, filter, and sort', () => {
  it('finds tasks by full-text search on title and description', async () => {
    await createTask('Buy groceries', 'Milk, eggs, bread');
    await createTask('Book dentist appointment', 'Ask about cleaning');

    const response = await request(app).get('/api/tasks').query({ q: 'groceries' });

    expect(response.status).toBe(200);
    expect(response.body.some((task) => task.title === 'Buy groceries')).toBe(true);
    expect(response.body.some((task) => task.title === 'Book dentist appointment')).toBe(false);
  });

  it('finds tasks by full-text search on description', async () => {
    await createTask('Plan trip', 'Book flights and hotel');

    const response = await request(app).get('/api/tasks').query({ q: 'flights' });

    expect(response.status).toBe(200);
    expect(response.body.some((task) => task.title === 'Plan trip')).toBe(true);
  });

  it('filters tasks by active status', async () => {
    const active = await createTask('Active task for filter test');
    const completed = await createTask('Completed task for filter test');
    await completeTask(completed.id);

    const response = await request(app).get('/api/tasks').query({ status: 'active' });

    expect(response.status).toBe(200);
    expect(response.body.some((task) => task.id === active.id)).toBe(true);
    expect(response.body.some((task) => task.id === completed.id)).toBe(false);
  });

  it('filters tasks by completed status', async () => {
    const active = await createTask('Another active task for filter test');
    const completed = await createTask('Another completed task for filter test');
    await completeTask(completed.id);

    const response = await request(app).get('/api/tasks').query({ status: 'completed' });

    expect(response.status).toBe(200);
    expect(response.body.some((task) => task.id === completed.id)).toBe(true);
    expect(response.body.some((task) => task.id === active.id)).toBe(false);
  });

  it('sorts tasks by title ascending', async () => {
    await createTask('Zebra task');
    await createTask('Apple task');

    const response = await request(app)
      .get('/api/tasks')
      .query({ sortBy: 'title', sortOrder: 'asc' });

    expect(response.status).toBe(200);
    const titles = response.body.map((task) => task.title);
    const sorted = [...titles].sort((a, b) => a.localeCompare(b));
    expect(titles).toEqual(sorted);
  });

  it('falls back to default sort for an invalid sortBy value', async () => {
    const response = await request(app)
      .get('/api/tasks')
      .query({ sortBy: 'DROP TABLE tasks;--', sortOrder: 'asc' });

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});

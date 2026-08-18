const { test, expect } = require('@playwright/test');
const { TaskAppPage } = require('./pages/TaskAppPage');

test('user can sort tasks by title', async ({ page }) => {
  const app = new TaskAppPage(page);
  const unique = Date.now();
  const first = `AAA sort task ${unique}`;
  const second = `ZZZ sort task ${unique}`;

  await app.goto();
  await app.addTask(second);
  await app.addTask(first);

  await app.setSort('title', 'asc');
  await app.filterByStatus('all');

  const titles = await app.getTaskTitles();
  const firstIndex = titles.indexOf(first);
  const secondIndex = titles.indexOf(second);

  expect(firstIndex).toBeGreaterThanOrEqual(0);
  expect(secondIndex).toBeGreaterThanOrEqual(0);
  expect(firstIndex).toBeLessThan(secondIndex);
});

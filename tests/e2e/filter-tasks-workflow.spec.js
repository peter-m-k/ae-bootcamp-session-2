const { test, expect } = require('@playwright/test');
const { TaskAppPage } = require('./pages/TaskAppPage');

test('user can filter tasks by status', async ({ page }) => {
  const app = new TaskAppPage(page);
  const unique = Date.now();
  const activeTitle = `Active filter task ${unique}`;
  const completedTitle = `Completed filter task ${unique}`;

  await app.goto();
  await app.addTask(activeTitle);
  await app.addTask(completedTitle);
  await app.toggleComplete(completedTitle);

  await app.filterByStatus('active');
  await expect(app.taskItem(activeTitle)).toBeVisible();
  await expect(app.taskItem(completedTitle)).toHaveCount(0);

  await app.filterByStatus('completed');
  await expect(app.taskItem(completedTitle)).toBeVisible();
  await expect(app.taskItem(activeTitle)).toHaveCount(0);

  await app.filterByStatus('all');
  await expect(app.taskItem(activeTitle)).toBeVisible();
  await expect(app.taskItem(completedTitle)).toBeVisible();
});

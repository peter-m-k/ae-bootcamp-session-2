const { test, expect } = require('@playwright/test');
const { TaskAppPage } = require('./pages/TaskAppPage');

test('user can add a new task', async ({ page }) => {
  const app = new TaskAppPage(page);
  const title = `Add task ${Date.now()}`;

  await app.goto();
  await app.addTask(title, 'Created by the add-task e2e test');

  await expect(app.taskItem(title)).toBeVisible();
});

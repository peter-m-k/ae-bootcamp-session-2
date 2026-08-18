const { test, expect } = require('@playwright/test');
const { TaskAppPage } = require('./pages/TaskAppPage');

test('user can delete a task', async ({ page }) => {
  const app = new TaskAppPage(page);
  const title = `Delete task ${Date.now()}`;

  await app.goto();
  await app.addTask(title);
  await expect(app.taskItem(title)).toBeVisible();

  await app.deleteTask(title);
  await expect(app.taskItem(title)).toHaveCount(0);
});

const { test, expect } = require('@playwright/test');
const { TaskAppPage } = require('./pages/TaskAppPage');

test('user can mark a task as completed and back to active', async ({ page }) => {
  const app = new TaskAppPage(page);
  const title = `Complete task ${Date.now()}`;

  await app.goto();
  await app.addTask(title);

  await app.toggleComplete(title);
  await expect(app.taskItem(title).locator('span')).toHaveClass(/text-decoration-line-through/);

  await app.toggleComplete(title);
  await expect(app.taskItem(title).locator('span')).not.toHaveClass(/text-decoration-line-through/);
});

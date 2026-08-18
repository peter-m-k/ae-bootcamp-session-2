const { test, expect } = require('@playwright/test');
const { TaskAppPage } = require('./pages/TaskAppPage');

test('user can edit a task title and description', async ({ page }) => {
  const app = new TaskAppPage(page);
  const originalTitle = `Edit task ${Date.now()}`;
  const updatedTitle = `${originalTitle} (updated)`;

  await app.goto();
  await app.addTask(originalTitle, 'Original description');
  await app.editTask(originalTitle, { newTitle: updatedTitle, newDescription: 'Updated description' });

  await expect(app.taskItem(updatedTitle)).toBeVisible();
  await expect(app.taskItem(updatedTitle)).toContainText('Updated description');
});

const { test, expect } = require('@playwright/test');
const { TaskAppPage } = require('./pages/TaskAppPage');

test('user can search for a task by title', async ({ page }) => {
  const app = new TaskAppPage(page);
  const unique = Date.now();
  const matchingTitle = `Searchable groceries task ${unique}`;
  const otherTitle = `Unrelated task ${unique}`;

  await app.goto();
  await app.addTask(matchingTitle);
  await app.addTask(otherTitle);

  await app.searchFor('groceries');

  await expect(app.taskItem(matchingTitle)).toBeVisible();
  await expect(app.taskItem(otherTitle)).toHaveCount(0);
});

const { test, expect } = require('@playwright/test');
const { TaskAppPage } = require('./pages/TaskAppPage');

test('user can toggle between light and dark mode', async ({ page }) => {
  const app = new TaskAppPage(page);

  await app.goto();
  const initialMode = await app.getColorMode();

  await app.toggleTheme();
  const toggledMode = await app.getColorMode();
  expect(toggledMode).not.toBe(initialMode);

  await app.toggleTheme();
  const revertedMode = await app.getColorMode();
  expect(revertedMode).toBe(initialMode);
});

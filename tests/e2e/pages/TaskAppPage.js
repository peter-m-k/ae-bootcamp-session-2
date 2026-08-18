// Page Object Model for the To Do App's single page.
class TaskAppPage {
  constructor(page) {
    this.page = page;
    this.titleInput = page.getByPlaceholder('What needs to be done?');
    this.descriptionInput = page.getByPlaceholder('Details (optional)');
    this.addButton = page.getByRole('button', { name: 'Add Task' });
    this.searchInput = page.getByPlaceholder('Search tasks by title or description...');
    this.statusFilter = page.getByLabel('Status');
    this.sortBySelect = page.getByLabel('Sort by');
    this.sortOrderButton = page.getByLabel('Toggle sort order');
    this.themeToggleButton = page.getByRole('button', { name: /toggle dark mode/i });
    this.taskList = page.locator('ul.list-group');
  }

  async goto() {
    await this.page.goto('/');
    await this.page.waitForSelector('.App-header');
  }

  async addTask(title, description = '') {
    await this.titleInput.fill(title);
    if (description) {
      await this.descriptionInput.fill(description);
    }
    await this.addButton.click();
    await this.taskItem(title).waitFor();
  }

  taskItem(title) {
    return this.page.locator(`li.list-group-item[data-task-title="${title}"]`);
  }

  async searchFor(query) {
    await this.searchInput.fill(query);
    // Search is debounced; wait for the debounce window to elapse.
    await this.page.waitForTimeout(400);
  }

  async filterByStatus(status) {
    await this.statusFilter.selectOption(status);
    await this.page.waitForTimeout(400);
  }

  async sortBy(field) {
    await this.sortBySelect.selectOption(field);
    await this.page.waitForTimeout(400);
  }

  async setSort(field, order) {
    await this.sortBy(field);
    const label = order === 'asc' ? '↑ Asc' : '↓ Desc';
    const current = (await this.sortOrderButton.textContent()).trim();
    if (current !== label) {
      await this.toggleSortOrder();
    }
  }

  async toggleSortOrder() {
    await this.sortOrderButton.click();
    await this.page.waitForTimeout(400);
  }

  async toggleComplete(title) {
    await this.taskItem(title).getByRole('checkbox').click();
  }

  async deleteTask(title) {
    await this.taskItem(title).getByRole('button', { name: 'Delete' }).click();
    await this.taskItem(title).waitFor({ state: 'detached' });
  }

  async editTask(title, { newTitle, newDescription } = {}) {
    const item = this.taskItem(title);
    await item.getByRole('button', { name: 'Edit' }).click();
    if (newTitle) {
      const titleField = item.getByLabel('Edit task title');
      await titleField.fill(newTitle);
    }
    if (newDescription !== undefined) {
      const descriptionField = item.getByLabel('Edit task description');
      await descriptionField.fill(newDescription);
    }
    await item.getByRole('button', { name: 'Save' }).click();
  }

  async getTaskTitles() {
    return this.page.locator('li.list-group-item span').allTextContents();
  }

  async toggleTheme() {
    await this.themeToggleButton.click();
  }

  async getColorMode() {
    return this.page.locator('html').getAttribute('data-bs-theme');
  }
}

module.exports = { TaskAppPage };

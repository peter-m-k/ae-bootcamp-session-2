# Coding Guidelines

## Code Style

- Prefer clear, descriptive names for variables, functions, and components over abbreviations.
- Keep functions small and focused on a single responsibility.
- Prefer `const`/`let` over `var`, and avoid mutating shared state.
- Use async/await over raw Promise chains for readability.

## Formatting

- Use consistent indentation (2 spaces) and line endings across the codebase.
- Keep lines reasonably short and break up long expressions for readability.
- Let the linter/formatter (not manual judgment) settle style disagreements such as quote style, trailing commas, and semicolons.

## Import Sorting

- Group imports in this order: external/third-party packages, then internal modules, then relative imports (`./`, `../`).
- Leave a blank line between import groups.
- Avoid unused imports; remove them as soon as code changes make them redundant.

## Linter and Static Code Analysis

- The frontend package (`packages/frontend`) uses ESLint via the `react-app` and `react-app/jest` configs (Create React App defaults), configured in [package.json](../packages/frontend/package.json).
- Run lint checks before committing changes and fix warnings rather than suppressing them; use inline disable comments only as a last resort with a reason.
- Treat linter errors as build-blocking; do not merge code with unresolved lint errors.

## Test Tools Used

- **Backend**: [Jest](https://jestjs.io/) for unit/component tests, [Supertest](https://github.com/ladjs/supertest) for HTTP-level API testing (see [packages/backend](../packages/backend)).
- **Frontend**: Jest (via `react-scripts test`) with [React Testing Library](https://testing-library.com/react) for component/UI tests (see [packages/frontend](../packages/frontend)).
- **E2E**: [Playwright](https://playwright.dev/) for end-to-end browser testing, run via `npm run test:e2e` at the repo root.
- See [Testing Guidelines](testing-guidelines.md) for detailed conventions per test type.

## Structured Programming Best Practices for SPAs

- Keep components small and composable; extract shared logic into hooks or utility modules rather than duplicating it.
- Separate concerns: keep data fetching/state management logic out of presentational components.
- Favor unidirectional data flow (props down, events up) over deeply shared mutable state.
- Handle loading, error, and empty states explicitly in every component that fetches data.
- Avoid deeply nested conditionals; prefer early returns and guard clauses.
- Keep side effects (API calls, subscriptions) isolated in well-defined lifecycle hooks (e.g. `useEffect`) with proper cleanup.
- Avoid prop drilling beyond a couple of levels; use context or state management only where genuinely needed.

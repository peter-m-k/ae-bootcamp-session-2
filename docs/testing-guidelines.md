# Testing Guidelines

This document describes best practices for writing and organizing tests across the project.

## Unit Tests

- **Folder organization**: Place unit tests next to the code they test, in a `__tests__` folder within the same package (e.g. `packages/backend/src/__tests__/`, `packages/frontend/src/__tests__/`).
- **File naming convention**: Name test files after the module under test, using the `.test.js` suffix (e.g. `app.js` -> `app.test.js`).
- **1:1 mapping**: Each source file (function, module, or class) should have a corresponding test file. Avoid bundling unrelated units into a single test file.
- **Use of env vars**: Never hardcode secrets, ports, or environment-specific values in tests. Read configuration from environment variables (with sensible defaults) and use `.env.test` files where supported.
- **Order-independence & parallelism**: Each test should set up and tear down its own state (e.g. via `beforeEach`/`afterEach`) so tests do not depend on execution order and can run safely in parallel.

## Component (Whole Repo) Tests

- **Folder organization**: Keep component-level tests (tests that exercise a whole package/module in isolation, e.g. the backend Express app) in the package's `__tests__` directory, separate from unit tests where practical (e.g. `__tests__/component/`).
- **File naming convention**: Suffix files with `.test.js`, using descriptive names that reflect the component being tested (e.g. `app.component.test.js`).
- **1:1 mapping**: Aim for one test file per top-level component/module (e.g. one file for the Express app, one for a major React feature), rather than one giant catch-all test file.
- **Use of env vars**: Configure the component under test (ports, database paths, feature flags) through environment variables so tests can run identically in local and CI environments.
- **Order-independence & parallelism**: Use isolated, in-memory resources (e.g. a fresh in-memory database instance per test suite) so component tests don't share state and can run in parallel across test files.

## Integration Tests

- **Folder organization**: Store integration tests in a dedicated `__tests__/integration/` (or top-level `integration/`) folder, separate from unit and component tests, since they typically span multiple modules or services (e.g. API + database).
- **File naming convention**: Use a `.integration.test.js` suffix to clearly distinguish these from unit/component tests (e.g. `orders.integration.test.js`).
- **1:1 mapping**: Organize integration test files around user-facing flows or API routes (one file per route/feature) rather than mirroring individual source files.
- **Use of env vars**: Use environment variables to point at test instances of external dependencies (databases, APIs), never against production resources.
- **Order-independence & parallelism**: Seed and clean up test data per test (or per test file) so integration tests don't leak state between runs and can be executed in parallel or in any order.

## E2E Tests

- **Folder organization**: Keep end-to-end tests in a top-level `e2e/` folder, outside of `packages/`, since they exercise the frontend and backend together.
- **File naming convention**: Name files after the user flow they cover, with a `.e2e.test.js` (or framework-specific, e.g. `.spec.ts` for Playwright/Cypress) suffix (e.g. `checkout.e2e.test.js`).
- **1:1 mapping**: Map each test file to a single end-to-end user flow (e.g. sign up, login, checkout) rather than testing multiple unrelated flows in one file.
- **Use of env vars**: Drive base URLs, credentials, and timeouts entirely from environment variables so the same suite can target local, staging, or CI environments.
- **Order-independence & parallelism**: Design flows to create and clean up their own data (e.g. unique test users per run) so scenarios can run in parallel without colliding.

## UI Tests

- **Folder organization**: Co-locate UI/component-rendering tests with the React components they cover, under `src/__tests__/` or alongside the component (e.g. `Component.jsx` + `Component.test.jsx`).
- **File naming convention**: Match the component's file name with a `.test.js`/`.test.jsx` suffix (e.g. `App.js` -> `App.test.js`).
- **1:1 mapping**: Maintain one test file per component, testing its rendering, props, and user interactions rather than combining multiple components in one file.
- **Use of env vars**: Mock or stub network calls and read any environment-dependent configuration (e.g. API base URL) from environment variables rather than hardcoding values.
- **Order-independence & parallelism**: Render a fresh instance of the component in each test (e.g. via `render()` in `beforeEach` or per-test) and avoid shared mutable state so tests can run in any order or in parallel.

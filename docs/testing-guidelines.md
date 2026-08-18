# Testing Guidelines

This document describes best practices for writing and organizing tests across the project.

## Unit Tests

Unit tests verify a single function, module, or class in isolation, with all collaborators mocked or stubbed.

- Co-locate tests with the source they cover, e.g. `packages/backend/src/__tests__/` mirroring `packages/backend/src/`, so it's obvious when a source file has no test.
- Name test files after the exact module under test (`orders.js` -> `orders.test.js`); if a module grows multiple test files, suffix by concern (`orders.validation.test.js`) rather than splitting arbitrarily.
- Aim for one test file per module, but don't force a 1:1 file split for trivial helpers exported from the same file — group by "unit of behavior," not strictly by file.
- Never read real environment variables in a unit test; inject config as function parameters or mock `process.env` explicitly so tests aren't affected by the machine they run on.
- Since units are cheap and numerous, keep them fast and side-effect-free (no filesystem/network/timers) — this is what makes order-independence and parallel execution trivial rather than something to engineer around.

## Component (Whole Repo) Tests

These tests exercise a whole package (e.g. the entire backend Express app, or the whole database layer) as a black box, without spinning up other services.

- Keep these under the package's `__tests__/` folder alongside unit tests (as in `packages/backend/__tests__/app.test.js`), since they still test one package in isolation — a separate top-level folder is unnecessary overhead at this scope.
- Name files after the package entry point or subsystem being exercised (`app.test.js`, `database.test.js`), not after individual internal functions.
- A 1:1 mapping to source files doesn't apply here — instead map one test file per public surface (e.g. one file covering all `app.js` routes, one covering the DB layer), since the point is testing integration within the package.
- Use environment variables to select in-memory or test-mode implementations (e.g. an in-memory SQLite database instead of a file-based one) so the whole package can be tested without external dependencies.
- Reset the package's internal state (e.g. re-create the in-memory database) in `beforeEach` so tests don't depend on run order; this is also what allows Jest to shard/parallelize test files safely.

## Integration Tests

Integration tests verify that two or more real pieces of the system work together (e.g. the backend API talking to a real database, or the frontend talking to a running backend).

- Organize by the boundary being crossed, e.g. `__tests__/integration/api-db/` for backend-to-database, separate from `__tests__/integration/frontend-api/` for frontend-to-backend — the folder should communicate *which* integration is under test.
- Name files after the flow or route being integrated (`create-order.integration.test.js`), not after a single source file, since these tests span multiple files by nature.
- Don't force 1:1 with source files; instead aim for 1:1 with API endpoints or cross-boundary flows — one file per endpoint/flow keeps failures easy to localize.
- Point at real but disposable infrastructure via env vars (e.g. `TEST_DATABASE_PATH`, `API_BASE_URL`) so the same tests can run locally and in CI without code changes, and so they never touch production data.
- Because these tests share real infrastructure (a database, a server), be deliberate about isolation: use unique keys/IDs per test or transactional rollbacks, since "just don't share state" is harder to achieve than in unit tests but more important given the shared resource.

## E2E Tests

E2E tests drive the full stack (browser + frontend + backend) through real user flows, and are the slowest and most brittle by nature.

- Keep them outside `packages/`, in a top-level `e2e/` folder, since they test the product as a whole rather than any one package.
- Name files after the user journey, not a technical unit (`checkout-flow.e2e.spec.js`, `login-flow.e2e.spec.js`) — readability of the flow matters more than mapping to code structure.
- Favor a small number of high-value flows over exhaustive 1:1 coverage of every screen; each file should represent one complete journey a real user would take.
- Use env vars for the target URL, browser/headless mode, and timeouts (`E2E_BASE_URL`, `HEADLESS`, `E2E_TIMEOUT_MS`) so the same suite runs against local dev, staging, and CI.
- Because E2E tests are inherently the flakiest, invest specifically in unique/generated test data per run (not just per test) and avoid relying on fixed seed data, so tests can be retried and parallelized across browser workers without colliding.

## UI Tests

UI tests render individual React components and assert on markup, accessibility, and user interaction, without a real backend.

- Co-locate with the component itself (`Component.jsx` next to `Component.test.jsx`, or in a nearby `__tests__/` folder) so the test is immediately visible when editing the component.
- Match the component's file name exactly (`OrderCard.js` -> `OrderCard.test.js`) so the pairing is unambiguous.
- Maintain a genuine 1:1 mapping between components and test files here — unlike other test types, each component's rendering/interaction logic is self-contained enough to justify one file per component.
- Never call real APIs; mock network/data-fetching layers, and only use env vars for things like feature-flag defaults — most "configuration" a UI test needs should come from props/mocks, not the environment.
- Use React Testing Library's `render()`/`screen` queries fresh in each test (via `beforeEach` or per-test setup) rather than sharing a rendered instance across tests, so tests remain order-independent and safe to parallelize across files.

# Testing Strategy

## Overview

Our project employs a comprehensive testing strategy covering unit tests and integration tests to ensure code quality, reliability, and maintainability.

## Unit Tests

Unit tests verify individual components and functions in isolation. They should be fast, focused, and independent.

### Frontend Unit Tests

- **Location**: `client/` directory
- **Naming convention**: `*.test.js`, `*.spec.js`, or `__tests__/` folder
- **Testing scope**: React components, utilities, hooks, and services
- **Framework recommendations**: Jest, Vitest, or similar
- **Example path**: `client/src/components/__tests__/Button.test.js`

#### Running Frontend Unit Tests

```bash
cd client
npm test
```

#### Test Coverage

- Target: **80%** code coverage
- Run with coverage report: `npm test -- --coverage`

### Backend Unit Tests

- **Location**: `server/` directory
- **Naming convention**: `*.test.js`, `*.spec.js`, or `__tests__/` folder
- **Testing scope**: Controllers, services, utilities, and middleware
- **Framework recommendations**: Jest, Mocha, or similar
- **Example path**: `server/src/services/__tests__/UserService.test.js`

#### Running Backend Unit Tests

```bash
cd server
npm test
```

#### Test Coverage

- Target: **80%** code coverage
- Run with coverage report: `npm test -- --coverage`

## Integration Tests

Integration tests verify that multiple components work together correctly. These test flows across client-server boundaries and database interactions.

- **Location**: `test/integration/` directory
- **Naming convention**: `*.integration.test.js` or `*.e2e.test.js`
- **Testing scope**: API endpoints, authentication flows, data persistence, end-to-end scenarios
- **Framework recommendations**: Jest + Supertest, Cypress, Playwright, or similar

### Example Test Files

- `test/integration/auth.integration.test.js` — Authentication flow testing
- `test/integration/api.integration.test.js` — API endpoint testing
- `test/integration/user.integration.test.js` — User operations testing

### Running Integration Tests

```bash
npm run test:integration
```

## Testing Best Practices

### Unit Testing

- **Keep tests focused** — Each test should verify one specific behavior
- **Use descriptive names** — Test names should clearly describe what is being tested
- **Avoid test interdependence** — Tests should run independently and in any order
- **Mock external dependencies** — Use mocks for database, APIs, and external services
- **Aim for high coverage** — Target at least 80% code coverage

### Integration Testing

- **Test realistic scenarios** — Include actual user workflows and data interactions
- **Use test fixtures** — Set up consistent test data before each test
- **Clean up after tests** — Ensure database state is reset between tests
- **Test error cases** — Include tests for edge cases and error handling
- **Keep tests maintainable** — Avoid brittle tests that break with minor changes

## Continuous Integration

Tests are automatically run via GitHub Actions on:

- Pull requests to `main`

See [`.github/workflows/ci.yml`](../.github/workflows/ci.yml) for CI/CD configuration.

### CI Test Requirements

All of the following must pass before merging:

- ✅ Linting passes
- ✅ All unit tests pass
- ✅ All integration tests pass
- ✅ Code coverage meets minimum threshold (if applicable)

## Debugging Tests

### Running a Single Test File

```bash
cd client
npm test -- Button.test.js

cd server
npm test -- UserService.test.js
```

### Running Tests in Watch Mode

```bash
npm test -- --watch
```

### Debugging with Console Output

```bash
npm test -- --verbose
```

## Common Issues & Troubleshooting

### Tests Fail Locally But Pass in CI

- Clear node_modules: `rm -rf node_modules && npm install`
- Clear Jest cache: `npm test -- --clearCache`
- Ensure environment variables are set (check `.env`)

### Database-Related Test Failures

- Ensure test database is set up correctly
- Check database connection in `.env` file
- Run migrations before tests if needed

### Async/Promise-Related Failures

- Use `async/await` or `.then()` chains properly
- Return promises from tests
- Use proper timeout settings for slow operations

## Test Metrics & Goals

| Metric | Target | Current |
|--------|--------|---------|
| Unit Test Coverage | 80% | TBD |
| Integration Test Coverage | 70% | TBD |
| Test Pass Rate | 100% | TBD |
| Average Test Runtime | < 5m | TBD |

## Resources

- [Jest Documentation](https://jestjs.io/)
- [Mocha Documentation](https://mochajs.org/)
- [Vitest Documentation](https://vitest.dev/)
- [Testing Library Docs](https://testing-library.com/)
- [Supertest (HTTP Assertions)](https://github.com/visionmedia/supertest)


# Petstore API Test Suite

This project is an automated test suite for the Petstore API, built with the following technologies:

- **Playwright**: For browser automation and API testing.
- **Faker.js**: For generating random and realistic test data.
- **Zod**: For schema validation of API responses.

## Project Structure

- **Tests are grouped by resource**: Each resource (e.g., Pet) has its own test files under the `tests/` directory.
- **Client Pattern**: There is one API client per resource (located in `API-clients/`). Each client exposes all endpoints for its resource, allowing for easy reuse across multiple tests.
- **Test Data**: Some test data is stored in JSON files under the `test-data/` directory for easy management and reuse.

## Scenarios and Validations

The test suite includes both positive and negative scenarios, covering:
- Business rules (e.g., getting non-existent pets)
- Field sanitization (e.g., sending the wrong type for IDs)
- Schema validations using Zod
- Response validations (status codes, response payloads)

> **Note:** For demonstration purposes and to keep the solution simple, not all validations are applied to every test. For example, schema validation is not present in all tests. In a real project, it is recommended to apply the same validation criteria to all tests for consistency and reliability.

> **Important:** Since this is a public API and some tests use existing data, tests may occasionally fail if someone else updates or deletes that data. This is a limitation of testing against shared, mutable resources in public environments.

## How to Run the Tests Locally

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Run the tests:**
   ```bash
   npx playwright test
   ```
3. **View the Playwright report:**
   ```bash
   npx playwright show-report
   ```

---

Feel free to contribute or adapt this suite for your own API testing needs!

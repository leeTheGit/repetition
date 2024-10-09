// https://www.robinwieruch.de/react-testing-library/
// https://testing-library.com/docs/
// https://derekndavis.com/posts/getbytestid-overused-react-testing-library

import { setupServer } from 'msw/node';
import { handlers } from './mocks/handlers';

import { expect, afterEach, beforeAll, afterAll } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from "@testing-library/jest-dom/matchers";

const server = setupServer(...handlers);


expect.extend(matchers);

// Start the server before running your tests
beforeAll(() => server.listen());
// Reset and stop the server after all tests finish
afterAll(() => {
  server.resetHandlers()
  server.close()
});

afterEach(() => {
  cleanup();
});

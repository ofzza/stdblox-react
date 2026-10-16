/**
 * Vitest setup, run before every test file of the `unit*` and `debug` projects
 */

import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Testing Library only unmounts rendered trees automatically when Vitest globals are enabled, which they are not
afterEach(() => {
  cleanup();
});

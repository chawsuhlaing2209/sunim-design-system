import { defineConfig } from 'vitest/config';

// Keeps CI green on a fresh starter: no component tests yet is a pass, not a failure.
// The reference example in examples/ is excluded (it's for reading, not running).
// jsdom is on because component tests render — @testing-library/react needs a DOM.
export default defineConfig({
  test: {
    environment: 'jsdom',
    passWithNoTests: true,
    // Registers @testing-library/jest-dom's matchers on vitest's expect.
    setupFiles: ['./src/test/setup.ts'],
    exclude: ['examples/**', 'node_modules/**', 'dist/**', 'storybook-static/**'],
  },
});

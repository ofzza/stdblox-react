import { join } from 'node:path';
import { defineConfig, type TestProjectInlineConfiguration } from 'vitest/config';
import { getReactVersions, reactSensitivePackages } from './scripts/react-versions.mjs';

const unitInclude = ['src/**/*.{test,unit.test,spec,unit.spec}.{js,ts,tsx}'];
const unitTypecheckInclude = ['src/**/*.{test,unit.test,spec,unit.spec}.{ts,tsx}'];
const exclude = ['node_modules/**', 'dist/**', 'react-versions/**', 'showcase/**'];

/**
 * Escapes a string for literal use within a regular expression
 * @param value String to escape
 * @returns Escaped string
 */
function _escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Creates a Vitest project that runs, and type checks, the unit tests
 * @param name Project name
 * @param tsconfig Type checking config
 * @param alias Module aliases, resolving the React-sensitive packages from a test environment directory
 * @returns Vitest project
 */
function _createUnitProject(name: string, tsconfig: string, alias: { find: RegExp; replacement: string }[] = []): TestProjectInlineConfiguration {
  return {
    resolve: { alias },
    // Test files are run twice: executed by the default pool for their runtime expectations, and type checked by `tsc` for their compile time
    // assertions. `include` and `typecheck.include` deliberately match the same files, which is why each test file is reported twice.
    test: {
      name,
      environment: 'jsdom',
      setupFiles: ['./vitest.setup.ts'],
      include: unitInclude,
      exclude,
      typecheck: {
        enabled: true,
        include: unitTypecheckInclude,
        exclude,
        tsconfig,
        // Vitest 5.0.1 documents, but does not apply, a default for this, but consumes it unguarded when spawning the checker
        spawnTimeout: 10000,
      },
    },
  };
}

const reactVersions = getReactVersions();

export default defineConfig({
  test: {
    reporters: ['tree'],
    projects: [
      {
        test: {
          name: 'debug',
          environment: 'jsdom',
          setupFiles: ['./vitest.setup.ts'],
          include: ['src/**/*.{test,unit.test,spec,unit.spec,debug,debug.test}.{js,ts,tsx}'],
          exclude,
        },
      },
      // The showcase application's own logic, against the default React version only
      {
        test: {
          name: 'showcase',
          include: ['showcase/src/**/*.test.{ts,tsx}'],
          exclude: ['node_modules/**', 'showcase/dist/**'],
          typecheck: {
            enabled: true,
            include: ['showcase/src/**/*.test.{ts,tsx}'],
            exclude: ['node_modules/**', 'showcase/dist/**'],
            tsconfig: './showcase/tsconfig.json',
            spawnTimeout: 10000,
          },
        },
      },
      // The default React version, resolved from the root `node_modules`
      _createUnitProject('unit', './tsconfig.json'),
      // Every additional React version: its React-sensitive packages, and any subpath of them, resolve from its test environment directory,
      // whose packages in turn resolve each other from there, so no React of another version is ever loaded alongside
      ...reactVersions.additional.map(({ major, dir }) =>
        _createUnitProject(
          `unit-react${major}`,
          `./react-versions/${major}/tsconfig.json`,
          reactSensitivePackages.map((pkg) => ({
            find: new RegExp(`^${_escapeRegExp(pkg)}(/.*)?$`),
            replacement: `${join(dir, 'node_modules', pkg)}$1`,
          })),
        ),
      ),
    ],
  },
});

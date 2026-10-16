/**
 * Supported React versions: discovers them, and installs their test environments
 *
 * The default React version is the major of the root `react` devDependency. Every additional React version has a test environment directory,
 * `react-versions/<major>/`, with its own `package.json` and lockfile installing the React-sensitive packages (React, React DOM, their types and
 * Testing Library) for that major. As a CLI:
 *
 * - `node scripts/react-versions.mjs list`: prints the JSON array of every supported major, default first (used by the CI matrix)
 * - `node scripts/react-versions.mjs install`: runs `npm ci` in every test environment directory (run by `prepare`)
 */

import { execSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

// #region Discovery

/**
 * Root directory of the repository
 */
export const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..');

/**
 * Directory holding the test environment of every additional React version
 */
export const reactVersionsDir = join(rootDir, 'react-versions');

/**
 * Packages installed into every test environment, and resolved from it instead of from the root by the Vitest project of that version
 */
export const reactSensitivePackages = ['react', 'react-dom', '@testing-library/react', '@testing-library/dom', '@testing-library/user-event'];

/**
 * Gets the major version a dependency specifier, such as `^19.3.1`, resolves to
 * @param {string} specifier Dependency specifier
 * @returns {string} Major version
 */
export function getMajor(specifier) {
  const match = /(\d+)/.exec(specifier);
  if (!match) throw new Error(`Can not determine the major version of "${specifier}"`);
  return match[1];
}

/**
 * Gets the supported React versions
 * @returns {{ default: string, additional: { major: string, dir: string }[] }} Default React major, and every additional React major with
 * its test environment directory
 */
export function getReactVersions() {
  const pkg = JSON.parse(readFileSync(join(rootDir, 'package.json'), 'utf8'));
  const additional = existsSync(reactVersionsDir)
    ? readdirSync(reactVersionsDir, { withFileTypes: true })
        .filter((entry) => entry.isDirectory() && /^\d+$/.test(entry.name))
        .map((entry) => ({ major: entry.name, dir: join(reactVersionsDir, entry.name) }))
        .sort((a, b) => Number(b.major) - Number(a.major))
    : [];
  return { default: getMajor(pkg.devDependencies.react), additional };
}

// #endregion

// #region CLI

/**
 * Runs the CLI command given on the command line
 * @param {string | undefined} command Command to run
 */
function _main(command) {
  const versions = getReactVersions();
  if (command === 'list') {
    console.log(JSON.stringify([versions.default, ...versions.additional.map(({ major }) => major)]));
  } else if (command === 'install') {
    for (const { major, dir } of versions.additional) {
      console.log(`Installing the React ${major} test environment (${dir})`);
      execSync('npm ci --no-audit --no-fund', { cwd: dir, stdio: 'inherit' });
    }
  } else {
    console.error('Usage: node scripts/react-versions.mjs <list|install>');
    process.exit(1);
  }
}

// Only run the CLI when executed directly, never when imported
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  _main(process.argv[2]);
}

// #endregion

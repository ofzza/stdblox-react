/**
 * Type declarations of `react-versions.mjs`, for its TypeScript importers (`vite.config.ts`, tests)
 */

/**
 * Root directory of the repository
 */
export const rootDir: string;

/**
 * Directory holding the test environment of every additional React version
 */
export const reactVersionsDir: string;

/**
 * Packages installed into every test environment, and resolved from it instead of from the root by the Vitest project of that version
 */
export const reactSensitivePackages: string[];

/**
 * Gets the major version a dependency specifier, such as `^19.3.1`, resolves to
 * @param specifier Dependency specifier
 * @returns Major version
 */
export function getMajor(specifier: string): string;

/**
 * Gets the supported React versions
 * @returns Default React major, and every additional React major with its test environment directory
 */
export function getReactVersions(): { default: string; additional: { major: string; dir: string }[] };

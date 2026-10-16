/**
 * Showcase content: collects the repository README, and every unit README and showcase-component, when the showcase is built
 */

import pkg from '../../package.json';
import readme from '../../README.md?raw';
import { createRegistry, getRepositoryUrl, type ShowcaseModule } from './registry.js';

// #region Content

/**
 * Strips the `../../src/` prefix `import.meta.glob` keys carry, leaving paths relative to `src/`
 * @param modules Modules keyed by their glob path
 * @returns Modules keyed by path relative to `src/`
 */
function _relativeToSrc<TModule>(modules: Record<string, TModule>): Record<string, TModule> {
  return Object.fromEntries(Object.entries(modules).map(([path, module]) => [path.replace(/^\.\.\/\.\.\/src\//, ''), module]));
}

/**
 * Package name, used as the showcase title
 */
export const title: string = pkg.name;

/**
 * Contents of the repository README.md, the showcase home page
 */
export const homeReadme: string = readme;

/**
 * Web URL of the repository's default branch, to which links to other repository files resolve
 */
export const repositoryUrl = getRepositoryUrl(pkg.repository);

/**
 * Showcase registry of every unit
 */
export const registry = createRegistry(
  _relativeToSrc(import.meta.glob<string>('../../src/*/**/README.md', { query: '?raw', import: 'default', eager: true })),
  _relativeToSrc(import.meta.glob<ShowcaseModule>('../../src/*/**/*.showcase.tsx')),
);

// #endregion

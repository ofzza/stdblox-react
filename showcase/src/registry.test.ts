import { describe, expect, it } from 'vitest';
import { createRegistry, getRepositoryUrl, resolveLink, type ShowcaseModule } from './registry.js';

/**
 * Loads no showcase module, standing in for a showcase loader
 * @returns Never resolving promise
 */
const _load = () => new Promise<ShowcaseModule>(() => {});

describe('registry', () => {
  // Tests the showcase registry's pure functions, with hand written README and showcase maps standing in for what `import.meta.glob` collects

  describe('createRegistry', () => {
    // Covers how unit pages and the menu tree are derived from the directory structure

    const registry = createRegistry(
      {
        'utilities/hello/README.md': '# hello',
        'components/Greeting/README.md': '# Greeting',
        'components/inputs/Counter/README.md': '# Counter',
        'README.md': '# Not a unit',
      },
      { 'components/Greeting/Greeting.showcase.tsx': _load },
    );

    it('Creates a page for every unit README', () => {
      expect([...registry.units.keys()].sort()).toEqual(['components/Greeting', 'components/inputs/Counter', 'utilities/hello']);
      expect(registry.units.get('components/Greeting')).toMatchObject({ name: 'Greeting', readme: '# Greeting' });
    });

    it('Attaches each showcase to the unit in its directory', () => {
      expect(registry.units.get('components/Greeting')?.Showcase).toBeDefined();
      expect(registry.units.get('utilities/hello')?.Showcase).toBeUndefined();
    });

    it('Mirrors the directory structure in the menu, sorted by name', () => {
      const names = (nodes: (typeof registry.menu)[number]['children']): unknown[] =>
        nodes.map((node) => (node.kind === 'group' ? { [node.name]: names(node.children) } : node.name));
      expect(names(registry.menu)).toEqual([{ components: ['Greeting', { inputs: ['Counter'] }] }, { utilities: ['hello'] }]);
    });
  });

  describe('resolveLink', () => {
    // Covers how links found in READMEs are resolved, from the root README and from a unit README

    const units = new Set(['components/Greeting', 'utilities/hello']);
    const repo = 'https://github.com/owner/repo/blob/master';

    it('Resolves a unit README link from the root README to its route', () => {
      expect(resolveLink('./src/components/Greeting/README.md', '', units, repo)).toBe('#/components/Greeting');
    });

    it('Resolves a unit README link from another unit README to its route', () => {
      expect(resolveLink('../../utilities/hello/README.md', 'src/components/Greeting', units, repo)).toBe('#/utilities/hello');
    });

    it('Resolves other repository files to the repository host', () => {
      expect(resolveLink('./CONTRIBUTE.md#glossary', '', units, repo)).toBe(`${repo}/CONTRIBUTE.md#glossary`);
      expect(resolveLink('../../../AGENTS.md', 'src/components/Greeting', units, repo)).toBe(`${repo}/AGENTS.md`);
    });

    it('Leaves absolute URLs, anchors, and links leaving the repository unchanged', () => {
      expect(resolveLink('https://react.dev', '', units, repo)).toBe('https://react.dev');
      expect(resolveLink('#usage', '', units, repo)).toBe('#usage');
      expect(resolveLink('../outside.md', '', units, repo)).toBe('../outside.md');
    });
  });

  describe('getRepositoryUrl', () => {
    // Covers deriving the repository's web URL from the `repository` field forms `package.json` allows

    it('Derives the web URL of a GitHub repository', () => {
      expect(getRepositoryUrl({ url: 'git+https://github.com/owner/repo.git' })).toBe('https://github.com/owner/repo/blob/master');
      expect(getRepositoryUrl('https://github.com/owner/repo', 'main')).toBe('https://github.com/owner/repo/blob/main');
    });

    it('Gets nothing for other repositories', () => {
      expect(getRepositoryUrl({ url: 'https://example.com/repo.git' })).toBeUndefined();
      expect(getRepositoryUrl(undefined)).toBeUndefined();
    });
  });
});

import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { getMajor, getReactVersions, rootDir } from '../scripts/react-versions.mjs';
import { version as reactVersion } from 'react';
import { version as reactDomVersion } from 'react-dom';
import * as api from './index.js';

/**
 * Directory of the library sources
 */
const _srcDir = dirname(fileURLToPath(import.meta.url));

/**
 * Directories holding units, by the kind of unit they hold
 */
const _unitRoots = { component: 'components', hook: 'hooks', utility: 'utilities' } as const;

/**
 * Represents a unit: a directory holding an `index.ts`, under one of the unit roots
 */
interface _Unit {
  kind: keyof typeof _unitRoots;
  name: string;
  path: string;
  dir: string;
  files: string[];
}

/**
 * Finds every unit under a directory, at any depth
 * @param kind Kind of the units under the directory
 * @param dir Directory to search
 * @returns Units found
 */
function _findUnits(kind: keyof typeof _unitRoots, dir: string): _Unit[] {
  if (!existsSync(dir)) return [];
  const entries = readdirSync(dir, { withFileTypes: true });
  const files = entries.filter((entry) => entry.isFile()).map((entry) => entry.name);
  const nested = entries.filter((entry) => entry.isDirectory()).flatMap((entry) => _findUnits(kind, join(dir, entry.name)));
  if (!files.includes('index.ts')) return nested;
  const path = relative(_srcDir, dir).split('\\').join('/');
  return [{ kind, name: path.split('/').pop()!, path, dir, files }, ...nested];
}

/**
 * Every unit of the library
 */
const _units = Object.entries(_unitRoots).flatMap(([kind, root]) => _findUnits(kind as keyof typeof _unitRoots, join(_srcDir, root)));

/**
 * Public API of every unit, keyed by the path of its `index.ts`
 */
const _unitModules = import.meta.glob<Record<string, unknown>>(['./components/**/index.ts', './hooks/**/index.ts', './utilities/**/index.ts'], {
  eager: true,
});

describe('index', () => {
  // Tests the public API and the repository structure it relies on, by walking the unit directories with `node:fs` and comparing what they
  // contain and export against the conventions in AGENTS.md › Units and AGENTS.md › Component pattern

  it('Finds units', () => {
    expect(_units.length).toBeGreaterThan(0);
  });

  describe.each(_units.map((unit) => [unit.path, unit] as const))('Unit %s', (_path, unit) => {
    // Checks each unit against the unit directory contract: every unit has a README, tests and a showcase, and is re-exported from the
    // entry point

    it('Has a README.md', () => {
      expect(unit.files).toContain('README.md');
    });

    it('Has tests', () => {
      expect(unit.files.some((file) => /\.test\.tsx?$/.test(file))).toBe(true);
    });

    it('Has a showcase', () => {
      expect(unit.files.some((file) => file.endsWith('.showcase.tsx'))).toBe(true);
    });

    it('Is re-exported from the entry point', () => {
      expect(readFileSync(join(_srcDir, 'index.ts'), 'utf8')).toContain(`export * from './${unit.path}/index.js';`);
    });
  });

  describe.each(_units.filter((unit) => unit.kind === 'component').map((unit) => [unit.path, unit] as const))('Component unit %s', (_path, unit) => {
    // Checks each component unit against the component pattern: logic in its hook, presentation in its render function, the component only
    // binding the two, and a showcase of a custom presentation proving the hook is reusable

    it('Is split into types, hook, render function and component', () => {
      const name = unit.name;
      expect(unit.files).toEqual(expect.arrayContaining([`${name}.types.ts`, `use${name}.ts`, `render${name}.tsx`, `${name}.tsx`]));
      expect(unit.files.some((file) => file === `use${name}.test.ts` || file === `use${name}.test.tsx`)).toBe(true);
      expect(unit.files).toContain(`${name}.test.tsx`);
    });

    it('Exports its component, hook and render function', () => {
      const module = _unitModules[`./${unit.path}/index.ts`];
      expect(module).toBeDefined();
      expect(Object.keys(module)).toEqual(expect.arrayContaining([unit.name, `use${unit.name}`, `render${unit.name}`]));
    });

    it('Showcases a custom presentation built on its hook', () => {
      const showcase = unit.files.find((file) => file.endsWith('.showcase.tsx'))!;
      expect(readFileSync(join(unit.dir, showcase), 'utf8')).toMatch(new RegExp(`\\buse${unit.name}\\(`));
    });
  });

  it('Exports exactly what the units export', () => {
    // Nothing may be exported from outside a unit, and every unit export must reach the public API
    const unitExports = Object.values(_unitModules).flatMap((module) => Object.keys(module));
    expect(Object.keys(api).sort()).toEqual([...new Set(unitExports)].sort());
  });

  describe('React versions', () => {
    // Checks that the declared React peer range, the root React devDependencies and the test environment of every additional React version
    // (see AGENTS.md › React compatibility) agree with each other

    const pkg = JSON.parse(readFileSync(join(rootDir, 'package.json'), 'utf8'));
    const versions = getReactVersions();
    const supported = [versions.default, ...versions.additional.map(({ major }) => major)];

    it('Loads React and React DOM of the same version', () => {
      // Guards the test environment aliasing: a React DOM resolving a React of another version fails in obscure ways. See AGENTS.md ›
      // React compatibility
      expect(reactDomVersion).toBe(reactVersion);
    });

    it('Declares a peer range covering exactly the supported React versions', () => {
      const peerMajors = (pkg.peerDependencies.react as string).split('||').map((range) => getMajor(range.trim()));
      expect(peerMajors.sort()).toEqual([...supported].sort());
    });

    it('Installs the default React version consistently', () => {
      for (const dependency of ['react', 'react-dom', '@types/react', '@types/react-dom']) {
        expect(getMajor(pkg.devDependencies[dependency]), dependency).toBe(versions.default);
      }
    });

    it.each(versions.additional.map(({ major, dir }) => [major, dir] as const))('Installs React %s consistently in its test environment', (major, dir) => {
      const environment = JSON.parse(readFileSync(join(dir, 'package.json'), 'utf8'));
      for (const dependency of ['react', 'react-dom', '@types/react', '@types/react-dom']) {
        expect(getMajor(environment.devDependencies[dependency]), dependency).toBe(major);
      }
      expect(existsSync(join(dir, 'tsconfig.json'))).toBe(true);
    });
  });
});

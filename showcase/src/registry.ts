/**
 * Showcase registry: builds the menu tree and the unit pages from the library's directory structure, and resolves README links to showcase
 * routes. Pure functions only, fed by `content.ts`, so they can be tested without a bundler
 */

import { lazy, type ComponentType, type LazyExoticComponent } from 'react';

// #region Types

/**
 * Represents a module default-exporting a showcase-component
 */
export interface ShowcaseModule {
  default: ComponentType;
}

/**
 * Represents a unit page: a unit's README preamble, followed by its showcase-component
 */
export interface UnitPage {
  kind: 'unit';
  /**
   * Unit name, which is its directory name
   */
  name: string;
  /**
   * Path of the unit directory, relative to `src/`, which is also its route
   */
  path: string;
  /**
   * Contents of the unit's README.md
   */
  readme: string;
  /**
   * Unit's showcase-component, loaded on first render, if it has one
   */
  Showcase?: LazyExoticComponent<ComponentType>;
}

/**
 * Represents a menu group: a directory of units, or of further groups
 */
export interface MenuGroup {
  kind: 'group';
  /**
   * Group name, which is its directory name
   */
  name: string;
  /**
   * Path of the group directory, relative to `src/`
   */
  path: string;
  /**
   * Groups and units within the group, sorted by name
   */
  children: (MenuGroup | UnitPage)[];
}

/**
 * Represents the showcase registry: every unit page by its path, and the menu tree mirroring the library's directory structure
 */
export interface Registry {
  units: Map<string, UnitPage>;
  menu: MenuGroup[];
}

// #endregion

// #region Registry

/**
 * Gets the directory path, relative to `src/`, of a file whose path is given relative to `src/`
 * @param file File path, relative to `src/`
 * @returns Directory path, relative to `src/`
 */
function _dirOf(file: string): string {
  return file.split('/').slice(0, -1).join('/');
}

/**
 * Creates the showcase registry
 * @param readmes Contents of every unit README.md, keyed by file path relative to `src/`
 * @param showcases Loader of every showcase module, keyed by file path relative to `src/`
 * @returns Registry
 */
export function createRegistry(readmes: Record<string, string>, showcases: Record<string, () => Promise<ShowcaseModule>>): Registry {
  const loaders = new Map(Object.entries(showcases).map(([file, load]) => [_dirOf(file), load]));
  const units = new Map<string, UnitPage>();
  const root: MenuGroup = { kind: 'group', name: '', path: '', children: [] };

  for (const [file, readme] of Object.entries(readmes)) {
    const path = _dirOf(file);
    const segments = path.split('/');
    // Units live in a group directory, never directly in `src/`
    if (segments.length < 2) continue;
    const load = loaders.get(path);
    const unit: UnitPage = { kind: 'unit', name: segments[segments.length - 1], path, readme, Showcase: load && lazy(load) };
    units.set(path, unit);

    let group = root;
    for (let i = 0; i < segments.length - 1; i++) {
      const groupPath = segments.slice(0, i + 1).join('/');
      let next = group.children.find((child): child is MenuGroup => child.kind === 'group' && child.path === groupPath);
      if (!next) {
        next = { kind: 'group', name: segments[i], path: groupPath, children: [] };
        group.children.push(next);
      }
      group = next;
    }
    group.children.push(unit);
  }

  _sortGroup(root);
  return { units, menu: root.children.filter((child): child is MenuGroup => child.kind === 'group') };
}

/**
 * Sorts a menu group's children by name, recursively
 * @param group Menu group to sort
 */
function _sortGroup(group: MenuGroup): void {
  group.children.sort((a, b) => a.name.localeCompare(b.name));
  for (const child of group.children) if (child.kind === 'group') _sortGroup(child);
}

// #endregion

// #region Links

/**
 * Resolves a relative path against a directory, both relative to the repository root
 * @param dir Directory, relative to the repository root (`''` for the root itself)
 * @param path Relative path
 * @returns Resolved path relative to the repository root, or `undefined` if it leaves the repository
 */
function _resolvePath(dir: string, path: string): string | undefined {
  const segments = dir ? dir.split('/') : [];
  for (const segment of path.split('/')) {
    if (segment === '' || segment === '.') continue;
    if (segment === '..') {
      if (!segments.length) return undefined;
      segments.pop();
    } else segments.push(segment);
  }
  return segments.join('/');
}

/**
 * Resolves a link found in a README to where it should point within the showcase: a README of a unit to that unit's route, any other file of
 * the repository to its page on the repository host, and anything else unchanged
 * @param href Link target, as written in the README
 * @param dir Directory of the README, relative to the repository root (`''` for the root README)
 * @param units Paths of every unit, relative to `src/`
 * @param repositoryUrl Web URL of the repository's default branch, to which repository files are linked, such as
 * `https://github.com/<owner>/<repo>/blob/master`
 * @returns Resolved link target
 */
export function resolveLink(href: string, dir: string, units: Set<string>, repositoryUrl?: string): string {
  // Absolute URLs, protocol relative URLs, in-page anchors and showcase routes stay as they are
  if (/^[a-z][a-z0-9+.-]*:/i.test(href) || href.startsWith('//') || href.startsWith('#')) return href;
  const [pathPart, anchor] = href.split('#', 2);
  const path = _resolvePath(dir, pathPart);
  if (path === undefined) return href;
  const unit = /^src\/(.+)\/README\.md$/.exec(path)?.[1];
  if (unit && units.has(unit)) return `#/${unit}`;
  return repositoryUrl ? `${repositoryUrl}/${path}${anchor ? `#${anchor}` : ''}` : href;
}

/**
 * Gets the web URL of a repository's default branch, from the `repository` field of a `package.json`
 * @param repository `repository` field of a `package.json`
 * @param branch Default branch
 * @returns Web URL of the branch, or `undefined` if the repository is not on GitHub
 */
export function getRepositoryUrl(repository: string | { url?: string } | undefined, branch: string = 'master'): string | undefined {
  const url = typeof repository === 'string' ? repository : repository?.url;
  const match = url && /github\.com[/:]([^/]+\/[^/#]+?)(\.git)?$/.exec(url);
  return match ? `https://github.com/${match[1]}/blob/${branch}` : undefined;
}

// #endregion

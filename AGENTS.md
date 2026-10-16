# AGENTS.md

Guidance for AI coding agents when working in this repository.

## Keeping documentation and tests current

**`README.md`, `CONTRIBUTE.md`, `AGENTS.md`, every unit's `README.md`, every unit's showcase-component and the tests are part of the deliverable of every task, not separate chores.** This holds whether or not the task mentions them. Whenever a change makes any of them inaccurate or incomplete, update it in the same change. Never leave it for later, and never finish a task by reporting only the code change. `PUBLISH.md` falls under the same rule whenever the release process changes.

- **`README.md`** is the user-facing documentation: what the library is, how to get it, React compatibility and versioning, an index of every export (`# Usage`), the showcase, and how to develop it (`# Development`). It is also the showcase application's home page.
- **`src/<group>/<Unit>/README.md`** is the user-facing documentation of one unit: what it does, its props or parameters, and for a component, its state and prop getters (`## Custom presentation`). It is also the preamble of the unit's showcase page.
- **`CONTRIBUTE.md`** is the contributor-facing documentation: reporting issues, the contribution workflow and branching, and the architecture, conventions and glossary.
- **`AGENTS.md`** (this file, included by `CLAUDE.md`) is the agent-facing documentation: layout, commands, testing, conventions and gotchas.

Tests in particular: new or changed behaviour gets tests in the `*.test.ts(x)` beside the changed file. Tests that a change breaks are fixed or updated to the new behaviour, never deleted or skipped to make the suite pass. The purpose comments of the tests (see [Code style](#code-style)) are part of them, and must be kept current along with them.

Concrete triggers:

| A change that ...                                                  | ... requires updating                                                                                                     |
| ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------- |
| changes behaviour or code                                          | the `*.test.ts(x)` beside it                                                                                              |
| adds, changes or removes a test                                    | the purpose comment of its `describe`, and of the `it` if it has one                                                      |
| adds a unit                                                        | everything in [Units](#units): its README, tests and showcase-component, `src/index.ts`, `README.md` `# Usage`, [Exports](#exports), and `scripts/smoke-test/smoke.tsx` |
| removes or renames a unit, or an export of one                     | `src/index.ts`, `README.md` `# Usage`, [Exports](#exports), `scripts/smoke-test/smoke.tsx`, and every README linking to it |
| changes a unit's props, parameters, state or semantics             | the unit's `README.md`, its showcase-component, and any example that demonstrates it                                       |
| introduces, renames or retires a concept or term                   | the glossary in `CONTRIBUTE.md`, and every identifier, comment and document using the term                                |
| adds or drops a supported React version                            | everything in [React compatibility](#react-compatibility) › Adding or dropping a React version                             |
| adds or changes an npm script, Vitest project or tsconfig          | [Commands](#commands) / [Testing](#testing), and `# Development` in `README.md`                                            |
| changes the release process or `package.json` publishing fields    | `PUBLISH.md`                                                                                                              |
| changes the branching model or contribution workflow               | [Branching](#branching) below, and `CONTRIBUTE.md`                                                                        |
| adds a unit group directory under `src/`                           | [Layout](#layout) below, the unit roots in `src/index.test.ts`, and the project structure in `CONTRIBUTE.md`               |
| establishes a new convention, or hits a new gotcha                 | [Code style](#code-style) / [Gotchas and known issues](#gotchas-and-known-issues)                                         |
| resolves one of the known issues listed below                      | remove it from [Gotchas and known issues](#gotchas-and-known-issues)                                                      |

Any code sample added to a `README.md` must be verified against `tsc` before it is committed. Extract the ```ts / ```tsx blocks, point their `@ofzza/stdblox-react` imports at `./src/index.js`, and run `tsc --noEmit` with this repository's `tsconfig.json` options.

## Project

`@ofzza/stdblox-react` is a standard library of React components, hooks and utilities, for more specialised React component libraries (such as `datablox-fluentui-react`) to build on. It is MIT licensed, published to NPM, and built from `src/` to `dist/`. Its showcase application is deployed to GitHub Pages.

- **ESM only** (`"type": "module"`). The entry point is the `exports` map (`.` → `types: ./dist/index.d.ts`, `default: ./dist/index.js`, plus `./package.json`). `main` and `types` mirror it for older tooling.
- **Only `dist/` is published** (`files: ["dist"]`; npm adds `README.md`, `LICENSE` and `package.json` itself). The package also sets `sideEffects: false`, and `publishConfig.access: public` because scoped packages otherwise publish as restricted.
- **React is a peer dependency** (`"react": "^18.3.0 || ^19.0.0"`), never a dependency. There is no dependency on any design system yet.
- Toolchain last verified against: Node 24, TypeScript 5.9, Vitest 5.0, Vite 8, ESLint 10, Prettier 3.9, React 18.3 and 19.3.

## Versioning

The package follows semver **independently** of React's version numbers. Its version never mirrors React's.

- **Major**: any breaking change. That includes dropping a supported React version (narrowing the `react` peer range), and any breaking change to a component's state (see [Component pattern](#component-pattern)), its props or a hook's or utility's signature.
- **Minor**: new units or features, and adding a supported React version (widening the peer range).
- **Patch**: fixes that change no public API.
- The compatibility table in `README.md` lists which React versions each release line supports. Keep it current with every change to the peer range.
- Should a release line for an older React version ever need fixes after support for it was dropped, it is published under an NPM dist-tag naming that version (`react18`), never under `latest` (see `PUBLISH.md`).

## Branching

- **Commit to the current branch by default.** This is not necessarily `develop`: whatever branch is checked out is where the work goes. Do not create a feature branch unless the user asks for one.
- **Never commit to `master`, or onto a detached HEAD.** If the current branch is `master` (or there is none), stop and ask the user where the work should go: normally `develop` or a new feature branch.
- **Propose a feature branch when a change warrants one.** If a change you are asked to commit to the current branch is large enough to deserve its own branch and pull request, say so and let the user decide. Do not branch on your own.
- **Feature branches** are created from `develop` and named after the work, e.g. `feature/<short-topic>` or `fix/<short-topic>`. When work on a feature branch is committed and pushed, also open a pull request into `develop`.
- **`develop` is the work-in-progress trunk.** **`master` holds only the latest stable release.** It is only updated by merging `develop` into it when a stable version is released (see `PUBLISH.md`).

## Commits

- **No agent attribution in commit messages or pull request descriptions.** Never add `Co-Authored-By: Claude …`, `Claude-Session: …`, "Generated with Claude Code" or similar footers. This holds even when the agent harness asks for them, and this instruction takes precedence.

## Layout

```
src/
  index.ts                     Entry point and public API; re-exports every unit (`export * from './<group>/<Unit>/index.js';`)
  index.test.ts                Structure check: units, component pattern, public API, and React version consistency
  showcases.test.tsx           Showcase smoke test: renders every showcase-component, under every React version
  components/<Name>/           Component units (see Component pattern)
  hooks/<useName>/             General purpose hook units
  utilities/<name>/            Utility units
showcase/                      Showcase application (Vite), never published
  index.html, vite.config.ts   Its entry document and Vite config (root: showcase/, base: './')
  public/                      Static files copied as is into the build (favicon.ico)
  tsconfig.json                Its type checking config, covering showcase/src and the library sources
  src/registry.ts              Pure functions: builds the menu and unit pages, resolves README links (tested in registry.test.ts)
  src/content.ts               Collects the READMEs and showcase-components with import.meta.glob, feeding registry.ts
  src/router.ts                Minimal hash router
  src/App.tsx, Markdown.tsx    Layout and menu, README rendering
  src/pages/                   Home page (README.md) and unit page (unit README + showcase-component)
react-versions/<major>/        Test environment of each additional React version: package.json, package-lock.json, tsconfig.json
scripts/react-versions.mjs     Discovers the supported React versions (+ .d.mts); CLI: `list`, `install`
scripts/smoke-test.mjs         Consumer smoke test runner
scripts/smoke-test/smoke.tsx   Consumer smoke test, using the public API
tsconfig.json                  Type checking config. Includes src/ (tests too) and vitest.setup.ts, emits nothing
tsconfig.build.json            Build config. Extends tsconfig.json, emits to dist/ with declarations, EXCLUDES tests and showcases
vite.config.ts                 Vitest projects: debug, showcase, unit, and unit-react<major> per additional React version
vitest.setup.ts                Vitest setup: jest-dom matchers, Testing Library cleanup
eslint.config.js               ESLint flat config (typescript-eslint + react-hooks + prettier compat, ignores what .gitignore ignores)
.prettierrc                    Prettier config
dist/, showcase/dist/          Build output, gitignored
.github/workflows/ci.yml       GitHub Actions CI
.github/workflows/showcase.yml GitHub Pages deployment of the showcase application
.github/dependabot.yml         Weekly dependency updates
.vscode/extensions.json        Recommended VSCode extensions: ESLint, Prettier, TODO Highlight, Twoslash Query Comments
.vscode/launch.json            Vitest debug launch configs: all tests, unit tests, current file
README.md                      User documentation, and the showcase home page
CONTRIBUTE.md                  Contributor guide: reporting issues, workflow, branching, architecture and glossary
PUBLISH.md                     Pre-publish checklist and release steps
```

## Units

A **unit** is one publicly exported component, hook or utility, together with everything that belongs to it. Each one lives in its own directory, **named exactly after its main export**, under the group directory for its kind: `src/components/`, `src/hooks/` or `src/utilities/`. Units may be nested in further grouping directories (`src/components/inputs/Counter/`): every directory between the group and the unit becomes a level of the showcase menu.

Every unit directory holds:

- **`index.ts`**, its public API, re-exporting everything the unit exports. Its presence is what makes a directory a unit.
- **`README.md`**, its user documentation, maintained along with the unit (see [Keeping documentation and tests current](#keeping-documentation-and-tests-current)). It opens with a `# ` heading naming the export, and documents every prop, parameter and return value.
- **Tests**, at least one `*.test.ts(x)`.
- **A showcase-component**, `<name>.showcase.tsx`, default-exporting a component that takes no props and demonstrates the unit. It is never built into `dist/`, and must render with no setup beyond what it does itself.
- The unit's sources. Types and helpers closely tied to the unit (its props type, its state type) belong to it, and are exported from its `index.ts`, rather than becoming units of their own.

Each unit is re-exported from `src/index.ts`, as `export * from './<path>/index.js';`, under the region of its group. A unit may import another unit, through that unit's `index.js`.

`src/index.test.ts` enforces all of this: CI fails when a unit is missing any of these files, is not re-exported, or when `src/index.ts` exports anything that does not come from a unit.

## Component pattern

**Every component keeps all of its logic in a hook, and its presentation in a separate render function**, so that a library building on it can replace the presentation completely while reusing all of the behaviour. This is mandatory, and enforced by `src/index.test.ts`, even for a component with no state, whose hook is then trivial.

A component unit `<Name>` is made of:

- **`<Name>.types.ts`**: `<Name>Props` and `<Name>State`. Keeping the types apart means the hook and the render function never import each other.
- **`use<Name>.ts`**: `use<Name>(props: <Name>Props, ref?: Ref<…>): <Name>State`, the **component hook**. It holds **all** of the component's state and behaviour, and returns:
  - its state values, and values derived from them;
  - its actions, wrapped in `useCallback` (and derived objects in `useMemo`), so that presentations passing them to memoised children do not re-render needlessly;
  - its **prop getters**, `getRootProps()` and `get<Part>Props()`, returning everything an element needs to behave correctly: ARIA attributes and roles, ids, event handlers and the forwarded ref. `getRootProps()` also carries every native prop passed to the component, and the hook composes, rather than overwrites, event handlers passed in its props.
- **`render<Name>.tsx`**: `render<Name>(state: <Name>State): JSX.Element`, the **render function**: the default presentation. It is a pure function of the state: it calls no hooks (ESLint's `rules-of-hooks` reports one that does), only spreads prop getters onto elements and reads state values.
- **`<Name>.tsx`**: only binds the two: `export const <Name> = forwardRef<…, <Name>Props>((props, ref) => render<Name>(use<Name>(props, ref)));`, followed by `<Name>.displayName = '<Name>';`.
- **`index.ts`**: exports the component, the hook, the render function, and both types (`export type *`). All of them are public API.

Further rules:

- **A component's state (`<Name>State`) is public API.** Custom presentations depend on its shape, so renaming or removing a member, changing its type, or changing what it means, is a breaking change: a major version (see [Versioning](#versioning)).
- **A presentation can be replaced in two ways**: build a new component from `use<Name>` and its own JSX (a **custom presentation**), or bind `use<Name>` to a different render function. Both reuse all of the logic, and the prop getters keep the accessibility and keyboard handling.
- **Logic is tested in `use<Name>.test.ts`**, with `renderHook`: every action, the state transitions, and what each prop getter returns. **`<Name>.test.tsx` only tests the presentation**: that it renders the state, that the prop getters are wired to the right elements (exercised through `user-event`), ref forwarding and the display name.
- **The showcase-component demonstrates the default presentation _and_ a custom presentation built on `use<Name>`**, proving the hook is reusable. `src/index.test.ts` checks that the showcase calls `use<Name>(`.
- **The unit's README has a `## Custom presentation` section**, documenting every member of `<Name>State` and every prop getter.
- Composite components compose: the hook of a component containing another one calls that one's hook, and its render function calls that one's render function.

## React compatibility

The library supports React 18.3+ and 19. **Every supported React version is tested**: the unit tests run, and are type checked, under each one, and the packed package is installed and smoke tested in a consumer project with each one.

- **The default React version** is the major of the root `react` devDependency, installed in the root `node_modules`, together with `react-dom`, `@types/react` and `@types/react-dom` of the same major. The build, ESLint, the showcase application and the `unit` Vitest project use it.
- **Each additional React version** has a **test environment** directory, `react-versions/<major>/`, with its own `package.json`, `package-lock.json` and `tsconfig.json`. Its `package.json` installs the **React-sensitive packages** for that major: `react`, `react-dom`, `@types/react`, `@types/react-dom`, `@testing-library/react`, `@testing-library/dom` and `@testing-library/user-event`. `prepare` installs every test environment (`npm run react-versions:install`, which runs `npm ci` in each).
- **`scripts/react-versions.mjs` is the single source of truth.** It discovers the default version from `package.json` and the additional ones from the `react-versions/` directories. `vite.config.ts` and the `react` CI job both use it.
- **The `unit-react<major>` Vitest project** of each additional version aliases every React-sensitive package, and any subpath of it, to that version's test environment (`resolve.alias`). Packages there resolve one another from there, so React, React DOM and Testing Library always come from the same version. It type checks against the test environment's `tsconfig.json`, whose `paths` point the same packages at that version's types.
- `src/index.test.ts` checks that the peer range covers exactly the supported versions, that each test environment installs the right major of every package, and that React and React DOM load at the same version.

**Code rules**, so that one build works under every supported version:

- Forward refs with `forwardRef`. Never rely on `ref` as a regular prop (React 19 only).
- Only use React APIs available in the oldest supported version: no `use()`, `useActionState`, `useOptimistic`, `useFormStatus`, or `<Context>` as a provider.
- Import the `JSX` type from `react` (`import type { JSX } from 'react'`), never use the global `JSX` namespace, which `@types/react` 19 removed.
- A React 19 only API used in library code fails the `unit-react18` type check ("Unhandled Source Error"), and usually its runtime tests too.

### Adding or dropping a React version

**Adding a new React major `<new>`** (a minor release):

1. Turn the current default version `<old>` into an additional one: create `react-versions/<old>/`, copying an existing test environment and setting every package in its `package.json` to `^<old>`, then run `npm install` in it to create its lockfile. Copy its `tsconfig.json` from an existing test environment.
2. Bump the root `react`, `react-dom`, `@types/react` and `@types/react-dom` devDependencies to `^<new>`.
3. Extend the `react` peer range in `package.json` with `|| ^<new>.0.0`.
4. Add a Dependabot entry for `/react-versions/<old>` in `.github/dependabot.yml`.
5. Run `npm run ci` and `npm run smoke -- <each major>`, and fix whatever the new version breaks under every version.
6. Update the compatibility table in `README.md`, and the supported versions in [Project](#project) and here.

**Dropping a React major `<old>`** (a major release): delete `react-versions/<old>/` and its Dependabot entry, remove it from the peer range, then update the compatibility table, [Project](#project) and the code rules above if the oldest version changed.

## Showcase

The showcase application (`showcase/`) is a Vite app, never published, built from the library sources directly:

- **The home page is `README.md`.** `content.ts` imports it with `?raw`.
- **The menu mirrors the directory structure.** `content.ts` collects every unit `README.md` and `*.showcase.tsx` under `src/<group>/` with `import.meta.glob`, and `registry.ts` builds the menu from their directories: groups and nested directories become menu groups, units become pages, sorted by name. Adding a unit adds its page, with no change to the showcase.
- **A unit page is its `README.md`**, followed by its showcase-component, loaded lazily inside an error boundary, so a broken showcase never takes the application down.
- **README links resolve within the showcase**: a link to a unit's `README.md` becomes that unit's route, a link to any other file of the repository goes to it on GitHub, and an in-page anchor scrolls to its heading. Write README links as relative paths to the files they point to, so they work on GitHub and on NPM too.
- Routing is hash based (`#/components/Counter`), and `base` is `'./'`, so the built application works from any sub-path, as GitHub Pages serves it.
- Styling is minimal plain CSS (`showcase/src/styles.css`), in light and dark.
- Static assets (the favicon) live in `showcase/public/`, Vite's default `publicDir`, and are copied to the root of the build. Reference them from `index.html` by root path (`/favicon.ico`): Vite rewrites it against `base`.

## Commands

- `npm run clean`: deletes `dist/` (cross-platform, via `node -e`).
- `npm run build`: runs `tsc -p tsconfig.build.json`, compiling `src/` to `dist/` with declarations. `prebuild` runs `clean` first, so renamed or removed modules never leave stale output behind to be published.
- `npm run dev`: the same in watch mode.
- `npm run showcase` / `showcase:build` / `showcase:preview`: the showcase application's development server, its build into `showcase/dist/`, and a static server for that build.
- `npm run smoke -- <major>`: the consumer smoke test against that React version (default: the default version). It packs the library (which runs `prepare`), installs the tarball into a temporary project together with `react`, `react-dom`, their types of that major and TypeScript, then type checks `scripts/smoke-test/smoke.tsx` under `nodenext` and `bundler` resolution, and compiles and runs it.
- `npm run react-versions:install`: runs `npm ci` in every `react-versions/<major>/` test environment.
- `npm test`: runs every `test:*` script.
  - `npm run test:unit`: `vitest run --project "unit*"`, every unit test under every supported React version, executed and type checked.
  - `npm run test:showcase`: `vitest run --project showcase`, the showcase application's own tests.
- `npm run ci`: runs every `ci:*` script (`ci:build`, `ci:typecheck-showcase`, `ci:build-showcase`, `ci:eslint`, `ci:prettier`, `ci:test-unit`, `ci:test-showcase`). This is what GitHub Actions runs.
- `npm run prepare`: installs the test environments, then builds. It is invoked automatically by a local `npm install`/`npm ci`, by `npm pack` and before `npm publish`, but **not** when the package is installed as a dependency.
- `prepublishOnly`: runs `npm run ci` before `npm publish`, so a failing build is never published.

**Script wiring matters when adding one.** `test` is `npm-run-all test:*` and `ci` is `npm-run-all ci:*`, so a new `test:<name>` joins `npm test` automatically. It will _not_ run in CI until a matching `ci:test-<name>` script exists, so add both.

## Testing

Vitest, with `describe`/`it`/`expect` imported explicitly (`globals` is not enabled). Components and hooks are tested with Testing Library (`render`, `renderHook`, `screen`), `@testing-library/user-event` for interaction, and the `@testing-library/jest-dom` matchers, in `jsdom`. `vitest.setup.ts` registers the matchers and unmounts rendered trees after each test, which Testing Library only does on its own when globals are enabled. `vite.config.ts` defines these projects:

- **`unit`** matches `src/**/*.{test,unit.test,spec,unit.spec}.{js,ts,tsx}`, under the default React version, and runs each test file through **both** Vitest pools in one invocation. The default pool executes it for its runtime expectations. `tsc` (via `typecheck.tsconfig: './tsconfig.json'`) type checks it for its compile-time assertions (`expectTypeOf`, `@ts-expect-error`), reporting type errors as failed tests.

  `include` and `typecheck.include` deliberately match the same files. Vitest globs the two independently and does not warn when they overlap, so **every test file is collected and reported twice**, with each test counted once per pool. That is expected, not a misconfiguration. It has two consequences:
  - A file change triggers two reruns in watch mode.
  - A file containing no runtime `test()`/`describe()` call fails the runtime pass with "No test suite found in file", unless `--passWithNoTests` is set (it is set in `test:unit`).

  Type errors in non-test sources are reported too. `tsc` runs over the whole program with no file list, so an error outside a test file surfaces as an "Unhandled Source Error" and fails the run without being attributed to any test. Test titles built with `it.each`/`describe.each` show their raw `%s` placeholders in the type checking pass.

  `typecheck.spawnTimeout` is pinned to `10000`. Vitest 5 documents a default for it but never applies one, yet uses the value unguarded when spawning the checker, which leaves an intermittent race.

- **`unit-react<major>`**, one per additional React version, runs the same files the same way, with the React-sensitive packages resolved from that version's test environment, and type checked against its `tsconfig.json` (see [React compatibility](#react-compatibility)).
- **`showcase`** matches `showcase/src/**/*.test.{ts,tsx}`, under the default React version only, type checked against `showcase/tsconfig.json`.
- **`debug`** matches every file the `unit` project runs, plus files ending in `.debug.ts(x)` / `.debug.js`. It executes them at runtime only, under the default React version, with no type checking, and is driven by the "Debug Current Test File" config in `.vscode/launch.json`. `.gitignore` excludes `*.debug.test.ts`. Those files also match the `unit` glob, so scratch debug tests run locally but are never committed.

Two test files check the repository rather than a unit:

- **`src/index.test.ts`** walks the unit directories with `node:fs`, and checks every unit against [Units](#units) and every component unit against [Component pattern](#component-pattern). It compares the runtime exports of `src/index.ts` with those of the units, and checks the React versions for consistency.
- **`src/showcases.test.tsx`** renders every showcase-component, so a showcase can never break unnoticed. It runs under every React version, and its test titles name the React version they ran under.

After adding or changing type-level assertions, or a structure check, sanity-check them: break one deliberately, confirm the run fails, then revert. Vitest prints an "experimental" warning for typecheck, which is expected.

## Code style

`ci:prettier` and `ci:eslint` enforce the style, over `src`, `showcase` and `scripts`. That includes the unit READMEs under `src/`, which Prettier formats too. **The root Markdown files are not format-enforced**, so keep them tidy by hand.

- Prettier: `printWidth: 160`, single quotes, 2-space indent, semicolons, trailing commas, always-parenthesised arrow params.
- Prose in documentation and comments uses British spelling (behaviour, memoise, specialised).
- Every source file opens with a descriptive header comment. Test files open with their imports.
- JSDoc on every exported symbol, including each member of a props or state interface: a summary in third person ("Gets ...", "Checks if ...", "Represents ..."). Only `@param` and `@returns` are used, never `@example`, `@template` or `@see`.
- Internal, non-exported symbols are `_`-prefixed and still get JSDoc. ESLint's `no-unused-vars` ignores `_`-prefixed vars, args and catch bindings.
- Group sections with `// #region Name` / `// #endregion`.
- Generic parameters are `T`-prefixed and descriptive (`TArray`, `TObject`), including `infer` bindings, which must never shadow an outer parameter.
- In conditional type chains, put a `// comment` line before each branch saying what it handles, rather than a trailing comment.
- File naming: a component unit's files are named as in [Component pattern](#component-pattern); a hook's or utility's main file is named after it (`useToggle.ts`, `hello.ts`), with its tests and showcase-component beside it (`useToggle.test.ts`, `useToggle.showcase.tsx`).
- Each test file has one top-level `describe` named after its module. `it()` names are capitalised verb phrases: `it('Greets the world by default', ...)`.
- **Every `describe` callback opens with a purpose comment.** It is a `//` block on the first line inside the callback, saying _what_ is under test and _how_ it is tested. A nested `describe` says only what its parent's comment does not.
- **An `it` callback gets a comment only when its title and body do not explain why it exists.** Examples: a regression, an edge case, a test guarding a gotcha (link it: `See AGENTS.md › <gotcha title>`), or a non-obvious assertion. Never restate the title.
- ESLint runs `eslint-plugin-react-hooks`' recommended rules, React Compiler rules included: for example, components must not be created during render, so a `lazy()` component is created once, outside of render.
- Rules deliberately off: `@typescript-eslint/no-explicit-any`, `ban-ts-comment`, `no-empty-object-type`. `any` and `@ts-expect-error` are fine to use where they earn their place.

## Gotchas and known issues

- **Additional React versions need their own test environment, not npm aliases.** An aliased `react-dom-18: npm:react-dom@18` next to a root `react@19` fails to install (`ERESOLVE`), and even when forced, it would `require('react')` and get React 19 from the root `node_modules`: Vitest externalises dependencies, so `resolve.alias` never applies inside them. A separate `react-versions/<major>/node_modules` keeps every React-sensitive package resolving its peers at the same version. `src/index.test.ts` › "Loads React and React DOM of the same version" guards this.
- **Every package that imports `react` and is loaded by tests must be a React-sensitive package**, installed in each test environment and listed in `reactSensitivePackages` in `scripts/react-versions.mjs`. Otherwise it resolves the root React even under `unit-react<major>`, mixing two React versions. Add a new one to the root devDependencies, every test environment, and the `paths` of every test environment's `tsconfig.json`.
- **The test environments' `tsconfig.json` files use `paths`, which nothing else may.** It is safe there because they only type check tests, and never emit. Do not add a `paths` alias to `tsconfig.json`, `tsconfig.build.json` or `showcase/tsconfig.json`: TSC does not rewrite aliased specifiers on emit, so they would ship to `dist/` unresolvable.
- **Showcase-components and tests are excluded from the build** by `tsconfig.build.json`. A new kind of non-library file under `src/` must be excluded there too. Check with `npm pack --dry-run`.
- **`prepare` must stay a script that never runs for consumers.** It installs the test environments, which a `postinstall` would also try to do in every consumer's install.
- **`npm pack` runs `prepare`**, so the smoke test re-installs the test environments and rebuilds before packing. That takes a few seconds, and is accepted.
- **`npm-run-all2`, not `npm-run-all`.** The original `npm-run-all@4` validates package names, and is unmaintained. Its maintained fork `npm-run-all2` installs the same `npm-run-all` binary.
- **Relative imports in `src/` must carry an explicit `.js` extension.** `moduleResolution: bundler` lets TSC accept `./module`, and TSC does not rewrite specifiers on emit. The extensionless form then ships to `dist/`, and Node's ESM resolver rejects it (`ERR_MODULE_NOT_FOUND` / `ERR_UNSUPPORTED_DIR_IMPORT`). Write `./module/index.js`, also for `.tsx` sources (`./Counter.js`).
- **Never use `npm ci --ignore-scripts` here.** `unrs-resolver` (`postinstall`) and `@parcel/watcher` (`install`) rely on their install hooks to link native bindings, and `prepare` installs the test environments. The CI workflow uses plain `npm ci` for this reason.
- **`prepare` builds during install**, so `npm ci` compiles once and `ci:build` compiles again. The duplicate build costs about a second and is accepted.
- **The real Node floor is 22.13.0 / 24.0.0**, not the bare major versions. It is set by `vitest@5`, `vite@8` and `eslint-visitor-keys@5`, and Node 20 is not supported. `actions/setup-node` with `node-version: 22` resolves to the latest 22.x and satisfies this.
- **Do not add an `engines` field for the dev-toolchain Node floor.** It would restrict consumers for no reason.
- **`files: ["dist"]` is an allowlist.** Anything else that must ship has to be added there. Check with `npm pack --dry-run`.
- **The `exports` map seals deep imports.** Only `.` and `./package.json` resolve, so `<package>/dist/<module>/index.js` fails under `node16`/`nodenext`/`bundler`. A new unit only needs re-exporting from `src/index.ts`. Add an `exports` subpath only if a unit should be importable on its own.
- **Anything in `dependencies` is installed for every consumer.** Keep build, lint, test and showcase tooling in `devDependencies`, and React in `peerDependencies`.
- **`@types/node` is pinned to the lowest supported Node major** (currently `^22`), so type checking cannot silently rely on APIs newer than the CI matrix floor. `.github/dependabot.yml` ignores its semver-major updates for this reason, so bump it by hand together with the matrix. Dependabot also ignores React majors, which are adopted following [React compatibility](#react-compatibility).
- **Library code must not use Node or Vite globals.** `tsconfig.build.json` sets `types: []`, so the build fails if it does, while `tsconfig.json` includes `node` and `vite/client` types for tests and tooling.
- **`@eslint/js` must be a direct devDependency.** `eslint.config.js` imports it, and since ESLint 10 `eslint` no longer pulls it in transitively.
- **`tsconfig.build.json` excludes test files**, so `npm run build` never reports a type error in a test. Use `npm test` (the `unit*` projects type check them) or `tsc --noEmit -p tsconfig.json`.
- **A prop getter's `aria-label` wins over its element's text** for assistive technologies. A custom presentation with visible button text ("Less", "More") is still announced as the getter's label ("Decrement", "Increment"), unless it overrides `aria-label` after spreading the getter.
- **A `workflow_run` trigger only takes effect from the workflow file on the default branch** (`master`). Changes to `showcase.yml` therefore only apply once they reach `master`, and the workflow cannot be tried out from `develop` or a pull request, except by running it on demand.
- `.gitignore` ignores `.vscode/` but re-includes `settings.json`, `tasks.json`, `launch.json` and `extensions.json`. Any other `.vscode/` file must be re-included there before it can be committed. `.gitignore` also ignores anything matching `*.gitignore.*` / `*.gitignore/`, a convention for keeping local scratch files and directories next to the code.
- The repository URLs in `package.json` (`github.com/ofzza/stdblox-react`) are assumed, and must match the real GitHub repository before the first publish. The showcase derives its links to repository files from them.

## Continuous integration

`.github/workflows/ci.yml` runs on every pull request targeting, and every push to, `master` or `develop`, and cancels in-progress runs only for pull requests, never for `master`. Its jobs:

- **`ci`** (`Node 22`, `Node 24`): `npm ci && npm run ci`, which covers every supported React version through the `unit*` projects.
- **`react-versions`**: lists the supported React majors with `node scripts/react-versions.mjs list`.
- **`react`** (`React <major> consumer`, one per supported major, from the list above, on Node 24): `npm ci && npm run smoke -- <major>`, the consumer smoke test against a real install of that React version.

`.github/workflows/showcase.yml` runs after every successful CI run of a push to `master` (a `workflow_run` trigger), checks out the commit CI tested, builds the showcase application and deploys it to GitHub Pages. It can also be run on demand, without waiting for CI. A failed CI run leaves it skipped, so a failing commit is never deployed. It requires the repository's Pages source to be set to "GitHub Actions" in its settings.

`.github/dependabot.yml` opens weekly npm and github-actions updates against `develop`. Root devDependencies are grouped into one pull request, and each test environment under `react-versions/` gets its own entry, ignoring majors. `@types/node` and React majors are ignored at the root.

**A workflow alone does not block merges.** To make it mandatory, set up branch protection on `master` in the GitHub repo settings, with `CI / Node 22`, `CI / Node 24` and every `CI / React <major> consumer` as required status checks. That is a repo setting, not a file in this repository.

## Exports

Everything public is re-exported from `src/index.ts`. Each unit's README documents it in full:

- **Components**
  - `Counter`, `useCounter`, `renderCounter`, `CounterProps`, `CounterState` (`src/components/Counter/`): a count, with buttons and arrow keys incrementing and decrementing it within optional bounds. Placeholder for a stateful component.
  - `Greeting`, `useGreeting`, `renderGreeting`, `GreetingProps`, `GreetingState` (`src/components/Greeting/`): a greeting for the given name. Placeholder for a stateless component.
- **Hooks**
  - `useToggle(initial?)`, `UseToggleResult` (`src/hooks/useToggle/`): a boolean state value, with stable functions toggling and setting it. Placeholder for a hook.
- **Utilities**
  - `hello(name?)` (`src/utilities/hello/`): a greeting for the given name, defaulting to `'World'`. Placeholder for a utility.

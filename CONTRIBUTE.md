# Contributing

## Reporting Issues

When reporting issues, please keep to the provided issue templates, if any.

Before reporting issues, please read: [GitHub Work-Flow](https://github.com/ofzza/onboarding/blob/master/CONTRIBUTING/github.md)

## Contributing Code

For work-flow and general etiquette when contributing, please see:

- [Git Source-Control Work-Flow](https://github.com/ofzza/onboarding/blob/master/CONTRIBUTING/git.md)
- [GitHub Work-Flow](https://github.com/ofzza/onboarding/blob/master/CONTRIBUTING/github.md)

This repository uses two long-lived branches:

- `develop` - the work-in-progress trunk.
- `master` - always contains the latest stable released version. It is never committed to directly, and only ever gets merged into from `develop`, when a stable version is released.

Small changes are committed directly to the branch you are working on, usually `develop`. Larger work, or any work you want reviewed, goes in its own feature branch, created from `develop` and named after the work (see [Git Source-Control Work-Flow](https://github.com/ofzza/onboarding/blob/master/CONTRIBUTING/git.md) for branch naming conventions). Once it is pushed, request a merge into `develop` with a pull request. Ideally, accompany such work with its own issue.

Before committing or requesting a merge, make sure `npm run ci` passes locally (build, showcase, ESLint, Prettier and the tests under every supported React version), and that `README.md`, `CONTRIBUTE.md`, `AGENTS.md` and the README of every unit you touched reflect the change.

## Architecture and glossary

### Project structure

```
src/
  index.ts                  Entry point and public API: re-exports every unit
  index.test.ts             Structure check of the units, the public API and the React versions
  showcases.test.tsx        Renders every showcase-component, under every supported React version
  components/<Name>/        Component units
  hooks/<useName>/          General purpose hook units
  utilities/<name>/         Utility units
showcase/                   Showcase application, built from the sources and READMEs, deployed to GitHub Pages
react-versions/<major>/     Test environment of each additional supported React version
scripts/                    React version discovery, and the consumer smoke test
```

### Units

Every public component, hook and utility is a **unit**: a directory of its own, named after it, under `src/components/`, `src/hooks/` or `src/utilities/` (optionally nested in further grouping directories). Each unit holds:

- `index.ts`, its public API, re-exported from `src/index.ts`;
- `README.md`, its documentation, kept current with every change to it;
- its tests, `*.test.ts(x)`;
- its showcase-component, `<name>.showcase.tsx`, demonstrating it in the showcase application.

The showcase application picks up a new unit on its own: its menu mirrors the directory structure, and each unit's page shows its README followed by its showcase-component. A test fails CI if a unit is missing any of these.

### Component pattern

Every component keeps **all** of its logic in a hook, and its presentation in a separate render function, so that a library building on it can replace the presentation completely while reusing all of the behaviour. A component `<Name>` is split into:

| File                 | Holds                                                                                                                            |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `<Name>.types.ts`    | `<Name>Props`, and `<Name>State`, what the hook returns                                                                          |
| `use<Name>.ts`       | `use<Name>(props, ref?)`: all state, actions (memoised) and prop getters (`getRootProps()`, `get<Part>Props()`), which carry ARIA attributes, event handlers and the ref |
| `render<Name>.tsx`   | `render<Name>(state)`: the default presentation, a pure function from state to JSX that calls no hooks                           |
| `<Name>.tsx`         | `<Name>`: binds the two, `forwardRef((props, ref) => render<Name>(use<Name>(props, ref)))`                                       |

The hook's logic is tested with `renderHook` in `use<Name>.test.ts`; `<Name>.test.tsx` only tests the presentation and its bindings. The showcase-component demonstrates the default presentation and a custom presentation built on the hook. A component's state is public API: changing its shape is a breaking change.

See `AGENTS.md` › Units and › Component pattern for the full set of rules.

### React versions

The library supports several React majors at once, and tests each of them: the default one is installed at the root, and each additional one has a test environment under `react-versions/<major>/`, against which a Vitest project of its own runs every unit test. CI also smoke tests the packed package against a real install of each one. See `AGENTS.md` › React compatibility for how it works, and for how to add or drop a React version.

### Glossary

Terms used across code, comments and documentation. Use them as defined here, and add every new concept to this list.

| Term                         | Meaning                                                                                                                                          |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Unit                         | One publicly exported component, hook or utility, with its own directory, README, tests and showcase-component                                  |
| Unit group                   | A directory holding units: `src/components/`, `src/hooks/`, `src/utilities/`, or a grouping directory nested in one; a level of the showcase menu |
| Component hook               | `use<Name>`: the hook holding all of a component's state and behaviour                                                                          |
| Component state              | `<Name>State`: everything a component hook returns, and a render function or custom presentation renders. Public API                           |
| Prop getter                  | A member of a component state, `get<Part>Props()`, returning the props one element of a presentation needs to behave correctly                 |
| Render function              | `render<Name>`: a component's default presentation, a pure function from its state to JSX                                                       |
| Presentation                 | What a component renders from its state: its markup and styling, with no logic of its own                                                       |
| Custom presentation          | A presentation other than the default one, built on a component hook                                                                            |
| Showcase-component           | A unit's `*.showcase.tsx` default export, demonstrating the unit in the showcase application                                                    |
| Showcase application         | The Vite app in `showcase/`, presenting the README and every unit                                                                               |
| Default React version        | The React major installed at the root, used for the build, linting, the showcase and the `unit` test project                                    |
| Additional React version     | Any other supported React major, tested through its test environment                                                                            |
| Test environment             | `react-versions/<major>/`: the React-sensitive packages of an additional React version, installed on their own                                  |
| React-sensitive package      | A package that imports React, and so is installed per React version: React, React DOM, their types and Testing Library                          |

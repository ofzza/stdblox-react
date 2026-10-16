# stdblox-react

[![npm](https://img.shields.io/npm/v/@ofzza/stdblox-react)](https://www.npmjs.com/package/@ofzza/stdblox-react)

Standard library of React components, hooks and utilities, for more specialised React component libraries to build on.

Every component keeps all of its logic in a hook, separate from its presentation, so a library building on it can replace a component's presentation completely while reusing all of its behaviour.

📖 **[Live documentation and showcase](https://ofzza.github.io/stdblox-react/)**

---

Jump to section:

- [Get stdblox-react](#get-stdblox-react)
- [Compatibility](#compatibility)
- [Versioning](#versioning)
- [Usage](#usage)
  - [Components](#components)
  - [Hooks](#hooks)
  - [Utilities](#utilities)
  - [Custom presentations](#custom-presentations)
- [Showcase](#showcase)
- [Development](#development)
- [Contributing](#contributing)

# Get stdblox-react

stdblox-react is published as an NPM package. React is a peer dependency, so install it alongside, if your project does not have it yet:

```sh
$ npm install @ofzza/stdblox-react react
```

# Compatibility

Every release is tested against every React version it supports: its unit tests run, and are type checked, under each one, and the packed package is installed, type checked and run in a consumer project with each one.

| stdblox-react | React          |
| ------------- | -------------- |
| `0.x`         | `18.3+`, `19`  |

# Versioning

stdblox-react follows [semantic versioning](https://semver.org/) on its own, independently of React's version numbers. Which React versions a release supports is declared by its `react` peer dependency range, and listed in the [compatibility](#compatibility) table:

- Adding support for a new React version extends the range, and is released as a **minor** version.
- Dropping support for a React version narrows the range, and is released as a **major** version.
- Any other breaking change, including a change to the state a component hook returns (see [Custom presentations](#custom-presentations)), is released as a **major** version too.

Should older React versions ever need fixes after support for them was dropped, those releases are published under an NPM dist-tag naming the React version, such as `npm install @ofzza/stdblox-react@react18`.

# Usage

Everything is imported from the package root. Each export is documented in its own README:

## Components

- [`<Counter />`](./src/components/Counter/README.md): a count, with buttons and arrow keys incrementing and decrementing it within optional bounds.
- [`<Greeting />`](./src/components/Greeting/README.md): a greeting for the given name.

## Hooks

- [`useToggle(initial?)`](./src/hooks/useToggle/README.md): a boolean state value, with stable functions toggling and setting it.

## Utilities

- [`hello(name?)`](./src/utilities/hello/README.md): a greeting for the given name.

## Custom presentations

Every component `<Name />` is made of three public parts, all exported:

- **`use<Name>(props, ref?)`**, its hook, holds **all** of its state and behaviour, and returns it as a `<Name>State`. That includes prop getters, such as `getRootProps()`, which return the attributes, event handlers and ref each element needs, so that a custom presentation keeps the keyboard handling and accessibility of the default one.
- **`render<Name>(state)`**, its render function, is its default presentation: a pure function from `<Name>State` to JSX.
- **`<Name />`** itself only binds the two together.

To present a component differently, call its hook and render the state it returns yourself:

```tsx
import { useCounter, type CounterProps } from '@ofzza/stdblox-react';

export function StarRating(props: CounterProps) {
  const state = useCounter({ min: 0, max: 5, ...props });
  return (
    <div {...state.getRootProps()}>
      <button {...state.getDecrementProps()}>-</button>
      <span {...state.getCountProps()}>{'★'.repeat(state.count)}</span>
      <button {...state.getIncrementProps()}>+</button>
    </div>
  );
}
```

# Showcase

The showcase application demonstrates every export: its menu mirrors the library's directory structure, and each export's page shows its README, followed by a live demo of its default presentation and, for components, of a custom presentation built on its hook. It is [deployed to GitHub Pages](https://ofzza.github.io/stdblox-react/) from `master` once CI passes, and can be run locally:

```sh
$ npm run showcase
```

# Development

- `npm install` installs the dependencies, and through `prepare`, the test environment of every additional React version (`react-versions/<major>/`), then builds.
- `npm run build` - cleans `dist/` (`npm run clean`), then compiles `src/` into it, emitting declarations. Tests and showcase-components are left out.
- `npm run dev` - the same, in watch mode.
- `npm test` - runs every `test:*` script.
  - `npm run test:unit` - runs the unit tests and type checks them, under every supported React version: one Vitest project per version, `unit` for the default one and `unit-react<major>` for each additional one.
  - `npm run test:showcase` - runs the showcase application's own tests.
- `npm run showcase` - runs the showcase application's development server. `npm run showcase:build` builds it into `showcase/dist/`, and `npm run showcase:preview` serves that build.
- `npm run smoke -- <major>` - packs the library and installs it into a throwaway consumer project, together with that React version, then type checks and runs a smoke test against it.
- `npm run ci` - runs every `ci:*` script: build, showcase type check and build, ESLint, Prettier and the tests. This is what GitHub Actions runs on every pull request targeting, and every push to, `master` or `develop`, against Node 22 and 24, together with the smoke test against every supported React version. It also runs on `prepublishOnly`, so `npm publish` refuses to publish a failing build.

# Contributing

For reporting issues, contribution workflow, branching and the library's conventions, see [CONTRIBUTE.md](./CONTRIBUTE.md). For releasing a version, see [PUBLISH.md](./PUBLISH.md).

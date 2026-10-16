# `<Counter />`

Renders a count, with buttons and arrow keys incrementing and decrementing it within optional bounds.

> Placeholder component, establishing the structure of a stateful component unit.

```tsx
import { Counter } from '@ofzza/stdblox-react';

export const Example = () => <Counter aria-label="Quantity" min={0} max={10} onChange={(count) => console.log(count)} />;
```

## Props

`CounterProps` extends the native props of a `<div>` element (except `onChange`), which are passed on to the root element. The ref is forwarded to it too.

| Prop       | Type                      | Default              | Description                                              |
| ---------- | ------------------------- | -------------------- | -------------------------------------------------------- |
| `initial`  | `number`                  | `min` if set, or `0` | Initial count, and the count `reset()` returns to        |
| `min`      | `number`                  | `-Infinity`          | Lowest allowed count                                     |
| `max`      | `number`                  | `Infinity`           | Highest allowed count                                    |
| `step`     | `number`                  | `1`                  | Amount each increment and decrement changes the count by |
| `onChange` | `(count: number) => void` |                      | Called with the new count whenever it changes            |

The root element is a `group`. Its arrow keys (`↑`/`→` and `↓`/`←`) increment and decrement the count, unless an `onKeyDown` passed to it calls `preventDefault()`. The count is announced to assistive technologies as it changes, and each button is disabled at its bound.

## Custom presentation

All of the logic lives in `useCounter(props, ref?)`, and the default presentation in `renderCounter(state)`. To present a counter differently, call the hook and render its `CounterState` yourself, spreading its prop getters onto your elements so that they keep the keyboard handling and accessibility:

| State member                   | Type                         | Description                                                                       |
| ------------------------------ | ---------------------------- | --------------------------------------------------------------------------------- |
| `count`                        | `number`                     | Current count                                                                     |
| `min`, `max`                   | `number`                     | Bounds of the count                                                               |
| `canIncrement`, `canDecrement` | `boolean`                    | If the count can still change in that direction                                   |
| `increment()`, `decrement()`   | `() => void`                 | Change the count by `step`, within the bounds                                     |
| `reset()`                      | `() => void`                 | Resets the count to `initial`                                                     |
| `getRootProps()`               | `() => HTMLAttributes`       | Root element props: native props, `group` role, arrow key handling, forwarded ref |
| `getDecrementProps()`          | `() => ButtonHTMLAttributes` | Decrement button props: type, label, disabled state, click handling               |
| `getIncrementProps()`          | `() => ButtonHTMLAttributes` | Increment button props: type, label, disabled state, click handling               |
| `getCountProps()`              | `() => HTMLAttributes`       | Count display props, announcing its changes                                       |

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

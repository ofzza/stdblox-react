# `useToggle(initial?)`

Gets a boolean state value, along with stable functions toggling and setting it.

> Placeholder general purpose hook, establishing the structure of a hook unit.

```tsx
import { useToggle } from '@ofzza/stdblox-react';

export function Switch() {
  const [on, toggle] = useToggle();
  return <button onClick={toggle}>{on ? 'On' : 'Off'}</button>;
}
```

| Parameter | Type      | Default | Description   |
| --------- | --------- | ------- | ------------- |
| `initial` | `boolean` | `false` | Initial value |

Returns a `UseToggleResult` tuple, `[value, toggle, set]`:

- `value: boolean` is the current value.
- `toggle(): void` flips it. Its identity is stable across renders.
- `set(value: boolean): void` sets it. Its identity is stable across renders.

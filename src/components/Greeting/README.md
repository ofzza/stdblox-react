# `<Greeting />`

Renders a greeting for the given name, as a paragraph.

> Placeholder component, establishing the structure of a stateless component unit.

```tsx
import { Greeting } from '@ofzza/stdblox-react';

export const Example = () => <Greeting name="React" />; // <p>Hello React!</p>
```

## Props

`GreetingProps` extends the native props of a `<p>` element, which are passed on to the root element. The ref is forwarded to it too.

| Prop   | Type     | Default   | Description   |
| ------ | -------- | --------- | ------------- |
| `name` | `string` | `'World'` | Name to greet |

## Custom presentation

All of the logic lives in `useGreeting(props, ref?)`, and the default presentation in `renderGreeting(state)`. To present a greeting differently, call the hook and render its `GreetingState` yourself:

| State member     | Type                   | Description                                                    |
| ---------------- | ---------------------- | -------------------------------------------------------------- |
| `greeting`       | `string`               | Greeting text                                                  |
| `getRootProps()` | `() => HTMLAttributes` | Props of the root element: native props, and the forwarded ref |

```tsx
import { useGreeting, type GreetingProps } from '@ofzza/stdblox-react';

export function ShoutingGreeting(props: GreetingProps) {
  const state = useGreeting(props);
  return (
    <p {...state.getRootProps()}>
      <strong>{state.greeting.toUpperCase()}</strong>
    </p>
  );
}
```

# `hello(name?)`

Gets a greeting for the given name, defaulting to `'World'`.

> Placeholder utility, establishing the structure of a utility unit.

```ts
import { hello } from '@ofzza/stdblox-react';

hello(); // 'Hello World!'
hello('React'); // 'Hello React!'
```

| Parameter | Type     | Default   | Description   |
| --------- | -------- | --------- | ------------- |
| `name`    | `string` | `'World'` | Name to greet |

Returns the greeting, as a `string`.

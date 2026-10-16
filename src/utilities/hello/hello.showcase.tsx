/**
 * `hello` utility showcase: greets whatever name is typed in
 */

import { useState } from 'react';
import { hello } from './index.js';

/**
 * Showcases the `hello` utility
 * @returns Showcase
 */
export default function HelloShowcase() {
  const [name, setName] = useState('World');
  return (
    <div>
      <label>
        Name: <input value={name} onChange={(e) => setName(e.target.value)} />
      </label>
      <p>
        <code>hello({JSON.stringify(name)})</code> returns <strong>{JSON.stringify(hello(name))}</strong>
      </p>
    </div>
  );
}

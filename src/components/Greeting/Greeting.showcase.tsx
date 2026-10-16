/**
 * `Greeting` component showcase: the default presentation, and a custom presentation built on `useGreeting`
 */

import { useState } from 'react';
import { Greeting, useGreeting, type GreetingProps } from './index.js';

/**
 * Custom presentation of a `Greeting`, reusing all of its logic through `useGreeting`
 * @param props Greeting props
 * @returns Banner style greeting
 */
function BannerGreeting(props: GreetingProps) {
  const state = useGreeting(props);
  return (
    <p {...state.getRootProps()} style={{ padding: '0.75em 1em', borderRadius: 8, background: '#2563eb', color: '#fff', fontWeight: 600 }}>
      👋 {state.greeting.toUpperCase()}
    </p>
  );
}

/**
 * Showcases the `Greeting` component
 * @returns Showcase
 */
export default function GreetingShowcase() {
  const [name, setName] = useState('World');
  return (
    <div>
      <label>
        Name: <input value={name} onChange={(e) => setName(e.target.value)} />
      </label>
      <h3>Default presentation</h3>
      <Greeting name={name} />
      <h3>Custom presentation, built on useGreeting</h3>
      <BannerGreeting name={name} />
    </div>
  );
}

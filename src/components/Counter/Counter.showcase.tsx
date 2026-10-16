/**
 * `Counter` component showcase: the default presentation, and a custom presentation built on `useCounter`
 */

import { useState } from 'react';
import { Counter, useCounter, type CounterProps } from './index.js';

/**
 * Custom presentation of a `Counter`, reusing all of its logic, including its keyboard handling and accessibility, through `useCounter`
 * @param props Counter props
 * @returns Rating style counter
 */
function RatingCounter(props: CounterProps) {
  const state = useCounter(props);
  return (
    <div {...state.getRootProps()} style={{ display: 'flex', alignItems: 'center', gap: '0.5em' }}>
      <button {...state.getDecrementProps()}>Less</button>
      <span {...state.getCountProps()} aria-label={`${state.count} of ${state.max}`} style={{ fontSize: '1.5em', letterSpacing: '0.1em' }}>
        {'★'.repeat(state.count)}
        {'☆'.repeat(state.max - state.count)}
      </span>
      <button {...state.getIncrementProps()}>More</button>
      <button type="button" onClick={state.reset}>
        Reset
      </button>
    </div>
  );
}

/**
 * Showcases the `Counter` component
 * @returns Showcase
 */
export default function CounterShowcase() {
  const [last, setLast] = useState<number | undefined>(undefined);
  return (
    <div>
      <h3>Default presentation</h3>
      <Counter aria-label="Quantity" min={0} max={10} onChange={setLast} />
      <p>Last change: {last ?? 'none yet'}</p>
      <h3>Custom presentation, built on useCounter</h3>
      <RatingCounter aria-label="Rating" initial={3} min={0} max={5} />
    </div>
  );
}

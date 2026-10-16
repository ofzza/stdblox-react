/**
 * `renderCounter` render function: the `Counter` component's default presentation
 */

import type { JSX } from 'react';
import type { CounterState } from './Counter.types.js';

// #region renderCounter

/**
 * Renders the default presentation of a `Counter` from its state: the count, between a decrement and an increment button
 * @param state Counter state, as returned by `useCounter`
 * @returns Rendered counter
 */
export function renderCounter(state: CounterState): JSX.Element {
  return (
    <div {...state.getRootProps()}>
      <button {...state.getDecrementProps()}>−</button> <output {...state.getCountProps()}>{state.count}</output>{' '}
      <button {...state.getIncrementProps()}>+</button>
    </div>
  );
}

// #endregion

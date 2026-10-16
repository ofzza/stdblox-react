/**
 * `renderGreeting` render function: the `Greeting` component's default presentation
 */

import type { JSX } from 'react';
import type { GreetingState } from './Greeting.types.js';

// #region renderGreeting

/**
 * Renders the default presentation of a `Greeting` from its state
 * @param state Greeting state, as returned by `useGreeting`
 * @returns Rendered greeting
 */
export function renderGreeting(state: GreetingState): JSX.Element {
  return <p {...state.getRootProps()}>{state.greeting}</p>;
}

// #endregion

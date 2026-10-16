/**
 * `useGreeting` hook: all of the `Greeting` component's logic
 */

import type { Ref } from 'react';
import { hello } from '../../utilities/hello/index.js';
import type { GreetingProps, GreetingState } from './Greeting.types.js';

// #region useGreeting

/**
 * Gets the state of a `Greeting`: the greeting text for the given name, and the props of its root element
 * @param props Greeting props
 * @param ref Ref to forward to the root element
 * @returns Greeting state
 */
export function useGreeting(props: GreetingProps, ref?: Ref<HTMLParagraphElement>): GreetingState {
  const { name, ...rootProps } = props;
  return {
    greeting: hello(name),
    getRootProps: () => ({ ...rootProps, ref }),
  };
}

// #endregion

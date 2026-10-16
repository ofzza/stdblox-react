/**
 * `Greeting` component types: its props, and the state its hook returns
 */

import type { HTMLAttributes, Ref } from 'react';

// #region Types

/**
 * Represents the props of the `Greeting` component, and of its `useGreeting` hook
 */
export interface GreetingProps extends HTMLAttributes<HTMLParagraphElement> {
  /**
   * Name to greet, defaulting to `'World'`
   */
  name?: string;
}

/**
 * Represents the state of a `Greeting`, as returned by `useGreeting`, and as rendered by `renderGreeting` or by a custom presentation
 */
export interface GreetingState {
  /**
   * Greeting text
   */
  greeting: string;
  /**
   * Gets the props of the root element: every native prop passed to the component, and the forwarded ref
   * @returns Root element props
   */
  getRootProps(): HTMLAttributes<HTMLParagraphElement> & { ref?: Ref<HTMLParagraphElement> };
}

// #endregion

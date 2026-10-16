/**
 * `Greeting` component: binds `useGreeting` to `renderGreeting`
 */

import { forwardRef } from 'react';
import type { GreetingProps } from './Greeting.types.js';
import { renderGreeting } from './renderGreeting.js';
import { useGreeting } from './useGreeting.js';

// #region Greeting

/**
 * Renders a greeting for the given name, as a paragraph
 */
export const Greeting = forwardRef<HTMLParagraphElement, GreetingProps>((props, ref) => renderGreeting(useGreeting(props, ref)));
Greeting.displayName = 'Greeting';

// #endregion

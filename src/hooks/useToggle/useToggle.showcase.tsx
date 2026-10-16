/**
 * `useToggle` hook showcase: a switch driven by the hook
 */

import { useToggle } from './index.js';

/**
 * Showcases the `useToggle` hook
 * @returns Showcase
 */
export default function UseToggleShowcase() {
  const [on, toggle, set] = useToggle();
  return (
    <div>
      <p>
        The value is <strong>{on ? 'on' : 'off'}</strong>.
      </p>
      <button type="button" onClick={toggle}>
        Toggle
      </button>{' '}
      <button type="button" onClick={() => set(false)}>
        Reset
      </button>
    </div>
  );
}

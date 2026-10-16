/**
 * Consumer smoke test: uses the public API the way a consumer would, from the packed package, against a real install of a React version.
 * `scripts/smoke-test.mjs` type checks it under `nodenext` and `bundler` resolution, then compiles and runs it
 */

import {
  Counter,
  Greeting,
  hello,
  renderCounter,
  renderGreeting,
  useCounter,
  useGreeting,
  useToggle,
  type CounterProps,
  type CounterState,
  type GreetingProps,
  type GreetingState,
  type UseToggleResult,
} from '@ofzza/stdblox-react';
import { version } from 'react';
import { renderToString } from 'react-dom/server';

/**
 * Custom counter presentation, reusing the counter hook
 * @param props Counter props
 * @returns Custom counter
 */
function CustomCounter(props: CounterProps) {
  const state: CounterState = useCounter(props);
  return <div {...state.getRootProps()}>Custom {state.count}</div>;
}

/**
 * Greeting rendered through its hook and default render function
 * @param props Greeting props
 * @returns Greeting
 */
function HookedGreeting(props: GreetingProps) {
  const state: GreetingState = useGreeting(props);
  return renderGreeting(state);
}

/**
 * Counter rendered through its hook and default render function, with a toggle
 * @returns Counter
 */
function HookedCounter() {
  const [on]: UseToggleResult = useToggle(true);
  return renderCounter(useCounter({ initial: on ? 7 : 0 }));
}

const html = renderToString(
  <>
    <Greeting name="Smoke" />
    <HookedGreeting name={hello('Hook').slice(6, -1)} />
    <Counter initial={2} />
    <HookedCounter />
    <CustomCounter initial={5} />
  </>,
);

for (const expected of ['Hello Smoke!', 'Hello Hook!', '>2<', '>7<', 'Custom <!-- -->5']) {
  if (!html.includes(expected)) throw new Error(`Rendered HTML is missing "${expected}": ${html}`);
}
console.log(`Smoke test passed against React ${version}`);

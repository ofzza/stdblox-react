import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { Greeting } from './index.js';

describe('Greeting', () => {
  // Tests the `Greeting` component's presentation and its bindings to `useGreeting`, by rendering it and querying the DOM. Its logic is
  // tested in `useGreeting.test.ts`

  it('Renders the greeting as a paragraph', () => {
    render(<Greeting name="React" />);
    const greeting = screen.getByText('Hello React!');
    expect(greeting.tagName).toBe('P');
  });

  it('Renders native props on the root element', () => {
    render(<Greeting className="greeting" data-testid="greeting" />);
    expect(screen.getByTestId('greeting')).toHaveClass('greeting');
  });

  it('Forwards the ref to the root element', () => {
    const ref = createRef<HTMLParagraphElement>();
    render(<Greeting ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLParagraphElement);
    expect(ref.current).toHaveTextContent('Hello World!');
  });

  it('Has a display name', () => {
    expect(Greeting.displayName).toBe('Greeting');
  });
});

import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Counter } from './index.js';

describe('Counter', () => {
  // Tests the `Counter` component's presentation and its bindings to `useCounter`, by rendering it and interacting with it through
  // `user-event`. Its logic is tested in `useCounter.test.ts`

  it('Renders the count between a decrement and an increment button', () => {
    render(<Counter initial={3} aria-label="Quantity" />);
    expect(screen.getByRole('group', { name: 'Quantity' })).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('3');
    expect(screen.getByRole('button', { name: 'Decrement' })).toBeEnabled();
    expect(screen.getByRole('button', { name: 'Increment' })).toBeEnabled();
  });

  it('Changes the count when the buttons are clicked', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Counter onChange={onChange} />);
    await user.click(screen.getByRole('button', { name: 'Increment' }));
    await user.click(screen.getByRole('button', { name: 'Increment' }));
    await user.click(screen.getByRole('button', { name: 'Decrement' }));
    expect(screen.getByRole('status')).toHaveTextContent('1');
    expect(onChange.mock.calls).toEqual([[1], [2], [1]]);
  });

  it('Changes the count on arrow keys', async () => {
    const user = userEvent.setup();
    render(<Counter />);
    await user.click(screen.getByRole('button', { name: 'Increment' }));
    await user.keyboard('{ArrowUp}{ArrowUp}{ArrowDown}');
    expect(screen.getByRole('status')).toHaveTextContent('2');
  });

  it('Disables the buttons at the bounds', async () => {
    const user = userEvent.setup();
    render(<Counter min={0} max={1} />);
    expect(screen.getByRole('button', { name: 'Decrement' })).toBeDisabled();
    await user.click(screen.getByRole('button', { name: 'Increment' }));
    expect(screen.getByRole('button', { name: 'Increment' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Decrement' })).toBeEnabled();
  });

  it('Forwards the ref to the root element', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Counter ref={ref} />);
    expect(ref.current).toBe(screen.getByRole('group'));
  });

  it('Has a display name', () => {
    expect(Counter.displayName).toBe('Counter');
  });
});

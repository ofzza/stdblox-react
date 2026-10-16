/**
 * `hello` utility: a placeholder utility, establishing the structure of a utility unit
 */

// #region hello

/**
 * Gets a greeting for the given name
 * @param name Name to greet
 * @returns Greeting for the given name
 */
export function hello(name: string = 'World'): string {
  return `Hello ${name}!`;
}

// #endregion

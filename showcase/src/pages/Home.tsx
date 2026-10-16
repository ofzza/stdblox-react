/**
 * Showcase home page: the repository README
 */

import { homeReadme } from '../content.js';
import { Markdown } from '../Markdown.js';

/**
 * Renders the home page
 * @returns Home page
 */
export function Home() {
  return <Markdown dir="">{homeReadme}</Markdown>;
}

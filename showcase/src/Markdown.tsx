/**
 * Showcase Markdown renderer: renders a README, resolving its links to showcase routes and repository pages
 */

import type { MouseEvent } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import { registry, repositoryUrl } from './content.js';
import { resolveLink } from './registry.js';

// #region Markdown

/**
 * Paths of every unit, against which README links are resolved
 */
const _units = new Set(registry.units.keys());

/**
 * Scrolls to the heading an in-page anchor points to, instead of letting the browser change the hash, which holds the route
 * @param e Click event of the anchor
 * @param href Anchor target, such as `#usage`
 */
function _scrollToAnchor(e: MouseEvent<HTMLAnchorElement>, href: string): void {
  e.preventDefault();
  document.getElementById(decodeURIComponent(href.slice(1)))?.scrollIntoView({ behavior: 'smooth' });
}

/**
 * Renders a README
 * @param props.children Markdown contents
 * @param props.dir Directory of the README, relative to the repository root (`''` for the root README), against which its links resolve
 * @returns Rendered README
 */
export function Markdown({ children, dir }: { children: string; dir: string }) {
  return (
    <div className="markdown">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSlug]}
        components={{
          a: ({ href = '', children, node: _node, ...props }) => {
            const resolved = resolveLink(href, dir, _units, repositoryUrl);
            if (resolved.startsWith('#') && !resolved.startsWith('#/')) {
              return (
                <a {...props} href={resolved} onClick={(e) => _scrollToAnchor(e, resolved)}>
                  {children}
                </a>
              );
            }
            const external = /^[a-z][a-z0-9+.-]*:/i.test(resolved);
            return (
              <a {...props} href={resolved} {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}>
                {children}
              </a>
            );
          },
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}

// #endregion

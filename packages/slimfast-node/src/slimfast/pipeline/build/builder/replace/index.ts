import { generateJSXElement } from './jsx-function/index.js';
import { generateFunction as generateCalleeFunction } from './normal-function/index.js';

import type { GenerateJSXElement } from './jsx-function/index.js';
import type { GenerateFunction } from './normal-function/index.js';
import type { Binding, NodePath } from '@babel/traverse';
import type { CallExpression, JSXElement } from '@babel/types';

export type ReplaceOpts = {
  jsxReplacer?: GenerateJSXElement;
  functionReplacer?: GenerateFunction;
};

export type Replace = (
  name: string,
  path: NodePath,
  data: { toInject: Binding[] },
  options?: ReplaceOpts
) => CallExpression | JSXElement;

/**
 * Replaces a `node path` with a newly generated AST node, which could be a JSX element
 * or a function call expression, based on the original path and provided options.
 *
 * @param name - Name utilized in the generated AST node.
 * @param path - `node path` to be replaced.
 * @param data - Object providing relevant data for new AST node generation, containing bindings to be injected.
 * @param options - Configuration options and alternative replacement functions.
 *   - jsxReplacer: Optional function for generating JSX element nodes (default: `generateJSXElement`).
 *   - functionReplacer: Optional function for generating function call expression nodes (default: `generateCalleeFunction`).
 * @returns - The newly generated AST node, which can be either a CallExpression or a JSXElement.
 *
 * @example
 * // Assume data and options are defined according to use-case
 * replace('MyComponent', path, { toInject: bindings }, options);
 * // The original path is now replaced with a new AST node representing <MyComponent {...dataAttributes}/> or myFunction(dataArguments), based on path type.
 */
export const replace: Replace = (name, path, data, options?) => {
  const calleeFunction = path.isJSXElement()
    ? (options?.jsxReplacer || generateJSXElement)(name, data)
    : (options?.functionReplacer || generateCalleeFunction)(name, data);
  path.replaceWith(calleeFunction);
  return calleeFunction;
};

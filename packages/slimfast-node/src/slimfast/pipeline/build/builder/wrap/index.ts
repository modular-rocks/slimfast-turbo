import { generateExportedJSXComponent } from './jsx-function/index.js';
import { generateExportedFunction } from './normal-function/index.js';

import type { GenerateExportedJSXComponent } from './jsx-function/index.js';
import type { GenerateExportedFunction } from './normal-function/index.js';
import type { Binding, NodePath } from '@babel/traverse';
import type { ExportDefaultDeclaration } from '@babel/types';

export type WrapOpts = {
  jsxGenerator?: GenerateExportedJSXComponent;
  functionGenerator?: GenerateExportedFunction;
};

export type Wrap = (
  path: NodePath,
  data: { toInject: Binding[] },
  options?: WrapOpts
) => ExportDefaultDeclaration;

/**
 * Wraps the provided AST node path into an exported default function or JSX component.
 *
 * Based on the type of the node represented by the provided AST node path, this function decides
 * whether to generate an exported JSX component or a regular exported function. If the node
 * corresponds to a JSX element, it either uses a custom JSX generator specified in the options or
 * defaults to the `generateExportedJSXComponent` function. For non-JSX nodes, the function delegates
 * to either a custom function generator provided in the options or the `generateExportedFunction`
 * function.
 *
 * @param path - The AST node path to be wrapped.
 * @param data - Context or information related to the node, which includes details like bindings to inject.
 * @param options - (Optional) Options that guide the wrapping process. Can specify custom JSX and function generators.
 * @returns An exported default function or JSX component declaration based on the provided AST node path.
 *
 * @example
 * // For an AST node path representing: `() => <div>Hello</div>`
 * // The wrap function would generate an exported JSX component.
 *
 * @example
 * // For an AST node path representing: `() => someFunction()`
 * // The wrap function would generate an exported function declaration.
 */
export const wrap: Wrap = (path, data, options?) => {
  return path.isJSXElement()
    ? (options?.jsxGenerator || generateExportedJSXComponent)(path, data)
    : (options?.functionGenerator || generateExportedFunction)(path, data);
};

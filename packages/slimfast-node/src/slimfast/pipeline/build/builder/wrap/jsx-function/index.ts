import {
  exportDefaultDeclaration,
  functionDeclaration,
  returnStatement,
  identifier,
  variableDeclaration,
  variableDeclarator,
  objectProperty,
  objectPattern,
  blockStatement,
} from '@babel/types';

import { unique } from '../../../../../../utils';
import { hasAwait } from '../has-await';

import type { Binding, NodePath } from '@babel/traverse';
import type { ExportDefaultDeclaration, Statement } from '@babel/types';

export type GenerateExportedJSXComponent = (
  path: NodePath,
  data: { toInject: Binding[] }
) => ExportDefaultDeclaration;

/**
 * Generates an exported JSX component declaration from a given AST node path and associated data.
 *
 * This function constructs an exported JSX component which can optionally inject props based on the `data.toInject` array.
 * The `toInject` array contains bindings representing variables that should be injected as props into the generated component.
 * If the provided AST path contains asynchronous operations, the function generates an asynchronous JSX component;
 * otherwise, it creates a synchronous component. If the path contains references to external identifiers (e.g., variables),
 * those identifiers are extracted and included as props in the generated JSX component.
 *
 * @param path - The AST node path representing the original JSX element.
 * @param data - Information or context related to the node, including the bindings to inject as props.
 * @returns An exported default declaration of the newly generated JSX component.
 *
 * @example
 * ```jsx
 * // Given the JSX: `() => <h1>Hello {name}!</h1>`
 * // This function could transform it to:
 * export default function(props) {
 *   const { name } = props;
 *   return <h1>Hello {name}!</h1>;
 * }
 * ```
 */
export const generateExportedJSXComponent: GenerateExportedJSXComponent = (
  path,
  data
) => {
  const toInject = unique(data.toInject);

  const nodes: Statement[] = [];
  if (toInject.length) {
    nodes.push(
      variableDeclaration('const', [
        variableDeclarator(
          objectPattern(
            toInject.map((binding) =>
              objectProperty(
                binding.identifier,
                binding.identifier,
                false,
                true
              )
            )
          ),
          identifier('props')
        ),
      ])
    );
  }

  // TODO: Check type
  const el: any = path.node;
  nodes.push(returnStatement(el));

  const block = blockStatement(nodes);

  return exportDefaultDeclaration(
    functionDeclaration(
      null, // can also be BabelTypes.identifier(name), null makes it anonymous
      [identifier('props')],
      // toInject.map((x: RandomObject) => x.identifier),
      block,
      false,
      hasAwait(path)
    )
  );
};

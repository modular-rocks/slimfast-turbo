import type { NodePath } from '@babel/traverse';
import type { File } from '@babel/types';

import type { RandomObject } from '../../../../../types';

/**
 * Generates a function to check if a given AST node path contains any identifiers that are part of a specified blocklist.
 *
 * The resulting function traverses the given node path and for every identifier node it encounters, it checks if that identifier's name is in the blocklist. This is particularly useful in scenarios where certain variable or function names might be considered undesirable or restricted.
 *
 * @param blocklisted - An array of identifiers considered to be blocklisted.
 * @returns A function that evaluates if a node path contains any of the blocklisted identifiers.
 * @example
 * const isIdentifierBlocklisted = hasBlocklistedIdentifiers(['useEffect', 'useMemo']);
 * const isBlocklisted = isIdentifierBlocklisted(nodePath, data, opts, ast);
 * if (isBlocklisted) {
 *   // Handle the blocklisted identifier.
 * }
 */
export const hasBlocklistedIdentifiers =
  (blocklisted: string[]) =>
  /**
   * Determines if the provided AST node path contains any blocklisted identifiers.
   *
   * @param path - The AST node path to be examined.
   * @param data - Information or context related to the node.
   * @param opts - Configuration options.
   * @param ast - The complete Abstract Syntax Tree.
   * @returns `true` if any of the identifiers within the node path are blocklisted, otherwise `false`.
   */
  (path: NodePath, data: RandomObject, opts: RandomObject, ast: File) => {
    let itHasBlocklistedIdentifiers = false;

    path.traverse({
      Identifier(innerPath: RandomObject) {
        if (blocklisted.includes(innerPath.node.name)) {
          itHasBlocklistedIdentifiers = true;
        }
      },
    });

    return itHasBlocklistedIdentifiers;
  };
